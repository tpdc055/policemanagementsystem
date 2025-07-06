import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function POST() {
  try {
    // Test connection first using our DatabaseService
    const connectionTest = await DatabaseService.testConnection()

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: `Database connection failed: ${connectionTest.error}`
      })
    }

    // Return schema for manual creation in Neon console
    const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location_address TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'reported',
    reported_by UUID REFERENCES users(id),
    date_reported TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_id UUID REFERENCES incidents(id),
    evidence_number VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'collected',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample admin user
INSERT INTO users (badge_number, email, first_name, last_name, rank, role)
VALUES ('ADMIN001', 'admin@pngpolice.gov.pg', 'System', 'Administrator', 'Commander', 'admin')
ON CONFLICT (badge_number) DO NOTHING;
`;

    return NextResponse.json({
      success: true,
      message: 'Database schema ready for Neon PostgreSQL',
      connected: true,
      database: 'Neon PostgreSQL - policesystem',
      schema: schema,
      instruction: 'Copy the schema above and run it in Neon SQL Editor for complete setup'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
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
