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
import { BiometricCapture } from "@/components/biometric/biometric-capture"
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
  Eye,
  Fingerprint
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
  "Perjury",
  "Other"
]

interface LogEntryForm {
  // Person Details
  personName: string
  personAge: string
  personGender: string
  personAddress: string
  personId: string
  personContact: string
  // Incident Details
  incidentType: string
  incidentNumber: string
  location: string
  province: string
  dateTime: string
  description: string
  charges: string[]
  // Custody Status
  inCustody: boolean
  cellNumber: string
  bailAmount: string
  bailType: string
  guarantor: string
  // Evidence
  documents: number
  photos: number
  videos: number
  physicalEvidence: string[]
  // Biometric Data
  biometricData: any
}

export default function NewLogEntryPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<LogEntryForm>({
    personName: "",
    personAge: "",
    personGender: "",
    personAddress: "",
    personId: "",
    personContact: "",
    incidentType: "",
    incidentNumber: "",
    location: "",
    province: "",
    dateTime: "",
    description: "",
    charges: [],
    inCustody: false,
    cellNumber: "",
    bailAmount: "",
    bailType: "",
    guarantor: "",
    documents: 0,
    photos: 0,
    videos: 0,
    physicalEvidence: [],
    biometricData: null
  })

  const [currentTab, setCurrentTab] = useState("person")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newCharge, setNewCharge] = useState("")
  const [newEvidence, setNewEvidence] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    // Generate incident number
    const incNumber = `INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    setFormData(prev => ({
      ...prev,
      incidentNumber: incNumber,
      dateTime: new Date().toISOString().slice(0, 16)
    }))
  }, [router])

  const handleInputChange = (field: keyof LogEntryForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const addCharge = () => {
    if (newCharge && !formData.charges.includes(newCharge)) {
      setFormData(prev => ({
        ...prev,
        charges: [...prev.charges, newCharge]
      }))
      setNewCharge("")
    }
  }

  const removeCharge = (charge: string) => {
    setFormData(prev => ({
      ...prev,
      charges: prev.charges.filter(c => c !== charge)
    }))
  }

  const addEvidence = () => {
    if (newEvidence && !formData.physicalEvidence.includes(newEvidence)) {
      setFormData(prev => ({
        ...prev,
        physicalEvidence: [...prev.physicalEvidence, newEvidence]
      }))
      setNewEvidence("")
    }
  }

  const removeEvidence = (evidence: string) => {
    setFormData(prev => ({
      ...prev,
      physicalEvidence: prev.physicalEvidence.filter(e => e !== evidence)
    }))
  }

  const handleBiometricDataChange = (biometricData: any) => {
    setFormData(prev => ({
      ...prev,
      biometricData
    }))
  }

  const validateTab = (tab: string): boolean => {
    const newErrors: Record<string, string> = {}

    switch (tab) {
      case "person":
        if (!formData.personName) newErrors.personName = "Person name is required"
        if (!formData.personAge) newErrors.personAge = "Age is required"
        if (!formData.personGender) newErrors.personGender = "Gender is required"
        break
      case "incident":
        if (!formData.incidentType) newErrors.incidentType = "Incident type is required"
        if (!formData.location) newErrors.location = "Location is required"
        if (!formData.province) newErrors.province = "Province is required"
        if (!formData.description) newErrors.description = "Description is required"
        break
      case "biometric":
        // Biometric validation - ensure at least some biometric data is captured
        if (!formData.biometricData ||
            (!formData.biometricData.leftEye &&
             !formData.biometricData.rightEye &&
             !formData.biometricData.voiceRecording &&
             !formData.biometricData.fingerprints &&
             !formData.biometricData.faceRecognition)) {
          newErrors.biometric = "At least one biometric capture is required for log entry"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTabChange = (newTab: string) => {
    if (validateTab(currentTab)) {
      setCurrentTab(newTab)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all tabs
    const allTabsValid = ["person", "incident", "biometric"].every(tab => validateTab(tab))

    if (!allTabsValid) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Show success and redirect
      alert(`Log entry ${formData.incidentNumber} created successfully!`)
      router.push("/logbook")
    } catch (error) {
      alert("Failed to create log entry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const getBiometricStatus = () => {
    if (!formData.biometricData) return { count: 0, quality: 0 }

    const captured = [
      formData.biometricData.leftEye,
      formData.biometricData.rightEye,
      formData.biometricData.voiceRecording,
      formData.biometricData.fingerprints,
      formData.biometricData.faceRecognition
    ].filter(Boolean).length

    return {
      count: captured,
      quality: formData.biometricData.qualityScore || 0
    }
  }

  const biometricStatus = getBiometricStatus()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              New Log Book Entry
            </h1>
            <p className="text-gray-600">
              Create a new incident log with biometric identification
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/logbook")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Log Book
            </Button>
          </div>
        </div>

        {/* Progress Indicators */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">Incident Number: </span>
                <Badge variant="outline">{formData.incidentNumber}</Badge>
              </div>
              <div>
                <span className="font-medium">Officer: </span>
                <span>{user.name} (Badge #{user.badgeNumber})</span>
              </div>
              <div>
                <span className="font-medium">Biometric Status: </span>
                <Badge variant={biometricStatus.count > 0 ? "default" : "secondary"}>
                  {biometricStatus.count}/5 Captured ({biometricStatus.quality}% Quality)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        {formData.biometricData?.searchResults?.some((r: any) => r.warrant) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL ALERT:</strong> Active warrant detected in biometric search!
              Contact supervisor immediately and request backup before proceeding with arrest.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="person" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Person Details
                  </TabsTrigger>
                  <TabsTrigger value="incident" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Incident Info
                  </TabsTrigger>
                  <TabsTrigger value="biometric" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Biometric ID
                    {biometricStatus.count > 0 && (
                      <Badge className="ml-1 bg-green-600 text-xs">
                        {biometricStatus.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="custody" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Custody Status
                  </TabsTrigger>
                  <TabsTrigger value="evidence" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Evidence
                  </TabsTrigger>
                  <TabsTrigger value="review" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Review & Submit
                  </TabsTrigger>
                </TabsList>

                {/* Person Details Tab */}
                <TabsContent value="person" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Person Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="personName">Full Name *</Label>
                        <Input
                          id="personName"
                          value={formData.personName}
                          onChange={(e) => handleInputChange("personName", e.target.value)}
                          placeholder="Enter full name"
                          className={errors.personName ? "border-red-500" : ""}
                        />
                        {errors.personName && (
                          <p className="text-sm text-red-500 mt-1">{errors.personName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="personAge">Age *</Label>
                        <Input
                          id="personAge"
                          type="number"
                          value={formData.personAge}
                          onChange={(e) => handleInputChange("personAge", e.target.value)}
                          placeholder="Age"
                          className={errors.personAge ? "border-red-500" : ""}
                        />
                        {errors.personAge && (
                          <p className="text-sm text-red-500 mt-1">{errors.personAge}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="personGender">Gender *</Label>
                        <Select value={formData.personGender} onValueChange={(value) => handleInputChange("personGender", value)}>
                          <SelectTrigger className={errors.personGender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.personGender && (
                          <p className="text-sm text-red-500 mt-1">{errors.personGender}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="personId">ID Number</Label>
                        <Input
                          id="personId"
                          value={formData.personId}
                          onChange={(e) => handleInputChange("personId", e.target.value)}
                          placeholder="National ID or Passport"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="personAddress">Address</Label>
                        <Textarea
                          id="personAddress"
                          value={formData.personAddress}
                          onChange={(e) => handleInputChange("personAddress", e.target.value)}
                          placeholder="Full address"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="personContact">Contact Number</Label>
                        <Input
                          id="personContact"
                          value={formData.personContact}
                          onChange={(e) => handleInputChange("personContact", e.target.value)}
                          placeholder="Phone number"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Incident Details Tab */}
                <TabsContent value="incident" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Incident Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="incidentType">Incident Type *</Label>
                        <Select value={formData.incidentType} onValueChange={(value) => handleInputChange("incidentType", value)}>
                          <SelectTrigger className={errors.incidentType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                          <SelectContent>
                            {INCIDENT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.incidentType && (
                          <p className="text-sm text-red-500 mt-1">{errors.incidentType}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="incidentNumber">Incident Number</Label>
                        <Input
                          id="incidentNumber"
                          value={formData.incidentNumber}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Specific location"
                          className={errors.location ? "border-red-500" : ""}
                        />
                        {errors.location && (
                          <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="province">Province *</Label>
                        <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                          <SelectTrigger className={errors.province ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {PNG_PROVINCES.map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.province && (
                          <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dateTime">Date & Time</Label>
                        <Input
                          id="dateTime"
                          type="datetime-local"
                          value={formData.dateTime}
                          onChange={(e) => handleInputChange("dateTime", e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description">Incident Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Detailed description of the incident"
                          rows={4}
                          className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                        )}
                      </div>

                      {/* Charges Section */}
                      <div className="md:col-span-2">
                        <Label>Charges</Label>
                        <div className="flex gap-2 mt-2">
                          <Select value={newCharge} onValueChange={setNewCharge}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select charge" />
                            </SelectTrigger>
                            <SelectContent>
                              {CHARGE_OPTIONS.map((charge) => (
                                <SelectItem key={charge} value={charge}>
                                  {charge}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addCharge} disabled={!newCharge}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.charges.map((charge) => (
                            <Badge key={charge} variant="secondary" className="pr-1">
                              {charge}
                              <X
                                className="w-3 h-3 ml-1 cursor-pointer"
                                onClick={() => removeCharge(charge)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Biometric Identification Tab */}
                <TabsContent value="biometric" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Fingerprint className="w-5 h-5" />
                        Advanced Biometric Identification
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Capture biometric data for positive identification and criminal database search.
                        At least one biometric capture is required for log entry completion.
                      </p>
                    </CardHeader>
                    <CardContent>
                      {errors.biometric && (
                        <Alert variant="destructive" className="mb-6">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{errors.biometric}</AlertDescription>
                        </Alert>
                      )}

                      <BiometricCapture
                        onDataChange={handleBiometricDataChange}
                        caseNumber={formData.incidentNumber}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Custody Status Tab */}
                <TabsContent value="custody" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Custody Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="inCustody"
                          checked={formData.inCustody}
                          onChange={(e) => handleInputChange("inCustody", e.target.checked)}
                        />
                        <Label htmlFor="inCustody">Person is currently in custody</Label>
                      </div>

                      {formData.inCustody && (
                        <div className="grid gap-4 md:grid-cols-2 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label htmlFor="cellNumber">Cell Number</Label>
                            <Input
                              id="cellNumber"
                              value={formData.cellNumber}
                              onChange={(e) => handleInputChange("cellNumber", e.target.value)}
                              placeholder="Cell assignment"
                            />
                          </div>
                        </div>
                      )}

                      {!formData.inCustody && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium">Bail Information</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="bailAmount">Bail Amount (Kina)</Label>
                              <Input
                                id="bailAmount"
                                type="number"
                                value={formData.bailAmount}
                                onChange={(e) => handleInputChange("bailAmount", e.target.value)}
                                placeholder="Amount"
                              />
                            </div>

                            <div>
                              <Label htmlFor="bailType">Bail Type</Label>
                              <Select value={formData.bailType} onValueChange={(value) => handleInputChange("bailType", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select bail type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Cash">Cash Bail</SelectItem>
                                  <SelectItem value="Surety">Surety Bond</SelectItem>
                                  <SelectItem value="Property">Property Bond</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="md:col-span-2">
                              <Label htmlFor="guarantor">Guarantor</Label>
                              <Input
                                id="guarantor"
                                value={formData.guarantor}
                                onChange={(e) => handleInputChange("guarantor", e.target.value)}
                                placeholder="Name and relationship"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Evidence Tab */}
                <TabsContent value="evidence" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Evidence Documentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Digital Evidence Counts */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <Label htmlFor="documents">Documents</Label>
                          <Input
                            id="documents"
                            type="number"
                            min="0"
                            value={formData.documents}
                            onChange={(e) => handleInputChange("documents", Number.parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="photos">Photos</Label>
                          <Input
                            id="photos"
                            type="number"
                            min="0"
                            value={formData.photos}
                            onChange={(e) => handleInputChange("photos", Number.parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="videos">Videos</Label>
                          <Input
                            id="videos"
                            type="number"
                            min="0"
                            value={formData.videos}
                            onChange={(e) => handleInputChange("videos", Number.parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      {/* Physical Evidence */}
                      <div>
                        <Label>Physical Evidence</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newEvidence}
                            onChange={(e) => setNewEvidence(e.target.value)}
                            placeholder="Describe physical evidence"
                            className="flex-1"
                          />
                          <Button type="button" onClick={addEvidence} disabled={!newEvidence}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 mt-2">
                          {formData.physicalEvidence.map((evidence, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>{evidence}</span>
                              <X
                                className="w-4 h-4 cursor-pointer text-red-500"
                                onClick={() => removeEvidence(evidence)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Biometric Evidence Summary */}
                      {formData.biometricData && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium mb-2">Biometric Evidence Captured</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <CheckCircle className={`w-4 h-4 ${formData.biometricData.leftEye ? 'text-green-600' : 'text-gray-400'}`} />
                              Left Iris
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className={`w-4 h-4 ${formData.biometricData.rightEye ? 'text-green-600' : 'text-gray-400'}`} />
                              Right Iris
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className={`w-4 h-4 ${formData.biometricData.voiceRecording ? 'text-green-600' : 'text-gray-400'}`} />
                              Voiceprint
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className={`w-4 h-4 ${formData.biometricData.fingerprints ? 'text-green-600' : 'text-gray-400'}`} />
                              Fingerprints
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className={`w-4 h-4 ${formData.biometricData.faceRecognition ? 'text-green-600' : 'text-gray-400'}`} />
                              Face Scan
                            </div>
                          </div>
                          {formData.biometricData.evidencePackage && (
                            <div className="mt-3 p-2 bg-green-100 rounded text-sm">
                              <strong>Court Evidence Package Generated:</strong> {formData.biometricData.evidencePackage.caseNumber}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Review & Submit Tab */}
                <TabsContent value="review" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Review & Submit Log Entry
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="font-medium">Person Information</h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Name:</strong> {formData.personName}</p>
                            <p><strong>Age:</strong> {formData.personAge}</p>
                            <p><strong>Gender:</strong> {formData.personGender}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Incident Details</h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Type:</strong> {formData.incidentType}</p>
                            <p><strong>Location:</strong> {formData.location}, {formData.province}</p>
                            <p><strong>Charges:</strong> {formData.charges.length} charges</p>
                          </div>
                        </div>
                      </div>

                      {/* Biometric Summary */}
                      {formData.biometricData && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium mb-2">Biometric Data Summary</h4>
                          <div className="text-sm">
                            <p><strong>Quality Score:</strong> {formData.biometricData.qualityScore}/100</p>
                            <p><strong>Captures:</strong> {biometricStatus.count}/5 completed</p>
                            {formData.biometricData.searchResults?.length > 0 && (
                              <p className="text-red-600">
                                <strong>Criminal Matches:</strong> {formData.biometricData.searchResults.length} found
                                {formData.biometricData.searchResults.some((r: any) => r.warrant) && (
                                  <span className="ml-2 font-bold">⚠️ ACTIVE WARRANT DETECTED</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex justify-end gap-4">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.biometricData || biometricStatus.count === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Creating Entry...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Create Log Entry
                            </>
                          )}
                        </Button>
                      </div>

                      {(!formData.biometricData || biometricStatus.count === 0) && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Please complete biometric identification before submitting the log entry.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
