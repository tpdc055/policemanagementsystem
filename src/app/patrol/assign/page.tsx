"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Navigation,
  Clock,
  Users,
  MapPin,
  Car,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  Activity,
  Route,
  Plus,
  Edit,
  Eye,
  Zap,
  Timer
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const PATROL_AREAS = [
  {
    id: "PA-001",
    name: "Port Moresby Central",
    region: "National Capital District",
    priority: "high",
    riskLevel: "high",
    population: 85000,
    area: "25 km²",
    landmarks: ["Parliament House", "Central Market", "Town Hall"],
    recommendedPatrols: 4,
    currentPatrols: 3,
    coverage: 75
  },
  {
    id: "PA-002",
    name: "Gerehu Residential",
    region: "National Capital District",
    priority: "critical",
    riskLevel: "extreme",
    population: 120000,
    area: "35 km²",
    landmarks: ["Gerehu Market", "Schools", "Shopping Centers"],
    recommendedPatrols: 6,
    currentPatrols: 4,
    coverage: 67
  },
  {
    id: "PA-003",
    name: "Lae Industrial",
    region: "Morobe Province",
    priority: "medium",
    riskLevel: "medium",
    population: 45000,
    area: "40 km²",
    landmarks: ["Lae Port", "Industrial Complex", "Airport"],
    recommendedPatrols: 3,
    currentPatrols: 2,
    coverage: 67
  },
  {
    id: "PA-004",
    name: "Mt. Hagen Market District",
    region: "Western Highlands Province",
    priority: "high",
    riskLevel: "high",
    population: 35000,
    area: "15 km²",
    landmarks: ["Central Market", "Bus Station", "Hospital"],
    recommendedPatrols: 3,
    currentPatrols: 3,
    coverage: 100
  },
  {
    id: "PA-005",
    name: "Vanimo Border Zone",
    region: "West Sepik Province",
    priority: "medium",
    riskLevel: "medium",
    population: 12000,
    area: "50 km²",
    landmarks: ["Border Crossing", "Wharf", "Immigration Office"],
    recommendedPatrols: 2,
    currentPatrols: 1,
    coverage: 50
  }
]

const AVAILABLE_OFFICERS = [
  {
    id: "OFF-001",
    name: "Sgt. Michael Kila",
    rank: "Sergeant",
    station: "Port Moresby Central",
    vehicle: "Toyota Hilux - PAA-123",
    shift: "Day Shift",
    status: "available",
    specialization: "Community Patrol",
    experience: "8 years",
    currentAssignment: null
  },
  {
    id: "OFF-002",
    name: "Const. Grace Temu",
    rank: "Constable",
    station: "Port Moresby Central",
    vehicle: "Honda Civic - PAA-456",
    shift: "Day Shift",
    status: "available",
    specialization: "Traffic Patrol",
    experience: "3 years",
    currentAssignment: null
  },
  {
    id: "OFF-003",
    name: "Const. Peter Namaliu",
    rank: "Constable",
    station: "Lae Station",
    vehicle: "Toyota Landcruiser - LAE-789",
    shift: "Night Shift",
    status: "assigned",
    specialization: "General Patrol",
    experience: "5 years",
    currentAssignment: "PA-003"
  },
  {
    id: "OFF-004",
    name: "Sgt. Maria Bani",
    rank: "Sergeant",
    station: "Mt. Hagen Station",
    vehicle: "Ford Ranger - MTH-111",
    shift: "Day Shift",
    status: "available",
    specialization: "Market Security",
    experience: "6 years",
    currentAssignment: null
  },
  {
    id: "OFF-005",
    name: "Const. David Agarobe",
    rank: "Constable",
    station: "Vanimo Station",
    vehicle: "Motorcycle - VAN-222",
    shift: "Day Shift",
    status: "available",
    specialization: "Border Patrol",
    experience: "4 years",
    currentAssignment: null
  }
]

const SHIFT_SCHEDULES = [
  { id: "day", label: "Day Shift", time: "06:00 - 18:00", officers: 12 },
  { id: "night", label: "Night Shift", time: "18:00 - 06:00", officers: 8 },
  { id: "early", label: "Early Shift", time: "05:00 - 13:00", officers: 6 },
  { id: "late", label: "Late Shift", time: "13:00 - 21:00", officers: 6 }
]

const PATROL_ROUTES = [
  {
    id: "RT-001",
    name: "Central Business District Route",
    area: "PA-001",
    distance: "12 km",
    duration: "2 hours",
    checkpoints: ["Parliament", "Central Market", "Police Station", "Court House"],
    priority: "high",
    frequency: "Every 3 hours",
    assignedOfficer: "Sgt. Michael Kila",
    status: "active"
  },
  {
    id: "RT-002",
    name: "Gerehu Residential Patrol",
    area: "PA-002",
    distance: "18 km",
    duration: "3 hours",
    checkpoints: ["Gerehu Market", "Stage 4", "Stage 6", "Shopping Center"],
    priority: "critical",
    frequency: "Every 2 hours",
    assignedOfficer: null,
    status: "unassigned"
  },
  {
    id: "RT-003",
    name: "Industrial Zone Security",
    area: "PA-003",
    distance: "25 km",
    duration: "4 hours",
    checkpoints: ["Port Gates", "Factory Area", "Airport", "Warehouse District"],
    priority: "medium",
    frequency: "Every 6 hours",
    assignedOfficer: "Const. Peter Namaliu",
    status: "active"
  },
  {
    id: "RT-004",
    name: "Market Security Patrol",
    area: "PA-004",
    distance: "8 km",
    duration: "1.5 hours",
    checkpoints: ["Main Market", "Bus Terminal", "Hospital", "Schools"],
    priority: "high",
    frequency: "Every 4 hours",
    assignedOfficer: "Sgt. Maria Bani",
    status: "active"
  },
  {
    id: "RT-005",
    name: "Border Surveillance",
    area: "PA-005",
    distance: "30 km",
    duration: "5 hours",
    checkpoints: ["Border Post", "Immigration", "Wharf", "Customs"],
    priority: "medium",
    frequency: "Every 8 hours",
    assignedOfficer: "Const. David Agarobe",
    status: "active"
  }
]

export default function PatrolAssignPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedArea, setSelectedArea] = useState<typeof PATROL_AREAS[0] | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<typeof PATROL_ROUTES[0] | null>(null)
  const [selectedShift, setSelectedShift] = useState("day")
  const [assignmentMode, setAssignmentMode] = useState(false)
  const [selectedOfficer, setSelectedOfficer] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const assignOfficerToRoute = () => {
    if (selectedRoute && selectedOfficer) {
      // Update route assignment (in real app, this would be an API call)
      console.log(`Assigning ${selectedOfficer} to ${selectedRoute.id}`)
      setAssignmentMode(false)
      setSelectedOfficer("")
    }
  }

  const getAvailableOfficers = () => {
    return AVAILABLE_OFFICERS.filter(officer =>
      officer.status === "available" && officer.shift.toLowerCase().includes(selectedShift)
    )
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return "text-green-600"
    if (coverage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive" as const
      case "high": return "destructive" as const
      case "medium": return "default" as const
      default: return "secondary" as const
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patrol Assignment & Routes</h1>
            <p className="text-gray-600">Manage patrol assignments and optimize coverage across PNG</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Route className="w-4 h-4 mr-2" />
              Route Planner
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patrols</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {PATROL_ROUTES.filter(r => r.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(PATROL_AREAS.reduce((sum, area) => sum + area.coverage, 0) / PATROL_AREAS.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Average coverage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Officers</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {AVAILABLE_OFFICERS.filter(o => o.status === "available").length}
              </div>
              <p className="text-xs text-muted-foreground">Ready for assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Areas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {PATROL_AREAS.filter(a => a.priority === "critical").length}
              </div>
              <p className="text-xs text-muted-foreground">Need immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrol Routes</CardTitle>
              <Navigation className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{PATROL_ROUTES.length}</div>
              <p className="text-xs text-muted-foreground">Defined routes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8.5m</div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>
        </div>

        {/* Shift Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Shift Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {SHIFT_SCHEDULES.map((shift) => (
                <div
                  key={shift.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedShift === shift.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedShift(shift.id)}
                >
                  <div className="font-medium">{shift.label}</div>
                  <div className="text-sm text-gray-600">{shift.time}</div>
                  <div className="text-sm font-medium text-blue-600">{shift.officers} officers</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Patrol Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Patrol Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PATROL_AREAS.map((area) => (
                <div
                  key={area.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedArea?.id === area.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedArea(area)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{area.name}</h4>
                    <div className="flex gap-1">
                      <Badge variant={getPriorityBadge(area.priority)}>
                        {area.priority}
                      </Badge>
                      <Badge variant="outline" className={getCoverageColor(area.coverage)}>
                        {area.coverage}%
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-600">Region: {area.region}</div>
                      <div className="text-gray-600">Population: {area.population.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-600">Area: {area.area}</div>
                      <div className="text-gray-600">Patrols: {area.currentPatrols}/{area.recommendedPatrols}</div>
                    </div>
                  </div>

                  {area.coverage < 80 && (
                    <Alert className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Low coverage - {area.recommendedPatrols - area.currentPatrols} more patrols needed
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Patrol Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Active Routes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PATROL_ROUTES.map((route) => (
                <div
                  key={route.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedRoute?.id === route.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{route.name}</h4>
                    <div className="flex gap-1">
                      <Badge variant={getPriorityBadge(route.priority)}>
                        {route.priority}
                      </Badge>
                      <Badge variant={route.status === "active" ? "default" : "secondary"}>
                        {route.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-600">Distance: {route.distance}</div>
                      <div className="text-gray-600">Duration: {route.duration}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-600">Frequency: {route.frequency}</div>
                      <div className="text-gray-600">Checkpoints: {route.checkpoints.length}</div>
                    </div>
                  </div>

                  <div className="mt-2">
                    {route.assignedOfficer ? (
                      <div className="flex items-center gap-1 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Assigned to: {route.assignedOfficer}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-red-600">Unassigned - needs officer</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Route Details */}
        {selectedRoute && (
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Route Details - {selectedRoute.name}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Map
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Route
                  </Button>
                  {!selectedRoute.assignedOfficer && (
                    <Button
                      size="sm"
                      onClick={() => setAssignmentMode(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Assign Officer
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Route Details</TabsTrigger>
                  <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium">Route Information</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Route ID:</span>
                          <span className="font-medium">{selectedRoute.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium">{selectedRoute.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">{selectedRoute.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{selectedRoute.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <Badge variant={getPriorityBadge(selectedRoute.priority)}>
                            {selectedRoute.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Assignment Status</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant={selectedRoute.status === "active" ? "default" : "secondary"}>
                            {selectedRoute.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{selectedRoute.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned Officer:</span>
                          <span className="font-medium">{selectedRoute.assignedOfficer || "Unassigned"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Checkpoints:</span>
                          <span className="font-medium">{selectedRoute.checkpoints.length} locations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="checkpoints" className="space-y-4">
                  <h4 className="font-medium">Route Checkpoints</h4>
                  <div className="space-y-2">
                    {selectedRoute.checkpoints.map((checkpoint, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 border rounded">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{checkpoint}</span>
                        <div className="flex-1" />
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 30) + 5} min
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <h4 className="font-medium">Patrol Schedule</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Next Patrol</span>
                        <span className="text-sm text-gray-600">In 45 minutes</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Scheduled: 14:00 - 16:00 ({selectedRoute.duration})
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Today's Schedule</h5>
                      {["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map((time, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                          <span>{time} - {(Number.parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}:00</span>
                          <Badge variant={index < 3 ? "default" : "outline"}>
                            {index < 3 ? "Completed" : "Scheduled"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <h4 className="font-medium">Route Performance</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">8.2m</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-gray-600">Incidents This Week</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Officer Assignment Modal */}
        {assignmentMode && selectedRoute && (
          <Card className="border-green-500 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Assign Officer to {selectedRoute.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Available Officers ({selectedShift})</Label>
                <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an officer" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableOfficers().map((officer) => (
                      <SelectItem key={officer.id} value={officer.name}>
                        {officer.name} - {officer.rank} ({officer.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedOfficer && (
                <div className="p-3 bg-white border rounded">
                  <h5 className="font-medium mb-2">Officer Details</h5>
                  {(() => {
                    const officer = AVAILABLE_OFFICERS.find(o => o.name === selectedOfficer)
                    return officer ? (
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span>{officer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rank:</span>
                          <span>{officer.rank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Station:</span>
                          <span>{officer.station}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vehicle:</span>
                          <span>{officer.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Specialization:</span>
                          <span>{officer.specialization}</span>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAssignmentMode(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={assignOfficerToRoute}
                  disabled={!selectedOfficer}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Assign Officer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Patrol
              </Button>
              <Button variant="outline">
                <Route className="w-4 h-4 mr-2" />
                Create Route
              </Button>
              <Button variant="outline">
                <Timer className="w-4 h-4 mr-2" />
                Emergency Dispatch
              </Button>
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Coverage Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
