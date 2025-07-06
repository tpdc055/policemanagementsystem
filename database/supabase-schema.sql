-- PNG Police Management System - Supabase Database Schema
-- This schema creates all tables needed for the police management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users/Officers table
CREATE TABLE users (
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
CREATE TABLE incidents (
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

-- Evidence table
CREATE TABLE evidence (
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
);

-- Create indexes for performance
CREATE INDEX idx_users_badge_number ON users(badge_number);
CREATE INDEX idx_incidents_number ON incidents(incident_number);
CREATE INDEX idx_incidents_date_reported ON incidents(date_reported);
CREATE INDEX idx_evidence_number ON evidence(evidence_number);
