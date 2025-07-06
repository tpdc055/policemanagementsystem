"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
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
  ArrowLeft,
  Edit,
  Save,
  X,
  Eye,
  Download,
  Printer,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  FileText,
  Camera,
  Paperclip,
  Shield,
  Scale,
  Lock,
  Unlock,
  History,
  Phone,
  Home,
  Gavel,
  Info,
  Plus
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// Extended log book entry interface
interface LogBookEntryDetail {
  id: string
  incidentNumber: string
  status: "pending" | "verified" | "amended" | "rejected"
  type: "arrest" | "custody" | "incident" | "transfer"

  // Person Information
  personName: string
  personAge: number
  personGender: string
  personNationality: string
  personAddress: string
  personPhone: string
  personIdentification: string

  // Incident Details
  incidentType: string
  location: string
  province: string
  dateTime: string
  description: string
  charges: string[]
  priority: "low" | "medium" | "high" | "critical"

  // Officers
  reportingOfficer: string
  verifyingOfficer?: string
  postCommander?: string

  // Evidence
  evidence: {
    documents: { name: string; type: string; uploadedBy: string; uploadedTime: string }[]
    photos: { name: string; description: string; uploadedBy: string; uploadedTime: string }[]
    videos: { name: string; description: string; uploadedBy: string; uploadedTime: string }[]
    physicalEvidence: { description: string; location: string; chainOfCustody: string[] }[]
  }

  // Custody Information
  custody: {
    inCustody: boolean
    cellNumber?: string
    admissionTime?: string
    bail?: {
      amount: number
      type: string
      guarantor: string
      guarantorPhone: string
      paid: boolean
      paidTime?: string
      receiptNumber?: string
    }
  }

  // Personal Property
  personalProperty: {
    description: string
    condition: string
    location: string
    isEvidence: boolean
    evidenceTag?: string
  }[]

  // Amendments
  amendments: {
    id: string
    amendedBy: string
    amendedTime: string
    reason: string
    oldValues: Record<string, unknown>
    newValues: Record<string, unknown>
    approvedBy?: string
    approvalTime?: string
  }[]

  // System Information
  createdBy: string
  createdTime: string
  lastUpdated: string
  notes: string
  specialInstructions: string
}

// Mock detailed log book entry
const getLogBookEntryDetail = (id: string): LogBookEntryDetail => {
  return {
    id: "LOG-2024-001",
    incidentNumber: "INC-2024-001",
    status: "verified",
    type: "arrest",

    // Person Information
    personName: "John Kaupa",
    personAge: 29,
    personGender: "Male",
    personNationality: "Papua New Guinean",
    personAddress: "Section 12, Lot 45, Gerehu Stage 4, Port Moresby, NCD",
    personPhone: "+675 7123 4567",
    personIdentification: "PNG ID: 123456789",

    // Incident Details
    incidentType: "Armed Robbery",
    location: "Port Moresby Central Market, Stall 45",
    province: "National Capital District",
    dateTime: "2024-01-15T14:30:00Z",
    description: "Suspect approached vendor with knife, demanded cash from till. Vendor complied under threat. Suspect fled scene but was apprehended 200m away by responding officers. Recovered K145 cash and weapon.",
    charges: ["Armed Robbery", "Possession of Stolen Property", "Carrying Weapon"],
    priority: "high",

    // Officers
    reportingOfficer: "Const. Peter Bani (Badge #1234)",
    verifyingOfficer: "Sgt. Michael Namaliu (Badge #567)",
    postCommander: "Insp. David Agarobe (Badge #89)",

    // Evidence
    evidence: {
      documents: [
        { name: "Witness_Statement_1.pdf", type: "Witness Statement", uploadedBy: "Const. Peter Bani", uploadedTime: "2024-01-15T15:00:00Z" },
        { name: "Vendor_Statement.pdf", type: "Victim Statement", uploadedBy: "Const. Peter Bani", uploadedTime: "2024-01-15T15:15:00Z" },
        { name: "Scene_Sketch.pdf", type: "Scene Documentation", uploadedBy: "Const. Sarah Kila", uploadedTime: "2024-01-15T15:30:00Z" }
      ],
      photos: [
        { name: "Scene_001.jpg", description: "Market stall where robbery occurred", uploadedBy: "Const. Sarah Kila", uploadedTime: "2024-01-15T14:45:00Z" },
        { name: "Evidence_Knife.jpg", description: "Recovered weapon - kitchen knife", uploadedBy: "Const. Sarah Kila", uploadedTime: "2024-01-15T14:50:00Z" },
        { name: "Suspect_Arrest.jpg", description: "Suspect at time of arrest", uploadedBy: "Const. Peter Bani", uploadedTime: "2024-01-15T14:55:00Z" },
        { name: "Recovered_Cash.jpg", description: "Stolen money recovered from suspect", uploadedBy: "Const. Peter Bani", uploadedTime: "2024-01-15T15:00:00Z" }
      ],
      videos: [
        { name: "CCTV_Market_Entrance.mp4", description: "Market entrance CCTV showing suspect fleeing", uploadedBy: "Det. Helen Bani", uploadedTime: "2024-01-15T16:00:00Z" }
      ],
      physicalEvidence: [
        { description: "Kitchen knife (20cm blade) - weapon used", location: "Evidence Room A, Locker 15", chainOfCustody: ["Const. Peter Bani", "Evidence Officer Mary Temu"] },
        { description: "Cash K145 - stolen property", location: "Evidence Room A, Locker 15", chainOfCustody: ["Const. Peter Bani", "Evidence Officer Mary Temu"] },
        { description: "Suspect clothing - blue shirt, black pants", location: "Evidence Room B, Rack 3", chainOfCustody: ["Const. Peter Bani", "Evidence Officer Mary Temu"] }
      ]
    },

    // Custody Information
    custody: {
      inCustody: true,
      cellNumber: "A-3",
      admissionTime: "2024-01-15T14:45:00Z",
      bail: {
        amount: 1000,
        type: "Surety",
        guarantor: "Grace Kaupa (Mother)",
        guarantorPhone: "+675 325 8901",
        paid: false
      }
    },

    // Personal Property
    personalProperty: [
      { description: "Samsung Galaxy S21 (Black)", condition: "Good", location: "Property Room A, Shelf 3", isEvidence: false },
      { description: "Leather wallet (brown)", condition: "Good", location: "Property Room A, Shelf 3", isEvidence: false },
      { description: "Cash K23 (personal)", condition: "Good", location: "Property Room A, Shelf 3", isEvidence: false },
      { description: "House keys (3 keys on ring)", condition: "Good", location: "Property Room A, Shelf 3", isEvidence: false }
    ],

    // Amendments
    amendments: [
      {
        id: "AMD-001",
        amendedBy: "Insp. David Agarobe",
        amendedTime: "2024-01-15T16:30:00Z",
        reason: "Additional charge added after forensic analysis of weapon confirmed it was used in previous unsolved robbery",
        oldValues: { charges: ["Armed Robbery", "Possession of Stolen Property"] },
        newValues: { charges: ["Armed Robbery", "Possession of Stolen Property", "Carrying Weapon"] },
        approvedBy: "Insp. David Agarobe",
        approvalTime: "2024-01-15T16:30:00Z"
      }
    ],

    // System Information
    createdBy: "Const. Peter Bani",
    createdTime: "2024-01-15T14:45:00Z",
    lastUpdated: "2024-01-15T16:30:00Z",
    notes: "Suspect was cooperative during arrest. No resistance offered. Weapon voluntarily surrendered when confronted.",
    specialInstructions: "Suspect has family connections in community. Monitor for potential retaliation concerns."
  }
}

export default function LogBookEntryDetailPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [entry, setEntry] = useState<LogBookEntryDetail | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<LogBookEntryDetail>>({})
  const [amendmentReason, setAmendmentReason] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load entry data
    const entryData = getLogBookEntryDetail(params.id as string)
    setEntry(entryData)
    setEditData(entryData)
  }, [router, params.id])

  const canAmend = user?.role === "commander" || user?.role === "admin"
  const canVerify = user?.role === "sergeant" || user?.role === "commander" || user?.role === "admin"

  const handleAmendment = async () => {
    if (!amendmentReason.trim()) {
      alert("Amendment reason is required")
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create amendment record
      const amendment = {
        id: `AMD-${String(entry!.amendments.length + 1).padStart(3, '0')}`,
        amendedBy: user!.name,
        amendedTime: new Date().toISOString(),
        reason: amendmentReason,
        oldValues: { /* original values */ },
        newValues: { /* edited values */ },
        approvedBy: user!.name,
        approvalTime: new Date().toISOString()
      }

      console.log("Amendment created:", amendment)

      setIsEditing(false)
      setAmendmentReason("")
      alert("Amendment successfully recorded with full audit trail")

    } catch (error) {
      console.error("Error creating amendment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !entry) {
    return <div>Loading...</div>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      "pending": { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      "verified": { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      "amended": { variant: "default" as const, icon: Edit, color: "text-blue-600" },
      "rejected": { variant: "destructive" as const, icon: X, color: "text-red-600" }
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const statusConfig = getStatusBadge(entry.status)
  const StatusIcon = statusConfig.icon

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Log Book
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                Log Entry: {entry.id}
              </h1>
              <p className="text-gray-600">
                {entry.personName} • {entry.incidentType} • {entry.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant} className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {entry.status.toUpperCase()}
            </Badge>
            {entry.custody.inCustody && (
              <Badge variant="destructive">IN CUSTODY</Badge>
            )}
            <Badge variant="outline">
              {entry.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </div>

        {/* Amendment Notice */}
        {entry.amendments.length > 0 && (
          <Alert>
            <History className="h-4 w-4" />
            <AlertDescription>
              <strong>Amendment History:</strong> This entry has been amended {entry.amendments.length} time(s).
              All changes are tracked in the audit trail below.
            </AlertDescription>
          </Alert>
        )}

        {/* Commander Controls */}
        {canAmend && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Commander Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={isEditing ? "destructive" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel Amendment
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Amend Entry
                    </>
                  )}
                </Button>

                {isEditing && (
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Required: Reason for amendment..."
                      value={amendmentReason}
                      onChange={(e) => setAmendmentReason(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAmendment}
                      disabled={!amendmentReason.trim() || loading}
                    >
                      {loading ? "Saving..." : "Save Amendment"}
                    </Button>
                  </div>
                )}

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="details">Entry Details</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="custody">Custody</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="amendments">Amendment History</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Person Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{entry.personName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{entry.personAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{entry.personGender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="font-medium">{entry.personNationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{entry.personPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Identification:</span>
                      <span className="font-medium">{entry.personIdentification}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <span className="text-gray-600 text-sm">Address:</span>
                    <p className="text-sm mt-1">{entry.personAddress}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Incident Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{entry.incidentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date/Time:</span>
                      <span className="font-medium">{new Date(entry.dateTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{entry.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Province:</span>
                      <span className="font-medium">{entry.province}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge variant={entry.priority === "high" || entry.priority === "critical" ? "destructive" : "default"}>
                        {entry.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charges */}
            <Card>
              <CardHeader>
                <CardTitle>Charges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {entry.charges.map((charge, index) => (
                    <Badge key={index} variant="destructive">
                      {charge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{entry.description}</p>
              </CardContent>
            </Card>

            {/* Officers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Officer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reporting Officer:</span>
                    <span className="font-medium">{entry.reportingOfficer}</span>
                  </div>
                  {entry.verifyingOfficer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verifying Officer:</span>
                      <span className="font-medium">{entry.verifyingOfficer}</span>
                    </div>
                  )}
                  {entry.postCommander && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Post Commander:</span>
                      <span className="font-medium">{entry.postCommander}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes and Instructions */}
            {(entry.notes || entry.specialInstructions) && (
              <div className="grid gap-6 md:grid-cols-2">
                {entry.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Officer Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{entry.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {entry.specialInstructions && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Special Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>{entry.specialInstructions}</AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents ({entry.evidence.documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.evidence.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">
                          {doc.type} • Uploaded by {doc.uploadedBy} • {new Date(doc.uploadedTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photographs ({entry.evidence.photos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {entry.evidence.photos.map((photo, index) => (
                    <div key={index} className="border rounded overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">{photo.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{photo.description}</p>
                        <p className="text-xs text-gray-500">
                          By {photo.uploadedBy} • {new Date(photo.uploadedTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            {entry.evidence.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Videos ({entry.evidence.videos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entry.evidence.videos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{video.name}</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded by {video.uploadedBy} • {new Date(video.uploadedTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Play
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Physical Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Physical Evidence ({entry.evidence.physicalEvidence.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entry.evidence.physicalEvidence.map((evidence, index) => (
                    <div key={index} className="p-4 border rounded">
                      <h4 className="font-medium mb-2">{evidence.description}</h4>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span> {evidence.location}
                        </div>
                        <div>
                          <span className="text-gray-600">Chain of Custody:</span> {evidence.chainOfCustody.join(" → ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custody" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Custody Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entry.custody.inCustody ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-800">Currently in Custody</span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <span className="text-gray-600">Cell Number:</span> {entry.custody.cellNumber}
                      </div>
                      <div>
                        <span className="text-gray-600">Admission Time:</span> {new Date(entry.custody.admissionTime!).toLocaleString()}
                      </div>
                    </div>

                    {entry.custody.bail && (
                      <div className="mt-4 p-3 bg-white border rounded">
                        <h4 className="font-medium mb-2">Bail Information</h4>
                        <div className="grid gap-2 md:grid-cols-2 text-sm">
                          <div>
                            <span className="text-gray-600">Amount:</span> K{entry.custody.bail.amount}
                          </div>
                          <div>
                            <span className="text-gray-600">Type:</span> {entry.custody.bail.type}
                          </div>
                          <div>
                            <span className="text-gray-600">Guarantor:</span> {entry.custody.bail.guarantor}
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <Badge variant={entry.custody.bail.paid ? "default" : "destructive"} className="ml-1">
                              {entry.custody.bail.paid ? "PAID" : "UNPAID"}
                            </Badge>
                          </div>
                        </div>

                        {entry.custody.bail.paid && entry.custody.bail.paidTime && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Paid:</span> {new Date(entry.custody.bail.paidTime).toLocaleString()}
                            {entry.custody.bail.receiptNumber && (
                              <span className="ml-2">Receipt: {entry.custody.bail.receiptNumber}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Link href={`/custody/${entry.id}`}>
                        <Button variant="outline" size="sm">
                          <Scale className="w-4 h-4 mr-1" />
                          Manage Custody
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Unlock className="w-4 h-4 mr-1" />
                        Process Release
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded text-center">
                    <Unlock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="text-green-800 font-medium">Not Currently in Custody</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="property" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Personal Property ({entry.personalProperty.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.personalProperty.map((item, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{item.description}</h4>
                          <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                        </div>
                        <div className="flex gap-2">
                          {item.isEvidence && (
                            <Badge variant="destructive">EVIDENCE</Badge>
                          )}
                          <Badge variant="outline">{item.location}</Badge>
                        </div>
                      </div>

                      {item.evidenceTag && (
                        <div className="text-sm text-red-600">
                          Evidence Tag: {item.evidenceTag}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amendments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Amendment History ({entry.amendments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entry.amendments.length > 0 ? (
                  <div className="space-y-4">
                    {entry.amendments.map((amendment, index) => (
                      <div key={amendment.id} className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">Amendment #{index + 1}</h4>
                            <p className="text-sm text-gray-600">
                              By {amendment.amendedBy} • {new Date(amendment.amendedTime).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="destructive">COMMANDER ACTION</Badge>
                        </div>

                        <div className="mb-3">
                          <span className="font-medium text-sm">Reason:</span>
                          <p className="text-sm mt-1">{amendment.reason}</p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <span className="font-medium text-sm text-red-600">Previous Values:</span>
                            <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(amendment.oldValues, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="font-medium text-sm text-green-600">New Values:</span>
                            <pre className="text-xs bg-green-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(amendment.newValues, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {amendment.approvedBy && (
                          <div className="mt-3 text-sm">
                            <span className="font-medium">Approved by:</span> {amendment.approvedBy}
                            {amendment.approvalTime && (
                              <span className="text-gray-600"> on {new Date(amendment.approvalTime).toLocaleString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No amendments have been made to this entry.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Complete Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* System Information */}
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-3">System Information</h4>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <span className="text-gray-600">Created by:</span> {entry.createdBy}
                      </div>
                      <div>
                        <span className="text-gray-600">Created time:</span> {new Date(entry.createdTime).toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-600">Last updated:</span> {new Date(entry.lastUpdated).toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-600">Entry ID:</span> {entry.id}
                      </div>
                    </div>
                  </div>

                  {/* Full audit trail would be loaded from audit system */}
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Complete audit trail available to authorized personnel.</p>
                    <Link href="/audit-trail">
                      <Button variant="outline" size="sm" className="mt-2">
                        <History className="w-4 h-4 mr-2" />
                        View Full Audit Trail
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
