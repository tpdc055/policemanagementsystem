"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  AlertTriangle,
  Calendar,
  Clock,
  Eye,
  Filter,
  FileText,
  Plus,
  Search,
  User,
  UserCheck,
  Scale,
  CheckCircle,
  XCircle,
  Timer
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const CASE_TYPES = {
  "criminal": "Criminal Investigation",
  "civil": "Civil Matter",
  "missing_person": "Missing Person",
  "fraud": "Fraud Investigation",
  "cybercrime": "Cybercrime",
  "domestic_violence": "Domestic Violence",
  "trafficking": "Human/Drug Trafficking",
  "corruption": "Anti-Corruption",
  "terrorism": "Counter-Terrorism",
  "organized_crime": "Organized Crime"
}

const CASE_PRIORITIES = {
  "critical": { label: "Critical", color: "bg-red-500", variant: "destructive" as const },
  "high": { label: "High", color: "bg-orange-500", variant: "default" as const },
  "medium": { label: "Medium", color: "bg-yellow-500", variant: "secondary" as const },
  "low": { label: "Low", color: "bg-green-500", variant: "outline" as const }
}

const CASE_STATUS = {
  "open": { label: "Open", color: "bg-blue-500", variant: "default" as const, icon: Timer },
  "investigating": { label: "Under Investigation", color: "bg-orange-500", variant: "default" as const, icon: Search },
  "pending": { label: "Pending Review", color: "bg-yellow-500", variant: "secondary" as const, icon: Clock },
  "court": { label: "In Court", color: "bg-purple-500", variant: "default" as const, icon: Scale },
  "closed": { label: "Closed", color: "bg-green-500", variant: "default" as const, icon: CheckCircle },
  "dismissed": { label: "Dismissed", color: "bg-gray-500", variant: "secondary" as const, icon: XCircle }
}

// Mock case data - in real app this would come from database
const MOCK_CASES = [
  {
    id: "CASE-2024-001",
    title: "Armed Robbery Investigation - Port Moresby Bank",
    type: "criminal",
    priority: "critical",
    status: "investigating",
    leadDetective: "Det. Sarah Johnson",
    assignedOfficers: ["Det. Michael Kila", "Const. Peter Namaliu"],
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    incidentId: "INC-2024-001",
    location: "Port Moresby Central",
    description: "Armed robbery at ANZ Bank, 3 suspects, firearms involved",
    evidenceCount: 12,
    witnessCount: 5,
    suspectCount: 3
  },
  {
    id: "CASE-2024-002",
    title: "Missing Person - Mary Tamate",
    type: "missing_person",
    priority: "high",
    status: "open",
    leadDetective: "Det. James Wanma",
    assignedOfficers: ["Const. Lisa Kaupa"],
    createdDate: "2024-01-12",
    lastUpdated: "2024-01-15",
    incidentId: "INC-2024-004",
    location: "Mt. Hagen",
    description: "8-year-old child missing for 3 days",
    evidenceCount: 4,
    witnessCount: 8,
    suspectCount: 0
  },
  {
    id: "CASE-2024-003",
    title: "Fraud Investigation - Government Contracts",
    type: "fraud",
    priority: "high",
    status: "investigating",
    leadDetective: "Det. Robert Mendi",
    assignedOfficers: ["Det. Grace Temu", "Const. David Bani"],
    createdDate: "2024-01-05",
    lastUpdated: "2024-01-14",
    incidentId: "INC-2024-002",
    location: "Waigani",
    description: "Suspected contract fraud involving K2.5M",
    evidenceCount: 25,
    witnessCount: 12,
    suspectCount: 5
  },
  {
    id: "CASE-2024-004",
    title: "Tribal Conflict Resolution - Enga Province",
    type: "criminal",
    priority: "medium",
    status: "pending",
    leadDetective: "Det. Paul Wapenamanda",
    assignedOfficers: ["Sgt. Joseph Lakane"],
    createdDate: "2024-01-08",
    lastUpdated: "2024-01-13",
    incidentId: "INC-2024-003",
    location: "Wabag, Enga",
    description: "Inter-tribal fighting, 2 casualties",
    evidenceCount: 8,
    witnessCount: 15,
    suspectCount: 12
  },
  {
    id: "CASE-2024-005",
    title: "Drug Trafficking Network Investigation",
    type: "trafficking",
    priority: "critical",
    status: "investigating",
    leadDetective: "Det. Maria Bani",
    assignedOfficers: ["Det. Tony Agarobe", "Const. Helen Siaguru"],
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-15",
    incidentId: "INC-2024-005",
    location: "Lae Port",
    description: "International drug trafficking operation",
    evidenceCount: 35,
    witnessCount: 6,
    suspectCount: 8
  }
]

export default function CasesPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [detectiveFilter, setDetectiveFilter] = useState("all")
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

  const filteredCases = MOCK_CASES.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || case_.type === typeFilter
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    const matchesPriority = priorityFilter === "all" || case_.priority === priorityFilter
    const matchesDetective = detectiveFilter === "all" || case_.leadDetective === detectiveFilter

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesDetective
  })

  const uniqueDetectives = [...new Set(MOCK_CASES.map(case_ => case_.leadDetective))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
            <p className="text-gray-600">Manage and track all investigation cases</p>
          </div>
          <Link href="/cases/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Case
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_CASES.length}</div>
              <p className="text-xs text-muted-foreground">Active investigations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {MOCK_CASES.filter(c => c.priority === "critical").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
              <Search className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_CASES.filter(c => c.status === "investigating").length}
              </div>
              <p className="text-xs text-muted-foreground">Active investigations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Court</CardTitle>
              <Scale className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_CASES.filter(c => c.status === "court").length}
              </div>
              <p className="text-xs text-muted-foreground">Court proceedings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Cases</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {MOCK_CASES.filter(c => c.status === "closed").length}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Case Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(CASE_TYPES).map(([key, label]) => (
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
                  {Object.entries(CASE_STATUS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {Object.entries(CASE_PRIORITIES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={detectiveFilter} onValueChange={setDetectiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Detective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Detectives</SelectItem>
                  {uniqueDetectives.map((detective) => (
                    <SelectItem key={detective} value={detective}>{detective}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setTypeFilter("all")
                setStatusFilter("all")
                setPriorityFilter("all")
                setDetectiveFilter("all")
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Investigation Cases ({filteredCases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lead Detective</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((case_) => {
                  const StatusIcon = CASE_STATUS[case_.status as keyof typeof CASE_STATUS].icon
                  return (
                    <TableRow key={case_.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{case_.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div>
                          <div className="font-medium truncate">{case_.title}</div>
                          <div className="text-sm text-gray-500">{case_.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CASE_TYPES[case_.type as keyof typeof CASE_TYPES]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={CASE_PRIORITIES[case_.priority as keyof typeof CASE_PRIORITIES].variant}>
                          {CASE_PRIORITIES[case_.priority as keyof typeof CASE_PRIORITIES].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <Badge variant={CASE_STATUS[case_.status as keyof typeof CASE_STATUS].variant}>
                            {CASE_STATUS[case_.status as keyof typeof CASE_STATUS].label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-gray-400" />
                          {case_.leadDetective}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{case_.evidenceCount} items</div>
                          <div className="text-gray-500">{case_.witnessCount} witnesses</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {case_.lastUpdated}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Link href={`/cases/${case_.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
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
