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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  FileText,
  Camera,
  Upload,
  Save,
  Send,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Shield,
  Lock,
  Database,
  Fingerprint,
  Scale,
  Clock,
  Eye,
  Hash
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const EVIDENCE_TYPES = {
  "physical": {
    label: "Physical Evidence",
    icon: Package,
    subcategories: [
      "Weapon (Knife/Gun/Club)", "Drug/Narcotic Substance", "Stolen Property", "Vehicle Parts",
      "Clothing/Fabric", "Blood/Biological Sample", "Tool/Instrument", "Document/Paper",
      "Electronics/Phone", "Jewelry/Valuables", "Container/Packaging", "Other Physical Item"
    ]
  },
  "digital": {
    label: "Digital Evidence",
    icon: Database,
    subcategories: [
      "Computer/Laptop", "Mobile Phone", "USB/Storage Device", "Memory Card",
      "Digital Photos/Videos", "Social Media Content", "Text Messages/Calls",
      "Email Communications", "CCTV Footage", "GPS Data", "Banking Records", "Other Digital"
    ]
  },
  "document": {
    label: "Documents",
    icon: FileText,
    subcategories: [
      "Official ID/Passport", "Financial Records", "Letters/Notes", "Contracts",
      "Maps/Drawings", "Receipts/Invoices", "Medical Records", "Legal Documents",
      "Photos/Printed Images", "Handwritten Notes", "Business Records", "Other Documents"
    ]
  },
  "biological": {
    label: "Biological Evidence",
    icon: Fingerprint,
    subcategories: [
      "Blood Sample", "DNA Sample", "Saliva", "Hair/Fiber", "Fingerprints",
      "Tissue Sample", "Bodily Fluids", "Dental Records", "Bone/Remains",
      "Plant Material", "Animal Evidence", "Other Biological"
    ]
  },
  "trace": {
    label: "Trace Evidence",
    icon: Eye,
    subcategories: [
      "Fiber Evidence", "Paint Chips", "Glass Fragments", "Soil/Dirt Samples",
      "Gunshot Residue", "Chemical Residue", "Tool Marks", "Tire Impressions",
      "Footprint Casts", "Fingerprint Lifts", "Powder/Dust", "Other Trace"
    ]
  }
}

const COLLECTION_LOCATIONS = [
  "Crime Scene", "Suspect Property", "Victim Property", "Public Area", "Vehicle",
  "Residence", "Business Location", "Police Station", "Hospital/Medical Facility",
  "Laboratory", "Court", "Other Location"
]

const STORAGE_LOCATIONS = [
  "Evidence Room A - Port Moresby", "Evidence Room B - Lae", "Evidence Room C - Mt. Hagen",
  "Forensics Laboratory", "Digital Evidence Server", "Refrigerated Storage",
  "Secure Storage Vault", "Weapons Storage", "Drug Storage", "Temporary Holding"
]

const PRIORITY_LEVELS = {
  "critical": { label: "Critical", color: "bg-red-600", description: "Immediate processing required" },
  "high": { label: "High", color: "bg-orange-500", description: "Process within 24 hours" },
  "medium": { label: "Medium", color: "bg-yellow-500", description: "Process within 1 week" },
  "low": { label: "Low", color: "bg-green-500", description: "Process when available" }
}

export default function NewEvidencePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [evidenceData, setEvidenceData] = useState({
    // Basic Information
    type: "",
    subcategory: "",
    description: "",
    quantity: "1",
    condition: "",

    // Case Information
    caseId: "",
    incidentId: "",
    relatedCases: "",

    // Collection Details
    collectionDate: new Date().toISOString().split('T')[0],
    collectionTime: new Date().toTimeString().slice(0, 5),
    collectionLocation: "",
    collectionAddress: "",
    collectedBy: "",
    collectionMethod: "",

    // Chain of Custody
    currentCustody: "",
    transferredBy: "",
    transferredTo: "",
    transferDate: "",
    transferReason: "",

    // Storage Information
    storageLocation: "",
    storageConditions: "",
    containerType: "",
    sealNumber: "",

    // Analysis Requirements
    priority: "",
    analysisRequired: [] as string[],
    forensicsRequested: false,
    dnaAnalysis: false,
    fingerprintAnalysis: false,
    digitalForensics: false,
    labAnalysis: false,

    // Legal Information
    searchWarrant: "",
    consentObtained: false,
    courtOrder: "",
    legalAuthority: "",

    // Documentation
    photographs: 0,
    videos: 0,
    sketches: 0,
    measurements: "",
    additionalDocuments: "",

    // Tags and Classification
    tags: [] as string[],
    confidentialityLevel: "standard",
    restrictedAccess: false,
    notifyProsecutor: false,

    // System Information
    loggedBy: "",
    loggedDate: new Date().toISOString(),
    witnessOfficers: [] as string[],
    notes: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEvidenceData(prev => ({
      ...prev,
      loggedBy: parsedUser.name,
      collectedBy: parsedUser.name,
      currentCustody: parsedUser.name
    }))
  }, [router])

  const updateField = (field: string, value: string | boolean | string[] | number) => {
    setEvidenceData(prev => ({ ...prev, [field]: value }))
  }

  const addToArray = (field: string, value: string) => {
    if (value.trim()) {
      const currentArray = evidenceData[field as keyof typeof evidenceData] as string[]
      if (!currentArray.includes(value.trim())) {
        updateField(field, [...currentArray, value.trim()])
      }
    }
  }

  const removeFromArray = (field: string, index: number) => {
    const currentArray = evidenceData[field as keyof typeof evidenceData] as string[]
    updateField(field, currentArray.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'submit') => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate evidence ID
      const evidenceId = `EVD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

      console.log("Evidence Data:", { ...evidenceData, id: evidenceId, action })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push(`/evidence`)
      }, 2000)

    } catch (error) {
      console.error("Error logging evidence:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableSubcategories = () => {
    if (!evidenceData.type) return []
    return EVIDENCE_TYPES[evidenceData.type as keyof typeof EVIDENCE_TYPES]?.subcategories || []
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
              <h2 className="text-xl font-semibold">Evidence Logged Successfully</h2>
              <p className="text-gray-600">Evidence has been logged and chain of custody initiated.</p>
              <p className="text-sm text-gray-500">Redirecting to evidence management...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Log New Evidence</h1>
            <p className="text-gray-600">Document and secure evidence with proper chain of custody</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Evidence ID will be auto-generated
            </Badge>
            {evidenceData.priority && (
              <Badge className={PRIORITY_LEVELS[evidenceData.priority as keyof typeof PRIORITY_LEVELS]?.color}>
                {PRIORITY_LEVELS[evidenceData.priority as keyof typeof PRIORITY_LEVELS]?.label} Priority
              </Badge>
            )}
          </div>
        </div>

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Chain of Custody:</strong> All evidence logging creates an immutable record.
            Ensure all information is accurate before submission.
          </AlertDescription>
        </Alert>

        <form className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Evidence Details</TabsTrigger>
              <TabsTrigger value="collection">Collection Info</TabsTrigger>
              <TabsTrigger value="custody">Chain of Custody</TabsTrigger>
              <TabsTrigger value="analysis">Analysis & Testing</TabsTrigger>
              <TabsTrigger value="storage">Storage & Security</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Evidence Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Evidence Type *</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(EVIDENCE_TYPES).map(([key, { label, icon: Icon }]) => (
                        <div
                          key={key}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            evidenceData.type === key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => updateField("type", key)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {evidenceData.type && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Specific Category *</Label>
                      <Select value={evidenceData.subcategory} onValueChange={(value) => updateField("subcategory", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specific type" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableSubcategories().map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Evidence Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the evidence item..."
                      rows={4}
                      value={evidenceData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={evidenceData.quantity}
                        onChange={(e) => updateField("quantity", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={evidenceData.condition} onValueChange={(value) => updateField("condition", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="destroyed">Destroyed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="caseId">Related Case ID</Label>
                      <Input
                        id="caseId"
                        placeholder="CASE-2024-XXX"
                        value={evidenceData.caseId}
                        onChange={(e) => updateField("caseId", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentId">Related Incident ID</Label>
                      <Input
                        id="incidentId"
                        placeholder="INC-2024-XXX"
                        value={evidenceData.incidentId}
                        onChange={(e) => updateField("incidentId", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collection" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Collection Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="collectionDate">Collection Date *</Label>
                      <Input
                        id="collectionDate"
                        type="date"
                        value={evidenceData.collectionDate}
                        onChange={(e) => updateField("collectionDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collectionTime">Collection Time *</Label>
                      <Input
                        id="collectionTime"
                        type="time"
                        value={evidenceData.collectionTime}
                        onChange={(e) => updateField("collectionTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collectionLocation">Collection Location *</Label>
                    <Select value={evidenceData.collectionLocation} onValueChange={(value) => updateField("collectionLocation", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLECTION_LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collectionAddress">Specific Address/Location *</Label>
                    <Input
                      id="collectionAddress"
                      placeholder="Exact address or location description"
                      value={evidenceData.collectionAddress}
                      onChange={(e) => updateField("collectionAddress", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collectedBy">Collected By *</Label>
                    <Input
                      id="collectedBy"
                      value={evidenceData.collectedBy}
                      onChange={(e) => updateField("collectedBy", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collectionMethod">Collection Method</Label>
                    <Select value={evidenceData.collectionMethod} onValueChange={(value) => updateField("collectionMethod", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How was evidence collected?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct_pickup">Direct Pickup</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="swabbing">Swabbing</SelectItem>
                        <SelectItem value="scraping">Scraping</SelectItem>
                        <SelectItem value="lifting">Lifting (tape/powder)</SelectItem>
                        <SelectItem value="casting">Casting/Molding</SelectItem>
                        <SelectItem value="excavation">Excavation</SelectItem>
                        <SelectItem value="digital_copy">Digital Copy</SelectItem>
                        <SelectItem value="seizure">Legal Seizure</SelectItem>
                        <SelectItem value="voluntary">Voluntary Surrender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custody" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Chain of Custody
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentCustody">Current Custodian *</Label>
                    <Input
                      id="currentCustody"
                      value={evidenceData.currentCustody}
                      onChange={(e) => updateField("currentCustody", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sealNumber">Evidence Seal Number</Label>
                      <Input
                        id="sealNumber"
                        placeholder="Unique seal identifier"
                        value={evidenceData.sealNumber}
                        onChange={(e) => updateField("sealNumber", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="containerType">Container Type</Label>
                      <Select value={evidenceData.containerType} onValueChange={(value) => updateField("containerType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select container" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="evidence_bag">Evidence Bag</SelectItem>
                          <SelectItem value="evidence_box">Evidence Box</SelectItem>
                          <SelectItem value="paper_bag">Paper Bag</SelectItem>
                          <SelectItem value="plastic_container">Plastic Container</SelectItem>
                          <SelectItem value="glass_vial">Glass Vial</SelectItem>
                          <SelectItem value="metal_container">Metal Container</SelectItem>
                          <SelectItem value="refrigerated">Refrigerated Container</SelectItem>
                          <SelectItem value="secure_locker">Secure Locker</SelectItem>
                          <SelectItem value="digital_storage">Digital Storage</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Chain of custody tracking begins immediately upon evidence logging.
                      All transfers will be automatically recorded with timestamps.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Analysis & Testing Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Processing Priority *</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(PRIORITY_LEVELS).map(([key, { label, color, description }]) => (
                        <div
                          key={key}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            evidenceData.priority === key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => updateField("priority", key)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <span className="font-medium text-sm">{label}</span>
                          </div>
                          <p className="text-xs text-gray-600">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Required Analysis Types</Label>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="forensicsRequested"
                          checked={evidenceData.forensicsRequested}
                          onChange={(e) => updateField("forensicsRequested", e.target.checked)}
                        />
                        <Label htmlFor="forensicsRequested">General Forensics</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dnaAnalysis"
                          checked={evidenceData.dnaAnalysis}
                          onChange={(e) => updateField("dnaAnalysis", e.target.checked)}
                        />
                        <Label htmlFor="dnaAnalysis">DNA Analysis</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="fingerprintAnalysis"
                          checked={evidenceData.fingerprintAnalysis}
                          onChange={(e) => updateField("fingerprintAnalysis", e.target.checked)}
                        />
                        <Label htmlFor="fingerprintAnalysis">Fingerprint Analysis</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="digitalForensics"
                          checked={evidenceData.digitalForensics}
                          onChange={(e) => updateField("digitalForensics", e.target.checked)}
                        />
                        <Label htmlFor="digitalForensics">Digital Forensics</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="labAnalysis"
                          checked={evidenceData.labAnalysis}
                          onChange={(e) => updateField("labAnalysis", e.target.checked)}
                        />
                        <Label htmlFor="labAnalysis">Laboratory Analysis</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Storage & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storageLocation">Storage Location *</Label>
                    <Select value={evidenceData.storageLocation} onValueChange={(value) => updateField("storageLocation", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage location" />
                      </SelectTrigger>
                      <SelectContent>
                        {STORAGE_LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storageConditions">Storage Conditions</Label>
                    <Select value={evidenceData.storageConditions} onValueChange={(value) => updateField("storageConditions", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Required storage conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room_temperature">Room Temperature</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated (2-8°C)</SelectItem>
                        <SelectItem value="frozen">Frozen (-20°C)</SelectItem>
                        <SelectItem value="dry_storage">Dry Storage</SelectItem>
                        <SelectItem value="climate_controlled">Climate Controlled</SelectItem>
                        <SelectItem value="secure_vault">Secure Vault</SelectItem>
                        <SelectItem value="fireproof">Fireproof Storage</SelectItem>
                        <SelectItem value="digital_only">Digital Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidentialityLevel">Confidentiality Level</Label>
                    <Select value={evidenceData.confidentialityLevel} onValueChange={(value) => updateField("confidentialityLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="confidential">Confidential</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="secret">Secret</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="restrictedAccess"
                        checked={evidenceData.restrictedAccess}
                        onChange={(e) => updateField("restrictedAccess", e.target.checked)}
                      />
                      <Label htmlFor="restrictedAccess">Restricted Access - Senior Officers Only</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notifyProsecutor"
                        checked={evidenceData.notifyProsecutor}
                        onChange={(e) => updateField("notifyProsecutor", e.target.checked)}
                      />
                      <Label htmlFor="notifyProsecutor">Notify Prosecutor of Evidence</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Documentation & Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="photographs">Number of Photographs</Label>
                      <Input
                        id="photographs"
                        type="number"
                        min="0"
                        value={evidenceData.photographs}
                        onChange={(e) => updateField("photographs", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videos">Number of Videos</Label>
                      <Input
                        id="videos"
                        type="number"
                        min="0"
                        value={evidenceData.videos}
                        onChange={(e) => updateField("videos", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sketches">Number of Sketches/Diagrams</Label>
                      <Input
                        id="sketches"
                        type="number"
                        min="0"
                        value={evidenceData.sketches}
                        onChange={(e) => updateField("sketches", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measurements">Measurements & Dimensions</Label>
                    <Textarea
                      id="measurements"
                      placeholder="Record any measurements, dimensions, or technical specifications..."
                      rows={3}
                      value={evidenceData.measurements}
                      onChange={(e) => updateField("measurements", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Legal Authority</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="searchWarrant">Search Warrant Number</Label>
                        <Input
                          id="searchWarrant"
                          placeholder="Warrant number if applicable"
                          value={evidenceData.searchWarrant}
                          onChange={(e) => updateField("searchWarrant", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="courtOrder">Court Order Number</Label>
                        <Input
                          id="courtOrder"
                          placeholder="Court order if applicable"
                          value={evidenceData.courtOrder}
                          onChange={(e) => updateField("courtOrder", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="consentObtained"
                        checked={evidenceData.consentObtained}
                        onChange={(e) => updateField("consentObtained", e.target.checked)}
                      />
                      <Label htmlFor="consentObtained">Consent obtained from owner/subject</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional observations, concerns, or relevant information..."
                      rows={4}
                      value={evidenceData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loggedBy">Logged By</Label>
                    <Input
                      id="loggedBy"
                      value={evidenceData.loggedBy}
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
              type="button"
              onClick={(e) => handleSubmit(e, 'save')}
              disabled={loading}
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, 'submit')}
              disabled={loading || !evidenceData.type || !evidenceData.description}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Logging Evidence...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Log Evidence
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
