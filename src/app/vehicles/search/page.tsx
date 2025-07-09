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
  Car,
  Search,
  AlertTriangle,
  CheckCircle,
  Eye,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Clock,
  FileText,
  Camera,
  Target,
  Database,
  Zap,
  Users
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const VEHICLE_TYPES = [
  "Car", "SUV", "Truck", "Motorcycle", "Bus", "Van", "Pickup", "Taxi", "PMV (Public Motor Vehicle)",
  "Commercial Vehicle", "Government Vehicle", "Diplomatic Vehicle", "Agricultural Vehicle"
]

const VEHICLE_MAKES = [
  "Toyota", "Nissan", "Mazda", "Honda", "Ford", "Mitsubishi", "Isuzu", "Holden",
  "Volkswagen", "Hyundai", "Kia", "Suzuki", "Subaru", "BMW", "Mercedes-Benz", "Other"
]

const VEHICLE_COLORS = [
  "White", "Black", "Silver", "Blue", "Red", "Green", "Yellow", "Brown", "Gold",
  "Orange", "Purple", "Pink", "Gray", "Maroon", "Navy", "Beige", "Other"
]

const VEHICLE_STATUS = {
  "registered": { label: "Registered", color: "bg-green-500", variant: "default" as const },
  "expired": { label: "Registration Expired", color: "bg-yellow-500", variant: "default" as const },
  "suspended": { label: "Suspended", color: "bg-orange-500", variant: "default" as const },
  "stolen": { label: "Reported Stolen", color: "bg-red-500", variant: "destructive" as const },
  "impounded": { label: "Impounded", color: "bg-red-600", variant: "destructive" as const },
  "unregistered": { label: "Unregistered", color: "bg-gray-500", variant: "secondary" as const }
}

// Mock vehicle database
const MOCK_VEHICLES = [
  {
    plateNumber: "PAA-123",
    vin: "1HGBH41JXMN109186",
    make: "Toyota",
    model: "Hilux",
    year: "2020",
    color: "White",
    type: "Pickup",
    status: "registered",
    ownerName: "John Kaupa",
    ownerPhone: "+675 325 8901",
    ownerAddress: "Gerehu Stage 4, Port Moresby",
    registrationDate: "2020-03-15",
    expiryDate: "2025-03-15",
    registeredProvince: "National Capital District",
    engineNumber: "3RZ-FE-7654321",
    chassisNumber: "MR0NS22G500123456",
    insuranceProvider: "PNG Insurance",
    insuranceExpiry: "2024-12-31",
    roadworthyExpiry: "2024-06-30",
    modifications: [],
    trafficViolations: [
      { date: "2024-01-10", violation: "Speeding", fine: "K200", status: "Paid" },
      { date: "2023-11-15", violation: "Parking Violation", fine: "K50", status: "Paid" }
    ],
    inspectionHistory: [
      { date: "2023-06-30", result: "Pass", inspector: "Const. Traffic Division" }
    ],
    notes: "Vehicle in good condition, regular inspections"
  },
  {
    plateNumber: "LAE-456",
    vin: "JMBSNCS6XBA012345",
    make: "Mitsubishi",
    model: "Triton",
    year: "2019",
    color: "Blue",
    type: "Pickup",
    status: "stolen",
    ownerName: "Maria Temu",
    ownerPhone: "+675 472 5678",
    ownerAddress: "Top Town, Lae",
    registrationDate: "2019-07-20",
    expiryDate: "2024-07-20",
    registeredProvince: "Morobe Province",
    engineNumber: "4D56-T-8901234",
    chassisNumber: "MR0NS22G600789012",
    insuranceProvider: "Motor Vehicle Insurance",
    insuranceExpiry: "2024-10-15",
    roadworthyExpiry: "2024-03-15",
    modifications: ["Bull Bar", "Tinted Windows"],
    stolenDate: "2024-01-08",
    stolenLocation: "Lae Market Area",
    reportingOfficer: "Sgt. Michael Kila",
    caseNumber: "CASE-2024-089",
    bolo: true,
    lastSighting: "2024-01-10 - Markham Road",
    notes: "STOLEN VEHICLE - BOLO Alert Active. Last seen heading towards Nadzab"
  },
  {
    plateNumber: "MTH-789",
    vin: "WAUZZZ8K0DA123456",
    make: "Honda",
    model: "Civic",
    year: "2018",
    color: "Silver",
    type: "Car",
    status: "expired",
    ownerName: "Peter Namaliu",
    ownerPhone: "+675 542 9876",
    ownerAddress: "Kagamuga, Mt. Hagen",
    registrationDate: "2018-09-10",
    expiryDate: "2023-09-10",
    registeredProvince: "Western Highlands Province",
    engineNumber: "D16Y8-5432109",
    chassisNumber: "MR0NS22G700345678",
    insuranceProvider: "Highlands Insurance",
    insuranceExpiry: "2023-12-31",
    roadworthyExpiry: "2023-09-10",
    modifications: ["Sound System"],
    trafficViolations: [
      { date: "2023-12-20", violation: "Expired Registration", fine: "K500", status: "Unpaid" }
    ],
    notes: "Registration expired - renewal required"
  },
  {
    plateNumber: "GOV-001",
    vin: "WBAVU37050A123456",
    make: "Toyota",
    model: "Landcruiser",
    year: "2021",
    color: "White",
    type: "Government Vehicle",
    status: "registered",
    ownerName: "PNG Government - Police Department",
    ownerPhone: "+675 325 1000",
    ownerAddress: "Police Headquarters, Port Moresby",
    registrationDate: "2021-01-15",
    expiryDate: "2026-01-15",
    registeredProvince: "National Capital District",
    engineNumber: "1VD-FTV-1234567",
    chassisNumber: "MR0NS22G800456789",
    insuranceProvider: "Government Fleet Insurance",
    insuranceExpiry: "2025-01-31",
    roadworthyExpiry: "2025-01-15",
    modifications: ["Police Equipment", "Radio System", "Emergency Lights"],
    assignedOfficer: "Insp. Sarah Johnson",
    assignedStation: "Port Moresby Central",
    mileage: "45,000 km",
    notes: "Police patrol vehicle - equipment inspected monthly"
  },
  {
    plateNumber: "PMV-555",
    vin: "JM7GJ1W69F1123456",
    make: "Isuzu",
    model: "NQR",
    year: "2017",
    color: "Yellow",
    type: "PMV (Public Motor Vehicle)",
    status: "suspended",
    ownerName: "Bus Stop Transport Ltd",
    ownerPhone: "+675 325 4444",
    ownerAddress: "Gordon Market, Port Moresby",
    registrationDate: "2017-05-20",
    expiryDate: "2024-05-20",
    registeredProvince: "National Capital District",
    engineNumber: "4JJ1-TC-2345678",
    chassisNumber: "MR0NS22G900567890",
    insuranceProvider: "Commercial Vehicle Insurance",
    insuranceExpiry: "2024-08-30",
    roadworthyExpiry: "2024-02-15",
    modifications: ["Passenger Seating", "Route Signage"],
    suspensionReason: "Safety violations - overloading passengers",
    suspensionDate: "2024-01-15",
    notes: "PMV license suspended pending safety improvements"
  }
]

export default function VehicleSearchPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchType, setSearchType] = useState("plate")
  const [searchQuery, setSearchQuery] = useState("")
  const [makeFilter, setMakeFilter] = useState("")
  const [colorFilter, setColorFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [searchResults, setSearchResults] = useState<typeof MOCK_VEHICLES>([])
  const [searching, setSearching] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<typeof MOCK_VEHICLES[0] | null>(null)
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
    setSelectedVehicle(null)

    // Simulate search delay
    setTimeout(() => {
      const filtered = MOCK_VEHICLES.filter(vehicle => {
        let matches = true

        if (searchQuery) {
          switch (searchType) {
            case "plate":
              matches = vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
              break
            case "vin":
              matches = vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase())
              break
            case "owner":
              matches = vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
              break
          }
        }

        if (makeFilter && vehicle.make !== makeFilter) matches = false
        if (colorFilter && vehicle.color !== colorFilter) matches = false
        if (statusFilter && vehicle.status !== statusFilter) matches = false

        return matches
      })

      setSearchResults(filtered)
      setSearching(false)
    }, 1000)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setMakeFilter("")
    setColorFilter("")
    setStatusFilter("")
    setSearchResults([])
    setSelectedVehicle(null)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Search & Registration</h1>
            <p className="text-gray-600">Search vehicle records and registration database</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Vehicle Database
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Car className="w-4 h-4 mr-2" />
              Register Vehicle
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_VEHICLES.length}</div>
              <p className="text-xs text-muted-foreground">In database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stolen Vehicles</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {MOCK_VEHICLES.filter(v => v.status === "stolen").length}
              </div>
              <p className="text-xs text-muted-foreground">Active BOLO</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired Rego</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {MOCK_VEHICLES.filter(v => v.status === "expired").length}
              </div>
              <p className="text-xs text-muted-foreground">Need renewal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Government Fleet</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {MOCK_VEHICLES.filter(v => v.type === "Government Vehicle").length}
              </div>
              <p className="text-xs text-muted-foreground">Official vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PMV Fleet</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_VEHICLES.filter(v => v.type === "PMV (Public Motor Vehicle)").length}
              </div>
              <p className="text-xs text-muted-foreground">Public transport</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Vehicle Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quick" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Quick Search</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Search</TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plate">License Plate</SelectItem>
                      <SelectItem value="vin">VIN Number</SelectItem>
                      <SelectItem value="owner">Owner Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex-1">
                    <Input
                      placeholder={`Enter ${searchType === 'plate' ? 'license plate' : searchType === 'vin' ? 'VIN number' : 'owner name'}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>

                  <Button onClick={handleSearch} disabled={searching || !searchQuery}>
                    {searching ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                    Search
                  </Button>

                  <Button variant="outline" onClick={clearSearch}>
                    Clear
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-5">
                  <Input
                    placeholder="License plate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <Select value={makeFilter} onValueChange={setMakeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Makes</SelectItem>
                      {VEHICLE_MAKES.map((make) => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={colorFilter} onValueChange={setColorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Colors</SelectItem>
                      {VEHICLE_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      {Object.entries(VEHICLE_STATUS).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={handleSearch} disabled={searching}>
                    {searching ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
                    Advanced Search
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results ({searchResults.length})</span>
                {searchResults.filter(v => v.status === "stolen").length > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {searchResults.filter(v => v.status === "stolen").length} Stolen Vehicle Alert
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((vehicle) => (
                  <div
                    key={vehicle.plateNumber}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      vehicle.status === "stolen" ? 'border-red-300 bg-red-50' : 'hover:bg-gray-50'
                    } ${
                      selectedVehicle?.plateNumber === vehicle.plateNumber ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Car className="w-8 h-8 text-gray-500" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{vehicle.plateNumber}</h3>
                            <Badge variant="outline">{vehicle.year} {vehicle.make} {vehicle.model}</Badge>
                            {vehicle.status === "stolen" && (
                              <Badge variant="destructive" className="animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                STOLEN
                              </Badge>
                            )}
                          </div>

                          <div className="grid gap-2 md:grid-cols-2 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Car className="w-3 h-3 text-gray-400" />
                                <span>{vehicle.color} {vehicle.type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-400" />
                                <span>{vehicle.ownerName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{vehicle.registeredProvince}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span>Expires: {vehicle.expiryDate}</span>
                              </div>
                              {vehicle.status === "stolen" && vehicle.stolenDate && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-400" />
                                  <span className="text-red-600">Stolen: {vehicle.stolenDate}</span>
                                </div>
                              )}
                              {vehicle.status === "stolen" && vehicle.lastSighting && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-red-400" />
                                  <span className="text-red-600">Last seen: {vehicle.lastSighting}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={VEHICLE_STATUS[vehicle.status as keyof typeof VEHICLE_STATUS].variant}>
                          {VEHICLE_STATUS[vehicle.status as keyof typeof VEHICLE_STATUS].label}
                        </Badge>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Details */}
        {selectedVehicle && (
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Vehicle Details - {selectedVehicle.plateNumber}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="registration" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="registration">Registration</TabsTrigger>
                  <TabsTrigger value="owner">Owner Details</TabsTrigger>
                  <TabsTrigger value="violations">Violations</TabsTrigger>
                  <TabsTrigger value="notes">Notes & History</TabsTrigger>
                </TabsList>

                <TabsContent value="registration" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium">Vehicle Information</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">License Plate:</span>
                          <span className="font-medium">{selectedVehicle.plateNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">VIN:</span>
                          <span className="font-medium">{selectedVehicle.vin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Make/Model:</span>
                          <span className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{selectedVehicle.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">{selectedVehicle.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{selectedVehicle.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Registration Status</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant={VEHICLE_STATUS[selectedVehicle.status as keyof typeof VEHICLE_STATUS].variant}>
                            {VEHICLE_STATUS[selectedVehicle.status as keyof typeof VEHICLE_STATUS].label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registered:</span>
                          <span className="font-medium">{selectedVehicle.registrationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires:</span>
                          <span className="font-medium">{selectedVehicle.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Province:</span>
                          <span className="font-medium">{selectedVehicle.registeredProvince}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span className="font-medium">{selectedVehicle.insuranceProvider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Roadworthy:</span>
                          <span className="font-medium">{selectedVehicle.roadworthyExpiry}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedVehicle.status === "stolen" && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>STOLEN VEHICLE ALERT:</strong> This vehicle was reported stolen on {selectedVehicle.stolenDate}
                        {selectedVehicle.lastSighting && ` Last sighting: ${selectedVehicle.lastSighting}`}
                        {selectedVehicle.caseNumber && ` Case: ${selectedVehicle.caseNumber}`}
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="owner" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Owner Information</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedVehicle.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedVehicle.ownerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">{selectedVehicle.ownerAddress}</span>
                      </div>
                    </div>
                  </div>

                  {selectedVehicle.assignedOfficer && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Assignment Details</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned Officer:</span>
                          <span className="font-medium">{selectedVehicle.assignedOfficer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Station:</span>
                          <span className="font-medium">{selectedVehicle.assignedStation}</span>
                        </div>
                        {selectedVehicle.mileage && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mileage:</span>
                            <span className="font-medium">{selectedVehicle.mileage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="violations" className="space-y-4">
                  <h4 className="font-medium">Traffic Violations</h4>
                  {selectedVehicle.trafficViolations && selectedVehicle.trafficViolations.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVehicle.trafficViolations.map((violation, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{violation.violation}</span>
                              <span className="text-gray-600 ml-2">- {violation.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{violation.fine}</span>
                              <Badge variant={violation.status === "Paid" ? "default" : "destructive"}>
                                {violation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No traffic violations on record</p>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Vehicle Notes</h4>
                    <p className="text-gray-700">{selectedVehicle.notes}</p>
                  </div>

                  {selectedVehicle.modifications && selectedVehicle.modifications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Modifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVehicle.modifications.map((mod, index) => (
                          <Badge key={index} variant="outline">{mod}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedVehicle.inspectionHistory && selectedVehicle.inspectionHistory.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Inspection History</h4>
                      <div className="space-y-2">
                        {selectedVehicle.inspectionHistory.map((inspection, index) => (
                          <div key={index} className="p-2 border rounded text-sm">
                            <div className="flex justify-between">
                              <span>{inspection.date}</span>
                              <Badge variant={inspection.result === "Pass" ? "default" : "destructive"}>
                                {inspection.result}
                              </Badge>
                            </div>
                            <div className="text-gray-600">Inspector: {inspection.inspector}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for Law Enforcement */}
        {selectedVehicle && (
          <Card>
            <CardHeader>
              <CardTitle>Law Enforcement Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Issue Citation
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
                {selectedVehicle.status === "stolen" ? (
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Report Sighting
                  </Button>
                ) : (
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Stolen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
