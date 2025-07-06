"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Package,
  Camera,
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Scale,
  Lock,
  Eye,
  Archive
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const EVIDENCE_TYPES = {
  "physical": { label: "Physical Evidence", icon: Package, color: "bg-blue-500" },
  "digital": { label: "Digital Evidence", icon: FileText, color: "bg-purple-500" },
  "photo": { label: "Photographic", icon: Camera, color: "bg-green-500" },
  "document": { label: "Documents", icon: FileText, color: "bg-orange-500" },
  "weapon": { label: "Weapons", icon: Shield, color: "bg-red-500" },
  "drug": { label: "Narcotics", icon: AlertTriangle, color: "bg-red-600" },
  "biological": { label: "Biological", icon: Package, color: "bg-pink-500" }
}

const EVIDENCE_STATUS = {
  "collected": { label: "Collected", color: "bg-blue-500", variant: "default" as const },
  "processing": { label: "Processing", color: "bg-orange-500", variant: "default" as const },
  "analyzed": { label: "Analyzed", color: "bg-green-500", variant: "default" as const },
  "court_ready": { label: "Court Ready", color: "bg-purple-500", variant: "default" as const },
  "in_court": { label: "In Court", color: "bg-red-500", variant: "destructive" as const },
  "returned": { label: "Returned", color: "bg-gray-500", variant: "secondary" as const },
  "destroyed": { label: "Destroyed", color: "bg-black", variant: "secondary" as const }
}

const STORAGE_LOCATIONS = {
  "evidence_room_a": "Evidence Room A - Port Moresby",
  "evidence_room_b": "Evidence Room B - Lae",
  "forensics_lab": "Forensics Laboratory",
  "digital_storage": "Digital Evidence Server",
  "court_custody": "Court Custody",
  "destroyed": "Destroyed/Disposed"
}

// Mock evidence data
const MOCK_EVIDENCE = [
  {
    id: "EVD-2024-001",
    caseId: "CASE-2024-001",
    type: "weapon",
    status: "court_ready",
    description: "Knife used in armed robbery",
    collectedBy: "Det. Johnson",
    collectedDate: "2024-01-15",
    location: "evidence_room_a",
    chainOfCustody: [
      { officer: "Det. Johnson", action: "Collected", date: "2024-01-15 14:30", location: "Crime Scene" },
      { officer: "Forensics Tech", action: "Received", date: "2024-01-15 16:00", location: "Forensics Lab" },
      { officer: "Evidence Clerk", action: "Stored", date: "2024-01-16 09:00", location: "Evidence Room A" }
    ],
    forensicsResults: "Fingerprints found, DNA swab taken",
    photos: 5,
    tags: ["weapon", "fingerprints", "DNA"],
    priority: "high",
    courtDate: "2024-02-15"
  },
  {
    id: "EVD-2024-002",
    caseId: "CASE-2024-002",
    type: "digital",
    status: "processing",
    description: "Laptop computer containing financial records",
    collectedBy: "Det. Kila",
    collectedDate: "2024-01-12",
    location: "digital_storage",
    chainOfCustody: [
      { officer: "Det. Kila", action: "Collected", date: "2024-01-12 10:15", location: "Suspect's Office" },
      { officer: "Digital Forensics", action: "Imaging", date: "2024-01-12 14:00", location: "Cyber Unit" }
    ],
    forensicsResults: "Hard drive imaging in progress",
    photos: 3,
    tags: ["computer", "financial", "fraud"],
    priority: "medium",
    courtDate: null
  },
  {
    id: "EVD-2024-003",
    caseId: "CASE-2024-003",
    type: "photo",
    status: "analyzed",
    description: "Crime scene photographs - tribal fighting",
    collectedBy: "Const. Temu",
    collectedDate: "2024-01-08",
    location: "digital_storage",
    chainOfCustody: [
      { officer: "Const. Temu", action: "Photographed", date: "2024-01-08 15:30", location: "Wabag Crime Scene" },
      { officer: "Evidence Tech", action: "Uploaded", date: "2024-01-08 18:00", location: "Digital Storage" }
    ],
    forensicsResults: "25 high-resolution photos documented",
    photos: 25,
    tags: ["crime_scene", "tribal", "fighting"],
    priority: "medium",
    courtDate: "2024-01-25"
  },
  {
    id: "EVD-2024-004",
    caseId: "CASE-2024-004",
    type: "drug",
    status: "in_court",
    description: "Cocaine seizure - 2.5kg",
    collectedBy: "Insp. Namaliu",
    collectedDate: "2024-01-05",
    location: "court_custody",
    chainOfCustody: [
      { officer: "Insp. Namaliu", action: "Seized", date: "2024-01-05 11:00", location: "Lae Port" },
      { officer: "Drug Lab Tech", action: "Tested", date: "2024-01-06 09:00", location: "Drug Lab" },
      { officer: "Court Officer", action: "Court Transfer", date: "2024-01-20 10:00", location: "National Court" }
    ],
    forensicsResults: "Confirmed 98% purity cocaine",
    photos: 8,
    tags: ["narcotics", "cocaine", "trafficking"],
    priority: "high",
    courtDate: "2024-01-22"
  },
  {
    id: "EVD-2024-005",
    caseId: "CASE-2024-005",
    type: "biological",
    status: "processing",
    description: "Blood samples from assault victim",
    collectedBy: "Det. Bani",
    collectedDate: "2024-01-14",
    location: "forensics_lab",
    chainOfCustody: [
      { officer: "Det. Bani", action: "Collected", date: "2024-01-14 16:45", location: "Crime Scene" },
      { officer: "Forensics Lab", action: "Received", date: "2024-01-14 18:00", location: "Forensics Lab" }
    ],
    forensicsResults: "DNA analysis pending",
    photos: 2,
    tags: ["DNA", "blood", "assault"],
    priority: "high",
    courtDate: null
  }
]

export default function EvidencePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
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

  const filteredEvidence = MOCK_EVIDENCE.filter(evidence => {
    const matchesSearch = evidence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || evidence.type === typeFilter
    const matchesStatus = statusFilter === "all" || evidence.status === statusFilter
    const matchesLocation = locationFilter === "all" || evidence.location === locationFilter

    return matchesSearch && matchesType && matchesStatus && matchesLocation
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evidence Management</h1>
            <p className="text-gray-600">Track physical and digital evidence with chain of custody</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Evidence
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_EVIDENCE.length}</div>
              <p className="text-xs text-muted-foreground">Items tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Processing</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_EVIDENCE.filter(e => e.status === "processing").length}
              </div>
              <p className="text-xs text-muted-foreground">Being analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Court Ready</CardTitle>
              <Scale className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_EVIDENCE.filter(e => e.status === "court_ready").length}
              </div>
              <p className="text-xs text-muted-foreground">Ready for trial</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Court</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {MOCK_EVIDENCE.filter(e => e.status === "in_court").length}
              </div>
              <p className="text-xs text-muted-foreground">Court proceedings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {MOCK_EVIDENCE.filter(e => e.priority === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Digital Items</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_EVIDENCE.filter(e => ["digital", "photo"].includes(e.type)).length}
              </div>
              <p className="text-xs text-muted-foreground">Digital evidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Evidence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search evidence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Evidence Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(EVIDENCE_TYPES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(EVIDENCE_STATUS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Object.entries(STORAGE_LOCATIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Storage Report
              </Button>

              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setTypeFilter("all")
                setStatusFilter("all")
                setLocationFilter("all")
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Table */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Items ({filteredEvidence.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evidence ID</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvidence.map((evidence) => {
                  const TypeIcon = EVIDENCE_TYPES[evidence.type as keyof typeof EVIDENCE_TYPES].icon
                  return (
                    <TableRow key={evidence.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{evidence.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{evidence.caseId}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${EVIDENCE_TYPES[evidence.type as keyof typeof EVIDENCE_TYPES].color}`}>
                            <TypeIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm">{EVIDENCE_TYPES[evidence.type as keyof typeof EVIDENCE_TYPES].label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div>
                          <div className="font-medium truncate">{evidence.description}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {evidence.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {evidence.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{evidence.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={EVIDENCE_STATUS[evidence.status as keyof typeof EVIDENCE_STATUS].variant}>
                            {EVIDENCE_STATUS[evidence.status as keyof typeof EVIDENCE_STATUS].label}
                          </Badge>
                          {evidence.priority === "high" && (
                            <Badge variant="destructive" className="text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {STORAGE_LOCATIONS[evidence.location as keyof typeof STORAGE_LOCATIONS]}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Chain of Custody: {evidence.chainOfCustody.length} entries
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            {evidence.collectedBy}
                          </div>
                          <div className="text-xs text-gray-500">{evidence.collectedDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{evidence.collectedDate}</div>
                          {evidence.courtDate && (
                            <div className="text-xs text-purple-600">
                              Court: {evidence.courtDate}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
