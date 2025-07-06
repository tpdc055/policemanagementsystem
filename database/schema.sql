-- PNG Police Management System Database Schema
-- Complete database structure for production deployment

-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  rank VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  station VARCHAR(100),
  province VARCHAR(50),
  phone VARCHAR(20),
  emergency_contact VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  role VARCHAR(20) DEFAULT 'officer', -- officer, sergeant, commander, admin
  permissions JSONB DEFAULT '{}',
  profile_photo TEXT,
  fingerprint_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Incidents Management
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_number VARCHAR(20) UNIQUE NOT NULL,
  incident_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location_address TEXT NOT NULL,
  location_coordinates POINT,
  province VARCHAR(50),
  district VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
  status VARCHAR(30) DEFAULT 'reported', -- reported, investigating, pending, resolved, closed
  reported_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  supervisor UUID REFERENCES users(id),
  date_reported TIMESTAMP DEFAULT NOW(),
  date_occurred TIMESTAMP,
  date_resolved TIMESTAMP,
  weather_conditions VARCHAR(100),
  visibility VARCHAR(50),
  photos TEXT[], -- Array of photo URLs
  videos TEXT[], -- Array of video URLs
  audio_recordings TEXT[],
  witness_count INTEGER DEFAULT 0,
  evidence_count INTEGER DEFAULT 0,
  case_file_number VARCHAR(50),
  court_case_number VARCHAR(50),
  insurance_claim VARCHAR(100),
  property_damage_estimate DECIMAL(15,2),
  injuries_reported BOOLEAN DEFAULT FALSE,
  fatalities_reported BOOLEAN DEFAULT FALSE,
  weapons_involved BOOLEAN DEFAULT FALSE,
  drugs_involved BOOLEAN DEFAULT FALSE,
  gang_related BOOLEAN DEFAULT FALSE,
  domestic_violence BOOLEAN DEFAULT FALSE,
  hate_crime BOOLEAN DEFAULT FALSE,
  follow_up_required BOOLEAN DEFAULT TRUE,
  public_interest BOOLEAN DEFAULT FALSE,
  media_attention BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- People Involved (Victims, Suspects, Witnesses)
CREATE TABLE people_involved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  person_type VARCHAR(20) NOT NULL, -- victim, suspect, witness, complainant
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  middle_name VARCHAR(50),
  aliases TEXT[],
  gender VARCHAR(10),
  date_of_birth DATE,
  age_estimate INTEGER,
  nationality VARCHAR(50) DEFAULT 'Papua New Guinea',
  ethnicity VARCHAR(50),
  languages_spoken TEXT[],
  id_number VARCHAR(50), -- National ID, Passport, etc.
  id_type VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  occupation VARCHAR(100),
  employer VARCHAR(100),
  emergency_contact VARCHAR(255),
  photos TEXT[],
  physical_description TEXT,
  height VARCHAR(10),
  weight VARCHAR(10),
  hair_color VARCHAR(20),
  eye_color VARCHAR(20),
  skin_tone VARCHAR(20),
  scars_marks TEXT,
  tattoos TEXT,
  piercings TEXT,
  clothing_description TEXT,
  distinguishing_features TEXT,
  fingerprints JSONB,
  dna_sample VARCHAR(100),
  blood_type VARCHAR(5),
  medical_conditions TEXT,
  mental_health_status TEXT,
  substance_use TEXT,
  criminal_history JSONB,
  gang_affiliation VARCHAR(100),
  threat_level VARCHAR(20) DEFAULT 'low',
  cooperation_level VARCHAR(20),
  interview_notes TEXT,
  statement_given BOOLEAN DEFAULT FALSE,
  statement_text TEXT,
  statement_audio TEXT,
  statement_video TEXT,
  interpreter_required BOOLEAN DEFAULT FALSE,
  interpreter_language VARCHAR(50),
  legal_representation BOOLEAN DEFAULT FALSE,
  lawyer_contact VARCHAR(255),
  victim_services_referred BOOLEAN DEFAULT FALSE,
  protection_order BOOLEAN DEFAULT FALSE,
  witness_protection BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles Involved
CREATE TABLE vehicles_involved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50), -- car, truck, motorcycle, boat, plane
  make VARCHAR(50),
  model VARCHAR(50),
  year INTEGER,
  color VARCHAR(30),
  license_plate VARCHAR(20),
  vin VARCHAR(50),
  engine_number VARCHAR(50),
  registration_status VARCHAR(20),
  owner_name VARCHAR(255),
  owner_id VARCHAR(50),
  owner_phone VARCHAR(20),
  owner_address TEXT,
  driver_name VARCHAR(255),
  driver_license VARCHAR(50),
  insurance_company VARCHAR(100),
  insurance_policy VARCHAR(50),
  insurance_expiry DATE,
  damage_description TEXT,
  damage_photos TEXT[],
  towed BOOLEAN DEFAULT FALSE,
  tow_company VARCHAR(100),
  tow_location TEXT,
  impounded BOOLEAN DEFAULT FALSE,
  impound_location TEXT,
  evidence_vehicle BOOLEAN DEFAULT FALSE,
  forensics_required BOOLEAN DEFAULT FALSE,
  stolen_vehicle BOOLEAN DEFAULT FALSE,
  vehicle_condition VARCHAR(50),
  mileage INTEGER,
  fuel_level VARCHAR(20),
  modifications TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Evidence Management
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  case_id UUID REFERENCES cases(id),
  evidence_number VARCHAR(30) UNIQUE NOT NULL,
  evidence_type VARCHAR(50) NOT NULL, -- physical, digital, biological, documentary
  category VARCHAR(50), -- weapon, drug, document, photo, video, dna, fingerprint
  subcategory VARCHAR(50),
  description TEXT NOT NULL,
  location_found TEXT,
  coordinates POINT,
  found_by UUID REFERENCES users(id),
  collected_by UUID REFERENCES users(id),
  date_found TIMESTAMP,
  date_collected TIMESTAMP DEFAULT NOW(),
  time_collected TIME,
  collection_method TEXT,
  packaging_type VARCHAR(50),
  seal_number VARCHAR(50),
  chain_of_custody JSONB DEFAULT '[]',
  photos TEXT[],
  videos TEXT[],
  file_attachments TEXT[],
  weight_grams DECIMAL(10,3),
  dimensions VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  condition_description TEXT,
  forensic_analysis_required BOOLEAN DEFAULT FALSE,
  forensic_results JSONB,
  lab_reference VARCHAR(50),
  dna_analysis BOOLEAN DEFAULT FALSE,
  fingerprint_analysis BOOLEAN DEFAULT FALSE,
  ballistics_analysis BOOLEAN DEFAULT FALSE,
  drug_analysis BOOLEAN DEFAULT FALSE,
  digital_forensics BOOLEAN DEFAULT FALSE,
  storage_location VARCHAR(100),
  storage_temperature VARCHAR(20),
  storage_conditions TEXT,
  custodian UUID REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'collected', -- collected, analyzed, returned, destroyed
  court_exhibit_number VARCHAR(50),
  court_date DATE,
  returned_to VARCHAR(255),
  return_date DATE,
  disposal_method VARCHAR(50),
  disposal_date DATE,
  disposal_authorized_by UUID REFERENCES users(id),
  notes TEXT,
  tags TEXT[],
  priority VARCHAR(20) DEFAULT 'normal',
  confidential BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cases Management
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(30) UNIQUE NOT NULL,
  case_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  primary_incident UUID REFERENCES incidents(id),
  lead_investigator UUID REFERENCES users(id),
  supervisor UUID REFERENCES users(id),
  prosecutor VARCHAR(255),
  court VARCHAR(100),
  judge VARCHAR(100),
  status VARCHAR(30) DEFAULT 'open', -- open, under_investigation, court, closed, cold
  priority VARCHAR(20) DEFAULT 'medium',
  date_opened DATE DEFAULT CURRENT_DATE,
  date_closed DATE,
  closure_reason TEXT,
  charges_filed TEXT[],
  convictions TEXT[],
  sentences TEXT[],
  appeals BOOLEAN DEFAULT FALSE,
  restitution_amount DECIMAL(15,2),
  victim_impact_statement TEXT,
  media_attention BOOLEAN DEFAULT FALSE,
  public_interest BOOLEAN DEFAULT FALSE,
  cold_case BOOLEAN DEFAULT FALSE,
  solved BOOLEAN DEFAULT FALSE,
  clearance_type VARCHAR(30), -- arrest, exceptional, unfounded
  solvability_factors JSONB,
  case_notes TEXT,
  timeline JSONB DEFAULT '[]',
  budget_allocated DECIMAL(15,2),
  expenses_incurred DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criminal Records
CREATE TABLE criminals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criminal_number VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(50),
  aliases TEXT[],
  gender VARCHAR(10),
  date_of_birth DATE,
  place_of_birth VARCHAR(100),
  nationality VARCHAR(50) DEFAULT 'Papua New Guinea',
  ethnicity VARCHAR(50),
  languages_spoken TEXT[],
  id_numbers JSONB, -- Various ID types and numbers
  photos TEXT[],
  mugshots TEXT[],
  fingerprints JSONB,
  dna_profile VARCHAR(100),
  physical_description TEXT,
  height VARCHAR(10),
  weight VARCHAR(10),
  hair_color VARCHAR(20),
  eye_color VARCHAR(20),
  skin_tone VARCHAR(20),
  blood_type VARCHAR(5),
  scars_marks TEXT,
  tattoos TEXT,
  piercings TEXT,
  distinguishing_features TEXT,
  current_address TEXT,
  previous_addresses TEXT[],
  phone_numbers TEXT[],
  email_addresses TEXT[],
  social_media_accounts JSONB,
  occupation VARCHAR(100),
  employer VARCHAR(100),
  education_level VARCHAR(50),
  marital_status VARCHAR(20),
  spouse_name VARCHAR(255),
  children_names TEXT[],
  emergency_contacts JSONB,
  known_associates TEXT[],
  gang_affiliation VARCHAR(100),
  gang_rank VARCHAR(50),
  threat_level VARCHAR(20) DEFAULT 'low', -- low, medium, high, extreme
  armed_dangerous BOOLEAN DEFAULT FALSE,
  mental_health_issues BOOLEAN DEFAULT FALSE,
  substance_abuse BOOLEAN DEFAULT FALSE,
  medical_conditions TEXT,
  criminal_history JSONB DEFAULT '[]',
  arrests_count INTEGER DEFAULT 0,
  convictions_count INTEGER DEFAULT 0,
  current_charges TEXT[],
  outstanding_warrants TEXT[],
  probation_status VARCHAR(30),
  probation_officer VARCHAR(255),
  parole_status VARCHAR(30),
  parole_officer VARCHAR(255),
  incarceration_history JSONB DEFAULT '[]',
  bail_history JSONB DEFAULT '[]',
  court_appearances JSONB DEFAULT '[]',
  vehicle_registrations TEXT[],
  property_owned TEXT[],
  financial_accounts JSONB,
  travel_history JSONB,
  international_alerts BOOLEAN DEFAULT FALSE,
  interpol_notice VARCHAR(20),
  extradition_risks BOOLEAN DEFAULT FALSE,
  surveillance_notes TEXT,
  intelligence_reports TEXT[],
  case_connections TEXT[], -- Related case numbers
  victim_of_crimes BOOLEAN DEFAULT FALSE,
  witness_history BOOLEAN DEFAULT FALSE,
  informant_status VARCHAR(20),
  protection_program BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active', -- active, deceased, relocated, unknown
  last_known_location TEXT,
  last_contact_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Custody Management
CREATE TABLE custody_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custody_number VARCHAR(20) UNIQUE NOT NULL,
  person_id UUID REFERENCES people_involved(id),
  criminal_id UUID REFERENCES criminals(id),
  incident_id UUID REFERENCES incidents(id),
  arresting_officer UUID REFERENCES users(id),
  booking_officer UUID REFERENCES users(id),
  arrest_date TIMESTAMP DEFAULT NOW(),
  arrest_location TEXT,
  arrest_reason TEXT,
  charges TEXT[] NOT NULL,
  warrant_number VARCHAR(50),
  miranda_rights_given BOOLEAN DEFAULT FALSE,
  miranda_time TIMESTAMP,
  miranda_officer UUID REFERENCES users(id),
  booking_date TIMESTAMP DEFAULT NOW(),
  release_date TIMESTAMP,
  cell_number VARCHAR(10),
  cell_block VARCHAR(10),
  custody_status VARCHAR(30) DEFAULT 'in_custody', -- in_custody, released, transferred, court
  bail_amount DECIMAL(15,2),
  bail_paid BOOLEAN DEFAULT FALSE,
  bail_payment_method VARCHAR(30),
  bail_receipt_number VARCHAR(50),
  guarantor_name VARCHAR(255),
  guarantor_contact VARCHAR(255),
  guarantor_id VARCHAR(50),
  personal_property JSONB DEFAULT '[]',
  property_receipt_number VARCHAR(50),
  medical_screening BOOLEAN DEFAULT FALSE,
  medical_notes TEXT,
  mental_health_assessment BOOLEAN DEFAULT FALSE,
  suicide_risk BOOLEAN DEFAULT FALSE,
  special_needs TEXT,
  dietary_requirements TEXT,
  medications TEXT[],
  visitors_log JSONB DEFAULT '[]',
  phone_calls_log JSONB DEFAULT '[]',
  legal_representation BOOLEAN DEFAULT FALSE,
  lawyer_contact VARCHAR(255),
  court_appearances JSONB DEFAULT '[]',
  disciplinary_actions JSONB DEFAULT '[]',
  release_conditions TEXT[],
  monitoring_required BOOLEAN DEFAULT FALSE,
  monitoring_type VARCHAR(50), -- ankle_bracelet, check_in, curfew
  probation_officer VARCHAR(255),
  next_court_date DATE,
  court_location VARCHAR(100),
  case_number VARCHAR(30),
  notes TEXT,
  photos TEXT[], -- Booking photos
  fingerprints_taken BOOLEAN DEFAULT FALSE,
  dna_sample_taken BOOLEAN DEFAULT FALSE,
  strip_search_conducted BOOLEAN DEFAULT FALSE,
  contraband_found BOOLEAN DEFAULT FALSE,
  contraband_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles Registration & Fleet Management
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(20) UNIQUE NOT NULL,
  vin VARCHAR(50) UNIQUE,
  vehicle_type VARCHAR(50) NOT NULL, -- car, truck, motorcycle, boat, aircraft
  category VARCHAR(30), -- personal, commercial, government, police
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(30),
  engine_type VARCHAR(30),
  engine_number VARCHAR(50),
  engine_capacity VARCHAR(20),
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  body_type VARCHAR(30),
  seating_capacity INTEGER,
  gross_weight INTEGER,
  purchase_date DATE,
  purchase_price DECIMAL(15,2),
  current_value DECIMAL(15,2),
  owner_type VARCHAR(30), -- individual, company, government
  owner_name VARCHAR(255) NOT NULL,
  owner_id VARCHAR(50),
  owner_phone VARCHAR(20),
  owner_email VARCHAR(100),
  owner_address TEXT,
  registered_address TEXT,
  insurance_company VARCHAR(100),
  insurance_policy VARCHAR(50),
  insurance_expiry DATE,
  registration_expiry DATE,
  fitness_certificate VARCHAR(50),
  fitness_expiry DATE,
  road_worthy BOOLEAN DEFAULT TRUE,
  status VARCHAR(30) DEFAULT 'active', -- active, suspended, cancelled, stolen, scrapped
  suspension_reason TEXT,
  stolen_date DATE,
  recovered_date DATE,
  accident_history JSONB DEFAULT '[]',
  traffic_violations JSONB DEFAULT '[]',
  maintenance_history JSONB DEFAULT '[]',
  inspection_history JSONB DEFAULT '[]',
  modifications TEXT[],
  defects TEXT[],
  liens JSONB DEFAULT '[]',
  encumbrances TEXT[],
  transfer_history JSONB DEFAULT '[]',
  import_details JSONB,
  export_details JSONB,
  customs_clearance VARCHAR(50),
  duty_paid BOOLEAN DEFAULT FALSE,
  vehicle_use VARCHAR(50), -- private, commercial, taxi, rental, government
  route_permit VARCHAR(50),
  operating_license VARCHAR(50),
  driver_restrictions TEXT[],
  special_conditions TEXT[],
  tracking_device BOOLEAN DEFAULT FALSE,
  tracking_id VARCHAR(50),
  gps_coordinates POINT,
  last_location_update TIMESTAMP,
  mileage INTEGER,
  condition_rating INTEGER, -- 1-10 scale
  photos TEXT[],
  documents TEXT[], -- Registration, insurance, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Missing Persons
CREATE TABLE missing_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(50),
  aliases TEXT[],
  gender VARCHAR(10),
  date_of_birth DATE,
  age_when_missing INTEGER,
  nationality VARCHAR(50) DEFAULT 'Papua New Guinea',
  ethnicity VARCHAR(50),
  languages_spoken TEXT[],
  id_number VARCHAR(50),
  photos TEXT[] NOT NULL,
  recent_photos TEXT[],
  physical_description TEXT,
  height VARCHAR(10),
  weight VARCHAR(10),
  hair_color VARCHAR(20),
  eye_color VARCHAR(20),
  skin_tone VARCHAR(20),
  scars_marks TEXT,
  tattoos TEXT,
  piercings TEXT,
  distinguishing_features TEXT,
  clothing_when_last_seen TEXT,
  personal_items TEXT[],
  medical_conditions TEXT,
  medications TEXT[],
  mental_health_status TEXT,
  developmental_disabilities BOOLEAN DEFAULT FALSE,
  endangered BOOLEAN DEFAULT FALSE,
  circumstances TEXT NOT NULL,
  last_seen_date TIMESTAMP NOT NULL,
  last_seen_location TEXT NOT NULL,
  last_seen_coordinates POINT,
  last_seen_by VARCHAR(255),
  last_contact_method VARCHAR(50),
  missing_from_address TEXT,
  destination_if_known TEXT,
  mode_of_transport VARCHAR(50),
  vehicle_description TEXT,
  companions TEXT[],
  possible_locations TEXT[],
  family_contacts JSONB NOT NULL,
  emergency_contact VARCHAR(255),
  reporting_person VARCHAR(255) NOT NULL,
  reporting_person_relationship VARCHAR(50),
  reporting_person_contact VARCHAR(255),
  case_type VARCHAR(30) DEFAULT 'missing', -- missing, runaway, abduction, endangered
  risk_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
  amber_alert_issued BOOLEAN DEFAULT FALSE,
  amber_alert_number VARCHAR(50),
  amber_alert_date TIMESTAMP,
  media_release BOOLEAN DEFAULT FALSE,
  media_description TEXT,
  public_appeal BOOLEAN DEFAULT FALSE,
  reward_offered BOOLEAN DEFAULT FALSE,
  reward_amount DECIMAL(10,2),
  investigating_officer UUID REFERENCES users(id),
  supervisor UUID REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'active', -- active, found_safe, found_deceased, closed
  found_date TIMESTAMP,
  found_location TEXT,
  found_condition VARCHAR(50),
  found_by VARCHAR(255),
  outcome_description TEXT,
  search_efforts JSONB DEFAULT '[]',
  leads_investigated JSONB DEFAULT '[]',
  sightings JSONB DEFAULT '[]',
  tips_received INTEGER DEFAULT 0,
  social_media_posts JSONB DEFAULT '[]',
  posters_distributed INTEGER DEFAULT 0,
  search_areas TEXT[],
  resources_deployed JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  case_notes TEXT,
  related_cases TEXT[],
  suspects JSONB DEFAULT '[]',
  foul_play_suspected BOOLEAN DEFAULT FALSE,
  custody_issues BOOLEAN DEFAULT FALSE,
  domestic_dispute BOOLEAN DEFAULT FALSE,
  mental_health_crisis BOOLEAN DEFAULT FALSE,
  substance_abuse BOOLEAN DEFAULT FALSE,
  financial_problems BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Alerts
CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id VARCHAR(20) UNIQUE NOT NULL,
  alert_type VARCHAR(30) NOT NULL, -- amber, bolo, weather, security, public_safety
  priority VARCHAR(20) DEFAULT 'high', -- low, medium, high, critical
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  detailed_description TEXT,
  incident_id UUID REFERENCES incidents(id),
  missing_person_id UUID REFERENCES missing_persons(id),
  location_affected TEXT,
  coordinates_affected POINT,
  radius_km DECIMAL(10,2),
  provinces_affected TEXT[],
  districts_affected TEXT[],
  target_audience TEXT[], -- public, police, emergency_services, government
  channels_used TEXT[], -- radio, tv, social_media, mobile, siren, digital_signs
  issued_by UUID REFERENCES users(id) NOT NULL,
  authorized_by UUID REFERENCES users(id),
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- draft, active, expired, cancelled
  acknowledgments JSONB DEFAULT '[]',
  responses JSONB DEFAULT '[]',
  effectiveness_rating INTEGER, -- 1-10
  public_response TEXT,
  media_coverage BOOLEAN DEFAULT FALSE,
  follow_up_required BOOLEAN DEFAULT TRUE,
  follow_up_notes TEXT,
  related_alerts TEXT[],
  attachments TEXT[], -- Photos, documents, audio
  translation_required BOOLEAN DEFAULT FALSE,
  translations JSONB, -- Different language versions
  accessibility_features JSONB, -- Sign language, audio descriptions
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Patrol Management
CREATE TABLE patrol_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id VARCHAR(20) UNIQUE NOT NULL,
  patrol_type VARCHAR(30) NOT NULL, -- routine, targeted, emergency, special_event
  assignment_name VARCHAR(255),
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_officers UUID[] NOT NULL, -- Array of officer IDs
  supervisor UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  patrol_area POLYGON, -- Geographic area
  route_coordinates JSONB, -- GPS route points
  route_optimized BOOLEAN DEFAULT FALSE,
  estimated_duration INTEGER, -- Minutes
  scheduled_start TIMESTAMP NOT NULL,
  scheduled_end TIMESTAMP NOT NULL,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  status VARCHAR(30) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  objectives TEXT[],
  special_instructions TEXT,
  equipment_required TEXT[],
  backup_required BOOLEAN DEFAULT FALSE,
  backup_units TEXT[],
  radio_frequency VARCHAR(20),
  checkpoints JSONB DEFAULT '[]',
  incidents_encountered UUID[], -- References to incidents
  reports_filed UUID[], -- References to reports
  arrests_made INTEGER DEFAULT 0,
  citations_issued INTEGER DEFAULT 0,
  warnings_given INTEGER DEFAULT 0,
  public_contacts INTEGER DEFAULT 0,
  suspicious_activities JSONB DEFAULT '[]',
  traffic_stops INTEGER DEFAULT 0,
  vehicle_searches INTEGER DEFAULT 0,
  contraband_seized JSONB DEFAULT '[]',
  fuel_consumption DECIMAL(8,2),
  mileage_start INTEGER,
  mileage_end INTEGER,
  vehicle_condition_start TEXT,
  vehicle_condition_end TEXT,
  weather_conditions VARCHAR(100),
  visibility VARCHAR(50),
  road_conditions VARCHAR(100),
  community_feedback JSONB DEFAULT '[]',
  officer_observations TEXT,
  recommendations TEXT,
  photos TEXT[],
  videos TEXT[],
  audio_logs TEXT[],
  gps_tracking JSONB DEFAULT '[]', -- Real-time location data
  performance_metrics JSONB,
  completion_percentage INTEGER DEFAULT 0,
  effectiveness_rating INTEGER, -- 1-10
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  request_data JSONB,
  response_data JSONB
);

-- System Configuration
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),
  editable BOOLEAN DEFAULT TRUE,
  sensitive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- File Storage
CREATE TABLE file_storage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  file_hash VARCHAR(64), -- SHA-256 hash
  uploaded_by UUID REFERENCES users(id),
  related_table VARCHAR(50),
  related_id UUID,
  file_category VARCHAR(50), -- photo, video, audio, document, evidence
  confidential BOOLEAN DEFAULT FALSE,
  encrypted BOOLEAN DEFAULT FALSE,
  virus_scanned BOOLEAN DEFAULT FALSE,
  scan_result VARCHAR(20),
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP,
  retention_period INTEGER, -- Days
  auto_delete_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_date_reported ON incidents(date_reported);
CREATE INDEX idx_incidents_location ON incidents USING GIST(location_coordinates);
CREATE INDEX idx_people_involved_incident ON people_involved(incident_id);
CREATE INDEX idx_evidence_incident ON evidence(incident_id);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_missing_persons_status ON missing_persons(status);
CREATE INDEX idx_patrol_assignments_status ON patrol_assignments(status);
CREATE INDEX idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp);
CREATE INDEX idx_file_storage_related ON file_storage(related_table, related_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_involved ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE criminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE custody_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missing_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrol_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_storage ENABLE ROW LEVEL SECURITY;
