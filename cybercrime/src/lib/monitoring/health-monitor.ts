import { db as prisma } from '../db';
import { reportError, reportMessage, addBreadcrumb } from './sentry-config';

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  details?: Record<string, any>;
  lastChecked: string;
  error?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  checks: HealthCheck[];
  metrics: {
    memory: {
      used: number;
      free: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
    database: {
      connections: number;
      queryTime: number;
    };
    storage: {
      used: number;
      available: number;
      percentage: number;
    };
  };
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();

  private constructor() {
    this.initializeChecks();
  }

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  private initializeChecks() {
    // Database connectivity check
    this.checks.set('database', async () => {
      const startTime = Date.now();
      try {
        await prisma.$queryRaw`SELECT 1`;
        const responseTime = Date.now() - startTime;

        return {
          name: 'database',
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          responseTime,
          details: { type: 'PostgreSQL' },
          lastChecked: new Date().toISOString(),
        };
      } catch (error) {
        reportError(error as Error, { component: 'health-check', check: 'database' });
        return {
          name: 'database',
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    // External services check (AWS S3)
    this.checks.set('storage', async () => {
      const startTime = Date.now();
      try {
        // Simple connectivity test to AWS
        const response = await fetch('https://s3.amazonaws.com/', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });

        const responseTime = Date.now() - startTime;
        const status = response.ok && responseTime < 2000 ? 'healthy' : 'degraded';

        return {
          name: 'storage',
          status,
          responseTime,
          details: { service: 'AWS S3', region: process.env.AWS_REGION },
          lastChecked: new Date().toISOString(),
        };
      } catch (error) {
        return {
          name: 'storage',
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'AWS S3 unreachable',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    // Memory usage check
    this.checks.set('memory', async () => {
      try {
        const memUsage = process.memoryUsage();
        const totalMem = memUsage.heapTotal;
        const usedMem = memUsage.heapUsed;
        const percentage = (usedMem / totalMem) * 100;

        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        if (percentage > 90) status = 'unhealthy';
        else if (percentage > 70) status = 'degraded';

        return {
          name: 'memory',
          status,
          details: {
            used: usedMem,
            total: totalMem,
            percentage: Math.round(percentage * 100) / 100,
          },
          lastChecked: new Date().toISOString(),
        };
      } catch (error) {
        return {
          name: 'memory',
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Memory check failed',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    // Application specific checks
    this.checks.set('api', async () => {
      const startTime = Date.now();
      try {
        // Test internal API endpoint
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/health`, {
          signal: AbortSignal.timeout(3000)
        });

        const responseTime = Date.now() - startTime;
        const status = response.ok && responseTime < 1000 ? 'healthy' : 'degraded';

        return {
          name: 'api',
          status,
          responseTime,
          details: { statusCode: response.status },
          lastChecked: new Date().toISOString(),
        };
      } catch (error) {
        return {
          name: 'api',
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'API unreachable',
          lastChecked: new Date().toISOString(),
        };
      }
    });
  }

  async runHealthChecks(): Promise<SystemHealth> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];

    // Run all health checks in parallel
    const checkPromises = Array.from(this.checks.entries()).map(async ([name, check]) => {
      try {
        return await check();
      } catch (error) {
        reportError(error as Error, { component: 'health-monitor', check: name });
        return {
          name,
          status: 'unhealthy' as const,
          error: error instanceof Error ? error.message : 'Check failed',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    const checkResults = await Promise.all(checkPromises);
    checks.push(...checkResults);

    // Determine overall system status
    const unhealthyChecks = checks.filter(c => c.status === 'unhealthy');
    const degradedChecks = checks.filter(c => c.status === 'degraded');

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (unhealthyChecks.length > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedChecks.length > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    // Collect system metrics
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics = {
      memory: {
        used: memUsage.heapUsed,
        free: memUsage.heapTotal - memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      },
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
      },
      database: {
        connections: await this.getDatabaseConnections(),
        queryTime: Date.now() - startTime,
      },
      storage: {
        used: 0, // Would get from AWS CloudWatch
        available: 0,
        percentage: 0,
      },
    };

    const health: SystemHealth = {
      status: overallStatus,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks,
      metrics,
    };

    // Log health status changes
    if (overallStatus !== 'healthy') {
      reportMessage(
        `System health is ${overallStatus}`,
        overallStatus === 'unhealthy' ? 'error' : 'warning',
        { health, failedChecks: unhealthyChecks.concat(degradedChecks) }
      );
    }

    addBreadcrumb(
      `Health check completed: ${overallStatus}`,
      'health-monitor',
      overallStatus === 'healthy' ? 'info' : 'warning',
      { checkCount: checks.length, duration: Date.now() - startTime }
    );

    return health;
  }

  private async getDatabaseConnections(): Promise<number> {
    try {
      const result = await prisma.$queryRaw<Array<{ count: number }>>`
        SELECT count(*) as count
        FROM pg_stat_activity
        WHERE state = 'active'
      `;
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  // Alert system for critical health issues
  async checkAndAlert(): Promise<void> {
    const health = await this.runHealthChecks();

    if (health.status === 'unhealthy') {
      const criticalIssues = health.checks.filter(c => c.status === 'unhealthy');

      // Send critical alerts
      await this.sendCriticalAlert(criticalIssues);
    }

    // Check for performance degradation
    if (health.metrics.memory.percentage > 85) {
      reportMessage(
        'High memory usage detected',
        'warning',
        { memoryUsage: health.metrics.memory }
      );
    }

    if (health.checks.some(c => c.responseTime && c.responseTime > 5000)) {
      reportMessage(
        'Slow response times detected',
        'warning',
        { slowChecks: health.checks.filter(c => c.responseTime && c.responseTime > 5000) }
      );
    }
  }

  private async sendCriticalAlert(issues: HealthCheck[]): Promise<void> {
    // Log critical system issues
    reportError(
      new Error('Critical system health issues detected'),
      {
        component: 'health-monitor',
        issues: issues.map(i => ({ name: i.name, error: i.error })),
        severity: 'critical',
      }
    );

    // In production, integrate with:
    // - Email notifications
    // - Slack/Teams alerts
    // - SMS notifications for critical staff
    // - PagerDuty or similar incident management

    console.error('CRITICAL HEALTH ALERT:', {
      timestamp: new Date().toISOString(),
      issues: issues.map(i => `${i.name}: ${i.error || 'Unknown error'}`),
    });
  }
}

// Singleton instance
export const healthMonitor = HealthMonitor.getInstance();
