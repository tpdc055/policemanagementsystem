import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { AWSS3Service } from '../../../../lib/services/aws-s3-service';
import { db as prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - only admins and commanders can view metrics
    if (!['ADMIN', 'UNIT_COMMANDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const s3Service = new AWSS3Service();

    // Get storage metrics
    const storageMetrics = await s3Service.getStorageMetrics();

    // Get additional database metrics
    const [
      totalCases,
      casesWithEvidence,
      averageEvidencePerCase,
      mostActiveUploaders,
      storageGrowth,
    ] = await Promise.all([
      // Total cases
      prisma.cyberCase.count(),

      // Cases with evidence
      prisma.cyberCase.count({
        where: {
          evidence: {
            some: { isDeleted: false },
          },
        },
      }),

      // Average evidence per case
      prisma.evidence.aggregate({
        where: { isDeleted: false },
        _avg: { size: true },
      }),

      // Most active uploaders
      prisma.evidence.groupBy({
        by: ['collectedBy'],
        where: { isDeleted: false },
        _count: { id: true },
        _sum: { size: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Storage growth over last 6 months
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as file_count,
          SUM(size) as total_size
        FROM evidence
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
          AND is_deleted = false
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `,
    ]);

    // Get user names for uploaders
    const uploaderIds = mostActiveUploaders.map(u => u.collectedBy);
    const users = await prisma.user.findMany({
      where: { id: { in: uploaderIds } },
      select: { id: true, name: true, department: true },
    });

    const uploadersWithNames = mostActiveUploaders.map(uploader => ({
      ...uploader,
      user: users.find(u => u.id === uploader.collectedBy),
    }));

    // Calculate additional metrics
    const storageUtilization = {
      evidencePerCase: totalCases > 0 ? storageMetrics.totalFiles / totalCases : 0,
      casesWithEvidencePercentage: totalCases > 0 ? (casesWithEvidence / totalCases) * 100 : 0,
      averageFileSize: averageEvidencePerCase._avg.size || 0,
    };

    // Cost estimation (AWS S3 pricing approximation)
    const estimatedMonthlyCost = {
      storage: (storageMetrics.totalSize / (1024 * 1024 * 1024)) * 0.023, // $0.023/GB for Standard-IA
      requests: storageMetrics.totalFiles * 0.0004, // $0.0004 per 1000 requests
      dataTransfer: 0, // First 1GB free, then varies by region
    };

    const metrics = {
      storage: storageMetrics,
      utilization: storageUtilization,
      uploaders: uploadersWithNames,
      growth: storageGrowth,
      costs: {
        estimated: estimatedMonthlyCost,
        currency: 'USD',
        period: 'monthly',
        disclaimer: 'Estimates based on AWS S3 Standard-IA pricing',
      },
      compliance: {
        retentionPolicy: '7 years (PNG legal requirement)',
        encryption: 'AES-256 server-side encryption',
        backupPolicy: 'Glacier backup with cross-region replication',
        accessLogging: 'Full audit trail maintained',
      },
      alerts: await getStorageAlerts(storageMetrics),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching storage metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage metrics' },
      { status: 500 }
    );
  }
}

// Helper function to generate storage alerts
async function getStorageAlerts(metrics: any) {
  const alerts = [];

  // Storage capacity alerts
  const storageGB = metrics.totalSize / (1024 * 1024 * 1024);
  if (storageGB > 500) {
    alerts.push({
      type: 'warning',
      message: `High storage usage: ${storageGB.toFixed(2)}GB`,
      recommendation: 'Consider archiving old cases or implementing data retention policies',
    });
  }

  // File count alerts
  if (metrics.totalFiles > 10000) {
    alerts.push({
      type: 'info',
      message: `Large number of files: ${metrics.totalFiles}`,
      recommendation: 'Monitor file organization and consider indexing improvements',
    });
  }

  // Cost alerts
  const estimatedCost = (storageGB * 0.023) + (metrics.totalFiles * 0.0004);
  if (estimatedCost > 100) {
    alerts.push({
      type: 'warning',
      message: `Estimated monthly cost: $${estimatedCost.toFixed(2)}`,
      recommendation: 'Review storage classes and lifecycle policies to optimize costs',
    });
  }

  // Growth rate alerts
  const recentUploads = metrics.uploadTrends
    .slice(-7)
    .reduce((sum: number, day: any) => sum + day.uploads, 0);

  if (recentUploads > 100) {
    alerts.push({
      type: 'info',
      message: `High upload activity: ${recentUploads} files in last 7 days`,
      recommendation: 'Ensure adequate storage monitoring and capacity planning',
    });
  }

  return alerts;
}
