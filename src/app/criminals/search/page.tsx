"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Fingerprint,
  Camera,
  Database,
  AlertTriangle,
  Eye,
  Filter,
  Users,
  MapPin,
  Calendar,
  Shield,
  Clock,
  FileText,
  User,
  Scan
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

const CRIMINAL_CATEGORIES = {
  "violent": "Violent Crimes",
  "property": "Property Crimes",
  "drug": "Drug Offenses",
  "fraud": "Fraud & Financial",
  "gang": "Gang Related",
  "tribal": "Tribal Conflicts",
  "cyber": "Cybercrime",
  "trafficking": "Human/Drug Trafficking",
  "corruption": "Corruption",
  "domestic": "Domestic Violence"
}

const THREAT_LEVELS = {
  "extreme": { label: "Extreme", color: "bg-red-600", variant: "destructive" as const },
  "high": { label: "High", color: "bg-red-500", variant: "destructive" as const },
  "medium": { label: "Medium", color: "bg-orange-500", variant: "default" as const },
  "low": { label: "Low", color: "bg-green-500", variant: "default" as const }
}

// Mock search results
const MOCK_SEARCH_RESULTS = [
  {
    id: "CRIM-001",
    name: "John Kaupa",
    aliases: ["Johnny K", "Big John"],
    age: 35,
    gender: "Male",
    nationality: "Papua New Guinean",
    province: "National Capital District",
    district: "Port Moresby",
    threatLevel: "high",
    status: "Wanted",
    lastSeen: "Port Moresby Central",
    lastSeenDate: "2024-01-10",
    charges: ["Armed Robbery", "Assault with Weapon", "Theft"],
    gangAffiliation: "Raskol Gang Alpha",
    physicalDescription: "Height: 5'8\", Weight: 180lbs, Tattoo on left arm",
    hasBiometrics: true,
    hasPhoto: true,
    convictions: 3,
    armedAndDangerous: true
  },
  {
    id: "CRIM-002",
    name: "Maria Bani",
    aliases: ["Mary B"],
    age: 28,
    gender: "Female",
    nationality: "Papua New Guinean",
    province: "Morobe Province",
    district: "Lae",
    threatLevel: "medium",
    status: "In Custody",
    lastSeen: "Lae Police Station",
    lastSeenDate: "2024-01-15",
    charges: ["Fraud", "Embezzlement", "Money Laundering"],
    gangAffiliation: null,
    physicalDescription: "Height: 5'4\", Weight: 130lbs, Scar on right cheek",
    hasBiometrics: true,
    hasPhoto: true,
    convictions: 1,
    armedAndDangerous: false
  },
  {
    id: "CRIM-003",
    name: "Peter Namaliu",
    aliases: ["Pete", "Boss Pete"],
    age: 42,
    gender: "Male",
    nationality: "Papua New Guinean",
    province: "Western Highlands Province",
    district: "Mt. Hagen",
    threatLevel: "extreme",
    status: "Wanted",
    lastSeen: "Mt. Hagen Market",
    lastSeenDate: "2024-01-05",
    charges: ["Drug Trafficking", "Money Laundering", "Organized Crime", "Murder"],
    gangAffiliation: "PNG Drug Cartel",
    physicalDescription: "Height: 6'0\", Weight: 200lbs, Gold teeth, Multiple tattoos",
    hasBiometrics: true,
    hasPhoto: true,
    convictions: 5,
    armedAndDangerous: true
  }
]

export default function CriminalSearchPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [provinceFilter, setProvinceFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [threatFilter, setThreatFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [biometricSearch, setBiometricSearch] = useState("")
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_RESULTS)
  const [searching, setSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleSearch = async () => {
    setSearching(true)

    // Simulate search delay
    setTimeout(() => {
      // Filter results based on search criteria
      const filtered = MOCK_SEARCH_RESULTS.filter(criminal => {
        const matchesQuery = searchQuery === "" ||
          criminal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          criminal.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
          criminal.charges.some(charge => charge.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesProvince = provinceFilter === "all" || criminal.province === provinceFilter
        const matchesThreat = threatFilter === "all" || criminal.threatLevel === threatFilter
        const matchesStatus = statusFilter === "all" || criminal.status.toLowerCase().includes(statusFilter.toLowerCase())

        return matchesQuery && matchesProvince && matchesThreat && matchesStatus
      })

      setSearchResults(filtered)
      setSearching(false)
    }, 1500)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setProvinceFilter("all")
    setCategoryFilter("all")
    setThreatFilter("all")
    setStatusFilter("all")
    setBiometricSearch("")
    setSearchResults(MOCK_SEARCH_RESULTS)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criminal Search</h1>
            <p className="text-gray-600">Advanced search and identification system</p>
          </div>
          <div className="flex gap-2">
            <Link href="/criminals">
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                View All Records
              </Button>
            </Link>
            <Link href="/criminals/new">
              <Button className="bg-red-600 hover:bg-red-700">
                <User className="w-4 h-4 mr-2" />
                Add Criminal
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Search</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
                <TabsTrigger value="biometric">Biometric Search</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name, alias, or charges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={searching}>
                    {searching ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                    Search
                  </Button>
                  <Button variant="outline" onClick={clearSearch}>
                    Clear
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      {PNG_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Crime Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(CRIMINAL_CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={threatFilter} onValueChange={setThreatFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Threat Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Threat Levels</SelectItem>
                      {Object.entries(THREAT_LEVELS).map(([key, { label }]) => (
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
                      <SelectItem value="wanted">Wanted</SelectItem>
                      <SelectItem value="custody">In Custody</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                      <SelectItem value="deceased">Deceased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSearch} disabled={searching}>
                    {searching ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Filter className="w-4 h-4 mr-2" />}
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearSearch}>
                    Reset Filters
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="biometric" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg text-center">
                    <Fingerprint className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                    <h3 className="font-medium mb-2">Fingerprint Search</h3>
                    <Button size="sm">
                      <Scan className="w-4 h-4 mr-2" />
                      Scan Fingerprint
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <Camera className="mx-auto h-12 w-12 text-green-500 mb-2" />
                    <h3 className="font-medium mb-2">Facial Recognition</h3>
                    <Button size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <Database className="mx-auto h-12 w-12 text-purple-500 mb-2" />
                    <h3 className="font-medium mb-2">DNA Search</h3>
                    <Button size="sm">
                      <Database className="w-4 h-4 mr-2" />
                      DNA Lookup
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Biometric search requires specialized equipment and authorized access.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results ({searchResults.length})</span>
              {searchResults.filter(r => r.armedAndDangerous).length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {searchResults.filter(r => r.armedAndDangerous).length} Armed & Dangerous
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((criminal) => (
                <div
                  key={criminal.id}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                    criminal.armedAndDangerous ? 'border-red-300 bg-red-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-gray-200 text-lg">
                          {criminal.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{criminal.name}</h3>
                          <Badge variant="outline">ID: {criminal.id}</Badge>
                          {criminal.armedAndDangerous && (
                            <Badge variant="destructive" className="animate-pulse">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Armed & Dangerous
                            </Badge>
                          )}
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span>Age: {criminal.age}, {criminal.gender}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{criminal.district}, {criminal.province}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span>Last seen: {criminal.lastSeenDate}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-gray-400" />
                              <Badge variant={THREAT_LEVELS[criminal.threatLevel as keyof typeof THREAT_LEVELS].variant}>
                                {THREAT_LEVELS[criminal.threatLevel as keyof typeof THREAT_LEVELS].label} Threat
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-gray-400" />
                              <span>{criminal.convictions} convictions</span>
                            </div>
                            {criminal.gangAffiliation && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-red-400" />
                                <span className="text-red-600 font-medium">{criminal.gangAffiliation}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="text-sm text-gray-600 mb-1">Primary Charges:</div>
                          <div className="flex flex-wrap gap-1">
                            {criminal.charges.slice(0, 3).map((charge, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {charge}
                              </Badge>
                            ))}
                            {criminal.charges.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{criminal.charges.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="text-right space-y-1">
                        <div className="flex gap-1">
                          {criminal.hasPhoto && (
                            <Badge variant="outline" className="text-xs">
                              <Camera className="w-3 h-3 mr-1" />
                              Photo
                            </Badge>
                          )}
                          {criminal.hasBiometrics && (
                            <Badge variant="outline" className="text-xs">
                              <Fingerprint className="w-3 h-3 mr-1" />
                              Bio
                            </Badge>
                          )}
                        </div>
                        <Badge variant={criminal.status === "Wanted" ? "destructive" : "default"}>
                          {criminal.status}
                        </Badge>
                      </div>

                      <Link href={`/criminals/${criminal.id}`}>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="mx-auto h-12 w-12 mb-4" />
                  <p>No criminals found matching your search criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
