import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Return the SQL schema that should be executed in Neon
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
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    role VARCHAR(20) DEFAULT 'officer' CHECK (role IN ('officer', 'sergeant', 'commander', 'admin')),
    permissions JSONB DEFAULT '{}',
    profile_photo TEXT,
    fingerprint_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location_address TEXT NOT NULL,
    location_coordinates POINT,
    province VARCHAR(50),
    district VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'pending', 'resolved', 'closed')),
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    supervisor UUID REFERENCES users(id),
    date_reported TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_occurred TIMESTAMP WITH TIME ZONE,
    date_resolved TIMESTAMP WITH TIME ZONE,
    photos TEXT[],
    videos TEXT[],
    witness_count INTEGER DEFAULT 0,
    evidence_count INTEGER DEFAULT 0,
    weapons_involved BOOLEAN DEFAULT FALSE,
    drugs_involved BOOLEAN DEFAULT FALSE,
    domestic_violence BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- People involved in incidents
CREATE TABLE IF NOT EXISTS people_involved (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    person_type VARCHAR(20) CHECK (person_type IN ('victim', 'suspect', 'witness', 'complainant')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    middle_name VARCHAR(100),
    aliases TEXT[],
    gender VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(50) DEFAULT 'Papua New Guinea',
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    photos TEXT[],
    physical_description TEXT,
    fingerprints JSONB,
    criminal_history JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_id UUID REFERENCES incidents(id),
    case_id VARCHAR(50),
    evidence_number VARCHAR(50) UNIQUE NOT NULL,
    evidence_type VARCHAR(20) CHECK (evidence_type IN ('physical', 'digital', 'biological', 'documentary')),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location_found TEXT,
    found_by UUID REFERENCES users(id),
    collected_by UUID REFERENCES users(id),
    date_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    photos TEXT[],
    videos TEXT[],
    file_attachments TEXT[],
    chain_of_custody JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'collected' CHECK (status IN ('collected', 'analyzed', 'returned', 'destroyed')),
    storage_location TEXT,
    custodian UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(50),
    vehicle_type VARCHAR(50) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30),
    owner_name VARCHAR(200) NOT NULL,
    owner_id VARCHAR(50),
    owner_phone VARCHAR(20),
    insurance_company VARCHAR(100),
    insurance_expiry DATE,
    registration_expiry DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'stolen')),
    accident_history JSONB DEFAULT '[]',
    traffic_violations JSONB DEFAULT '[]',
    photos TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missing persons table
CREATE TABLE IF NOT EXISTS missing_persons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    age_when_missing INTEGER,
    photos TEXT[] NOT NULL,
    physical_description TEXT,
    circumstances TEXT NOT NULL,
    last_seen_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_seen_location TEXT NOT NULL,
    family_contacts JSONB NOT NULL,
    reporting_person VARCHAR(200) NOT NULL,
    case_type VARCHAR(20) CHECK (case_type IN ('missing', 'runaway', 'abduction', 'endangered')),
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    amber_alert_issued BOOLEAN DEFAULT FALSE,
    investigating_officer UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'found_safe', 'found_deceased', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    alert_type VARCHAR(20) CHECK (alert_type IN ('amber', 'bolo', 'weather', 'security', 'public_safety')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    location_affected TEXT,
    provinces_affected TEXT[],
    channels_used TEXT[],
    issued_by UUID REFERENCES users(id),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patrol assignments table
CREATE TABLE IF NOT EXISTS patrol_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id VARCHAR(50) UNIQUE NOT NULL,
    patrol_type VARCHAR(20) CHECK (patrol_type IN ('routine', 'targeted', 'emergency', 'special_event')),
    assignment_name VARCHAR(200),
    assigned_officers UUID[],
    supervisor UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    objectives TEXT[],
    incidents_encountered UUID[],
    arrests_made INTEGER DEFAULT 0,
    citations_issued INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File storage table
CREATE TABLE IF NOT EXISTS file_storage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_category VARCHAR(50) NOT NULL,
    related_table VARCHAR(50),
    related_id UUID,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_badge_number ON users(badge_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_incidents_number ON incidents(incident_number);
CREATE INDEX IF NOT EXISTS idx_incidents_date_reported ON incidents(date_reported);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_evidence_number ON evidence(evidence_number);
CREATE INDEX IF NOT EXISTS idx_evidence_incident_id ON evidence(incident_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_missing_persons_case_number ON missing_persons(case_number);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Insert sample admin user
INSERT INTO users (
    badge_number,
    email,
    first_name,
    last_name,
    rank,
    department,
    station,
    province,
    role,
    permissions
) VALUES (
    'ADMIN001',
    'admin@pngpolice.gov.pg',
    'System',
    'Administrator',
    'Commander',
    'Information Technology',
    'Port Moresby Central',
    'National Capital District',
    'admin',
    '{"full_access": true, "can_amend": true, "can_manage_users": true}'
) ON CONFLICT (badge_number) DO NOTHING;

-- Insert sample incidents for testing
INSERT INTO incidents (
    incident_number,
    incident_type,
    title,
    description,
    location_address,
    province,
    priority,
    status,
    reported_by
) VALUES
    ('INC-2025-0001', 'Armed Robbery', 'Armed Robbery at Downtown Store', 'Two suspects armed with knives robbed a convenience store', 'Waigani Drive, Port Moresby', 'National Capital District', 'high', 'investigating', (SELECT id FROM users WHERE badge_number = 'ADMIN001')),
    ('INC-2025-0002', 'Traffic Accident', 'Vehicle Collision on Independence Drive', 'Two-vehicle collision with minor injuries reported', 'Independence Drive, Port Moresby', 'National Capital District', 'medium', 'reported', (SELECT id FROM users WHERE badge_number = 'ADMIN001')),
    ('INC-2025-0003', 'Domestic Violence', 'Domestic Dispute in Gerehu', 'Domestic violence incident reported by neighbor', 'Gerehu Stage 2, Port Moresby', 'National Capital District', 'high', 'pending', (SELECT id FROM users WHERE badge_number = 'ADMIN001'))
ON CONFLICT (incident_number) DO NOTHING;
`;

    return NextResponse.json({
      success: true,
      message: 'PNG Police System database schema ready for Neon PostgreSQL',
      database: 'connectpng_local',
      host: 'ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech',
      schema: schema,
      instructions: [
        '1. Copy the SQL schema above',
        '2. Go to your Neon dashboard: https://console.neon.tech/app/projects',
        '3. Select your "connectpng_local" database',
        '4. Open the SQL Editor',
        '5. Paste and execute the schema',
        '6. Your PNG Police System will have all tables with sample data!'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate schema: ' + error
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PNG Police System - Neon Database Setup',
    endpoint: 'Use POST to get the database schema',
    database: 'connectpng_local',
    tables: [
      'users', 'incidents', 'people_involved', 'evidence',
      'vehicles', 'missing_persons', 'emergency_alerts',
      'patrol_assignments', 'file_storage', 'audit_logs'
    ]
  })
}
