"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Users,
  Calendar,
  Eye,
  Filter,
  Plus,
  Search,
  Shield,
  BookOpen,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  User,
  GraduationCap
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const RANKS = {
  "commissioner": { label: "Commissioner", level: 9, color: "bg-purple-600" },
  "deputy_commissioner": { label: "Deputy Commissioner", level: 8, color: "bg-purple-500" },
  "assistant_commissioner": { label: "Assistant Commissioner", level: 7, color: "bg-blue-600" },
  "chief_superintendent": { label: "Chief Superintendent", level: 6, color: "bg-blue-500" },
  "superintendent": { label: "Superintendent", level: 5, color: "bg-blue-400" },
  "chief_inspector": { label: "Chief Inspector", level: 4, color: "bg-green-600" },
  "inspector": { label: "Inspector", level: 3, color: "bg-green-500" },
  "sergeant": { label: "Sergeant", level: 2, color: "bg-orange-500" },
  "constable": { label: "Constable", level: 1, color: "bg-gray-500" }
}

const DEPARTMENTS = {
  "general_duties": "General Duties",
  "cid": "Criminal Investigation Department",
  "traffic": "Traffic Division",
  "forensics": "Forensics Unit",
  "cyber": "Cybercrime Unit",
  "narcotics": "Narcotics Division",
  "special_operations": "Special Operations",
  "community": "Community Relations",
  "internal_affairs": "Internal Affairs",
  "administration": "Administration"
}

const STATUS_OPTIONS = {
  "active": { label: "Active Duty", color: "bg-green-500", variant: "default" as const },
  "training": { label: "In Training", color: "bg-blue-500", variant: "default" as const },
  "leave": { label: "On Leave", color: "bg-yellow-500", variant: "secondary" as const },
  "suspended": { label: "Suspended", color: "bg-red-500", variant: "destructive" as const },
  "retired": { label: "Retired", color: "bg-gray-500", variant: "secondary" as const },
  "medical": { label: "Medical Leave", color: "bg-orange-500", variant: "default" as const }
}

// Mock personnel data
const MOCK_PERSONNEL = [
  {
    id: "OFF-001",
    badgeNumber: "PNG12345",
    firstName: "Sarah",
    lastName: "Johnson",
    rank: "inspector",
    department: "cid",
    status: "active",
    dateJoined: "2018-03-15",
    lastPromotion: "2022-01-10",
    station: "Port Moresby Central",
    email: "s.johnson@police.gov.pg",
    phone: "+675 325 8901",
    emergencyContact: "John Johnson - +675 325 8902",
    specializations: ["Fraud Investigation", "Financial Crime"],
    trainingCompleted: ["Advanced Detective Course", "Financial Crime Investigation"],
    trainingDue: ["Crisis Negotiation"],
    performanceRating: "Excellent",
    commendations: 3,
    disciplinaryActions: 0,
    yearsOfService: 6,
    photo: null
  },
  {
    id: "OFF-002",
    badgeNumber: "PNG67890",
    firstName: "Michael",
    lastName: "Kila",
    rank: "sergeant",
    department: "general_duties",
    status: "active",
    dateJoined: "2020-06-20",
    lastPromotion: "2023-06-20",
    station: "Lae Station",
    email: "m.kila@police.gov.pg",
    phone: "+675 472 1234",
    emergencyContact: "Grace Kila - +675 472 1235",
    specializations: ["Community Policing", "Youth Engagement"],
    trainingCompleted: ["Basic Police Training", "Community Relations"],
    trainingDue: ["Firearms Recertification"],
    performanceRating: "Good",
    commendations: 1,
    disciplinaryActions: 0,
    yearsOfService: 4,
    photo: null
  },
  {
    id: "OFF-003",
    badgeNumber: "PNG11111",
    firstName: "Grace",
    lastName: "Temu",
    rank: "constable",
    department: "cyber",
    status: "training",
    dateJoined: "2023-01-15",
    lastPromotion: null,
    station: "Mt. Hagen Station",
    email: "g.temu@police.gov.pg",
    phone: "+675 542 3456",
    emergencyContact: "Paul Temu - +675 542 3457",
    specializations: ["Cybercrime", "Digital Forensics"],
    trainingCompleted: ["Basic Police Training"],
    trainingDue: ["Advanced Cybercrime Investigation", "Digital Evidence Handling"],
    performanceRating: "Good",
    commendations: 0,
    disciplinaryActions: 0,
    yearsOfService: 1,
    photo: null
  },
  {
    id: "OFF-004",
    badgeNumber: "PNG22222",
    firstName: "Robert",
    lastName: "Namaliu",
    rank: "chief_inspector",
    department: "narcotics",
    status: "active",
    dateJoined: "2015-08-10",
    lastPromotion: "2021-08-10",
    station: "Port Moresby Central",
    email: "r.namaliu@police.gov.pg",
    phone: "+675 325 7890",
    emergencyContact: "Mary Namaliu - +675 325 7891",
    specializations: ["Drug Enforcement", "Organized Crime"],
    trainingCompleted: ["Advanced Narcotics Investigation", "Undercover Operations"],
    trainingDue: ["Leadership Development"],
    performanceRating: "Excellent",
    commendations: 5,
    disciplinaryActions: 0,
    yearsOfService: 9,
    photo: null
  },
  {
    id: "OFF-005",
    badgeNumber: "PNG33333",
    firstName: "Maria",
    lastName: "Bani",
    rank: "constable",
    department: "traffic",
    status: "leave",
    dateJoined: "2022-02-01",
    lastPromotion: null,
    station: "Vanimo Station",
    email: "m.bani@police.gov.pg",
    phone: "+675 857 4567",
    emergencyContact: "Peter Bani - +675 857 4568",
    specializations: ["Traffic Enforcement", "Road Safety"],
    trainingCompleted: ["Basic Police Training", "Traffic Law Enforcement"],
    trainingDue: ["Accident Investigation"],
    performanceRating: "Good",
    commendations: 0,
    disciplinaryActions: 0,
    yearsOfService: 2,
    photo: null
  }
]

export default function PersonnelPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [rankFilter, setRankFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
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

  const filteredPersonnel = MOCK_PERSONNEL.filter(officer => {
    const fullName = `${officer.firstName} ${officer.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         officer.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.station.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRank = rankFilter === "all" || officer.rank === rankFilter
    const matchesDepartment = departmentFilter === "all" || officer.department === departmentFilter
    const matchesStatus = statusFilter === "all" || officer.status === statusFilter

    return matchesSearch && matchesRank && matchesDepartment && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Personnel Administration</h1>
            <p className="text-gray-600">Manage officer records, training, and human resources</p>
          </div>
          <div className="flex gap-2">
            <Link href="/personnel/training">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Training Schedule
              </Button>
            </Link>
            <Link href="/personnel/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Officer
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_PERSONNEL.length}</div>
              <p className="text-xs text-muted-foreground">Active personnel</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Duty</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {MOCK_PERSONNEL.filter(o => o.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Active duty</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Training</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {MOCK_PERSONNEL.filter(o => o.status === "training").length}
              </div>
              <p className="text-xs text-muted-foreground">Training programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {MOCK_PERSONNEL.filter(o => ["leave", "medical"].includes(o.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">Various leave types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(MOCK_PERSONNEL.reduce((sum, o) => sum + o.yearsOfService, 0) / MOCK_PERSONNEL.length)}y
              </div>
              <p className="text-xs text-muted-foreground">Years of service</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Due</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_PERSONNEL.reduce((sum, o) => sum + o.trainingDue.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Pending certifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Personnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search officers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  {Object.entries(RANKS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {Object.entries(DEPARTMENTS).map(([key, label]) => (
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
                  {Object.entries(STATUS_OPTIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setRankFilter("all")
                setDepartmentFilter("all")
                setStatusFilter("all")
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personnel Table */}
        <Card>
          <CardHeader>
            <CardTitle>Personnel Records ({filteredPersonnel.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Badge Number</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Training</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((officer) => (
                  <TableRow key={officer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={officer.photo || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {officer.firstName[0]}{officer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{officer.badgeNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{officer.firstName} {officer.lastName}</div>
                        <div className="text-sm text-gray-500">{officer.yearsOfService} years service</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={RANKS[officer.rank as keyof typeof RANKS].color}>
                        {RANKS[officer.rank as keyof typeof RANKS].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {DEPARTMENTS[officer.department as keyof typeof DEPARTMENTS]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_OPTIONS[officer.status as keyof typeof STATUS_OPTIONS].variant}>
                        {STATUS_OPTIONS[officer.status as keyof typeof STATUS_OPTIONS].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{officer.station}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          {officer.performanceRating === "Excellent" ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : officer.performanceRating === "Good" ? (
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          )}
                          {officer.performanceRating}
                        </div>
                        <div className="text-xs text-gray-500">{officer.commendations} commendations</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-green-600">{officer.trainingCompleted.length} completed</div>
                        <div className="text-orange-600">{officer.trainingDue.length} due</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/personnel/${officer.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
