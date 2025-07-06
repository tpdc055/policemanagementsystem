import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET() {
  try {
    // Test database connection using our DatabaseService
    const connectionTest = await DatabaseService.testConnection()

    return NextResponse.json({
      success: connectionTest.success,
      message: connectionTest.message,
      connected: connectionTest.success,
      database: 'Neon PostgreSQL - policesystem',
      error: connectionTest.error
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
