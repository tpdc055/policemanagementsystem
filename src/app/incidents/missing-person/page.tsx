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
  User,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Camera,
  Users,
  Search,
  Calendar,
  Send,
  CheckCircle,
  Eye,
  Upload,
  Megaphone,
  Shield,
  Target,
  Activity
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const PNG_PROVINCES = [
  "National Capital District", "Western Province", "Gulf Province", "Central Province",
  "Milne Bay Province", "Oro Province", "Southern Highlands Province", "Western Highlands Province",
  "Enga Province", "Simbu Province", "Eastern Highlands Province", "Morobe Province",
  "Madang Province", "East Sepik Province", "West Sepik Province", "Manus Province",
  "New Ireland Province", "East New Britain Province", "West New Britain Province",
  "Bougainville Province"
]

const MISSING_CATEGORIES = {
  "child": { label: "Missing Child", priority: "critical", color: "bg-red-600", amber: true },
  "adult": { label: "Missing Adult", priority: "high", color: "bg-orange-500", amber: false },
  "elderly": { label: "Missing Elderly", priority: "high", color: "bg-red-500", amber: false },
  "vulnerable": { label: "Vulnerable Person", priority: "critical", color: "bg-red-700", amber: true },
  "endangered": { label: "Endangered Missing", priority: "critical", color: "bg-red-800", amber: true }
}

const CIRCUMSTANCES = [
  "Last seen at home", "Last seen at school", "Last seen at work", "Last seen with friends",
  "Left for walk/exercise", "Went to market/shopping", "Family dispute", "Mental health concerns",
  "Medical emergency", "Possible abduction", "Runaway", "Lost while traveling",
  "Tribal/family conflict", "Sorcery accusations", "Unknown circumstances"
]

// Mock missing persons data
const MOCK_MISSING_PERSONS = [
  {
    id: "MP-2024-001",
    name: "Mary Kaupa",
    age: 8,
    gender: "Female",
    category: "child",
    reportDate: "2024-01-15",
    lastSeen: "2024-01-14 16:00",
    location: "Gerehu Primary School, Port Moresby",
    province: "National Capital District",
    description: "Small girl, short black hair, wearing blue school uniform and black shoes",
    circumstances: "Last seen leaving school, never arrived home",
    reportedBy: "Grace Kaupa (Mother)",
    reporterPhone: "+675 325 8901",
    caseOfficer: "Det. Sarah Johnson",
    status: "active",
    amberAlert: true,
    mediaAttention: true,
    searchTeams: 3,
    tips: 12,
    lastUpdate: "2024-01-15 14:30"
  },
  {
    id: "MP-2024-002",
    name: "Peter Temu",
    age: 45,
    gender: "Male",
    category: "adult",
    reportDate: "2024-01-12",
    lastSeen: "2024-01-11 08:00",
    location: "Mt. Hagen Market",
    province: "Western Highlands Province",
    description: "Medium build, beard, wearing red shirt and blue jeans",
    circumstances: "Went to market for business, never returned home",
    reportedBy: "Maria Temu (Wife)",
    reporterPhone: "+675 542 7890",
    caseOfficer: "Const. Michael Kila",
    status: "active",
    amberAlert: false,
    mediaAttention: false,
    searchTeams: 1,
    tips: 5,
    lastUpdate: "2024-01-14 10:15"
  },
  {
    id: "MP-2024-003",
    name: "Joseph Namaliu",
    age: 72,
    gender: "Male",
    category: "elderly",
    reportDate: "2024-01-10",
    lastSeen: "2024-01-09 19:00",
    location: "Lae Township",
    province: "Morobe Province",
    description: "Elderly man, gray hair, walks with cane, wearing traditional clothing",
    circumstances: "Has dementia, wandered from home during evening",
    reportedBy: "David Namaliu (Son)",
    reporterPhone: "+675 472 1234",
    caseOfficer: "Sgt. Grace Bani",
    status: "found",
    amberAlert: false,
    mediaAttention: true,
    searchTeams: 2,
    tips: 8,
    lastUpdate: "2024-01-11 06:45",
    foundDate: "2024-01-11",
    foundLocation: "Lae Market - found safe"
  },
  {
    id: "MP-2024-004",
    name: "Susan Mendi",
    age: 16,
    gender: "Female",
    category: "vulnerable",
    reportDate: "2024-01-08",
    lastSeen: "2024-01-07 20:00",
    location: "Vanimo High School",
    province: "West Sepik Province",
    description: "Teenage girl, long hair, wearing school clothes, has medical condition",
    circumstances: "Did not return home after school, has diabetes requiring medication",
    reportedBy: "Paul Mendi (Father)",
    reporterPhone: "+675 857 5678",
    caseOfficer: "Const. Helen Siaguru",
    status: "active",
    amberAlert: true,
    mediaAttention: true,
    searchTeams: 2,
    tips: 15,
    lastUpdate: "2024-01-14 16:20"
  }
]

export default function MissingPersonPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [activeTab, setActiveTab] = useState("active")
  const [selectedCase, setSelectedCase] = useState<typeof MOCK_MISSING_PERSONS[0] | null>(null)
  const [showNewReport, setShowNewReport] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // New report form state
  const [newReport, setNewReport] = useState({
    name: "",
    age: "",
    gender: "",
    category: "",
    lastSeenDate: "",
    lastSeenTime: "",
    location: "",
    province: "",
    description: "",
    circumstances: "",
    reporterName: "",
    reporterPhone: "",
    reporterRelation: "",
    medicalConditions: "",
    medications: "",
    clothing: "",
    distinguishingFeatures: "",
    tribalAffiliation: "",
    languagesSpoken: "",
    schoolWork: "",
    socialMedia: "",
    recentPhotos: false,
    hasMedicalNeeds: false,
    isEndangered: false,
    suspectedAbduction: false,
    notes: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate case ID
    const caseId = `MP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`

    console.log("New Missing Person Report:", { ...newReport, id: caseId })

    // Reset form and close
    setNewReport({
      name: "", age: "", gender: "", category: "", lastSeenDate: "", lastSeenTime: "",
      location: "", province: "", description: "", circumstances: "", reporterName: "",
      reporterPhone: "", reporterRelation: "", medicalConditions: "", medications: "",
      clothing: "", distinguishingFeatures: "", tribalAffiliation: "", languagesSpoken: "",
      schoolWork: "", socialMedia: "", recentPhotos: false, hasMedicalNeeds: false,
      isEndangered: false, suspectedAbduction: false, notes: ""
    })
    setShowNewReport(false)

    // Show success message or redirect
    alert(`Missing person report ${caseId} created successfully`)
  }

  const filteredCases = MOCK_MISSING_PERSONS.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" ||
                      (activeTab === "active" && person.status === "active") ||
                      (activeTab === "found" && person.status === "found") ||
                      (activeTab === "amber" && person.amberAlert)

    return matchesSearch && matchesTab
  })

  if (!user) {
    return <div>Loading...</div>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "destructive" as const
      case "found": return "default" as const
      case "closed": return "secondary" as const
      default: return "outline" as const
    }
  }

  const getCategoryColor = (category: string) => {
    return MISSING_CATEGORIES[category as keyof typeof MISSING_CATEGORIES]?.color || "bg-gray-500"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Missing Person Reports</h1>
            <p className="text-gray-600">Manage and track missing person cases across Papua New Guinea</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Megaphone className="w-4 h-4 mr-2" />
              Broadcast Alert
            </Button>
            <Button
              onClick={() => setShowNewReport(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <User className="w-4 h-4 mr-2" />
              Report Missing Person
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {MOCK_MISSING_PERSONS.filter(p => p.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently missing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AMBER Alerts</CardTitle>
              <Shield className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_MISSING_PERSONS.filter(p => p.amberAlert && p.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Critical alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Found Safe</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {MOCK_MISSING_PERSONS.filter(p => p.status === "found").length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search Teams</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {MOCK_MISSING_PERSONS.filter(p => p.status === "active").reduce((sum, p) => sum + p.searchTeams, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Active teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Tips</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_MISSING_PERSONS.reduce((sum, p) => sum + p.tips, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total received</p>
            </CardContent>
          </Card>
        </div>

        {/* AMBER Alert Banner */}
        {MOCK_MISSING_PERSONS.some(p => p.amberAlert && p.status === "active") && (
          <Alert variant="destructive" className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>AMBER ALERT ACTIVE:</strong> {MOCK_MISSING_PERSONS.filter(p => p.amberAlert && p.status === "active").length} critical missing person case(s) require immediate public attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Missing Persons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, case ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cases Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Cases ({MOCK_MISSING_PERSONS.filter(p => p.status === "active").length})</TabsTrigger>
            <TabsTrigger value="amber">AMBER Alerts ({MOCK_MISSING_PERSONS.filter(p => p.amberAlert && p.status === "active").length})</TabsTrigger>
            <TabsTrigger value="found">Found ({MOCK_MISSING_PERSONS.filter(p => p.status === "found").length})</TabsTrigger>
            <TabsTrigger value="all">All Cases ({MOCK_MISSING_PERSONS.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Missing Person Cases ({filteredCases.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCases.map((person) => (
                    <div
                      key={person.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        person.amberAlert ? 'border-red-300 bg-red-50' : 'hover:bg-gray-50'
                      } ${
                        selectedCase?.id === person.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCase(person)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-500" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{person.name}</h3>
                              <Badge variant="outline">ID: {person.id}</Badge>
                              {person.amberAlert && (
                                <Badge variant="destructive" className="animate-pulse">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  AMBER
                                </Badge>
                              )}
                              {person.status === "found" && (
                                <Badge variant="default">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  FOUND SAFE
                                </Badge>
                              )}
                            </div>

                            <div className="grid gap-2 md:grid-cols-2 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span>{person.age} years old, {person.gender}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span>{person.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span>Last seen: {person.lastSeen}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span>Reported by: {person.reportedBy}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Shield className="w-3 h-3 text-gray-400" />
                                  <span>Officer: {person.caseOfficer}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Activity className="w-3 h-3 text-gray-400" />
                                  <span>{person.searchTeams} search teams, {person.tips} tips</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <p className="text-sm text-gray-600 line-clamp-2">{person.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(person.category)}`} />
                          <Badge variant={getStatusBadge(person.status)}>
                            {person.status.toUpperCase()}
                          </Badge>
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Case
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredCases.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <User className="mx-auto h-12 w-12 mb-4" />
                      <p>No missing person cases found matching your criteria.</p>
                      <p className="text-sm mt-2">Try adjusting your search terms.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Case Details */}
        {selectedCase && (
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Case Details - {selectedCase.name}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Photos
                  </Button>
                  <Button variant="outline" size="sm">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Broadcast
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Found
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Missing Person Details</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedCase.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedCase.age} years old</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{selectedCase.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <Badge className={getCategoryColor(selectedCase.category)}>
                          {MISSING_CATEGORIES[selectedCase.category as keyof typeof MISSING_CATEGORIES]?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{selectedCase.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Circumstances</h4>
                    <p className="text-sm text-gray-700">{selectedCase.circumstances}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Case Information</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Case ID:</span>
                        <span className="font-medium">{selectedCase.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Report Date:</span>
                        <span className="font-medium">{selectedCase.reportDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Seen:</span>
                        <span className="font-medium">{selectedCase.lastSeen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedCase.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Province:</span>
                        <span className="font-medium">{selectedCase.province}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reported By:</span>
                        <span className="font-medium">{selectedCase.reportedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedCase.reporterPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Case Officer:</span>
                        <span className="font-medium">{selectedCase.caseOfficer}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Search Status</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Search Teams:</span>
                        <span className="font-medium">{selectedCase.searchTeams} active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Community Tips:</span>
                        <span className="font-medium">{selectedCase.tips} received</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Media Coverage:</span>
                        <Badge variant={selectedCase.mediaAttention ? "default" : "secondary"}>
                          {selectedCase.mediaAttention ? "Active" : "None"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="font-medium">{selectedCase.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  {selectedCase.status === "found" && selectedCase.foundDate && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>FOUND SAFE:</strong> {selectedCase.name} was found on {selectedCase.foundDate} at {selectedCase.foundLocation}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Report Form */}
        {showNewReport && (
          <Card className="border-red-500 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Report Missing Person
                </span>
                <Button variant="outline" onClick={() => setShowNewReport(false)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReport} className="space-y-6">
                <Tabs defaultValue="person" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="person">Missing Person</TabsTrigger>
                    <TabsTrigger value="circumstances">Circumstances</TabsTrigger>
                    <TabsTrigger value="reporter">Reporter Info</TabsTrigger>
                    <TabsTrigger value="additional">Additional Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="person" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newReport.name}
                          onChange={(e) => setNewReport(prev => ({...prev, name: e.target.value}))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={newReport.age}
                          onChange={(e) => setNewReport(prev => ({...prev, age: e.target.value}))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <Select value={newReport.gender} onValueChange={(value) => setNewReport(prev => ({...prev, gender: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newReport.category} onValueChange={(value) => setNewReport(prev => ({...prev, category: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MISSING_CATEGORIES).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Physical Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Height, weight, hair color, eye color, clothing, etc..."
                        value={newReport.description}
                        onChange={(e) => setNewReport(prev => ({...prev, description: e.target.value}))}
                        rows={4}
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="circumstances" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="lastSeenDate">Last Seen Date *</Label>
                        <Input
                          id="lastSeenDate"
                          type="date"
                          value={newReport.lastSeenDate}
                          onChange={(e) => setNewReport(prev => ({...prev, lastSeenDate: e.target.value}))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastSeenTime">Last Seen Time</Label>
                        <Input
                          id="lastSeenTime"
                          type="time"
                          value={newReport.lastSeenTime}
                          onChange={(e) => setNewReport(prev => ({...prev, lastSeenTime: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">Last Known Location *</Label>
                        <Input
                          id="location"
                          placeholder="Specific location where last seen"
                          value={newReport.location}
                          onChange={(e) => setNewReport(prev => ({...prev, location: e.target.value}))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="province">Province *</Label>
                        <Select value={newReport.province} onValueChange={(value) => setNewReport(prev => ({...prev, province: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {PNG_PROVINCES.map((province) => (
                              <SelectItem key={province} value={province}>{province}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="circumstances">Circumstances *</Label>
                      <Select value={newReport.circumstances} onValueChange={(value) => setNewReport(prev => ({...prev, circumstances: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select circumstances" />
                        </SelectTrigger>
                        <SelectContent>
                          {CIRCUMSTANCES.map((circumstance) => (
                            <SelectItem key={circumstance} value={circumstance}>{circumstance}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="reporter" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="reporterName">Your Name *</Label>
                        <Input
                          id="reporterName"
                          value={newReport.reporterName}
                          onChange={(e) => setNewReport(prev => ({...prev, reporterName: e.target.value}))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reporterPhone">Contact Phone *</Label>
                        <Input
                          id="reporterPhone"
                          placeholder="+675 XXX XXXX"
                          value={newReport.reporterPhone}
                          onChange={(e) => setNewReport(prev => ({...prev, reporterPhone: e.target.value}))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reporterRelation">Relationship to Missing Person *</Label>
                      <Select value={newReport.reporterRelation} onValueChange={(value) => setNewReport(prev => ({...prev, reporterRelation: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="relative">Other Relative</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="teacher">Teacher/School</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="hasMedicalNeeds"
                          checked={newReport.hasMedicalNeeds}
                          onChange={(e) => setNewReport(prev => ({...prev, hasMedicalNeeds: e.target.checked}))}
                        />
                        <Label htmlFor="hasMedicalNeeds">Has medical conditions or needs medication</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isEndangered"
                          checked={newReport.isEndangered}
                          onChange={(e) => setNewReport(prev => ({...prev, isEndangered: e.target.checked}))}
                        />
                        <Label htmlFor="isEndangered">Person may be in danger</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="suspectedAbduction"
                          checked={newReport.suspectedAbduction}
                          onChange={(e) => setNewReport(prev => ({...prev, suspectedAbduction: e.target.checked}))}
                        />
                        <Label htmlFor="suspectedAbduction">Suspected abduction or foul play</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="recentPhotos"
                          checked={newReport.recentPhotos}
                          onChange={(e) => setNewReport(prev => ({...prev, recentPhotos: e.target.checked}))}
                        />
                        <Label htmlFor="recentPhotos">I have recent photos to provide</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Information</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any other relevant information that might help locate this person..."
                        value={newReport.notes}
                        onChange={(e) => setNewReport(prev => ({...prev, notes: e.target.value}))}
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNewReport(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Missing Person Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
