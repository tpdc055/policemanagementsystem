import { db as prisma } from '../db';
import { addBreadcrumb, measureTime } from './sentry-config';

export interface SystemAnalytics {
  overview: {
    totalCases: number;
    activeCases: number;
    totalEvidence: number;
    totalUsers: number;
    storageUsed: number;
    avgResponseTime: number;
  };
  trends: {
    caseCreationTrend: Array<{ date: string; count: number }>;
    evidenceUploadTrend: Array<{ date: string; count: number; size: number }>;
    userActivityTrend: Array<{ date: string; activeUsers: number }>;
    systemPerformanceTrend: Array<{ date: string; avgResponseTime: number; errorRate: number }>;
  };
  performance: {
    apiEndpoints: Array<{
      endpoint: string;
      totalRequests: number;
      avgResponseTime: number;
      errorRate: number;
      slowestRequests: Array<{ timestamp: string; responseTime: number }>;
    }>;
    databasePerformance: {
      avgQueryTime: number;
      slowQueries: Array<{ query: string; duration: number; timestamp: string }>;
      connectionPoolStatus: { active: number; idle: number; total: number };
    };
    errorAnalysis: {
      totalErrors: number;
      errorsByType: Record<string, number>;
      criticalErrors: Array<{ message: string; count: number; lastOccurred: string }>;
    };
  };
  userMetrics: {
    activeUsers: number;
    topUsers: Array<{
      userId: string;
      userName: string;
      department: string;
      activityScore: number;
      lastActive: string;
    }>;
    sessionMetrics: {
      avgSessionDuration: number;
      totalSessions: number;
      bounceRate: number;
    };
  };
  securityMetrics: {
    failedLoginAttempts: number;
    suspiciousActivities: Array<{
      type: string;
      count: number;
      details: Record<string, any>;
    }>;
    accessPatterns: Array<{
      ipAddress: string;
      requestCount: number;
      riskScore: number;
    }>;
  };
}

export interface UserActivityReport {
  userId: string;
  userName: string;
  department: string;
  role: string;
  period: { start: string; end: string };
  metrics: {
    casesWorked: number;
    evidenceUploaded: number;
    searchesPerformed: number;
    loginCount: number;
    totalHoursActive: number;
    averageSessionDuration: number;
  };
  activities: Array<{
    action: string;
    resource: string;
    timestamp: string;
    details: Record<string, any>;
  }>;
}

export interface PerformanceReport {
  period: { start: string; end: string };
  summary: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  endpoints: Array<{
    path: string;
    method: string;
    requestCount: number;
    avgResponseTime: number;
    p95ResponseTime: number;
    errorCount: number;
    errorRate: number;
  }>;
  errors: Array<{
    message: string;
    count: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    firstSeen: string;
    lastSeen: string;
  }>;
  recommendations: string[];
}

export class AnalyticsService {
  // System Analytics
  static async getSystemAnalytics(period: 'day' | 'week' | 'month' = 'week'): Promise<SystemAnalytics> {
    return measureTime('getSystemAnalytics', 'analytics', async () => {
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      const [
        totalCases,
        activeCases,
        totalEvidence,
        totalUsers,
        storageUsed,
        caseCreationTrend,
        evidenceUploadTrend,
        userActivityTrend,
        recentErrors,
        topUsers,
      ] = await Promise.all([
        // Overview metrics
        prisma.cyberCase.count(),
        prisma.cyberCase.count({
          where: { status: { in: ['OPEN', 'IN_PROGRESS', 'UNDER_INVESTIGATION'] } },
        }),
        prisma.evidence.count({ where: { isDeleted: false } }),
        prisma.user.count({ where: { isActive: true } }),
        prisma.evidence.aggregate({
          where: { isDeleted: false },
          _sum: { size: true },
        }),

        // Trend data
        this.getCaseCreationTrend(startDate, endDate),
        this.getEvidenceUploadTrend(startDate, endDate),
        this.getUserActivityTrend(startDate, endDate),
        this.getRecentErrors(startDate, endDate),
        this.getTopUsers(startDate, endDate),
      ]);

      // Calculate performance metrics
      const avgResponseTime = await this.calculateAverageResponseTime();
      const errorAnalysis = await this.analyzeErrors(recentErrors);

      addBreadcrumb(
        'System analytics generated',
        'analytics',
        'info',
        { period, totalCases, activeCases, totalEvidence }
      );

      return {
        overview: {
          totalCases,
          activeCases,
          totalEvidence,
          totalUsers,
          storageUsed: storageUsed._sum.size || 0,
          avgResponseTime,
        },
        trends: {
          caseCreationTrend,
          evidenceUploadTrend,
          userActivityTrend,
          systemPerformanceTrend: [], // Would implement with performance monitoring
        },
        performance: {
          apiEndpoints: [], // Would implement with request logging
          databasePerformance: await this.getDatabasePerformance(),
          errorAnalysis,
        },
        userMetrics: {
          activeUsers: totalUsers,
          topUsers,
          sessionMetrics: {
            avgSessionDuration: 0, // Would implement with session tracking
            totalSessions: 0,
            bounceRate: 0,
          },
        },
        securityMetrics: await this.getSecurityMetrics(startDate, endDate),
      };
    });
  }

  // User Activity Report
  static async getUserActivityReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<UserActivityReport> {
    return measureTime('getUserActivityReport', 'analytics', async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, department: true, role: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const [activities, casesWorked, evidenceUploaded, auditLogs] = await Promise.all([
        prisma.auditLog.findMany({
          where: {
            userId,
            timestamp: { gte: startDate, lte: endDate },
          },
          orderBy: { timestamp: 'desc' },
          take: 100,
        }),
        prisma.cyberCase.count({
          where: {
            OR: [
              { createdById: userId },
              { assignedToId: userId },
            ],
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        prisma.evidence.count({
          where: {
            collectedBy: userId,
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        prisma.auditLog.count({
          where: {
            userId,
            action: 'LOGIN',
            timestamp: { gte: startDate, lte: endDate },
          },
        }),
      ]);

      // Calculate search activity
      const searchesPerformed = activities.filter(a =>
        a.action.includes('SEARCH') || a.resource === 'search'
      ).length;

      // Calculate session metrics
      const sessionData = this.calculateSessionMetrics(activities);

      return {
        userId: user.id,
        userName: user.name,
        department: user.department,
        role: user.role,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        metrics: {
          casesWorked,
          evidenceUploaded,
          searchesPerformed,
          loginCount: auditLogs,
          totalHoursActive: sessionData.totalHours,
          averageSessionDuration: sessionData.avgDuration,
        },
        activities: activities.map(a => ({
          action: a.action,
          resource: a.resource,
          timestamp: a.timestamp.toISOString(),
          details: a.newValues as Record<string, any> || {},
        })),
      };
    });
  }

  // Performance Report
  static async getPerformanceReport(
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceReport> {
    return measureTime('getPerformanceReport', 'analytics', async () => {
      // Get error data from audit logs
      const errors = await prisma.auditLog.findMany({
        where: {
          action: { contains: 'ERROR' },
          timestamp: { gte: startDate, lte: endDate },
        },
      });

      // Group and analyze errors
      const errorGroups = errors.reduce((acc, error) => {
        const message = (error.newValues as any)?.error || 'Unknown error';
        if (!acc[message]) {
          acc[message] = {
            count: 0,
            firstSeen: error.timestamp,
            lastSeen: error.timestamp,
          };
        }
        acc[message].count++;
        if (error.timestamp < acc[message].firstSeen) {
          acc[message].firstSeen = error.timestamp;
        }
        if (error.timestamp > acc[message].lastSeen) {
          acc[message].lastSeen = error.timestamp;
        }
        return acc;
      }, {} as Record<string, { count: number; firstSeen: Date; lastSeen: Date }>);

      const errorAnalysis = Object.entries(errorGroups).map(([message, data]) => ({
        message,
        count: data.count,
        impact: this.determineErrorImpact(data.count, message),
        firstSeen: data.firstSeen.toISOString(),
        lastSeen: data.lastSeen.toISOString(),
      }));

      // Generate recommendations based on performance data
      const recommendations = this.generatePerformanceRecommendations(errorAnalysis);

      return {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        summary: {
          totalRequests: 0, // Would implement with request logging
          avgResponseTime: await this.calculateAverageResponseTime(),
          errorRate: errors.length > 0 ? (errors.length / 1000) * 100 : 0, // Approximate
          uptime: 99.9, // Would implement with uptime monitoring
        },
        endpoints: [], // Would implement with detailed request logging
        errors: errorAnalysis,
        recommendations,
      };
    });
  }

  // Private helper methods
  private static async getCaseCreationTrend(startDate: Date, endDate: Date) {
    const result = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM cyber_cases
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return result.map(r => ({
      date: r.date,
      count: Number(r.count),
    }));
  }

  private static async getEvidenceUploadTrend(startDate: Date, endDate: Date) {
    const result = await prisma.$queryRaw<Array<{ date: string; count: bigint; size: bigint }>>`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count,
        COALESCE(SUM(size), 0) as size
      FROM evidence
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
        AND is_deleted = false
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return result.map(r => ({
      date: r.date,
      count: Number(r.count),
      size: Number(r.size),
    }));
  }

  private static async getUserActivityTrend(startDate: Date, endDate: Date) {
    const result = await prisma.$queryRaw<Array<{ date: string; activeUsers: bigint }>>`
      SELECT
        DATE(timestamp) as date,
        COUNT(DISTINCT user_id) as activeUsers
      FROM audit_logs
      WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

    return result.map(r => ({
      date: r.date,
      activeUsers: Number(r.activeUsers),
    }));
  }

  private static async getRecentErrors(startDate: Date, endDate: Date) {
    return prisma.auditLog.findMany({
      where: {
        action: { contains: 'ERROR' },
        timestamp: { gte: startDate, lte: endDate },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  private static async getTopUsers(startDate: Date, endDate: Date) {
    const result = await prisma.$queryRaw<Array<{
      user_id: string;
      user_name: string;
      department: string;
      activity_count: bigint;
      last_active: Date;
    }>>`
      SELECT
        al.user_id,
        u.name as user_name,
        u.department,
        COUNT(*) as activity_count,
        MAX(al.timestamp) as last_active
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.timestamp >= ${startDate} AND al.timestamp <= ${endDate}
      GROUP BY al.user_id, u.name, u.department
      ORDER BY activity_count DESC
      LIMIT 10
    `;

    return result.map(r => ({
      userId: r.user_id,
      userName: r.user_name,
      department: r.department,
      activityScore: Number(r.activity_count),
      lastActive: r.last_active.toISOString(),
    }));
  }

  private static async getDatabasePerformance() {
    try {
      const result = await prisma.$queryRaw<Array<{ avg_duration: number; active: bigint; idle: bigint }>>`
        SELECT
          AVG(EXTRACT(EPOCH FROM (now() - query_start)) * 1000) as avg_duration,
          COUNT(*) FILTER (WHERE state = 'active') as active,
          COUNT(*) FILTER (WHERE state = 'idle') as idle
        FROM pg_stat_activity
        WHERE state IN ('active', 'idle')
      `;

      const stats = result[0];
      return {
        avgQueryTime: stats?.avg_duration || 0,
        slowQueries: [], // Would implement with pg_stat_statements
        connectionPoolStatus: {
          active: Number(stats?.active || 0),
          idle: Number(stats?.idle || 0),
          total: Number(stats?.active || 0) + Number(stats?.idle || 0),
        },
      };
    } catch {
      return {
        avgQueryTime: 0,
        slowQueries: [],
        connectionPoolStatus: { active: 0, idle: 0, total: 0 },
      };
    }
  }

  private static async getSecurityMetrics(startDate: Date, endDate: Date) {
    const failedLogins = await prisma.auditLog.count({
      where: {
        action: 'LOGIN_FAILED',
        timestamp: { gte: startDate, lte: endDate },
      },
    });

    // Analyze suspicious activities
    const suspiciousActivities = await prisma.auditLog.groupBy({
      by: ['action'],
      where: {
        action: { in: ['FAILED_LOGIN', 'UNAUTHORIZED_ACCESS', 'SUSPICIOUS_ACTIVITY'] },
        timestamp: { gte: startDate, lte: endDate },
      },
      _count: { action: true },
    });

    return {
      failedLoginAttempts: failedLogins,
      suspiciousActivities: suspiciousActivities.map(sa => ({
        type: sa.action,
        count: sa._count.action,
        details: {},
      })),
      accessPatterns: [], // Would implement with detailed request logging
    };
  }

  private static async calculateAverageResponseTime(): Promise<number> {
    // Mock implementation - would integrate with performance monitoring
    return Math.random() * 500 + 100; // 100-600ms
  }

  private static async analyzeErrors(errors: any[]) {
    const errorsByType = errors.reduce((acc, error) => {
      const type = error.action || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const criticalErrors = Object.entries(errorsByType)
      .filter(([, count]) => (count as number) > 5)
      .map(([type, count]) => ({
        message: type,
        count: count as number,
        lastOccurred: new Date().toISOString(),
      }));

    return {
      totalErrors: errors.length,
      errorsByType,
      criticalErrors,
    };
  }

  private static calculateSessionMetrics(activities: any[]) {
    // Simplified session calculation
    const sessionGaps = 30 * 60 * 1000; // 30 minutes
    let sessions = [];
    let currentSession = { start: 0, end: 0 };

    for (const activity of activities.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )) {
      const timestamp = new Date(activity.timestamp).getTime();

      if (!currentSession.start || timestamp - currentSession.end > sessionGaps) {
        if (currentSession.start) sessions.push(currentSession);
        currentSession = { start: timestamp, end: timestamp };
      } else {
        currentSession.end = timestamp;
      }
    }

    if (currentSession.start) sessions.push(currentSession);

    const totalDuration = sessions.reduce((sum, s) => sum + (s.end - s.start), 0);
    const avgDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;

    return {
      totalHours: totalDuration / (1000 * 60 * 60),
      avgDuration: avgDuration / (1000 * 60), // in minutes
    };
  }

  private static determineErrorImpact(count: number, message: string): 'low' | 'medium' | 'high' | 'critical' {
    if (message.toLowerCase().includes('critical') || count > 50) return 'critical';
    if (message.toLowerCase().includes('database') || count > 20) return 'high';
    if (count > 5) return 'medium';
    return 'low';
  }

  private static generatePerformanceRecommendations(errors: any[]): string[] {
    const recommendations = [];

    if (errors.some(e => e.impact === 'critical')) {
      recommendations.push('Immediate attention required for critical errors');
    }

    if (errors.filter(e => e.message.includes('database')).length > 3) {
      recommendations.push('Consider database query optimization');
    }

    if (errors.length > 20) {
      recommendations.push('Review error handling and logging practices');
    }

    recommendations.push('Implement automated monitoring alerts');
    recommendations.push('Regular performance review scheduled weekly');

    return recommendations;
  }
}
