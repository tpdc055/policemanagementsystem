"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  MapPin,
  FileText,
  Camera,
  Paperclip,
  Shield,
  Scale,
  Download,
  Printer
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// TypeScript interfaces for log book entries
interface LogBookEntry {
  id: string
  incidentNumber: string
  status: "pending" | "verified" | "amended" | "rejected"
  type: "arrest" | "custody" | "incident" | "transfer"
  personName: string
  personAge: number
  personGender: string
  incidentType: string
  location: string
  dateTime: string
  reportingOfficer: string
  verifyingOfficer?: string
  postCommander?: string
  description: string
  charges: string[]
  evidence: {
    documents: number
    photos: number
    videos: number
  }
  custody: {
    inCustody: boolean
    cellNumber?: string
    bail?: {
      amount: number
      type: string
      guarantor: string
    }
  }
  amendments: {
    count: number
    lastAmended?: string
    amendedBy?: string
  }
  priority: "low" | "medium" | "high" | "critical"
  lastUpdated: string
}

// Mock log book data
const MOCK_LOG_ENTRIES: LogBookEntry[] = [
  {
    id: "LOG-2024-001",
    incidentNumber: "INC-2024-001",
    status: "pending",
    type: "arrest",
    personName: "John Kaupa",
    personAge: 29,
    personGender: "Male",
    incidentType: "Armed Robbery",
    location: "Port Moresby Central Market",
    dateTime: "2024-01-15T14:30:00Z",
    reportingOfficer: "Const. Peter Bani",
    description: "Suspect arrested for armed robbery at Central Market. Found in possession of stolen items and weapon.",
    charges: ["Armed Robbery", "Possession of Stolen Property", "Carrying Weapon"],
    evidence: {
      documents: 3,
      photos: 8,
      videos: 1
    },
    custody: {
      inCustody: true,
      cellNumber: "A-3"
    },
    amendments: {
      count: 0
    },
    priority: "high",
    lastUpdated: "2024-01-15T14:45:00Z"
  },
  {
    id: "LOG-2024-002",
    incidentNumber: "INC-2024-002",
    status: "verified",
    type: "custody",
    personName: "Mary Temu",
    personAge: 35,
    personGender: "Female",
    incidentType: "Domestic Violence",
    location: "Gerehu Stage 4",
    dateTime: "2024-01-15T09:15:00Z",
    reportingOfficer: "Const. Sarah Kila",
    verifyingOfficer: "Sgt. Michael Namaliu",
    postCommander: "Insp. David Agarobe",
    description: "Domestic violence incident. Suspect brought in for questioning and processing.",
    charges: ["Domestic Violence", "Assault"],
    evidence: {
      documents: 2,
      photos: 4,
      videos: 0
    },
    custody: {
      inCustody: false,
      bail: {
        amount: 500,
        type: "Cash",
        guarantor: "Paul Temu (Brother)"
      }
    },
    amendments: {
      count: 1,
      lastAmended: "2024-01-15T11:30:00Z",
      amendedBy: "Insp. David Agarobe"
    },
    priority: "medium",
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    id: "LOG-2024-003",
    incidentNumber: "INC-2024-003",
    status: "amended",
    type: "incident",
    personName: "Tony Siaguru",
    personAge: 42,
    personGender: "Male",
    incidentType: "Theft",
    location: "Boroko Market",
    dateTime: "2024-01-14T16:20:00Z",
    reportingOfficer: "Const. Helen Bani",
    verifyingOfficer: "Sgt. Lisa Kaupa",
    postCommander: "Insp. David Agarobe",
    description: "Theft of motor vehicle parts. Suspect apprehended and items recovered.",
    charges: ["Theft", "Receiving Stolen Goods"],
    evidence: {
      documents: 4,
      photos: 12,
      videos: 2
    },
    custody: {
      inCustody: false,
      bail: {
        amount: 300,
        type: "Surety",
        guarantor: "Grace Siaguru (Wife)"
      }
    },
    amendments: {
      count: 2,
      lastAmended: "2024-01-15T08:15:00Z",
      amendedBy: "Insp. David Agarobe"
    },
    priority: "medium",
    lastUpdated: "2024-01-15T08:15:00Z"
  }
]

export default function LogBookPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [entries, setEntries] = useState<LogBookEntry[]>(MOCK_LOG_ENTRIES)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  // Filter entries based on search and status
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.incidentType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      "pending": { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      "verified": { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      "amended": { variant: "default" as const, icon: Edit, color: "text-blue-600" },
      "rejected": { variant: "destructive" as const, icon: XCircle, color: "text-red-600" }
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      "low": "secondary" as const,
      "medium": "default" as const,
      "high": "destructive" as const,
      "critical": "destructive" as const
    }
    return variants[priority as keyof typeof variants] || "secondary"
  }

  const canAmend = user.role === "commander" || user.role === "admin"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              Digital Log Book
            </h1>
            <p className="text-gray-600">
              Incident verification, custody logging, and audit trail management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Register
            </Button>
            <Link href="/logbook/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Log Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* Alert for Amendment Authority */}
        {canAmend && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Commander Authority:</strong> You have permission to amend log book entries.
              All amendments will be tracked in the audit trail.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entries.length}</div>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entries.filter(e => e.status === "pending").length}
              </div>
              <p className="text-xs text-yellow-600">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Custody</CardTitle>
              <User className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entries.filter(e => e.custody.inCustody).length}
              </div>
              <p className="text-xs text-red-600">Currently detained</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amendments</CardTitle>
              <Edit className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entries.reduce((sum, e) => sum + e.amendments.count, 0)}
              </div>
              <p className="text-xs text-purple-600">Total amendments</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter Log Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, incident number, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md min-w-32"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="amended">Amended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Log Book Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Log Book Entries ({filteredEntries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntries.map((entry) => {
                const statusConfig = getStatusBadge(entry.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div key={entry.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{entry.personName}</h3>
                          <p className="text-sm text-gray-600">
                            {entry.incidentNumber} • {entry.incidentType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityBadge(entry.priority)}>
                          {entry.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {entry.status.toUpperCase()}
                        </Badge>
                        {entry.custody.inCustody && (
                          <Badge variant="destructive" className="bg-red-600">
                            IN CUSTODY
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-3 text-sm mb-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.dateTime).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {entry.location}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="w-4 h-4" />
                        {entry.reportingOfficer}
                      </div>
                    </div>

                    {/* Charges */}
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Charges: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.charges.map((charge, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {charge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Evidence and Custody Info */}
                    <div className="grid gap-4 md:grid-cols-2 mb-3 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <h4 className="font-medium mb-1">Evidence Attached</h4>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {entry.evidence.documents} docs
                          </span>
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {entry.evidence.photos} photos
                          </span>
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {entry.evidence.videos} videos
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-gray-50 rounded">
                        <h4 className="font-medium mb-1">Custody Status</h4>
                        {entry.custody.inCustody ? (
                          <div>
                            <span className="text-red-600 font-medium">In Custody</span>
                            {entry.custody.cellNumber && (
                              <span className="text-gray-600"> - Cell {entry.custody.cellNumber}</span>
                            )}
                          </div>
                        ) : entry.custody.bail ? (
                          <div>
                            <span className="text-green-600 font-medium">Released on Bail</span>
                            <span className="text-gray-600"> - K{entry.custody.bail.amount} ({entry.custody.bail.type})</span>
                          </div>
                        ) : (
                          <span className="text-gray-600">Not in custody</span>
                        )}
                      </div>
                    </div>

                    {/* Amendment Info */}
                    {entry.amendments.count > 0 && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Edit className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium">
                            {entry.amendments.count} amendment(s) made
                          </span>
                          {entry.amendments.lastAmended && (
                            <span className="text-gray-600">
                              Last: {new Date(entry.amendments.lastAmended).toLocaleString()}
                              {entry.amendments.amendedBy && ` by ${entry.amendments.amendedBy}`}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <Link href={`/logbook/${entry.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </Link>

                      {entry.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      )}

                      {canAmend && (
                        <Button variant="outline" size="sm" className="text-blue-600">
                          <Edit className="w-4 h-4 mr-1" />
                          Amend
                        </Button>
                      )}

                      {entry.custody.inCustody && (
                        <Link href={`/custody/${entry.id}`}>
                          <Button variant="outline" size="sm" className="text-purple-600">
                            <Scale className="w-4 h-4 mr-1" />
                            Custody
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}

              {filteredEntries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No log entries found</h3>
                  <p>No entries match your search criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
