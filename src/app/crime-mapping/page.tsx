"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  Shield,
  Activity,
  BarChart3,
  Filter,
  Download,
  Eye,
  Zap,
  Navigation,
  Search
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const PNG_REGIONS = [
  { name: "National Capital District", population: 410000, area: "240 km²", riskLevel: "high" },
  { name: "Morobe Province", population: 674000, area: "33,705 km²", riskLevel: "medium" },
  { name: "Western Highlands Province", population: 365000, area: "4,299 km²", riskLevel: "high" },
  { name: "Southern Highlands Province", population: 515000, area: "25,202 km²", riskLevel: "medium" },
  { name: "Eastern Highlands Province", population: 579000, area: "11,157 km²", riskLevel: "medium" },
  { name: "Enga Province", population: 432000, area: "12,800 km²", riskLevel: "high" },
  { name: "Simbu Province", population: 259000, area: "6,112 km²", riskLevel: "low" },
  { name: "Madang Province", population: 493000, area: "29,000 km²", riskLevel: "medium" }
]

const CRIME_TYPES = {
  "violent": { label: "Violent Crime", color: "bg-red-500", icon: AlertTriangle },
  "property": { label: "Property Crime", color: "bg-orange-500", icon: Target },
  "drug": { label: "Drug Offenses", color: "bg-purple-500", icon: Zap },
  "tribal": { label: "Tribal Conflicts", color: "bg-yellow-500", icon: Users },
  "traffic": { label: "Traffic Violations", color: "bg-blue-500", icon: Navigation },
  "domestic": { label: "Domestic Violence", color: "bg-red-600", icon: AlertTriangle }
}

// Mock crime data
const CRIME_HOTSPOTS = [
  {
    id: "HS-001",
    name: "Gerehu Suburb",
    region: "National Capital District",
    coordinates: { lat: -9.4438, lng: 147.1803 },
    riskLevel: "extreme",
    crimeCount: 45,
    lastIncident: "2024-01-15",
    primaryCrimes: ["violent", "property", "drug"],
    description: "High crime area with frequent robberies and gang activity",
    patrolFrequency: "Every 2 hours",
    recommendedActions: ["Increase patrol presence", "Community engagement", "CCTV installation"]
  },
  {
    id: "HS-002",
    name: "Lae Market District",
    region: "Morobe Province",
    coordinates: { lat: -6.7249, lng: 147.0158 },
    riskLevel: "high",
    crimeCount: 32,
    lastIncident: "2024-01-14",
    primaryCrimes: ["property", "traffic", "domestic"],
    description: "Market area with high pedestrian traffic and theft incidents",
    patrolFrequency: "Every 4 hours",
    recommendedActions: ["Market security", "Traffic control", "Vendor education"]
  },
  {
    id: "HS-003",
    name: "Mt. Hagen Central",
    region: "Western Highlands Province",
    coordinates: { lat: -5.8506, lng: 144.2092 },
    riskLevel: "high",
    crimeCount: 28,
    lastIncident: "2024-01-13",
    primaryCrimes: ["tribal", "violent", "property"],
    description: "Central business district with tribal conflict spillover",
    patrolFrequency: "Every 3 hours",
    recommendedActions: ["Tribal mediation", "Business security", "Youth programs"]
  },
  {
    id: "HS-004",
    name: "Vanimo Border Area",
    region: "West Sepik Province",
    coordinates: { lat: -2.6748, lng: 141.3028 },
    riskLevel: "medium",
    crimeCount: 18,
    lastIncident: "2024-01-12",
    primaryCrimes: ["drug", "trafficking", "smuggling"],
    description: "Border area with smuggling and trafficking activities",
    patrolFrequency: "Every 6 hours",
    recommendedActions: ["Border security", "Customs cooperation", "Intelligence gathering"]
  },
  {
    id: "HS-005",
    name: "Kerema Township",
    region: "Gulf Province",
    coordinates: { lat: -7.9630, lng: 145.7710 },
    riskLevel: "low",
    crimeCount: 8,
    lastIncident: "2024-01-10",
    primaryCrimes: ["domestic", "minor_theft"],
    description: "Small township with occasional domestic incidents",
    patrolFrequency: "Daily patrol",
    recommendedActions: ["Community policing", "Domestic violence support"]
  }
]

const RECENT_INCIDENTS = [
  {
    id: "INC-2024-156",
    type: "violent",
    location: "Gerehu Stage 4",
    region: "National Capital District",
    time: "2024-01-15 14:30",
    description: "Armed robbery at local store",
    severity: "high",
    status: "investigating"
  },
  {
    id: "INC-2024-157",
    type: "tribal",
    location: "Mt. Hagen Market",
    region: "Western Highlands Province",
    time: "2024-01-15 11:20",
    description: "Tribal fighting incident",
    severity: "medium",
    status: "resolved"
  },
  {
    id: "INC-2024-158",
    type: "property",
    location: "Lae Top Town",
    region: "Morobe Province",
    time: "2024-01-15 09:15",
    description: "Break and enter at business",
    severity: "medium",
    status: "investigating"
  },
  {
    id: "INC-2024-159",
    type: "drug",
    location: "Vanimo Wharf",
    region: "West Sepik Province",
    time: "2024-01-14 22:45",
    description: "Drug trafficking arrest",
    severity: "high",
    status: "arrested"
  },
  {
    id: "INC-2024-160",
    type: "domestic",
    location: "Kerema Village",
    region: "Gulf Province",
    time: "2024-01-14 19:30",
    description: "Domestic violence report",
    severity: "medium",
    status: "investigating"
  }
]

const CRIME_STATISTICS = {
  "National Capital District": {
    total: 234,
    trend: "up",
    change: "+12%",
    breakdown: { violent: 45, property: 89, drug: 34, tribal: 12, traffic: 54 }
  },
  "Morobe Province": {
    total: 156,
    trend: "down",
    change: "-8%",
    breakdown: { violent: 23, property: 67, drug: 19, tribal: 8, traffic: 39 }
  },
  "Western Highlands Province": {
    total: 189,
    trend: "up",
    change: "+15%",
    breakdown: { violent: 34, property: 45, drug: 12, tribal: 78, traffic: 20 }
  },
  "Enga Province": {
    total: 201,
    trend: "up",
    change: "+22%",
    breakdown: { violent: 28, property: 32, drug: 8, tribal: 118, traffic: 15 }
  },
  "Eastern Highlands Province": {
    total: 134,
    trend: "stable",
    change: "+2%",
    breakdown: { violent: 19, property: 56, drug: 15, tribal: 24, traffic: 20 }
  }
}

export default function CrimeMappingPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedCrimeType, setSelectedCrimeType] = useState("all")
  const [timeRange, setTimeRange] = useState("30days")
  const [selectedHotspot, setSelectedHotspot] = useState<typeof CRIME_HOTSPOTS[0] | null>(null)
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

  const filteredHotspots = CRIME_HOTSPOTS.filter(hotspot => {
    if (selectedRegion !== "all" && hotspot.region !== selectedRegion) return false
    if (selectedCrimeType !== "all" && !hotspot.primaryCrimes.includes(selectedCrimeType)) return false
    return true
  })

  const getTotalCrimes = () => {
    return Object.values(CRIME_STATISTICS).reduce((sum, region) => sum + region.total, 0)
  }

  const getRegionRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "extreme": return "bg-red-600"
      case "high": return "bg-red-500"
      case "medium": return "bg-orange-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crime Mapping & Analytics</h1>
            <p className="text-gray-600">Visualize crime patterns and hotspots across Papua New Guinea</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Map
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalCrimes()}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crime Hotspots</CardTitle>
              <Target className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{CRIME_HOTSPOTS.length}</div>
              <p className="text-xs text-muted-foreground">Active areas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {CRIME_HOTSPOTS.filter(h => ["extreme", "high"].includes(h.riskLevel)).length}
              </div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trend Direction</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">-5%</div>
              <p className="text-xs text-muted-foreground">Overall decrease</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrol Coverage</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <p className="text-xs text-muted-foreground">Areas covered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">12m</div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Map Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {PNG_REGIONS.map((region) => (
                    <SelectItem key={region.name} value={region.name}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCrimeType} onValueChange={setSelectedCrimeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Crime Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crime Types</SelectItem>
                  {Object.entries(CRIME_TYPES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSelectedRegion("all")
                setSelectedCrimeType("all")
                setTimeRange("30days")
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Interactive Map Placeholder */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Papua New Guinea Crime Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8 text-center min-h-96 flex flex-col justify-center">
                  <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive PNG Map</h3>
                  <p className="text-gray-600 mb-4">
                    Real-time crime hotspot visualization across Papua New Guinea provinces
                  </p>

                  <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mt-6">
                    {filteredHotspots.slice(0, 4).map((hotspot) => (
                      <div
                        key={hotspot.id}
                        className={`p-3 bg-white rounded border cursor-pointer transition-all hover:shadow-md ${
                          selectedHotspot?.id === hotspot.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedHotspot(hotspot)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${getRegionRiskColor(hotspot.riskLevel)}`} />
                          <span className="font-medium text-sm">{hotspot.name}</span>
                        </div>
                        <div className="text-xs text-gray-600">{hotspot.region}</div>
                        <div className="text-xs font-medium text-red-600">{hotspot.crimeCount} incidents</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600" />
                        <span>Extreme Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>High Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span>Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Low Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotspot Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Crime Hotspots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredHotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedHotspot?.id === hotspot.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{hotspot.name}</h4>
                      <Badge variant={hotspot.riskLevel === "extreme" ? "destructive" : "default"}>
                        {hotspot.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{hotspot.region}</div>
                    <div className="text-sm font-medium text-red-600">{hotspot.crimeCount} incidents</div>
                    <div className="text-xs text-gray-500">Last: {hotspot.lastIncident}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedHotspot && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Hotspot Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">{selectedHotspot.name}</h4>
                    <p className="text-sm text-gray-600">{selectedHotspot.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Crime Count:</span>
                      <span className="font-medium">{selectedHotspot.crimeCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk Level:</span>
                      <Badge variant={selectedHotspot.riskLevel === "extreme" ? "destructive" : "default"}>
                        {selectedHotspot.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Patrol Frequency:</span>
                      <span className="font-medium">{selectedHotspot.patrolFrequency}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Primary Crime Types:</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedHotspot.primaryCrimes.map((crime) => (
                        <Badge key={crime} variant="outline" className="text-xs">
                          {CRIME_TYPES[crime as keyof typeof CRIME_TYPES]?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Recommended Actions:</h5>
                    <ul className="text-xs space-y-1">
                      {selectedHotspot.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="statistics">Regional Statistics</TabsTrigger>
            <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
            <TabsTrigger value="trends">Crime Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crime Statistics by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(CRIME_STATISTICS).map(([region, stats]) => (
                    <div key={region} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{region}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{stats.total}</span>
                          <Badge variant={stats.trend === "up" ? "destructive" : stats.trend === "down" ? "default" : "secondary"}>
                            {stats.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> :
                             stats.trend === "down" ? <TrendingDown className="w-3 h-3 mr-1" /> :
                             <Activity className="w-3 h-3 mr-1" />}
                            {stats.change}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-5 text-sm">
                        {Object.entries(stats.breakdown).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="text-gray-600">{CRIME_TYPES[type as keyof typeof CRIME_TYPES]?.label || type}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Crime Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RECENT_INCIDENTS.map((incident) => (
                    <div key={incident.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${CRIME_TYPES[incident.type as keyof typeof CRIME_TYPES]?.color}`} />
                          <span className="font-medium">{incident.id}</span>
                          <Badge variant={incident.severity === "high" ? "destructive" : "default"}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <Badge variant={incident.status === "resolved" ? "default" : "secondary"}>
                          {incident.status}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="font-medium">{incident.description}</div>
                        <div className="text-gray-600">📍 {incident.location}, {incident.region}</div>
                        <div className="text-gray-500">🕒 {incident.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Crime Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(CRIME_TYPES).map(([key, { label, color }]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 h-2 rounded-full w-20">
                            <div className={`h-2 rounded-full w-${Math.floor(Math.random() * 16) + 4} ${color}`} />
                          </div>
                          <span className="text-sm font-medium">{Math.floor(Math.random() * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>January 2024</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 h-2 rounded-full w-16" />
                        <span className="text-sm">-12%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>December 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-red-500 h-2 rounded-full w-20" />
                        <span className="text-sm">+8%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>November 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-500 h-2 rounded-full w-12" />
                        <span className="text-sm">+3%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>October 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 h-2 rounded-full w-14" />
                        <span className="text-sm">-5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-gray-600">Extreme Risk Areas</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <div className="text-sm text-gray-600">High Risk Areas</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-gray-600">Medium Risk Areas</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-sm text-gray-600">Low Risk Areas</div>
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
