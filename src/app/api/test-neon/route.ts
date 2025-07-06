import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!databaseUrl || !databaseUrl.includes('neon.tech')) {
      return NextResponse.json({
        success: false,
        message: 'Neon database URL not found in environment variables',
        connected: false
      })
    }

    // Check if we can parse the connection string
    const isNeonConnection = databaseUrl.includes('ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech')

    return NextResponse.json({
      success: true,
      message: 'Neon database configuration detected',
      connected: isNeonConnection,
      database: 'connectpng_local',
      host: 'ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech',
      tablesStatus: 'Need to create tables in Neon console',
      nextStep: 'Run the SQL schema in your Neon dashboard'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database test failed: ' + error,
      connected: false
    })
  }
}
