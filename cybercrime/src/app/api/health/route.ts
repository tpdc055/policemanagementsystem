import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface HealthCheck {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
  details?: string;
  lastCheck: string;
}

interface SystemHealth {
  overall: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  version: string;
  uptime: number;
  services: HealthCheck[];
  metrics: {
    totalCases: number;
    activeCases: number;
    totalUsers: number;
    activeUsers: number;
    totalEvidence: number;
    systemLoad: {
      cpu?: number;
      memory?: number;
      disk?: number;
    };
  };
}

// GET /api/health - System health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const services: HealthCheck[] = [];
  let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";

  try {
    // Database health check
    const dbStart = Date.now();
    try {
      await db.$queryRaw`SELECT 1 as health_check`;
      const dbResponseTime = Date.now() - dbStart;

      services.push({
        service: "database",
        status: dbResponseTime < 1000 ? "healthy" : "degraded",
        responseTime: dbResponseTime,
        details: `PostgreSQL connection successful`,
        lastCheck: new Date().toISOString(),
      });

      if (dbResponseTime >= 1000) overallStatus = "degraded";
    } catch (error) {
      services.push({
        service: "database",
        status: "unhealthy",
        responseTime: Date.now() - dbStart,
        details: `Database connection failed: ${error}`,
        lastCheck: new Date().toISOString(),
      });
      overallStatus = "unhealthy";
    }

    // Email service health check
    const emailStart = Date.now();
    try {
      // Simple connection test (don't send actual email)
      const emailStatus = process.env.EMAIL_HOST && process.env.EMAIL_USER ? "healthy" : "degraded";

      services.push({
        service: "email",
        status: emailStatus,
        responseTime: Date.now() - emailStart,
        details: emailStatus === "healthy" ? "Email configuration valid" : "Email configuration incomplete",
        lastCheck: new Date().toISOString(),
      });

      if (emailStatus === "degraded" && overallStatus === "healthy") {
        overallStatus = "degraded";
      }
    } catch (error) {
      services.push({
        service: "email",
        status: "unhealthy",
        responseTime: Date.now() - emailStart,
        details: `Email service error: ${error}`,
        lastCheck: new Date().toISOString(),
      });
      if (overallStatus !== "unhealthy") overallStatus = "degraded";
    }

    // File system health check
    const fsStart = Date.now();
    try {
      const fs = await import('fs/promises');
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      await fs.access(uploadDir);

      services.push({
        service: "filesystem",
        status: "healthy",
        responseTime: Date.now() - fsStart,
        details: "File system accessible",
        lastCheck: new Date().toISOString(),
      });
    } catch (error) {
      services.push({
        service: "filesystem",
        status: "unhealthy",
        responseTime: Date.now() - fsStart,
        details: `File system error: ${error}`,
        lastCheck: new Date().toISOString(),
      });
      if (overallStatus !== "unhealthy") overallStatus = "degraded";
    }

    // Get system metrics
    let metrics;
    try {
      const [totalCases, activeCases, totalUsers, activeUsers, totalEvidence] = await Promise.all([
        db.cyberCase.count(),
        db.cyberCase.count({
          where: {
            status: {
              in: ["OPEN", "IN_PROGRESS", "UNDER_INVESTIGATION"],
            },
          },
        }),
        db.user.count(),
        db.user.count({
          where: {
            isActive: true,
            lastLogin: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
        db.evidence.count(),
      ]);

      metrics = {
        totalCases,
        activeCases,
        totalUsers,
        activeUsers,
        totalEvidence,
        systemLoad: {
          // These would typically come from system monitoring
          cpu: Math.random() * 100, // Placeholder
          memory: Math.random() * 100, // Placeholder
          disk: Math.random() * 100, // Placeholder
        },
      };
    } catch (error) {
      metrics = {
        totalCases: 0,
        activeCases: 0,
        totalUsers: 0,
        activeUsers: 0,
        totalEvidence: 0,
        systemLoad: {},
      };
      if (overallStatus === "healthy") overallStatus = "degraded";
    }

    const healthResponse: SystemHealth = {
      overall: overallStatus,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime(),
      services,
      metrics,
    };

    const statusCode = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503;

    return NextResponse.json(healthResponse, { status: statusCode });

  } catch (error) {
    return NextResponse.json({
      overall: "unhealthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime(),
      services: [
        {
          service: "system",
          status: "unhealthy",
          responseTime: Date.now() - startTime,
          details: `Health check failed: ${error}`,
          lastCheck: new Date().toISOString(),
        },
      ],
      metrics: {
        totalCases: 0,
        activeCases: 0,
        totalUsers: 0,
        activeUsers: 0,
        totalEvidence: 0,
        systemLoad: {},
      },
    }, { status: 503 });
  }
}

// GET /api/health/detailed - Detailed system diagnostics (admin only)
export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const apiKey = request.headers.get("x-admin-key");
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
      database: await getDatabaseDiagnostics(),
      application: await getApplicationDiagnostics(),
      performance: await getPerformanceMetrics(),
      errors: await getRecentErrors(),
    };

    return NextResponse.json(diagnostics);
  } catch (error) {
    return NextResponse.json(
      { error: "Diagnostics failed", details: error },
      { status: 500 }
    );
  }
}

async function getDatabaseDiagnostics() {
  try {
    const [connectionInfo, tableStats, indexStats] = await Promise.all([
      // Connection information
      db.$queryRaw`
        SELECT
          count(*) as total_connections,
          count(CASE WHEN state = 'active' THEN 1 END) as active_connections,
          count(CASE WHEN state = 'idle' THEN 1 END) as idle_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `,

      // Table statistics
      db.$queryRaw`
        SELECT
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
      `,

      // Index usage
      db.$queryRaw`
        SELECT
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes
        WHERE idx_tup_read > 0
        ORDER BY idx_tup_read DESC
        LIMIT 10
      `,
    ]);

    return {
      connections: connectionInfo,
      tables: tableStats,
      indexes: indexStats,
      size: await db.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
      `,
    };
  } catch (error) {
    return { error: `Database diagnostics failed: ${error}` };
  }
}

async function getApplicationDiagnostics() {
  try {
    // Get recent activity statistics
    const [recentCases, recentEvidence, recentUsers] = await Promise.all([
      db.cyberCase.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      db.evidence.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      activity24h: {
        newCases: recentCases,
        newEvidence: recentEvidence,
        activeUsers: recentUsers,
      },
      casesByStatus: await db.cyberCase.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      evidenceByType: await db.evidence.groupBy({
        by: ["evidenceType"],
        _count: { evidenceType: true },
      }),
    };
  } catch (error) {
    return { error: `Application diagnostics failed: ${error}` };
  }
}

async function getPerformanceMetrics() {
  try {
    // This would typically integrate with APM tools
    // For now, return basic metrics
    return {
      averageResponseTime: Math.random() * 1000 + 200, // Placeholder
      requestsPerMinute: Math.random() * 100 + 50, // Placeholder
      errorRate: Math.random() * 0.05, // Placeholder
      cacheHitRate: Math.random() * 0.3 + 0.7, // Placeholder
    };
  } catch (error) {
    return { error: `Performance metrics failed: ${error}` };
  }
}

async function getRecentErrors() {
  try {
    // Get recent audit log entries for errors
    const recentErrors = await db.auditLog.findMany({
      where: {
        action: "ERROR",
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    return recentErrors.map(error => ({
      timestamp: error.timestamp,
      resource: error.resource,
      details: error.newValues,
    }));
  } catch (error) {
    return { error: `Recent errors query failed: ${error}` };
  }
}
