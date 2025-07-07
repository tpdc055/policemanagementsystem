import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { AWSS3Service } from '../../../../../lib/services/aws-s3-service';
import { db as prisma } from '../../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    // Verify user has access to this evidence
    const evidence = await prisma.evidence.findFirst({
      where: {
        filePath: decodedKey,
        isDeleted: false,
      },
      include: {
        case: {
          select: {
            id: true,
            caseId: true,
            assignedToId: true,
            createdById: true,
          },
        },
      },
    });

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess =
      evidence.case.assignedToId === session.user.id ||
      evidence.case.createdById === session.user.id ||
      ['ADMIN', 'UNIT_COMMANDER'].includes(session.user.role);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const s3Service = new AWSS3Service();

    // Check if requesting presigned URL or direct download
    const requestPresigned = request.nextUrl.searchParams.get('presigned') === 'true';

    if (requestPresigned) {
      // Generate presigned URL for client-side download
      const expiresIn = parseInt(request.nextUrl.searchParams.get('expires') || '3600');

      const presignedUrl = await s3Service.generatePresignedDownloadUrl(
        decodedKey,
        { expiresIn }
      );

      // Log access
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'EVIDENCE_DOWNLOAD_URL_GENERATED',
          resource: 'evidence',
          resourceId: evidence.id,
          newValues: {
            caseId: evidence.case.caseId,
            fileName: evidence.filename,
            expiresIn,
          },
          timestamp: new Date(),
        },
      });

      return NextResponse.json({
        url: presignedUrl,
        expiresIn,
        filename: evidence.filename,
      });
    } else {
      // Direct download through server
      const { body, metadata } = await s3Service.downloadFile(decodedKey);

      // Log download
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'EVIDENCE_DOWNLOADED',
          resource: 'evidence',
          resourceId: evidence.id,
          newValues: {
            caseId: evidence.case.caseId,
            fileName: evidence.filename,
            fileSize: body.length,
          },
          timestamp: new Date(),
        },
      });

      // Return file with appropriate headers
      return new NextResponse(body, {
        status: 200,
        headers: {
          'Content-Type': evidence.type || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${evidence.filename}"`,
          'Content-Length': body.length.toString(),
          'Cache-Control': 'private, no-cache',
          'X-Evidence-Case': evidence.case.caseId,
          'X-Evidence-Type': evidence.evidenceType,
        },
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download evidence' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete evidence
    if (!['ADMIN', 'UNIT_COMMANDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    // Verify evidence exists
    const evidence = await prisma.evidence.findFirst({
      where: {
        filePath: decodedKey,
        isDeleted: false,
      },
      include: {
        case: { select: { caseId: true } },
      },
    });

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    const s3Service = new AWSS3Service();

    // Delete with backup (regulatory compliance)
    await s3Service.deleteFile(decodedKey, true);

    // Log deletion
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'EVIDENCE_DELETED',
        resource: 'evidence',
        resourceId: evidence.id,
        oldValues: {
          caseId: evidence.case.caseId,
          fileName: evidence.filename,
          filePath: decodedKey,
        },
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Evidence deleted successfully (backup created)',
      backupRetention: '7 years (regulatory compliance)',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete evidence' },
      { status: 500 }
    );
  }
}
