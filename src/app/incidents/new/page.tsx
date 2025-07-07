"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import PhotoCapture from "@/components/capture/PhotoCapture"
import BiometricCapture from "@/components/capture/BiometricCapture"
import { DatabaseService } from "@/lib/database"
import {
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Camera,
  Fingerprint,
  Car,
  FileText,
  Save,
  Send,
  Plus,
  Minus,
  Shield,
  Phone,
  Calendar,
  User,
  Building,
  Navigation,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import type { User as UserType } from "@/types/user"

interface PersonInvolved {
  id: string
  person_type: 'victim' | 'suspect' | 'witness' | 'complainant'
  first_name: string
  last_name: string
  middle_name?: string
  gender?: string
  date_of_birth?: string
  nationality: string
  phone?: string
  email?: string
  address?: string
  physical_description?: string
  role_in_incident?: string
  injuries?: string
  statement_given: boolean
  cooperation_level: 'cooperative' | 'uncooperative' | 'unknown'
}

interface VehicleInvolved {
  id: string
  vehicle_type: string
  make?: string
  model?: string
  year?: number
  color?: string
  license_plate?: string
  owner_name?: string
  driver_name?: string
  damage_description?: string
  towed: boolean
  impounded: boolean
}

interface IncidentFormData {
  incident_type: string
  title: string
  description: string
  location_address: string
  location_coordinates?: [number, number]
  province: string
  district: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  date_occurred: string
  time_occurred: string
  weather_conditions: string
  visibility: string
  weapons_involved: boolean
  drugs_involved: boolean
  gang_related: boolean
  domestic_violence: boolean
  injuries_reported: boolean
  fatalities_reported: boolean
  property_damage_estimate?: number
  people_involved: PersonInvolved[]
  vehicles_involved: VehicleInvolved[]
  evidence_collected: boolean
  photos_taken: boolean
  witnesses_interviewed: boolean
  follow_up_required: boolean
  immediate_actions_taken: string
  additional_notes: string
}

const INCIDENT_TYPES = [
  'Armed Robbery', 'Burglary', 'Theft', 'Assault', 'Domestic Violence',
  'Traffic Accident', 'Drug Offense', 'Public Disturbance', 'Vandalism',
  'Fraud', 'Missing Person', 'Homicide', 'Sexual Assault', 'Tribal Fighting',
  'Kidnapping', 'Arson', 'Cybercrime', 'Environmental Crime', 'Corruption',
  'Human Trafficking', 'Wildlife Crime', 'Border Security', 'Other'
]

const PNG_PROVINCES = [
  'National Capital District', 'Morobe', 'Western Highlands', 'Southern Highlands',
  'Eastern Highlands', 'Simbu', 'Western', 'Gulf', 'Central', 'Milne Bay',
  'Oro', 'Northern', 'East Sepik', 'West Sepik', 'Manus', 'New Ireland',
  'East New Britain', 'West New Britain', 'Autonomous Region of Bougainville',
  'Hela', 'Jiwaka', 'Enga'
]

const WEATHER_CONDITIONS = [
  'Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain',
  'Thunderstorm', 'Fog', 'Mist', 'Strong Winds', 'Unknown'
]

const VISIBILITY_CONDITIONS = [
  'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor', 'Dark', 'Artificial Light'
]

export default function NewIncidentPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<IncidentFormData>({
    incident_type: '',
    title: '',
    description: '',
    location_address: '',
    province: '',
    district: '',
    priority: 'medium',
    date_occurred: new Date().toISOString().split('T')[0],
    time_occurred: new Date().toTimeString().split(' ')[0].slice(0, 5),
    weather_conditions: '',
    visibility: '',
    weapons_involved: false,
    drugs_involved: false,
    gang_related: false,
    domestic_violence: false,
    injuries_reported: false,
    fatalities_reported: false,
    people_involved: [],
    vehicles_involved: [],
    evidence_collected: false,
    photos_taken: false,
    witnesses_interviewed: false,
    follow_up_required: true,
    immediate_actions_taken: '',
    additional_notes: ''
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [capturedPhotos, setCapturedPhotos] = useState<any[]>([])
  const [capturedBiometrics, setCapturedBiometrics] = useState<any[]>([])
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setFormData(prev => ({
            ...prev,
            location_coordinates: [position.coords.longitude, position.coords.latitude]
          }))
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }, [])

  // Add person involved
  const addPersonInvolved = () => {
    const newPerson: PersonInvolved = {
      id: `person_${Date.now()}`,
      person_type: 'witness',
      first_name: '',
      last_name: '',
      nationality: 'Papua New Guinea',
      statement_given: false,
      cooperation_level: 'cooperative'
    }
    setFormData(prev => ({
      ...prev,
      people_involved: [...prev.people_involved, newPerson]
    }))
  }

  // Remove person involved
  const removePersonInvolved = (id: string) => {
    setFormData(prev => ({
      ...prev,
      people_involved: prev.people_involved.filter(person => person.id !== id)
    }))
  }

  // Update person involved
  const updatePersonInvolved = (id: string, updates: Partial<PersonInvolved>) => {
    setFormData(prev => ({
      ...prev,
      people_involved: prev.people_involved.map(person =>
        person.id === id ? { ...person, ...updates } : person
      )
    }))
  }

  // Add vehicle involved
  const addVehicleInvolved = () => {
    const newVehicle: VehicleInvolved = {
      id: `vehicle_${Date.now()}`,
      vehicle_type: 'car',
      towed: false,
      impounded: false
    }
    setFormData(prev => ({
      ...prev,
      vehicles_involved: [...prev.vehicles_involved, newVehicle]
    }))
  }

  // Remove vehicle involved
  const removeVehicleInvolved = (id: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles_involved: prev.vehicles_involved.filter(vehicle => vehicle.id !== id)
    }))
  }

  // Update vehicle involved
  const updateVehicleInvolved = (id: string, updates: Partial<VehicleInvolved>) => {
    setFormData(prev => ({
      ...prev,
      vehicles_involved: prev.vehicles_involved.map(vehicle =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      )
    }))
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.incident_type) newErrors.incident_type = 'Incident type is required'
    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.location_address) newErrors.location_address = 'Location is required'
    if (!formData.province) newErrors.province = 'Province is required'
    if (!formData.date_occurred) newErrors.date_occurred = 'Date is required'
    if (!formData.time_occurred) newErrors.time_occurred = 'Time is required'

    // Validate people involved
    formData.people_involved.forEach((person, index) => {
      if (!person.first_name) newErrors[`person_${index}_first_name`] = 'First name is required'
      if (!person.last_name) newErrors[`person_${index}_last_name`] = 'Last name is required'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit incident
  const submitIncident = async () => {
    if (!validateForm() || !user) return

    setIsSubmitting(true)

    try {
      // Create incident in database
      const incidentData = {
        ...formData,
        reported_by: user.badgeNumber,
        date_reported: new Date().toISOString(),
        status: 'reported' as const,
        photos: capturedPhotos.map(photo => photo.url),
        witness_count: formData.people_involved.filter(p => p.person_type === 'witness').length,
        evidence_count: capturedPhotos.length + (formData.evidence_collected ? 1 : 0)
      }

      const incident = await DatabaseService.createIncident(incidentData)

      // Create people involved records
      for (const person of formData.people_involved) {
        await DatabaseService.createPersonInvolved({
          ...person,
          incident_id: incident.id
        })
      }

      // Create vehicle records
      for (const vehicle of formData.vehicles_involved) {
        await DatabaseService.createVehicleInvolved({
          ...vehicle,
          incident_id: incident.id
        })
      }

      // Upload and link photos
      for (const photo of capturedPhotos) {
        const filePath = await DatabaseService.uploadFile(
          photo.blob,
          'incident_photos',
          'incidents',
          incident.id
        )

        // Create evidence record for photo
        await DatabaseService.createEvidence({
          incident_id: incident.id,
          evidence_type: 'digital',
          category: 'photo',
          description: photo.metadata.evidence_info.description || 'Incident scene photograph',
          collected_by: user.id,
          photos: [filePath],
          metadata: photo.metadata
        })
      }

      // Handle biometric data
      for (const biometric of capturedBiometrics) {
        // Store biometric data securely
        // This would involve specialized biometric database storage
        console.log('Storing biometric data:', biometric.type, biometric.quality_score)
      }

      // Log audit trail
      await DatabaseService.logAction(
        user.id,
        'create_incident',
        'incidents',
        incident.id,
        null,
        incidentData
      )

      alert(`Incident ${incident.incident_number} created successfully!`)
      router.push(`/incidents/${incident.id}`)

    } catch (error) {
      console.error('Error creating incident:', error)
      alert('Error creating incident. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report New Incident</h1>
            <p className="text-gray-600">Document and investigate police incidents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={submitIncident}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Incident Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Incident Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incident_type">Incident Type *</Label>
                    <Select
                      value={formData.incident_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, incident_type: value }))}
                    >
                      <SelectTrigger className={errors.incident_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCIDENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.incident_type && <p className="text-red-500 text-sm">{errors.incident_type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the incident"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide a detailed description of what happened..."
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_occurred">Date Occurred *</Label>
                    <Input
                      id="date_occurred"
                      type="date"
                      value={formData.date_occurred}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_occurred: e.target.value }))}
                      className={errors.date_occurred ? 'border-red-500' : ''}
                    />
                    {errors.date_occurred && <p className="text-red-500 text-sm">{errors.date_occurred}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time_occurred">Time Occurred *</Label>
                    <Input
                      id="time_occurred"
                      type="time"
                      value={formData.time_occurred}
                      onChange={(e) => setFormData(prev => ({ ...prev, time_occurred: e.target.value }))}
                      className={errors.time_occurred ? 'border-red-500' : ''}
                    />
                    {errors.time_occurred && <p className="text-red-500 text-sm">{errors.time_occurred}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weather_conditions">Weather</Label>
                    <Select
                      value={formData.weather_conditions}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, weather_conditions: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select weather" />
                      </SelectTrigger>
                      <SelectContent>
                        {WEATHER_CONDITIONS.map(weather => (
                          <SelectItem key={weather} value={weather}>{weather}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Incident Characteristics</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="weapons_involved"
                        checked={formData.weapons_involved}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, weapons_involved: checked as boolean }))}
                      />
                      <Label htmlFor="weapons_involved">Weapons Involved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="drugs_involved"
                        checked={formData.drugs_involved}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, drugs_involved: checked as boolean }))}
                      />
                      <Label htmlFor="drugs_involved">Drugs Involved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gang_related"
                        checked={formData.gang_related}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, gang_related: checked as boolean }))}
                      />
                      <Label htmlFor="gang_related">Gang Related</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="domestic_violence"
                        checked={formData.domestic_violence}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, domestic_violence: checked as boolean }))}
                      />
                      <Label htmlFor="domestic_violence">Domestic Violence</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="injuries_reported"
                        checked={formData.injuries_reported}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, injuries_reported: checked as boolean }))}
                      />
                      <Label htmlFor="injuries_reported">Injuries Reported</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fatalities_reported"
                        checked={formData.fatalities_reported}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fatalities_reported: checked as boolean }))}
                      />
                      <Label htmlFor="fatalities_reported">Fatalities Reported</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Information */}
          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location_address">Incident Location *</Label>
                  <Textarea
                    id="location_address"
                    value={formData.location_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                    placeholder="Provide detailed address or description of location..."
                    className={errors.location_address ? 'border-red-500' : ''}
                  />
                  {errors.location_address && <p className="text-red-500 text-sm">{errors.location_address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province *</Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
                    >
                      <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {PNG_PROVINCES.map(province => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      placeholder="District name"
                    />
                  </div>
                </div>

                {location && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">GPS Coordinates Captured</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility Conditions</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        {VISIBILITY_CONDITIONS.map(visibility => (
                          <SelectItem key={visibility} value={visibility}>{visibility}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property_damage_estimate">Property Damage Estimate (PGK)</Label>
                    <Input
                      id="property_damage_estimate"
                      type="number"
                      value={formData.property_damage_estimate || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        property_damage_estimate: e.target.value ? Number(e.target.value) : undefined
                      }))}
                      placeholder="Estimated damage in Kina"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* People Involved */}
          <TabsContent value="people" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    People Involved ({formData.people_involved.length})
                  </CardTitle>
                  <Button onClick={addPersonInvolved} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Person
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.people_involved.map((person, index) => (
                  <div key={person.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Person #{index + 1}</h4>
                      <Button
                        onClick={() => removePersonInvolved(person.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Role in Incident</Label>
                        <Select
                          value={person.person_type}
                          onValueChange={(value: any) => updatePersonInvolved(person.id, { person_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="victim">Victim</SelectItem>
                            <SelectItem value="suspect">Suspect</SelectItem>
                            <SelectItem value="witness">Witness</SelectItem>
                            <SelectItem value="complainant">Complainant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          value={person.first_name}
                          onChange={(e) => updatePersonInvolved(person.id, { first_name: e.target.value })}
                          placeholder="First name"
                          className={errors[`person_${index}_first_name`] ? 'border-red-500' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          value={person.last_name}
                          onChange={(e) => updatePersonInvolved(person.id, { last_name: e.target.value })}
                          placeholder="Last name"
                          className={errors[`person_${index}_last_name`] ? 'border-red-500' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={person.gender || ''}
                          onValueChange={(value) => updatePersonInvolved(person.id, { gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          value={person.phone || ''}
                          onChange={(e) => updatePersonInvolved(person.id, { phone: e.target.value })}
                          placeholder="Phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={person.date_of_birth || ''}
                          onChange={(e) => updatePersonInvolved(person.id, { date_of_birth: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={person.address || ''}
                        onChange={(e) => updatePersonInvolved(person.id, { address: e.target.value })}
                        placeholder="Home address"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Physical Description</Label>
                      <Textarea
                        value={person.physical_description || ''}
                        onChange={(e) => updatePersonInvolved(person.id, { physical_description: e.target.value })}
                        placeholder="Height, weight, distinguishing features, clothing, etc."
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`statement_${person.id}`}
                          checked={person.statement_given}
                          onCheckedChange={(checked) => updatePersonInvolved(person.id, { statement_given: checked as boolean })}
                        />
                        <Label htmlFor={`statement_${person.id}`}>Statement Given</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Cooperation Level</Label>
                        <Select
                          value={person.cooperation_level}
                          onValueChange={(value: any) => updatePersonInvolved(person.id, { cooperation_level: value })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cooperative">Cooperative</SelectItem>
                            <SelectItem value="uncooperative">Uncooperative</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.people_involved.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No people added yet. Click "Add Person" to include people involved in this incident.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Involved */}
          <TabsContent value="vehicles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Vehicles Involved ({formData.vehicles_involved.length})
                  </CardTitle>
                  <Button onClick={addVehicleInvolved} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.vehicles_involved.map((vehicle, index) => (
                  <div key={vehicle.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Vehicle #{index + 1}</h4>
                      <Button
                        onClick={() => removeVehicleInvolved(vehicle.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Vehicle Type</Label>
                        <Select
                          value={vehicle.vehicle_type}
                          onValueChange={(value) => updateVehicleInvolved(vehicle.id, { vehicle_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="bus">Bus</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="bicycle">Bicycle</SelectItem>
                            <SelectItem value="boat">Boat</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Make</Label>
                        <Input
                          value={vehicle.make || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { make: e.target.value })}
                          placeholder="Vehicle make"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Input
                          value={vehicle.model || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { model: e.target.value })}
                          placeholder="Vehicle model"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={vehicle.year || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { year: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="Year"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          value={vehicle.color || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { color: e.target.value })}
                          placeholder="Vehicle color"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>License Plate</Label>
                        <Input
                          value={vehicle.license_plate || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { license_plate: e.target.value })}
                          placeholder="License plate number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Owner Name</Label>
                        <Input
                          value={vehicle.owner_name || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { owner_name: e.target.value })}
                          placeholder="Vehicle owner"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Driver Name</Label>
                        <Input
                          value={vehicle.driver_name || ''}
                          onChange={(e) => updateVehicleInvolved(vehicle.id, { driver_name: e.target.value })}
                          placeholder="Driver at time of incident"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Damage Description</Label>
                      <Textarea
                        value={vehicle.damage_description || ''}
                        onChange={(e) => updateVehicleInvolved(vehicle.id, { damage_description: e.target.value })}
                        placeholder="Describe any damage to the vehicle"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`towed_${vehicle.id}`}
                          checked={vehicle.towed}
                          onCheckedChange={(checked) => updateVehicleInvolved(vehicle.id, { towed: checked as boolean })}
                        />
                        <Label htmlFor={`towed_${vehicle.id}`}>Vehicle Towed</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`impounded_${vehicle.id}`}
                          checked={vehicle.impounded}
                          onCheckedChange={(checked) => updateVehicleInvolved(vehicle.id, { impounded: checked as boolean })}
                        />
                        <Label htmlFor={`impounded_${vehicle.id}`}>Vehicle Impounded</Label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.vehicles_involved.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No vehicles added yet. Click "Add Vehicle" to include vehicles involved in this incident.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence & Photos */}
          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Evidence & Photo Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoCapture
                  onPhotosCapture={setCapturedPhotos}
                  category="evidence"
                  photographer={`${user.first_name} ${user.last_name}`}
                  maxPhotos={20}
                  allowMultiple={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Evidence Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="evidence_collected"
                      checked={formData.evidence_collected}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, evidence_collected: checked as boolean }))}
                    />
                    <Label htmlFor="evidence_collected">Physical Evidence Collected</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="photos_taken"
                      checked={formData.photos_taken || capturedPhotos.length > 0}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, photos_taken: checked as boolean }))}
                    />
                    <Label htmlFor="photos_taken">Photos Taken</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="witnesses_interviewed"
                      checked={formData.witnesses_interviewed}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, witnesses_interviewed: checked as boolean }))}
                    />
                    <Label htmlFor="witnesses_interviewed">Witnesses Interviewed</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="immediate_actions_taken">Immediate Actions Taken</Label>
                  <Textarea
                    id="immediate_actions_taken"
                    value={formData.immediate_actions_taken}
                    onChange={(e) => setFormData(prev => ({ ...prev, immediate_actions_taken: e.target.value }))}
                    placeholder="Describe what actions were taken immediately at the scene..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_notes">Additional Notes</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                    placeholder="Any additional information, observations, or notes..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="follow_up_required"
                    checked={formData.follow_up_required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, follow_up_required: checked as boolean }))}
                  />
                  <Label htmlFor="follow_up_required">Follow-up Investigation Required</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biometric Data */}
          <TabsContent value="biometrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Biometric Data Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BiometricCapture
                  onBiometricCapture={setCapturedBiometrics}
                  operator={`${user.first_name} ${user.last_name}`}
                  allowedTypes={['fingerprint', 'facial']}
                  required={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                Form Validation Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-red-600 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
