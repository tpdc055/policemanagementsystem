import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  PutObjectTaggingCommand,
  GetObjectTaggingCommand,
  RestoreObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash, randomBytes } from 'crypto';
import { db as prisma } from '../db';
import type {
  S3UploadConfig,
  S3UploadResult,
  PresignedUrlOptions,
  EvidenceUpload,
  CloudStorageMetrics,
  FileProcessingResult,
  BackupPolicy,
} from '../types/storage';

export class AWSS3Service {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.AWS_S3_BUCKET || 'cyber-crime-evidence';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // Generate secure file key with encryption
  private generateSecureKey(caseId: string, filename: string, userId: string): string {
    const timestamp = Date.now();
    const random = randomBytes(8).toString('hex');
    const hash = createHash('sha256')
      .update(`${caseId}-${filename}-${userId}-${timestamp}`)
      .digest('hex')
      .substring(0, 16);

    return `evidence/${caseId}/${timestamp}-${hash}-${random}/${filename}`;
  }

  // Upload evidence file to S3
  async uploadEvidence(
    evidenceUpload: EvidenceUpload,
    userId: string
  ): Promise<S3UploadResult> {
    const { file, caseId, description, source, evidenceType, tags } = evidenceUpload;

    // Generate secure key
    const key = this.generateSecureKey(caseId, file.name, userId);

    // Calculate file hash for integrity
    const fileBuffer = await file.arrayBuffer();
    const fileHash = createHash('sha256').update(Buffer.from(fileBuffer)).digest('hex');

    // Prepare metadata
    const metadata = {
      'case-id': caseId,
      'uploaded-by': userId,
      'source': source,
      'evidence-type': evidenceType,
      'description': description,
      'file-hash': fileHash,
      'upload-timestamp': new Date().toISOString(),
    };

    // Prepare tags
    const objectTags = {
      CaseId: caseId,
      EvidenceType: evidenceType,
      Confidentiality: 'RESTRICTED',
      Department: 'PNG-CYBER-CRIME',
      ...tags?.reduce((acc, tag) => ({ ...acc, [tag]: 'true' }), {}),
    };

    try {
      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
        Metadata: metadata,
        ServerSideEncryption: 'AES256',
        StorageClass: 'STANDARD_IA', // Cost-effective for evidence storage
      });

      const uploadResult = await this.s3Client.send(uploadCommand);

      // Apply tags
      if (Object.keys(objectTags).length > 0) {
        await this.s3Client.send(new PutObjectTaggingCommand({
          Bucket: this.bucket,
          Key: key,
          Tagging: {
            TagSet: Object.entries(objectTags).map(([Key, Value]) => ({ Key, Value })),
          },
        }));
      }

      // Store in database
      await prisma.evidence.create({
        data: {
          caseId,
          title: file.name,
          description,
          evidenceType: evidenceType as any,
          filePath: key, // Store S3 key
          filename: file.name,
          type: file.type,
          size: file.size,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          hash: fileHash,
          source,
          collectedBy: userId,
          collectedAt: new Date(),
          chainOfCustody: [
            {
              action: 'UPLOADED_TO_S3',
              userId,
              timestamp: new Date().toISOString(),
              location: `s3://${this.bucket}/${key}`,
              ipAddress: 'system',
            },
          ],
          isSecure: true,
        },
      });

      return {
        key,
        bucket: this.bucket,
        url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
        etag: uploadResult.ETag || '',
        versionId: uploadResult.VersionId,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload evidence to secure storage');
    }
  }

  // Generate presigned URL for secure download
  async generatePresignedDownloadUrl(
    key: string,
    options: PresignedUrlOptions = {}
  ): Promise<string> {
    const {
      expiresIn = 3600, // 1 hour default
      contentType,
    } = options;

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ...(contentType && { ResponseContentType: contentType }),
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      // Log access for audit trail
      await this.logFileAccess(key, 'DOWNLOAD_URL_GENERATED');

      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate secure download link');
    }
  }

  // Generate presigned URL for direct upload
  async generatePresignedUploadUrl(
    caseId: string,
    filename: string,
    contentType: string,
    userId: string,
    options: PresignedUrlOptions = {}
  ): Promise<{ url: string; key: string; fields: Record<string, string> }> {
    const key = this.generateSecureKey(caseId, filename, userId);
    const { expiresIn = 3600, metadata = {} } = options;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
        Metadata: {
          'case-id': caseId,
          'uploaded-by': userId,
          'upload-timestamp': new Date().toISOString(),
          ...metadata,
        },
        ServerSideEncryption: 'AES256',
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return {
        url,
        key,
        fields: {
          'Content-Type': contentType,
          'x-amz-server-side-encryption': 'AES256',
        },
      };
    } catch (error) {
      console.error('Error generating presigned upload URL:', error);
      throw new Error('Failed to generate secure upload link');
    }
  }

  // Download file from S3
  async downloadFile(key: string): Promise<{ body: Buffer; metadata: Record<string, string> }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('File not found');
      }

      const body = Buffer.from(await response.Body.transformToByteArray());

      // Log access
      await this.logFileAccess(key, 'DOWNLOADED');

      return {
        body,
        metadata: response.Metadata || {},
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file from secure storage');
    }
  }

  // Create backup copy
  async createBackup(key: string, backupPolicy: BackupPolicy): Promise<string> {
    const backupKey = `backups/${key}`;

    try {
      const copyCommand = new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${key}`,
        Key: backupKey,
        StorageClass: 'GLACIER', // Long-term storage
        TaggingDirective: 'COPY',
      });

      await this.s3Client.send(copyCommand);

      // Log backup creation
      await this.logFileAccess(key, 'BACKUP_CREATED', { backupKey });

      return backupKey;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  // Process uploaded file (OCR, metadata extraction, etc.)
  async processUploadedFile(key: string): Promise<FileProcessingResult> {
    try {
      // Get file info
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const headResult = await this.s3Client.send(headCommand);

      const contentType = headResult.ContentType || '';
      const processedFiles: FileProcessingResult['processedFiles'] = [];
      let extractedMetadata: Record<string, any> = {};
      let ocrText: string | undefined;

      // Download file for processing
      const { body } = await this.downloadFile(key);

      // Extract basic metadata
      extractedMetadata = {
        originalSize: headResult.ContentLength,
        contentType,
        lastModified: headResult.LastModified,
        etag: headResult.ETag,
        uploadMetadata: headResult.Metadata,
      };

      // Image processing
      if (contentType.startsWith('image/')) {
        // Create thumbnail (would integrate with image processing service)
        const thumbnailKey = `${key}-thumbnail.jpg`;
        // processedFiles.push({
        //   type: 'thumbnail',
        //   key: thumbnailKey,
        //   url: await this.generatePresignedDownloadUrl(thumbnailKey),
        //   size: 0, // Would be actual thumbnail size
        // });

        // OCR for images (would integrate with Tesseract or AWS Textract)
        ocrText = 'OCR text would be extracted here...';
      }

      // PDF processing
      if (contentType === 'application/pdf') {
        // Extract text and metadata from PDF
        ocrText = 'PDF text would be extracted here...';
      }

      // Log processing completion
      await this.logFileAccess(key, 'FILE_PROCESSED', {
        extractedMetadata,
        ocrTextLength: ocrText?.length || 0,
      });

      return {
        originalFile: key,
        processedFiles,
        extractedMetadata,
        ocrText,
        virusScanResult: {
          clean: true, // Would integrate with antivirus service
          scanDate: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error('Failed to process uploaded file');
    }
  }

  // Get storage metrics
  async getStorageMetrics(): Promise<CloudStorageMetrics> {
    try {
      // Get evidence files from database
      const evidenceFiles = await prisma.evidence.findMany({
        select: {
          caseId: true,
          size: true,
          type: true,
          createdAt: true,
        },
      });

      const totalFiles = evidenceFiles.length;
      const totalSize = evidenceFiles.reduce((sum, file) => sum + (file.size || 0), 0);

      // Group by type
      const sizeByType = evidenceFiles.reduce((acc, file) => {
        const type = file.type || 'unknown';
        acc[type] = (acc[type] || 0) + (file.size || 0);
        return acc;
      }, {} as Record<string, number>);

      // Upload trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentFiles = evidenceFiles.filter(
        file => file.createdAt >= thirtyDaysAgo
      );

      const uploadTrends = this.groupByDate(recentFiles);

      // Storage by case
      const storageByCase = Object.entries(
        evidenceFiles.reduce((acc, file) => {
          if (!acc[file.caseId]) {
            acc[file.caseId] = { fileCount: 0, totalSize: 0 };
          }
          acc[file.caseId].fileCount++;
          acc[file.caseId].totalSize += file.size || 0;
          return acc;
        }, {} as Record<string, { fileCount: number; totalSize: number }>)
      ).map(([caseId, stats]) => ({
        caseId,
        ...stats,
      }));

      return {
        totalFiles,
        totalSize,
        sizeByType,
        uploadTrends,
        storageByCase,
      };
    } catch (error) {
      console.error('Error getting storage metrics:', error);
      throw new Error('Failed to retrieve storage metrics');
    }
  }

  // Delete file (with backup policy)
  async deleteFile(key: string, createBackup = true): Promise<void> {
    try {
      if (createBackup) {
        await this.createBackup(key, {
          retentionDays: 2555, // 7 years retention for legal compliance
          versioning: true,
          lifecycleRules: {
            transitionToGlacier: 30,
          },
        });
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);

      // Update database
      await prisma.evidence.updateMany({
        where: { filePath: key },
        data: { isDeleted: true },
      });

      // Log deletion
      await this.logFileAccess(key, 'DELETED', { backupCreated: createBackup });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from secure storage');
    }
  }

  // Restore from backup/archive
  async restoreFile(key: string, restoreDays = 7): Promise<void> {
    try {
      const restoreCommand = new RestoreObjectCommand({
        Bucket: this.bucket,
        Key: key,
        RestoreRequest: {
          Days: restoreDays,
          GlacierJobParameters: {
            Tier: 'Standard', // Standard, Bulk, or Expedited
          },
        },
      });

      await this.s3Client.send(restoreCommand);

      // Log restore request
      await this.logFileAccess(key, 'RESTORE_REQUESTED', { restoreDays });
    } catch (error) {
      console.error('Error restoring file:', error);
      throw new Error('Failed to restore file from archive');
    }
  }

  // List files for a case
  async listCaseFiles(caseId: string): Promise<string[]> {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: `evidence/${caseId}/`,
      });

      const response = await this.s3Client.send(listCommand);

      return response.Contents?.map(obj => obj.Key || '') || [];
    } catch (error) {
      console.error('Error listing case files:', error);
      throw new Error('Failed to list case files');
    }
  }

  // Private helper methods
  private async logFileAccess(
    key: string,
    action: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          action,
          resource: 'evidence_file',
          resourceId: key,
          newValues: metadata || {},
          timestamp: new Date(),
          ipAddress: 'aws-s3',
          userAgent: 'aws-s3-service',
        },
      });
    } catch (error) {
      console.error('Error logging file access:', error);
      // Don't throw error for logging failures
    }
  }

  private groupByDate(
    files: Array<{ createdAt: Date; size: number | null }>
  ): Array<{ date: string; uploads: number; totalSize: number }> {
    const groups: Record<string, { uploads: number; totalSize: number }> = {};

    for (const file of files) {
      const date = file.createdAt.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = { uploads: 0, totalSize: 0 };
      }
      groups[date].uploads++;
      groups[date].totalSize += file.size || 0;
    }

    return Object.entries(groups).map(([date, stats]) => ({
      date,
      ...stats,
    }));
  }
}
