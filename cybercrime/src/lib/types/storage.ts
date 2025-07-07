export interface S3UploadConfig {
  bucket: string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
  tagging?: Record<string, string>;
}

export interface S3UploadResult {
  key: string;
  bucket: string;
  url: string;
  etag: string;
  versionId?: string;
  size: number;
  uploadedAt: string;
}

export interface PresignedUrlOptions {
  expiresIn?: number; // seconds
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface EvidenceUpload {
  file: File;
  caseId: string;
  description: string;
  source: string;
  evidenceType: string;
  tags?: string[];
}

export interface CloudStorageMetrics {
  totalFiles: number;
  totalSize: number; // bytes
  sizeByType: Record<string, number>;
  uploadTrends: {
    date: string;
    uploads: number;
    totalSize: number;
  }[];
  storageByCase: {
    caseId: string;
    fileCount: number;
    totalSize: number;
  }[];
}

export interface FileProcessingResult {
  originalFile: string;
  processedFiles: {
    type: 'thumbnail' | 'preview' | 'ocr' | 'metadata';
    key: string;
    url: string;
    size: number;
  }[];
  extractedMetadata: Record<string, any>;
  ocrText?: string;
  virusScanResult?: {
    clean: boolean;
    threats?: string[];
    scanDate: string;
  };
}

export interface BackupPolicy {
  retentionDays: number;
  versioning: boolean;
  crossRegionReplication?: {
    enabled: boolean;
    destinationBucket: string;
    destinationRegion: string;
  };
  lifecycleRules: {
    transitionToIA?: number; // days
    transitionToGlacier?: number; // days
    deleteAfter?: number; // days
  };
}
