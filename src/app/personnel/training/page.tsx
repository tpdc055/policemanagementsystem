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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  Download,
  Search,
  GraduationCap,
  Target,
  Shield,
  Zap,
  FileText,
  User,
  MapPin
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// TypeScript interfaces for training data
interface ExpiringCertification {
  name: string
  issueDate: string
  expiryDate: string
  status: string
  officerName: string
  officerId: string
}

const TRAINING_CATEGORIES = {
  "basic": "Basic Training",
  "advanced": "Advanced Skills",
  "specialized": "Specialized Units",
  "leadership": "Leadership Development",
  "technical": "Technical Skills",
  "legal": "Legal Updates",
  "safety": "Safety & Procedures",
  "community": "Community Relations",
  "firearms": "Firearms & Weapons",
  "investigation": "Investigation Techniques"
}

const TRAINING_STATUS = {
  "scheduled": { label: "Scheduled", color: "bg-blue-500", variant: "default" as const },
  "in_progress": { label: "In Progress", color: "bg-orange-500", variant: "default" as const },
  "completed": { label: "Completed", color: "bg-green-500", variant: "default" as const },
  "cancelled": { label: "Cancelled", color: "bg-gray-500", variant: "secondary" as const },
  "overdue": { label: "Overdue", color: "bg-red-500", variant: "destructive" as const }
}

const CERTIFICATION_STATUS = {
  "current": { label: "Current", color: "bg-green-500", variant: "default" as const },
  "expiring": { label: "Expiring Soon", color: "bg-yellow-500", variant: "default" as const },
  "expired": { label: "Expired", color: "bg-red-500", variant: "destructive" as const },
  "pending": { label: "Pending", color: "bg-blue-500", variant: "default" as const }
}

// Mock training data
const MOCK_TRAINING_SCHEDULE = [
  {
    id: "TRN-001",
    title: "Firearms Recertification",
    category: "firearms",
    instructor: "Sgt. Michael Weapons",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    duration: "3 days",
    location: "Police Training Academy - Port Moresby",
    maxParticipants: 20,
    enrolled: 18,
    status: "scheduled",
    description: "Annual firearms safety and proficiency certification",
    prerequisites: ["Basic Firearms Training"],
    certificationAwarded: "Firearms Certification",
    isRequired: true
  },
  {
    id: "TRN-002",
    title: "Community Policing Workshop",
    category: "community",
    instructor: "Insp. Grace Relations",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    duration: "3 days",
    location: "Lae Police Station",
    maxParticipants: 25,
    enrolled: 22,
    status: "in_progress",
    description: "Building better relationships with PNG communities",
    prerequisites: ["Basic Police Training"],
    certificationAwarded: "Community Relations Certificate",
    isRequired: false
  },
  {
    id: "TRN-003",
    title: "Digital Evidence Collection",
    category: "technical",
    instructor: "Det. Peter Cyber",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    duration: "3 days",
    location: "Cybercrime Unit - Port Moresby",
    maxParticipants: 15,
    enrolled: 15,
    status: "completed",
    description: "Modern techniques for digital evidence handling",
    prerequisites: ["Basic Investigation Course"],
    certificationAwarded: "Digital Evidence Specialist",
    isRequired: false
  },
  {
    id: "TRN-004",
    title: "First Aid & Emergency Response",
    category: "safety",
    instructor: "Paramedic John Emergency",
    startDate: "2024-01-25",
    endDate: "2024-01-26",
    duration: "2 days",
    location: "Police Training Academy - Port Moresby",
    maxParticipants: 30,
    enrolled: 28,
    status: "scheduled",
    description: "Basic first aid and emergency medical response",
    prerequisites: [],
    certificationAwarded: "First Aid Certification",
    isRequired: true
  },
  {
    id: "TRN-005",
    title: "Leadership Development Program",
    category: "leadership",
    instructor: "Comm. Sarah Leadership",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    duration: "5 days",
    location: "PNG Police Headquarters",
    maxParticipants: 12,
    enrolled: 10,
    status: "scheduled",
    description: "Advanced leadership skills for senior officers",
    prerequisites: ["5+ years experience", "Supervisory role"],
    certificationAwarded: "Leadership Certificate",
    isRequired: false
  }
]

// Mock officer certifications
const MOCK_CERTIFICATIONS = [
  {
    officerId: "OFF-001",
    officerName: "Const. John Mendi",
    certifications: [
      { name: "Basic Police Training", issueDate: "2020-03-15", expiryDate: "2025-03-15", status: "current" },
      { name: "Firearms Certification", issueDate: "2023-01-20", expiryDate: "2024-01-20", status: "expiring" },
      { name: "First Aid Certification", issueDate: "2022-06-10", expiryDate: "2024-06-10", status: "current" }
    ]
  },
  {
    officerId: "OFF-002",
    officerName: "Det. Sarah Johnson",
    certifications: [
      { name: "Detective Training", issueDate: "2019-08-15", expiryDate: "2024-08-15", status: "current" },
      { name: "Digital Evidence Specialist", issueDate: "2024-01-12", expiryDate: "2027-01-12", status: "current" },
      { name: "Interview Techniques", issueDate: "2021-03-20", expiryDate: "2023-03-20", status: "expired" }
    ]
  },
  {
    officerId: "OFF-003",
    officerName: "Sgt. Maria Bani",
    certifications: [
      { name: "Supervisory Training", issueDate: "2022-05-10", expiryDate: "2025-05-10", status: "current" },
      { name: "Community Relations Certificate", issueDate: "2024-01-17", expiryDate: "2027-01-17", status: "current" },
      { name: "Traffic Law Enforcement", issueDate: "2020-09-15", expiryDate: "2023-09-15", status: "expired" }
    ]
  }
]

export default function TrainingSchedulePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [activeTab, setActiveTab] = useState("schedule")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
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

  const filteredTraining = MOCK_TRAINING_SCHEDULE.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || training.category === categoryFilter
    const matchesStatus = statusFilter === "all" || training.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getExpiringCertifications = () => {
    const expiring: ExpiringCertification[] = []
    MOCK_CERTIFICATIONS.forEach(officer => {
      officer.certifications.forEach(cert => {
        if (cert.status === "expiring" || cert.status === "expired") {
          expiring.push({
            ...cert,
            officerName: officer.officerName,
            officerId: officer.officerId
          })
        }
      })
    })
    return expiring
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training & Certification</h1>
            <p className="text-gray-600">Manage training schedules and track officer certifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Training
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Training</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {MOCK_TRAINING_SCHEDULE.filter(t => t.status === "in_progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {MOCK_TRAINING_SCHEDULE.filter(t => t.status === "scheduled").length}
              </div>
              <p className="text-xs text-muted-foreground">Upcoming sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrollment</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_TRAINING_SCHEDULE.reduce((sum, t) => sum + t.enrolled, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_CERTIFICATIONS.reduce((sum, officer) => sum + officer.certifications.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Active certifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {getExpiringCertifications().length}
              </div>
              <p className="text-xs text-muted-foreground">Need renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts for Expiring Certifications */}
        {getExpiringCertifications().length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Certification Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getExpiringCertifications().slice(0, 3).map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="font-medium">{cert.officerName}</span>
                      <span className="text-gray-600 ml-2">- {cert.name}</span>
                    </div>
                    <Badge variant={cert.status === "expired" ? "destructive" : "default"}>
                      {cert.status === "expired" ? "Expired" : "Expiring"} {cert.expiryDate}
                    </Badge>
                  </div>
                ))}
                {getExpiringCertifications().length > 3 && (
                  <p className="text-sm text-orange-700">
                    +{getExpiringCertifications().length - 3} more certifications need attention
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">Training Schedule</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Training Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search training..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(TRAINING_CATEGORIES).map(([key, label]) => (
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
                      {Object.entries(TRAINING_STATUS).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                    setStatusFilter("all")
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Training Schedule Table */}
            <Card>
              <CardHeader>
                <CardTitle>Training Schedule ({filteredTraining.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Training</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTraining.map((training) => (
                      <TableRow key={training.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{training.title}</div>
                            <div className="text-sm text-gray-500">{training.id}</div>
                            {training.isRequired && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Required
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {TRAINING_CATEGORIES[training.category as keyof typeof TRAINING_CATEGORIES]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-400" />
                            {training.instructor}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{training.startDate} - {training.endDate}</div>
                            <div className="text-gray-500">{training.duration}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {training.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{training.enrolled}/{training.maxParticipants}</div>
                            <div className="text-gray-500">
                              {Math.round((training.enrolled / training.maxParticipants) * 100)}% full
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={TRAINING_STATUS[training.status as keyof typeof TRAINING_STATUS].variant}>
                            {TRAINING_STATUS[training.status as keyof typeof TRAINING_STATUS].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <BookOpen className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Users className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Officer Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {MOCK_CERTIFICATIONS.map((officer) => (
                    <div key={officer.officerId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{officer.officerName}</h3>
                          <p className="text-sm text-gray-600">ID: {officer.officerId}</p>
                        </div>
                        <Badge variant="outline">
                          {officer.certifications.length} Certifications
                        </Badge>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {officer.certifications.map((cert, index) => (
                          <div key={index} className="p-3 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{cert.name}</h4>
                              <Badge variant={CERTIFICATION_STATUS[cert.status as keyof typeof CERTIFICATION_STATUS].variant}>
                                {CERTIFICATION_STATUS[cert.status as keyof typeof CERTIFICATION_STATUS].label}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Issued: {cert.issueDate}</div>
                              <div>Expires: {cert.expiryDate}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Training Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-medium">Required Training Compliance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Firearms Certification</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }} />
                          </div>
                          <span className="text-sm">85%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>First Aid Certification</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }} />
                          </div>
                          <span className="text-sm">65%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Legal Updates</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "40%" }} />
                          </div>
                          <span className="text-sm">40%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Upcoming Requirements</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded bg-red-50 border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-800">Urgent</span>
                        </div>
                        <p className="text-sm">12 officers need firearms recertification within 30 days</p>
                      </div>

                      <div className="p-3 border rounded bg-orange-50 border-orange-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Due Soon</span>
                        </div>
                        <p className="text-sm">8 officers need first aid renewal within 60 days</p>
                      </div>

                      <div className="p-3 border rounded bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Scheduled</span>
                        </div>
                        <p className="text-sm">Annual legal update training in 90 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Training Completion Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Q4 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 h-2 rounded-full w-16" />
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Q3 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 h-2 rounded-full w-14" />
                        <span className="text-sm">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Q2 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-12" />
                        <span className="text-sm">78%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Popular Training Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Firearms & Weapons</span>
                      <Badge variant="default">45 officers</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Investigation Techniques</span>
                      <Badge variant="default">32 officers</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Community Relations</span>
                      <Badge variant="default">28 officers</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Technical Skills</span>
                      <Badge variant="default">22 officers</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Training Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 text-center">
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-600">Officers Trained (YTD)</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-gray-600">Training Sessions</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold text-orange-600">92%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
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
