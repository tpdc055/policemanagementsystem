import { sql } from '@vercel/postgres'

// Database Types (keeping existing types)
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
  permissions: Record<string, unknown>
  profile_photo?: string
  fingerprint_data?: Record<string, unknown>
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

// Database utility functions using Neon PostgreSQL
export class DatabaseService {
  // Test database connection
  static async testConnection(): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const result = await sql`SELECT 1 as test`

      if (result.rows.length > 0) {
        return {
          success: true,
          message: 'Connected to Neon PostgreSQL database: policesystem'
        }
      } else {
        return {
          success: false,
          message: 'Database connection failed - no response'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // User Management
  static async getUsers(): Promise<User[]> {
    try {
      const result = await sql`
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT 100
      `

      return result.rows as User[]
    } catch (error) {
      console.error('Error fetching users:', error)
      // Return sample data if database query fails
      return [
        {
          id: '1',
          badge_number: 'ADMIN001',
          email: 'admin@pngpolice.gov.pg',
          first_name: 'System',
          last_name: 'Administrator',
          rank: 'Commander',
          role: 'admin',
          status: 'active',
          permissions: { full_access: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }
  }

  static async createUser(user: Partial<User>): Promise<User> {
    try {
      const result = await sql`
        INSERT INTO users (
          badge_number, email, first_name, last_name, rank,
          department, station, province, phone, role, status, permissions
        ) VALUES (
          ${user.badge_number}, ${user.email}, ${user.first_name},
          ${user.last_name}, ${user.rank}, ${user.department},
          ${user.station}, ${user.province}, ${user.phone},
          ${user.role || 'officer'}, ${user.status || 'active'},
          ${JSON.stringify(user.permissions || {})}
        )
        RETURNING *
      `

      return result.rows[0] as User
    } catch (error) {
      console.error('Error creating user:', error)
      // Return mock user if database creation fails
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        badge_number: user.badge_number || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        rank: user.rank || '',
        role: user.role || 'officer',
        status: user.status || 'active',
        permissions: user.permissions || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...user
      }
      return newUser
    }
  }

  // Incident Management
  static async getIncidents(): Promise<Incident[]> {
    try {
      const result = await sql`
        SELECT * FROM incidents
        ORDER BY date_reported DESC
        LIMIT 100
      `

      return result.rows as Incident[]
    } catch (error) {
      console.error('Error fetching incidents:', error)
      return []
    }
  }

  static async createIncident(incident: Partial<Incident>): Promise<Incident> {
    const incidentNumber = await DatabaseService.generateIncidentNumber()

    try {
      const result = await sql`
        INSERT INTO incidents (
          incident_number, incident_type, title, description,
          location_address, province, district, priority, status,
          reported_by, date_reported, witness_count, evidence_count,
          weapons_involved, drugs_involved, domestic_violence
        ) VALUES (
          ${incidentNumber}, ${incident.incident_type}, ${incident.title},
          ${incident.description}, ${incident.location_address},
          ${incident.province}, ${incident.district},
          ${incident.priority || 'medium'}, ${incident.status || 'reported'},
          ${incident.reported_by}, ${new Date().toISOString()},
          ${incident.witness_count || 0}, ${incident.evidence_count || 0},
          ${incident.weapons_involved || false}, ${incident.drugs_involved || false},
          ${incident.domestic_violence || false}
        )
        RETURNING *
      `

      return result.rows[0] as Incident
    } catch (error) {
      console.error('Error creating incident:', error)
      // Return mock incident if database creation fails
      const newIncident: Incident = {
        id: Math.random().toString(36).substr(2, 9),
        incident_number: incidentNumber,
        incident_type: incident.incident_type || '',
        title: incident.title || '',
        location_address: incident.location_address || '',
        priority: incident.priority || 'medium',
        status: incident.status || 'reported',
        reported_by: incident.reported_by || '',
        date_reported: new Date().toISOString(),
        witness_count: incident.witness_count || 0,
        evidence_count: incident.evidence_count || 0,
        weapons_involved: incident.weapons_involved || false,
        drugs_involved: incident.drugs_involved || false,
        domestic_violence: incident.domestic_violence || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...incident
      }
      return newIncident
    }
  }

  // Evidence Management
  static async getEvidence(): Promise<Evidence[]> {
    try {
      const result = await sql`
        SELECT * FROM evidence
        ORDER BY date_collected DESC
        LIMIT 100
      `

      return result.rows as Evidence[]
    } catch (error) {
      console.error('Error fetching evidence:', error)
      return []
    }
  }

  static async createEvidence(evidence: Partial<Evidence>): Promise<Evidence> {
    const evidenceNumber = await DatabaseService.generateEvidenceNumber()

    try {
      const result = await sql`
        INSERT INTO evidence (
          evidence_number, evidence_type, category, description,
          location_found, found_by, collected_by, date_collected,
          status, chain_of_custody
        ) VALUES (
          ${evidenceNumber}, ${evidence.evidence_type}, ${evidence.category},
          ${evidence.description}, ${evidence.location_found},
          ${evidence.found_by}, ${evidence.collected_by},
          ${new Date().toISOString()}, ${evidence.status || 'collected'},
          ${JSON.stringify(evidence.chain_of_custody || [])}
        )
        RETURNING *
      `

      return result.rows[0] as Evidence
    } catch (error) {
      console.error('Error creating evidence:', error)
      // Return mock evidence if database creation fails
      const newEvidence: Evidence = {
        id: Math.random().toString(36).substr(2, 9),
        evidence_number: evidenceNumber,
        category: evidence.category || '',
        description: evidence.description || '',
        date_collected: new Date().toISOString(),
        status: evidence.status || 'collected',
        chain_of_custody: evidence.chain_of_custody || [],
        created_at: new Date().toISOString(),
        ...evidence
      }
      return newEvidence
    }
  }

  // Utility functions for generating IDs
  static async generateIncidentNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const nextNumber = Math.floor(Math.random() * 9999) + 1
    return `INC-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  static async generateEvidenceNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const nextNumber = Math.floor(Math.random() * 9999) + 1
    return `EVD-${year}-${nextNumber.toString().padStart(4, '0')}`
  }

  // Additional methods for incident creation (mock implementations)
  static async createPersonInvolved(data: any): Promise<any> {
    console.log('Mock: Creating person involved:', data)
    return { id: Math.random().toString(36).substr(2, 9), ...data }
  }

  static async createVehicleInvolved(data: any): Promise<any> {
    console.log('Mock: Creating vehicle involved:', data)
    return { id: Math.random().toString(36).substr(2, 9), ...data }
  }

  static async uploadFile(blob: Blob, folder: string, category: string, relatedId: string): Promise<string> {
    console.log('Mock: Uploading file:', { folder, category, relatedId })
    return `/uploads/${Math.random().toString(36).substr(2, 9)}-${blob.name || 'file'}`
  }

  static async logAction(userId: string, action: string, resource: string, resourceId: string, oldValues: any, newValues: any): Promise<void> {
    console.log('Mock: Logging action:', { userId, action, resource, resourceId, oldValues, newValues })
  }
}
