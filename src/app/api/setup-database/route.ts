import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST() {
  try {
    // Create users table using Neon PostgreSQL
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        badge_number VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        rank VARCHAR(50) NOT NULL,
        department VARCHAR(100),
        station VARCHAR(100),
        province VARCHAR(50),
        phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'active',
        role VARCHAR(20) DEFAULT 'officer',
        permissions JSONB DEFAULT '{}',
        fingerprint_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE
      );
    `

    // Create incidents table
    await sql`
      CREATE TABLE IF NOT EXISTS incidents (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        incident_number VARCHAR(50) UNIQUE NOT NULL,
        incident_type VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        location_address TEXT NOT NULL,
        province VARCHAR(50),
        district VARCHAR(50),
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'reported',
        reported_by UUID REFERENCES users(id),
        assigned_to UUID REFERENCES users(id),
        date_reported TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Create evidence table
    await sql`
      CREATE TABLE IF NOT EXISTS evidence (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        incident_id UUID REFERENCES incidents(id),
        evidence_number VARCHAR(50) UNIQUE NOT NULL,
        evidence_type VARCHAR(20),
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        date_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'collected',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Insert sample admin user
    await sql`
      INSERT INTO users (badge_number, email, first_name, last_name, rank, role)
      VALUES ('ADMIN001', 'admin@pngpolice.gov.pg', 'System', 'Administrator', 'Commander', 'admin')
      ON CONFLICT (badge_number) DO NOTHING;
    `

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully with Neon PostgreSQL!',
      tables: ['users', 'incidents', 'evidence'],
      database: 'Neon PostgreSQL - policesystem'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Failed to create tables: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create database schema',
    database: 'Neon PostgreSQL',
    recommendation: 'PNG Police System using proper Neon PostgreSQL connection'
  })
}
