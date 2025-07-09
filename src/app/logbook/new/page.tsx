"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Save,
  ArrowLeft,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  FileText,
  Camera,
  Upload,
  Paperclip,
  Shield,
  Clock,
  CheckCircle,
  Plus,
  X,
  Info,
  Fingerprint,
  UserX,
  RotateCcw,
  Download,
  Eye
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// PNG Provinces for location selection
const PNG_PROVINCES = [
  "National Capital District",
  "Central Province",
  "Gulf Province",
  "Milne Bay Province",
  "Oro Province",
  "Southern Highlands Province",
  "Western Highlands Province",
  "Enga Province",
  "Simbu Province",
  "Eastern Highlands Province",
  "Morobe Province",
  "Madang Province",
  "East Sepik Province",
  "West Sepik Province",
  "Manus Province",
  "New Ireland Province",
  "East New Britain Province",
  "West New Britain Province",
  "Bougainville Province",
  "Western Province"
]

const INCIDENT_TYPES = [
  "Armed Robbery",
  "Assault",
  "Domestic Violence",
  "Theft",
  "Motor Vehicle Theft",
  "Breaking and Entering",
  "Drug Possession",
  "Drug Trafficking",
  "Murder",
  "Manslaughter",
  "Sexual Assault",
  "Fraud",
  "Corruption",
  "Tribal Fighting",
  "Sorcery-related Violence",
  "Land Dispute",
  "Public Disturbance",
  "Traffic Violation",
  "Weapon Possession",
  "Other"
]

const CHARGE_OPTIONS = [
  "Armed Robbery",
  "Aggravated Assault",
  "Simple Assault",
  "Domestic Violence",
  "Theft",
  "Motor Vehicle Theft",
  "Breaking and Entering",
  "Possession of Controlled Substance",
  "Drug Trafficking",
  "Murder",
  "Manslaughter",
  "Sexual Assault",
  "Fraud",
  "Corruption",
  "Public Disturbance",
  "Weapon Possession",
  "Resisting Arrest",
  "Obstruction of Justice",
  "Vandalism",
  "Trespassing"
]

interface BailInfo {
  eligible: boolean
  amount: string
  type: string
  guarantor: string
  guarantorPhone: string
  guarantorAddress: string
}

interface BiometricFingerprints {
  right_thumb: string | null
  right_index: string | null
  right_middle: string | null
  right_ring: string | null
  right_little: string | null
  left_thumb: string | null
  left_index: string | null
  left_middle: string | null
  left_ring: string | null
  left_little: string | null
}

interface BiometricsData {
  mugshot_front: string | null
  mugshot_side: string | null
  fingerprints: BiometricFingerprints
}

interface EvidenceData {
  documents: string[]
  photos: string[]
  videos: string[]
  physicalEvidence: string[]
}

interface EntryData {
  personName: string
  personAge: string
  personGender: string
  personNationality: string
  personAddress: string
  personPhone: string
  personIdentification: string
  biometrics: BiometricsData
  incidentType: string
  location: string
  province: string
  dateTime: string
  description: string
  charges: string[]
  inCustody: boolean
  cellNumber: string
  arrestTime: string
  bail: BailInfo
  evidence: EvidenceData
  personalProperty: string[]
  priority: string
  officerNotes: string
  specialInstructions: string
}

export default function NewLogEntryPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [entryData, setEntryData] = useState<EntryData>({
    // Person Information
    personName: "",
    personAge: "",
    personGender: "",
    personNationality: "Papua New Guinean",
    personAddress: "",
    personPhone: "",
    personIdentification: "",

    // Biometric Information
    biometrics: {
      mugshot_front: null,
      mugshot_side: null,
      fingerprints: {
        right_thumb: null,
        right_index: null,
        right_middle: null,
        right_ring: null,
        right_little: null,
        left_thumb: null,
        left_index: null,
        left_middle: null,
        left_ring: null,
        left_little: null,
      }
    },

    // Incident Information
    incidentType: "",
    location: "",
    province: "",
    dateTime: "",
    description: "",
    charges: [],

    // Custody Information
    inCustody: false,
    cellNumber: "",
    arrestTime: "",
    bail: {
      eligible: false,
      amount: "",
      type: "",
      guarantor: "",
      guarantorPhone: "",
      guarantorAddress: ""
    },

    // Evidence Information
    evidence: {
      documents: [],
      photos: [],
      videos: [],
      physicalEvidence: []
    },

    // Personal Property
    personalProperty: [],

    // Priority and Notes
    priority: "medium",
    officerNotes: "",
    specialInstructions: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    // Set current date/time as default
    const now = new Date()
    setEntryData(prev => ({
      ...prev,
      dateTime: now.toISOString().slice(0, 16),
      arrestTime: now.toISOString().slice(0, 16)
    }))
  }, [router])

  const updateField = (field: keyof EntryData, value: unknown) => {
    setEntryData(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: keyof EntryData, field: string, value: unknown) => {
    setEntryData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as unknown as Record<string, unknown>),
        [field]: value
      }
    }))
  }

  const addCharge = (charge: string) => {
    if (!entryData.charges.includes(charge)) {
      setEntryData(prev => ({
        ...prev,
        charges: [...prev.charges, charge]
      }))
    }
  }

  const removeCharge = (charge: string) => {
    setEntryData(prev => ({
      ...prev,
      charges: prev.charges.filter(c => c !== charge)
    }))
  }

  const addItem = (array: keyof EntryData, item: string) => {
    if (item.trim()) {
      setEntryData(prev => ({
        ...prev,
        [array]: [...(prev[array] as string[]), item.trim()]
      }))
    }
  }

  const removeItem = (array: keyof EntryData, index: number) => {
    setEntryData(prev => ({
      ...prev,
      [array]: (prev[array] as string[]).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate unique incident number
      const incidentNumber = `LOG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))

      console.log("New Log Entry:", {
        ...entryData,
        incidentNumber,
        reportingOfficer: user?.name,
        reportingOfficerBadge: user?.badgeNumber,
        status: "pending",
        createdAt: new Date().toISOString(),
        biometricDataCollected: {
          photosComplete: entryData.biometrics.mugshot_front && entryData.biometrics.mugshot_side,
          fingerprintsComplete: Object.values(entryData.biometrics.fingerprints).filter(Boolean).length === 10,
          photosCount: (entryData.biometrics.mugshot_front ? 1 : 0) + (entryData.biometrics.mugshot_side ? 1 : 0),
          fingerprintsCount: Object.values(entryData.biometrics.fingerprints).filter(Boolean).length
        }
      })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/logbook")
      }, 2000)

    } catch (error) {
      console.error("Error creating log entry:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="min-h-96 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Log Entry Created</h2>
              <p className="text-gray-600">The log book entry has been created and is pending verification.</p>
              <p className="text-sm text-gray-500">Redirecting to log book...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              New Log Book Entry
            </h1>
            <p className="text-gray-600">Create a new digital log book entry with verification</p>
          </div>
        </div>

        {/* Important Notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> All log book entries are immutable once submitted.
            Only the Post Commander can make amendments with full audit trail. Ensure all information is accurate.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="person" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="person">Person Details</TabsTrigger>
              <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
              <TabsTrigger value="incident">Incident Info</TabsTrigger>
              <TabsTrigger value="custody">Custody Status</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>

            <TabsContent value="person" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Person Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="personName">Full Name *</Label>
                      <Input
                        id="personName"
                        placeholder="Enter full name"
                        value={entryData.personName}
                        onChange={(e) => updateField("personName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personAge">Age *</Label>
                      <Input
                        id="personAge"
                        type="number"
                        placeholder="Age"
                        value={entryData.personAge}
                        onChange={(e) => updateField("personAge", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="personGender">Gender *</Label>
                      <Select value={entryData.personGender} onValueChange={(value: string) => updateField("personGender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personNationality">Nationality</Label>
                      <Input
                        id="personNationality"
                        value={entryData.personNationality}
                        onChange={(e) => updateField("personNationality", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personAddress">Address</Label>
                    <Textarea
                      id="personAddress"
                      placeholder="Full address including village, district, province"
                      value={entryData.personAddress}
                      onChange={(e) => updateField("personAddress", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="personPhone">Phone Number</Label>
                      <Input
                        id="personPhone"
                        placeholder="+675 XXX XXXX"
                        value={entryData.personPhone}
                        onChange={(e) => updateField("personPhone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personIdentification">Identification</Label>
                      <Input
                        id="personIdentification"
                        placeholder="ID number, passport, etc."
                        value={entryData.personIdentification}
                        onChange={(e) => updateField("personIdentification", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="biometrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5" />
                    Biometric Data Collection
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Capture photographs and fingerprints for identification and record keeping
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Capture Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Photographs (Mugshots)</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Front Photo */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <UserX className="w-4 h-4" />
                          Front View Photo
                        </h4>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                          {entryData.biometrics.mugshot_front ? (
                            <div className="space-y-3">
                              <div className="w-32 h-40 mx-auto bg-blue-100 rounded border flex items-center justify-center">
                                <Camera className="w-8 h-8 text-blue-500" />
                                <span className="sr-only">Front photo captured</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                <Button type="button" variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateNestedField("biometrics", "mugshot_front", null)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Retake
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Camera className="mx-auto h-12 w-12 text-gray-400" />
                              <div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateNestedField("biometrics", "mugshot_front", "captured")}
                                >
                                  <Camera className="w-4 h-4 mr-2" />
                                  Capture Front Photo
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Position subject facing camera directly
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Side Profile Photo */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <UserX className="w-4 h-4" />
                          Side Profile Photo
                        </h4>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                          {entryData.biometrics.mugshot_side ? (
                            <div className="space-y-3">
                              <div className="w-32 h-40 mx-auto bg-blue-100 rounded border flex items-center justify-center">
                                <Camera className="w-8 h-8 text-blue-500" />
                                <span className="sr-only">Side photo captured</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                <Button type="button" variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateNestedField("biometrics", "mugshot_side", null)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Retake
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Camera className="mx-auto h-12 w-12 text-gray-400" />
                              <div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateNestedField("biometrics", "mugshot_side", "captured")}
                                >
                                  <Camera className="w-4 h-4 mr-2" />
                                  Capture Profile Photo
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Position subject in side profile (90° turn)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fingerprint Capture Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Fingerprint Collection</h3>
                    <p className="text-sm text-gray-600">
                      Collect all 10 fingerprints for complete identification record
                    </p>

                    {/* Right Hand */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-blue-700">Right Hand</h4>
                      <div className="grid grid-cols-5 gap-3">
                        {(['right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_little'] as const).map((finger, index) => {
                          const fingerNames = ['Thumb', 'Index', 'Middle', 'Ring', 'Little']
                          const isCapturered = entryData.biometrics.fingerprints[finger]

                          return (
                            <div key={finger} className="text-center space-y-2">
                              <div className={`w-16 h-20 mx-auto rounded-lg border-2 border-dashed flex items-center justify-center ${
                                isCapturered ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                              }`}>
                                <Fingerprint className={`w-6 h-6 ${
                                  isCapturered ? 'text-green-600' : 'text-gray-400'
                                }`} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium">{fingerNames[index]}</p>
                                {isCapturered ? (
                                  <div className="space-y-1">
                                    <Badge variant="secondary" className="text-xs">Captured</Badge>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-auto p-1"
                                      onClick={() => {
                                        const newFingerprints = { ...entryData.biometrics.fingerprints }
                                        newFingerprints[finger] = null
                                        updateNestedField("biometrics", "fingerprints", newFingerprints)
                                      }}
                                    >
                                      Retake
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-auto p-1"
                                    onClick={() => {
                                      const newFingerprints = { ...entryData.biometrics.fingerprints }
                                      newFingerprints[finger] = "captured"
                                      updateNestedField("biometrics", "fingerprints", newFingerprints)
                                    }}
                                  >
                                    Scan
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Left Hand */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-blue-700">Left Hand</h4>
                      <div className="grid grid-cols-5 gap-3">
                        {(['left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_little'] as const).map((finger, index) => {
                          const fingerNames = ['Thumb', 'Index', 'Middle', 'Ring', 'Little']
                          const isCapturered = entryData.biometrics.fingerprints[finger]

                          return (
                            <div key={finger} className="text-center space-y-2">
                              <div className={`w-16 h-20 mx-auto rounded-lg border-2 border-dashed flex items-center justify-center ${
                                isCapturered ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                              }`}>
                                <Fingerprint className={`w-6 h-6 ${
                                  isCapturered ? 'text-green-600' : 'text-gray-400'
                                }`} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium">{fingerNames[index]}</p>
                                {isCapturered ? (
                                  <div className="space-y-1">
                                    <Badge variant="secondary" className="text-xs">Captured</Badge>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-auto p-1"
                                      onClick={() => {
                                        const newFingerprints = { ...entryData.biometrics.fingerprints }
                                        newFingerprints[finger] = null
                                        updateNestedField("biometrics", "fingerprints", newFingerprints)
                                      }}
                                    >
                                      Retake
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-auto p-1"
                                    onClick={() => {
                                      const newFingerprints = { ...entryData.biometrics.fingerprints }
                                      newFingerprints[finger] = "captured"
                                      updateNestedField("biometrics", "fingerprints", newFingerprints)
                                    }}
                                  >
                                    Scan
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Biometric Status Summary */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900">Biometric Collection Status</h4>
                          <p className="text-sm text-blue-700">
                            Photos: {(entryData.biometrics.mugshot_front ? 1 : 0) + (entryData.biometrics.mugshot_side ? 1 : 0)}/2 captured
                            <span className="ml-4">
                              Fingerprints: {Object.values(entryData.biometrics.fingerprints).filter(Boolean).length}/10 captured
                            </span>
                          </p>
                        </div>
                        {entryData.biometrics.mugshot_front && entryData.biometrics.mugshot_side &&
                         Object.values(entryData.biometrics.fingerprints).filter(Boolean).length === 10 && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Note:</strong> Biometric data collection is optional but highly recommended for
                        proper identification and criminal record management. All biometric data is securely stored
                        and only accessible to authorized personnel.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incident" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Incident Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="incidentType">Incident Type *</Label>
                      <Select value={entryData.incidentType} onValueChange={(value: string) => updateField("incidentType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                          {INCIDENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={entryData.priority} onValueChange={(value: string) => updateField("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
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

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="Specific location of incident"
                        value={entryData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select value={entryData.province} onValueChange={(value: string) => updateField("province", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PNG_PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>{province}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateTime">Date & Time of Incident *</Label>
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      value={entryData.dateTime}
                      onChange={(e) => updateField("dateTime", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Incident Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the incident, circumstances, and actions taken..."
                      value={entryData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Charges */}
                  <div className="space-y-2">
                    <Label>Charges</Label>
                    <div className="space-y-2">
                      <Select onValueChange={addCharge}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add charge" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHARGE_OPTIONS.filter(charge => !entryData.charges.includes(charge)).map((charge) => (
                            <SelectItem key={charge} value={charge}>{charge}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {entryData.charges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entryData.charges.map((charge, index) => (
                            <Badge key={index} variant="destructive" className="flex items-center gap-1">
                              {charge}
                              <button
                                type="button"
                                onClick={() => removeCharge(charge)}
                                className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custody" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Custody Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inCustody"
                      checked={entryData.inCustody}
                      onChange={(e) => updateField("inCustody", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="inCustody" className="text-base font-medium">
                      Person is currently in custody
                    </Label>
                  </div>

                  {entryData.inCustody && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cellNumber">Cell Number</Label>
                          <Input
                            id="cellNumber"
                            placeholder="e.g., A-3, B-1"
                            value={entryData.cellNumber}
                            onChange={(e) => updateField("cellNumber", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="arrestTime">Time of Arrest</Label>
                          <Input
                            id="arrestTime"
                            type="datetime-local"
                            value={entryData.arrestTime}
                            onChange={(e) => updateField("arrestTime", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Bail Information */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="bailEligible"
                            checked={entryData.bail.eligible}
                            onChange={(e) => updateNestedField("bail", "eligible", e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="bailEligible">Eligible for bail</Label>
                        </div>

                        {entryData.bail.eligible && (
                          <div className="space-y-4 p-3 bg-white rounded border">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="bailAmount">Bail Amount (Kina)</Label>
                                <Input
                                  id="bailAmount"
                                  type="number"
                                  placeholder="Amount"
                                  value={entryData.bail.amount}
                                  onChange={(e) => updateNestedField("bail", "amount", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="bailType">Bail Type</Label>
                                <Select value={entryData.bail.type} onValueChange={(value: string) => updateNestedField("bail", "type", value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Surety">Surety</SelectItem>
                                    <SelectItem value="Property">Property</SelectItem>
                                    <SelectItem value="Own Recognizance">Own Recognizance</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="guarantor">Guarantor Name</Label>
                              <Input
                                id="guarantor"
                                placeholder="Full name of guarantor"
                                value={entryData.bail.guarantor}
                                onChange={(e) => updateNestedField("bail", "guarantor", e.target.value)}
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="guarantorPhone">Guarantor Phone</Label>
                                <Input
                                  id="guarantorPhone"
                                  placeholder="+675 XXX XXXX"
                                  value={entryData.bail.guarantorPhone}
                                  onChange={(e) => updateNestedField("bail", "guarantorPhone", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="guarantorAddress">Guarantor Address</Label>
                                <Input
                                  id="guarantorAddress"
                                  placeholder="Full address"
                                  value={entryData.bail.guarantorAddress}
                                  onChange={(e) => updateNestedField("bail", "guarantorAddress", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Evidence & Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload Simulation */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-medium">Document Upload</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Documents
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">PDF, DOC, TXT files</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Photo/Video Upload</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Media
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG, MP4 files</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Property Inventory */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Personal Property Inventory</h3>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add property item (e.g., Mobile phone, Wallet, etc.)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.target as HTMLInputElement
                              addItem('personalProperty', input.value)
                              input.value = ''
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const target = e.target as HTMLElement
                            const input = target.closest('div')?.querySelector('input') as HTMLInputElement
                            if (input) {
                              addItem('personalProperty', input.value)
                              input.value = ''
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {entryData.personalProperty.length > 0 && (
                        <div className="space-y-1">
                          {entryData.personalProperty.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>{item}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem('personalProperty', index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Officer Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="officerNotes">Officer Notes</Label>
                    <Textarea
                      id="officerNotes"
                      placeholder="Additional notes, observations, or special circumstances..."
                      value={entryData.officerNotes}
                      onChange={(e) => updateField("officerNotes", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Special handling instructions, medical conditions, etc..."
                      value={entryData.specialInstructions}
                      onChange={(e) => updateField("specialInstructions", e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Review & Submit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary of Entry */}
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <h3 className="font-semibold">Entry Summary</h3>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div><strong>Person:</strong> {entryData.personName} ({entryData.personAge} years, {entryData.personGender})</div>
                      <div><strong>Incident:</strong> {entryData.incidentType}</div>
                      <div><strong>Location:</strong> {entryData.location}, {entryData.province}</div>
                      <div><strong>Date/Time:</strong> {entryData.dateTime ? new Date(entryData.dateTime).toLocaleString() : "Not set"}</div>
                      <div><strong>Charges:</strong> {entryData.charges.length} charges</div>
                      <div><strong>Custody:</strong> {entryData.inCustody ? "In custody" : "Not in custody"}</div>
                      <div><strong>Photos:</strong> {(entryData.biometrics.mugshot_front ? 1 : 0) + (entryData.biometrics.mugshot_side ? 1 : 0)}/2 captured</div>
                      <div><strong>Fingerprints:</strong> {Object.values(entryData.biometrics.fingerprints).filter(Boolean).length}/10 captured</div>
                    </div>
                  </div>

                  {/* Verification Notice */}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Verification Required:</strong> This entry will be marked as "Pending Verification"
                      until reviewed and approved by a supervising officer or Post Commander.
                    </AlertDescription>
                  </Alert>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading || !entryData.personName || !entryData.incidentType || !entryData.location}
                      className="flex-1"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Creating Entry...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Create Log Entry
                        </>
                      )}
                    </Button>

                    <Button type="button" variant="outline" onClick={() => router.push("/logbook")}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </DashboardLayout>
  )
}
