import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET() {
  try {
    // Test database connection
    const dbHealth = await DatabaseService.testConnection()

    // Test cybercrime integration (with timeout)
    let cybercrimeHealth = false
    try {
      if (process.env.NEXT_PUBLIC_CYBERCRIME_API_URL && process.env.CYBERCRIME_API_KEY) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CYBERCRIME_API_URL}/api/health`,
          {
            headers: { 'x-api-key': process.env.CYBERCRIME_API_KEY },
            signal: controller.signal
          }
        )

        clearTimeout(timeoutId)
        cybercrimeHealth = response.ok
      }
    } catch (error) {
      // Cybercrime system unavailable - not critical for police system
      cybercrimeHealth = false
    }

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealth.success,
        cybercrime_integration: cybercrimeHealth
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database_info: {
        connected: dbHealth.success,
        message: dbHealth.message
      }
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      { status: 503 }
    )
  }
}
