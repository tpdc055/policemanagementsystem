import { createClient } from '@supabase/supabase-js'

// Database Types
export interface User {
  id: string
  badge_number: string
  email?: string
  first_name: string
  last_name: string
  rank: string
  department?: string
  station?: string
  province?: string
  phone?: string
  status: 'active' | 'inactive' | 'suspended'
  role: 'officer' | 'sergeant' | 'commander' | 'admin'
  permissions: Record<string, any>
  profile_photo?: string
  fingerprint_data?: Record<string, any>
  created_at: string
  updated_at: string
  last_login?: string
}

export interface Incident {
  id: string
  incident_number: string
  incident_type: string
  title: string
  description?: string
  location_address: string
  location_coordinates?: [number, number]
  province?: string
  district?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'investigating' | 'pending' | 'resolved' | 'closed'
  reported_by: string
  assigned_to?: string
  supervisor?: string
  date_reported: string
  date_occurred?: string
  date_resolved?: string
  photos?: string[]
  videos?: string[]
  witness_count: number
  evidence_count: number
  weapons_involved: boolean
  drugs_involved: boolean
  domestic_violence: boolean
  created_at: string
  updated_at: string
}

export interface PersonInvolved {
  id: string
  incident_id: string
  person_type: 'victim' | 'suspect' | 'witness' | 'complainant'
  first_name?: string
  last_name?: string
  middle_name?: string
  aliases?: string[]
  gender?: string
  date_of_birth?: string
  nationality: string
  phone?: string
  email?: string
  address?: string
  photos?: string[]
  physical_description?: string
  fingerprints?: Record<string, any>
  criminal_history?: Record<string, any>
  created_at: string
}

export interface Evidence {
  id: string
  incident_id?: string
  case_id?: string
  evidence_number: string
  evidence_type: 'physical' | 'digital' | 'biological' | 'documentary'
  category: string
  description: string
  location_found?: string
  found_by?: string
  collected_by?: string
  date_collected: string
  photos?: string[]
  videos?: string[]
  file_attachments?: string[]
  chain_of_custody: Array<{
    handler: string
    action: string
    timestamp: string
    location: string
  }>
  status: 'collected' | 'analyzed' | 'returned' | 'destroyed'
  storage_location?: string
  custodian?: string
  created_at: string
}

export interface Vehicle {
  id: string
  registration_number: string
  vin?: string
  vehicle_type: string
  make: string
  model: string
  year: number
  color?: string
  owner_name: string
  owner_id?: string
  owner_phone?: string
  insurance_company?: string
  insurance_expiry?: string
  registration_expiry?: string
  status: 'active' | 'suspended' | 'cancelled' | 'stolen'
  accident_history?: Record<string, any>[]
  traffic_violations?: Record<string, any>[]
  photos?: string[]
  created_at: string
}

export interface MissingPerson {
  id: string
  case_number: string
  first_name: string
  last_name: string
  middle_name?: string
  gender?: string
  date_of_birth?: string
  age_when_missing?: number
  photos: string[]
  physical_description?: string
  circumstances: string
  last_seen_date: string
  last_seen_location: string
  family_contacts: Record<string, any>
  reporting_person: string
  case_type: 'missing' | 'runaway' | 'abduction' | 'endangered'
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  amber_alert_issued: boolean
  investigating_officer?: string
  status: 'active' | 'found_safe' | 'found_deceased' | 'closed'
  created_at: string
}

export interface EmergencyAlert {
  id: string
  alert_id: string
  alert_type: 'amber' | 'bolo' | 'weather' | 'security' | 'public_safety'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  location_affected?: string
  provinces_affected?: string[]
  channels_used: string[]
  issued_by: string
  issued_at: string
  expires_at?: string
  status: 'draft' | 'active' | 'expired' | 'cancelled'
  created_at: string
}

export interface PatrolAssignment {
  id: string
  assignment_id: string
  patrol_type: 'routine' | 'targeted' | 'emergency' | 'special_event'
  assignment_name?: string
  assigned_officers: string[]
  supervisor?: string
  vehicle_id?: string
  scheduled_start: string
  scheduled_end: string
  actual_start?: string
  actual_end?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  objectives?: string[]
  incidents_encountered?: string[]
  arrests_made: number
  citations_issued: number
  created_at: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database utility functions
export class DatabaseService {
  // User Management
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getUserByBadgeNumber(badgeNumber: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('badge_number', badgeNumber)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createUser(user: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Incident Management
  static async getIncidents(filters?: {
    status?: string
    priority?: string
    assigned_to?: string
    date_from?: string
    date_to?: string
  }): Promise<Incident[]> {
    let query = supabase
      .from('incidents')
      .select(`
        *,
        reported_by_user:users!incidents_reported_by_fkey(first_name, last_name, badge_number),
        assigned_to_user:users!incidents_assigned_to_fkey(first_name, last_name, badge_number)
      `)
      .order('date_reported', { ascending: false })

    if (filters?.status && filters.status !== 'All') {
      query = query.eq('status', filters.status)
    }
    if (filters?.priority && filters.priority !== 'All') {
      query = query.eq('priority', filters.priority)
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to)
    }
    if (filters?.date_from) {
      query = query.gte('date_reported', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('date_reported', filters.date_to)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async getIncidentById(id: string): Promise<Incident | null> {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        reported_by_user:users!incidents_reported_by_fkey(*),
        assigned_to_user:users!incidents_assigned_to_fkey(*),
        people_involved(*),
        vehicles_involved(*),
        evidence(*)
      `)
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createIncident(incident: Partial<Incident>): Promise<Incident> {
    // Generate incident number
    const incidentNumber = await this.generateIncidentNumber()

    const { data, error } = await supabase
      .from('incidents')
      .insert({
        ...incident,
        incident_number: incidentNumber,
        date_reported: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
    const { data, error } = await supabase
      .from('incidents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Evidence Management
  static async getEvidence(incidentId?: string): Promise<Evidence[]> {
    let query = supabase
      .from('evidence')
      .select(`
        *,
        found_by_user:users!evidence_found_by_fkey(first_name, last_name, badge_number),
        collected_by_user:users!evidence_collected_by_fkey(first_name, last_name, badge_number),
        custodian_user:users!evidence_custodian_fkey(first_name, last_name, badge_number)
      `)
      .order('date_collected', { ascending: false })

    if (incidentId) {
      query = query.eq('incident_id', incidentId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async createEvidence(evidence: Partial<Evidence>): Promise<Evidence> {
    const evidenceNumber = await this.generateEvidenceNumber()

    const { data, error } = await supabase
      .from('evidence')
      .insert({
        ...evidence,
        evidence_number: evidenceNumber,
        chain_of_custody: [{
          handler: evidence.collected_by || '',
          action: 'collected',
          timestamp: new Date().toISOString(),
          location: evidence.location_found || 'Unknown'
        }]
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateEvidenceChainOfCustody(
    id: string,
    custodyEntry: {
      handler: string
      action: string
      location: string
    }
  ): Promise<Evidence> {
    // Get current evidence
    const { data: currentEvidence, error: fetchError } = await supabase
      .from('evidence')
      .select('chain_of_custody')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const updatedChain = [
      ...(currentEvidence.chain_of_custody || []),
      {
        ...custodyEntry,
        timestamp: new Date().toISOString()
      }
    ]

    const { data, error } = await supabase
      .from('evidence')
      .update({
        chain_of_custody: updatedChain,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Vehicle Management
  static async getVehicles(searchTerm?: string): Promise<Vehicle[]> {
    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (searchTerm) {
      query = query.or(`registration_number.ilike.%${searchTerm}%,make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,owner_name.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async getVehicleByRegistration(registration: string): Promise<Vehicle | null> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('registration_number', registration)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Missing Persons
  static async getMissingPersons(status?: string): Promise<MissingPerson[]> {
    let query = supabase
      .from('missing_persons')
      .select(`
        *,
        investigating_officer_user:users!missing_persons_investigating_officer_fkey(first_name, last_name, badge_number)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'All') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async createMissingPerson(person: Partial<MissingPerson>): Promise<MissingPerson> {
    const caseNumber = await this.generateMissingPersonCaseNumber()

    const { data, error } = await supabase
      .from('missing_persons')
      .insert({
        ...person,
        case_number: caseNumber
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Emergency Alerts
  static async getEmergencyAlerts(status?: string): Promise<EmergencyAlert[]> {
    let query = supabase
      .from('emergency_alerts')
      .select(`
        *,
        issued_by_user:users!emergency_alerts_issued_by_fkey(first_name, last_name, badge_number)
      `)
      .order('issued_at', { ascending: false })

    if (status && status !== 'All') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async createEmergencyAlert(alert: Partial<EmergencyAlert>): Promise<EmergencyAlert> {
    const alertId = await this.generateAlertId()

    const { data, error } = await supabase
      .from('emergency_alerts')
      .insert({
        ...alert,
        alert_id: alertId,
        issued_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Patrol Assignments
  static async getPatrolAssignments(
    officerId?: string,
    status?: string
  ): Promise<PatrolAssignment[]> {
    let query = supabase
      .from('patrol_assignments')
      .select(`
        *,
        supervisor_user:users!patrol_assignments_supervisor_fkey(first_name, last_name, badge_number),
        vehicle:vehicles(registration_number, make, model)
      `)
      .order('scheduled_start', { ascending: false })

    if (officerId) {
      query = query.contains('assigned_officers', [officerId])
    }
    if (status && status !== 'All') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async createPatrolAssignment(assignment: Partial<PatrolAssignment>): Promise<PatrolAssignment> {
    const assignmentId = await this.generatePatrolAssignmentId()

    const { data, error } = await supabase
      .from('patrol_assignments')
      .insert({
        ...assignment,
        assignment_id: assignmentId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // File Management
  static async uploadFile(
    file: File,
    category: string,
    relatedTable?: string,
    relatedId?: string
  ): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${category}/${fileName}`

    const { data, error } = await supabase.storage
      .from('police-files')
      .upload(filePath, file)

    if (error) throw error

    // Store file metadata
    await supabase
      .from('file_storage')
      .insert({
        file_name: fileName,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        file_category: category,
        related_table: relatedTable,
        related_id: relatedId,
        uploaded_by: 'current_user_id' // This should be replaced with actual user ID
      })

    return filePath
  }

  static async getFileUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('police-files')
      .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

    return data?.signedUrl || ''
  }

  // Utility functions for generating IDs
  static async generateIncidentNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const { count } = await supabase
      .from('incidents')
      .select('*', { count: 'exact', head: true })
      .gte('date_reported', `${year}-01-01`)

    const nextNumber = (count || 0) + 1
    return `INC-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  static async generateEvidenceNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const { count } = await supabase
      .from('evidence')
      .select('*', { count: 'exact', head: true })
      .gte('date_collected', `${year}-01-01`)

    const nextNumber = (count || 0) + 1
    return `EVD-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  static async generateMissingPersonCaseNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const { count } = await supabase
      .from('missing_persons')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${year}-01-01`)

    const nextNumber = (count || 0) + 1
    return `MP-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  static async generateAlertId(): Promise<string> {
    const year = new Date().getFullYear()
    const { count } = await supabase
      .from('emergency_alerts')
      .select('*', { count: 'exact', head: true })
      .gte('issued_at', `${year}-01-01`)

    const nextNumber = (count || 0) + 1
    return `ALERT-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  static async generatePatrolAssignmentId(): Promise<string> {
    const year = new Date().getFullYear()
    const { count } = await supabase
      .from('patrol_assignments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${year}-01-01`)

    const nextNumber = (count || 0) + 1
    return `PATROL-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  // Analytics and Statistics
  static async getIncidentStatistics(dateFrom?: string, dateTo?: string) {
    let query = supabase
      .from('incidents')
      .select('status, priority, incident_type, province, date_reported')

    if (dateFrom) {
      query = query.gte('date_reported', dateFrom)
    }
    if (dateTo) {
      query = query.lte('date_reported', dateTo)
    }

    const { data, error } = await query
    if (error) throw error

    // Process statistics
    const stats = {
      total: data?.length || 0,
      by_status: {},
      by_priority: {},
      by_type: {},
      by_province: {},
      recent_trend: []
    }

    data?.forEach(incident => {
      // Status breakdown
      stats.by_status[incident.status] = (stats.by_status[incident.status] || 0) + 1

      // Priority breakdown
      stats.by_priority[incident.priority] = (stats.by_priority[incident.priority] || 0) + 1

      // Type breakdown
      stats.by_type[incident.incident_type] = (stats.by_type[incident.incident_type] || 0) + 1

      // Province breakdown
      if (incident.province) {
        stats.by_province[incident.province] = (stats.by_province[incident.province] || 0) + 1
      }
    })

    return stats
  }

  // Audit Trail
  static async logAction(
    userId: string,
    action: string,
    tableName: string,
    recordId?: string,
    oldValues?: any,
    newValues?: any
  ) {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: '127.0.0.1', // This should be replaced with actual IP
        timestamp: new Date().toISOString()
      })
  }
}
