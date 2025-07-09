"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  Send,
  Radio,
  Users,
  MapPin,
  Clock,
  Eye,
  Car,
  User,
  Phone,
  CheckCircle,
  Bell,
  Megaphone,
  Shield,
  Zap,
  Target,
  FileText,
  Upload
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const ALERT_TYPES = {
  "bolo": {
    label: "BOLO - Be On Look Out",
    description: "Suspect or vehicle search alert",
    priority: "high",
    color: "bg-red-600",
    icon: Eye
  },
  "missing_person": {
    label: "Missing Person Alert",
    description: "Missing child or adult",
    priority: "critical",
    color: "bg-orange-600",
    icon: User
  },
  "amber": {
    label: "AMBER Alert",
    description: "Child abduction emergency",
    priority: "critical",
    color: "bg-red-700",
    icon: AlertTriangle
  },
  "weather": {
    label: "Weather Emergency",
    description: "Severe weather warning",
    priority: "medium",
    color: "bg-blue-600",
    icon: AlertTriangle
  },
  "public_safety": {
    label: "Public Safety Alert",
    description: "General public safety warning",
    priority: "medium",
    color: "bg-yellow-600",
    icon: Shield
  },
  "officer_down": {
    label: "Officer Down",
    description: "Officer needs immediate assistance",
    priority: "critical",
    color: "bg-black",
    icon: Shield
  },
  "armed_suspect": {
    label: "Armed & Dangerous",
    description: "Armed suspect in area",
    priority: "critical",
    color: "bg-red-800",
    icon: Target
  },
  "evacuation": {
    label: "Evacuation Notice",
    description: "Area evacuation required",
    priority: "critical",
    color: "bg-purple-600",
    icon: Users
  }
}

const PNG_REGIONS = [
  "Nationwide",
  "National Capital District",
  "Morobe Province",
  "Western Highlands Province",
  "Southern Highlands Province",
  "Eastern Highlands Province",
  "Enga Province",
  "Simbu Province",
  "Madang Province",
  "East Sepik Province",
  "West Sepik Province",
  "Central Province",
  "Gulf Province",
  "Western Province",
  "Milne Bay Province",
  "Oro Province",
  "Manus Province",
  "New Ireland Province",
  "East New Britain Province",
  "West New Britain Province",
  "Bougainville Province"
]

const DISTRIBUTION_CHANNELS = [
  { id: "police_units", label: "All Police Units", description: "Mobile data terminals and radios" },
  { id: "patrol_cars", label: "Patrol Vehicles", description: "On-duty patrol units" },
  { id: "stations", label: "Police Stations", description: "All station commanders" },
  { id: "detectives", label: "CID/Detectives", description: "Criminal investigation teams" },
  { id: "traffic", label: "Traffic Division", description: "Highway and traffic units" },
  { id: "community", label: "Community Leaders", description: "Village officials and community contacts" },
  { id: "media", label: "Media Outlets", description: "TV, radio, and newspaper contacts" },
  { id: "government", label: "Government Agencies", description: "Emergency services and agencies" },
  { id: "schools", label: "Schools/Education", description: "Educational institutions" },
  { id: "hospitals", label: "Medical Facilities", description: "Hospitals and clinics" }
]

export default function EmergencyAlertPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  const [alertData, setAlertData] = useState({
    // Alert Classification
    type: "",
    priority: "",
    title: "",
    description: "",

    // Geographic Scope
    regions: [] as string[],
    specificLocations: "",
    radius: "",

    // Distribution
    channels: [] as string[],
    urgency: "immediate",
    duration: "24",

    // Subject Information (for BOLO/Missing Person)
    subjectName: "",
    subjectAge: "",
    subjectDescription: "",
    subjectPhoto: "",
    lastSeenLocation: "",
    lastSeenTime: "",

    // Vehicle Information (for BOLO)
    vehicleMake: "",
    vehicleModel: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleDescription: "",

    // Contact Information
    contactOfficer: "",
    contactPhone: "",
    contactEmail: "",
    caseNumber: "",

    // Instructions
    actionInstructions: "",
    doNotApproach: false,
    armedAndDangerous: false,
    immediateNotification: false,

    // System Information
    issuedBy: "",
    issuedTime: new Date().toISOString(),
    expirationTime: "",
    alertId: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setAlertData(prev => ({
      ...prev,
      issuedBy: parsedUser.name,
      contactOfficer: parsedUser.name
    }))
  }, [router])

  const updateField = (field: string, value: string | boolean | string[]) => {
    setAlertData(prev => ({ ...prev, [field]: value }))
  }

  const toggleRegion = (region: string) => {
    const currentRegions = alertData.regions
    if (currentRegions.includes(region)) {
      updateField("regions", currentRegions.filter(r => r !== region))
    } else {
      updateField("regions", [...currentRegions, region])
    }
  }

  const toggleChannel = (channel: string) => {
    const currentChannels = alertData.channels
    if (currentChannels.includes(channel)) {
      updateField("channels", currentChannels.filter(c => c !== channel))
    } else {
      updateField("channels", [...currentChannels, channel])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate alert ID
      const alertId = `ALERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

      console.log("Alert Data:", { ...alertData, alertId })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/dispatch")
      }, 3000)

    } catch (error) {
      console.error("Error issuing alert:", error)
    } finally {
      setLoading(false)
    }
  }

  const generatePreview = () => {
    const alertTypeInfo = ALERT_TYPES[alertData.type as keyof typeof ALERT_TYPES]
    if (!alertTypeInfo) return ""

    let preview = `🚨 ${alertTypeInfo.label.toUpperCase()} 🚨\n\n`
    preview += `${alertData.title}\n\n`
    preview += `${alertData.description}\n\n`

    if (alertData.subjectName) {
      preview += `SUBJECT: ${alertData.subjectName}\n`
      if (alertData.subjectAge) preview += `AGE: ${alertData.subjectAge}\n`
      if (alertData.subjectDescription) preview += `DESCRIPTION: ${alertData.subjectDescription}\n`
      if (alertData.lastSeenLocation) preview += `LAST SEEN: ${alertData.lastSeenLocation}\n`
      preview += "\n"
    }

    if (alertData.vehiclePlate || alertData.vehicleMake) {
      preview += "VEHICLE INFORMATION:\n"
      if (alertData.vehiclePlate) preview += `LICENSE: ${alertData.vehiclePlate}\n`
      if (alertData.vehicleMake) preview += `VEHICLE: ${alertData.vehicleColor} ${alertData.vehicleMake} ${alertData.vehicleModel}\n`
      preview += "\n"
    }

    if (alertData.armedAndDangerous) {
      preview += "⚠️ ARMED AND DANGEROUS - DO NOT APPROACH ⚠️\n\n"
    }

    if (alertData.actionInstructions) {
      preview += `INSTRUCTIONS: ${alertData.actionInstructions}\n\n`
    }

    preview += `CONTACT: ${alertData.contactOfficer} - ${alertData.contactPhone}\n`
    if (alertData.caseNumber) preview += `CASE: ${alertData.caseNumber}\n`
    preview += `\nISSUED: ${new Date().toLocaleString()}`

    return preview
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
              <h2 className="text-xl font-semibold">Alert Broadcasted Successfully</h2>
              <p className="text-gray-600">Emergency alert has been sent to all selected channels.</p>
              <div className="text-sm text-gray-500">
                <p>Distributed to: {alertData.channels.length} channels</p>
                <p>Coverage: {alertData.regions.length} regions</p>
              </div>
              <p className="text-sm text-gray-500">Redirecting to dispatch control...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Alert System</h1>
            <p className="text-gray-600">Broadcast urgent alerts across PNG police network</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              disabled={!alertData.type || !alertData.title}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "Hide Preview" : "Preview Alert"}
            </Button>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              Alert ID will be auto-generated
            </Badge>
          </div>
        </div>

        {/* Critical Alert Warning */}
        {alertData.type && ALERT_TYPES[alertData.type as keyof typeof ALERT_TYPES]?.priority === "critical" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL ALERT:</strong> This alert type requires immediate authorization and will be distributed with highest priority.
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Mode */}
        {previewMode && alertData.type && (
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Alert Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {generatePreview()}
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="type" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="type">Alert Type</TabsTrigger>
              <TabsTrigger value="details">Subject Details</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Alert Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Alert Type *</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(ALERT_TYPES).map(([key, info]) => (
                        <div
                          key={key}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            alertData.type === key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => updateField("type", key)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <info.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{info.label}</span>
                            <Badge variant={info.priority === "critical" ? "destructive" : "default"} className="text-xs">
                              {info.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{info.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Alert Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief, clear alert title"
                      value={alertData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Alert Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the situation..."
                      rows={4}
                      value={alertData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={alertData.urgency} onValueChange={(value) => updateField("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="urgent">Urgent (1 hour)</SelectItem>
                          <SelectItem value="priority">Priority (4 hours)</SelectItem>
                          <SelectItem value="routine">Routine (24 hours)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Alert Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="24"
                        value={alertData.duration}
                        onChange={(e) => updateField("duration", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caseNumber">Case Number</Label>
                      <Input
                        id="caseNumber"
                        placeholder="Related case number"
                        value={alertData.caseNumber}
                        onChange={(e) => updateField("caseNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Subject Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="subjectName">Subject Name</Label>
                      <Input
                        id="subjectName"
                        placeholder="Full name of subject"
                        value={alertData.subjectName}
                        onChange={(e) => updateField("subjectName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjectAge">Age</Label>
                      <Input
                        id="subjectAge"
                        placeholder="Age or age range"
                        value={alertData.subjectAge}
                        onChange={(e) => updateField("subjectAge", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjectDescription">Physical Description</Label>
                    <Textarea
                      id="subjectDescription"
                      placeholder="Height, weight, hair, clothing, distinguishing features..."
                      rows={3}
                      value={alertData.subjectDescription}
                      onChange={(e) => updateField("subjectDescription", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lastSeenLocation">Last Seen Location</Label>
                      <Input
                        id="lastSeenLocation"
                        placeholder="Specific location where last seen"
                        value={alertData.lastSeenLocation}
                        onChange={(e) => updateField("lastSeenLocation", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastSeenTime">Last Seen Time</Label>
                      <Input
                        id="lastSeenTime"
                        type="datetime-local"
                        value={alertData.lastSeenTime}
                        onChange={(e) => updateField("lastSeenTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Photo Upload</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <Button type="button" variant="outline" size="sm">
                        Upload Subject Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vehiclePlate">License Plate</Label>
                      <Input
                        id="vehiclePlate"
                        placeholder="License plate number"
                        value={alertData.vehiclePlate}
                        onChange={(e) => updateField("vehiclePlate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleColor">Color</Label>
                      <Input
                        id="vehicleColor"
                        placeholder="Vehicle color"
                        value={alertData.vehicleColor}
                        onChange={(e) => updateField("vehicleColor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Make</Label>
                      <Input
                        id="vehicleMake"
                        placeholder="Vehicle make"
                        value={alertData.vehicleMake}
                        onChange={(e) => updateField("vehicleMake", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Model</Label>
                      <Input
                        id="vehicleModel"
                        placeholder="Vehicle model"
                        value={alertData.vehicleModel}
                        onChange={(e) => updateField("vehicleModel", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleDescription">Additional Vehicle Details</Label>
                    <Textarea
                      id="vehicleDescription"
                      placeholder="Damage, modifications, unique features..."
                      rows={2}
                      value={alertData.vehicleDescription}
                      onChange={(e) => updateField("vehicleDescription", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Geographic Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Regions *</Label>
                    <div className="grid gap-2 md:grid-cols-3">
                      {PNG_REGIONS.map((region) => (
                        <div
                          key={region}
                          className={`p-2 border rounded cursor-pointer text-sm ${
                            alertData.regions.includes(region)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleRegion(region)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              alertData.regions.includes(region) ? "bg-blue-500" : "bg-gray-300"
                            }`} />
                            {region}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Selected: {alertData.regions.length} regions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specificLocations">Specific Locations</Label>
                    <Textarea
                      id="specificLocations"
                      placeholder="Specific areas, roads, landmarks within selected regions..."
                      rows={2}
                      value={alertData.specificLocations}
                      onChange={(e) => updateField("specificLocations", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Distribution Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Distribution Channels *</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {DISTRIBUTION_CHANNELS.map((channel) => (
                        <div
                          key={channel.id}
                          className={`p-3 border rounded cursor-pointer ${
                            alertData.channels.includes(channel.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleChannel(channel.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${
                              alertData.channels.includes(channel.id) ? "bg-blue-500" : "bg-gray-300"
                            }`} />
                            <span className="font-medium text-sm">{channel.label}</span>
                          </div>
                          <p className="text-xs text-gray-600">{channel.description}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Selected: {alertData.channels.length} channels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Action Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="actionInstructions">Instructions for Recipients</Label>
                    <Textarea
                      id="actionInstructions"
                      placeholder="What should officers/recipients do if they encounter the subject?"
                      rows={4}
                      value={alertData.actionInstructions}
                      onChange={(e) => updateField("actionInstructions", e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="doNotApproach"
                        checked={alertData.doNotApproach}
                        onChange={(e) => updateField("doNotApproach", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="doNotApproach" className="text-orange-600 font-medium">
                        Do Not Approach - Observe and Report Only
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="armedAndDangerous"
                        checked={alertData.armedAndDangerous}
                        onChange={(e) => updateField("armedAndDangerous", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="armedAndDangerous" className="text-red-600 font-medium">
                        Armed and Dangerous - Use Extreme Caution
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="immediateNotification"
                        checked={alertData.immediateNotification}
                        onChange={(e) => updateField("immediateNotification", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="immediateNotification" className="text-blue-600 font-medium">
                        Immediate Notification Required
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactOfficer">Contact Officer *</Label>
                      <Input
                        id="contactOfficer"
                        value={alertData.contactOfficer}
                        onChange={(e) => updateField("contactOfficer", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        id="contactPhone"
                        placeholder="+675 XXX XXXX"
                        value={alertData.contactPhone}
                        onChange={(e) => updateField("contactPhone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="officer@police.gov.pg"
                      value={alertData.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issuedBy">Issued By</Label>
                    <Input
                      id="issuedBy"
                      value={alertData.issuedBy}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !alertData.type || !alertData.title || alertData.regions.length === 0 || alertData.channels.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Broadcasting Alert...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Broadcast Alert
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
