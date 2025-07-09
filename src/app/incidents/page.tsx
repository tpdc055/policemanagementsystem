"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  MapPin,
  UserIcon,
  FileText,
  Phone,
  Calendar,
  Shield,
  Car,
  Users,
  Target,
  Activity
} from "lucide-react"
import type { User } from "@/types/user"

// Mock incident data
const MOCK_INCIDENTS = [
  {
    id: "INC-2024-001",
    type: "Armed Robbery",
    location: "Boroko Market, NCD",
    status: "Under Investigation",
    priority: "High",
    reportedBy: "Officer Temu",
    reportedAt: "2024-01-15 14:30",
    assignedTo: "Detective Kila",
    description: "Armed robbery at market stall. Suspect fled on foot.",
    witnesses: 3,
    evidence: 2
  },
  {
    id: "INC-2024-002",
    type: "Domestic Violence",
    location: "Gerehu Stage 4, NCD",
    status: "Resolved",
    priority: "Medium",
    reportedBy: "Officer Namaliu",
    reportedAt: "2024-01-15 11:15",
    assignedTo: "Sergeant Bani",
    description: "Domestic dispute resolved. Counseling referred.",
    witnesses: 2,
    evidence: 1
  },
  {
    id: "INC-2024-003",
    type: "Traffic Accident",
    location: "Independence Drive, NCD",
    status: "Pending Review",
    priority: "Low",
    reportedBy: "Officer Kambu",
    reportedAt: "2024-01-15 09:45",
    assignedTo: "Traffic Unit",
    description: "Minor vehicle collision. No injuries reported.",
    witnesses: 4,
    evidence: 3
  },
  {
    id: "INC-2024-004",
    type: "Breaking & Entering",
    location: "3-Mile Settlement, NCD",
    status: "Active",
    priority: "High",
    reportedBy: "Civilian Report",
    reportedAt: "2024-01-14 22:30",
    assignedTo: "Detective Agarobe",
    description: "House broken into while family away. Electronics stolen.",
    witnesses: 1,
    evidence: 4
  },
  {
    id: "INC-2024-005",
    type: "Public Disturbance",
    location: "Gordon Market, NCD",
    status: "Closed",
    priority: "Low",
    reportedBy: "Officer Mendi",
    reportedAt: "2024-01-14 16:20",
    assignedTo: "Patrol Unit 7",
    description: "Noise complaint resolved. Warning issued.",
    witnesses: 0,
    evidence: 0
  }
]

const INCIDENT_TYPES = [
  "Armed Robbery", "Domestic Violence", "Traffic Accident", "Breaking & Entering",
  "Public Disturbance", "Assault", "Theft", "Drug Related", "Missing Person",
  "Tribal Fighting", "Fraud", "Vandalism", "Noise Complaint"
]

const STATUS_OPTIONS = ["All", "Active", "Under Investigation", "Pending Review", "Resolved", "Closed"]
const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"]

export default function IncidentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || incident.status === statusFilter
    const matchesPriority = priorityFilter === "All" || incident.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-red-500"
      case "Under Investigation": return "bg-orange-500"
      case "Pending Review": return "bg-yellow-500"
      case "Resolved": return "bg-green-500"
      case "Closed": return "bg-gray-500"
      default: return "bg-blue-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50"
      case "Medium": return "text-orange-600 bg-orange-50"
      case "Low": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
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
            <h1 className="text-3xl font-bold text-gray-900">Incident Management</h1>
            <p className="text-gray-600">Track and manage police incidents across Papua New Guinea</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/incidents/missing-person">
                <UserIcon className="w-4 h-4 mr-2" />
                Missing Person
              </Link>
            </Button>
            <Button asChild>
              <Link href="/incidents/new">
                <Plus className="w-4 h-4 mr-2" />
                Report Incident
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {incidents.filter(i => i.status === "Active").length}
              </div>
              <p className="text-xs text-red-600">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
              <Search className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {incidents.filter(i => i.status === "Under Investigation").length}
              </div>
              <p className="text-xs text-orange-600">Being actively investigated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Reports</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {incidents.filter(i => i.reportedAt.includes("2024-01-15")).length}
              </div>
              <p className="text-xs text-blue-600">New incidents today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-green-600">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Incident Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Actions</label>
                <Button variant="outline" className="w-full">
                  <Activity className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Incidents ({filteredIncidents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.id}</TableCell>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {incident.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(incident.status)} text-white`}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(incident.priority)}>
                          {incident.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {incident.reportedAt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Incident Detail Modal/Card */}
        {selectedIncident && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Incident Details: {selectedIncident.id}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="font-medium">{selectedIncident.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="font-medium">{selectedIncident.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={`${getStatusColor(selectedIncident.status)} text-white`}>
                      {selectedIncident.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm">{selectedIncident.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reported By</label>
                    <p className="font-medium">{selectedIncident.reportedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Assigned To</label>
                    <p className="font-medium">{selectedIncident.assignedTo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <Badge variant="outline" className={getPriorityColor(selectedIncident.priority)}>
                      {selectedIncident.priority}
                    </Badge>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Witnesses</label>
                      <p className="font-medium">{selectedIncident.witnesses}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Evidence Items</label>
                      <p className="font-medium">{selectedIncident.evidence}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
