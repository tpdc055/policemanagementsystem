import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { AWSS3Service } from '../../../../lib/services/aws-s3-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const description = formData.get('description') as string;
    const source = formData.get('source') as string;
    const evidenceType = formData.get('evidenceType') as string;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];

    if (!file || !caseId || !description || !source || !evidenceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // File validation
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 500MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'image/*',
      'video/*',
      'audio/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/*',
      'application/zip',
      'application/x-zip-compressed',
    ];

    const isAllowedType = allowedTypes.some(pattern => {
      if (pattern.endsWith('*')) {
        return file.type.startsWith(pattern.slice(0, -1));
      }
      return file.type === pattern;
    });

    if (!isAllowedType) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    const s3Service = new AWSS3Service();

    const uploadResult = await s3Service.uploadEvidence({
      file,
      caseId,
      description,
      source,
      evidenceType,
      tags,
    }, session.user.id);

    // Start background processing
    try {
      const processingResult = await s3Service.processUploadedFile(uploadResult.key);

      return NextResponse.json({
        upload: uploadResult,
        processing: processingResult,
        message: 'Evidence uploaded and processed successfully',
      });
    } catch (processingError) {
      console.error('File processing error:', processingError);

      // Return upload success even if processing fails
      return NextResponse.json({
        upload: uploadResult,
        processing: { error: 'Processing failed but file uploaded successfully' },
        message: 'Evidence uploaded successfully, processing in background',
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload evidence' },
      { status: 500 }
    );
  }
}

// Generate presigned upload URL for direct client uploads
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { caseId, filename, contentType, metadata } = body;

    if (!caseId || !filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const s3Service = new AWSS3Service();

    const presignedData = await s3Service.generatePresignedUploadUrl(
      caseId,
      filename,
      contentType,
      session.user.id,
      { metadata }
    );

    return NextResponse.json(presignedData);
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
