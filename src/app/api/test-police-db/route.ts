import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not found in environment variables',
        connected: false
      })
    }

    // Check if the URL contains our police system database
    const isPoliceDatabase = databaseUrl.includes('policesystem')

    if (!isPoliceDatabase) {
      return NextResponse.json({
        success: false,
        error: 'Not connected to policesystem database',
        connected: false,
        currentDatabase: databaseUrl.split('/').pop()?.split('?')[0]
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Connected to PNG Police System database!',
      connected: true,
      database: 'policesystem',
      host: 'Neon PostgreSQL',
      status: 'Ready to serve police data',
      tables: [
        'users (Police Officers)',
        'incidents (Crime Reports)',
        'evidence (Evidence Tracking)',
        'missing_persons (AMBER Alerts)',
        'vehicles (Vehicle Registry)',
        'emergency_alerts (Emergency Notifications)'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database connection test failed: ' + error,
      connected: false
    })
  }
}
