"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Radio,
  Send,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Phone,
  Car,
  Zap,
  Shield,
  Activity,
  Target,
  Plus,
  X,
  Navigation,
  Timer
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const PRIORITY_LEVELS = {
  "critical": { label: "Critical - Life Threatening", color: "bg-red-600", variant: "destructive" as const },
  "urgent": { label: "Urgent - Immediate Response", color: "bg-orange-500", variant: "default" as const },
  "routine": { label: "Routine - Standard Response", color: "bg-blue-500", variant: "default" as const },
  "low": { label: "Low Priority - When Available", color: "bg-green-500", variant: "secondary" as const }
}

const INCIDENT_TYPES = {
  "emergency": "Emergency Call",
  "crime_in_progress": "Crime in Progress",
  "accident": "Vehicle Accident",
  "domestic": "Domestic Disturbance",
  "medical": "Medical Emergency",
  "fire": "Fire/Rescue",
  "traffic": "Traffic Incident",
  "public_order": "Public Order",
  "suspicious": "Suspicious Activity",
  "welfare_check": "Welfare Check",
  "noise": "Noise Complaint",
  "theft": "Theft Report",
  "assault": "Assault",
  "burglary": "Burglary",
  "drug": "Drug Related",
  "gang": "Gang Activity",
  "tribal": "Tribal Conflict"
}

const PNG_LOCATIONS = [
  "Port Moresby Central", "Boroko", "Gerehu", "Waigani", "Kila Kila",
  "Lae Central", "Lae Top Town", "Eriku", "Taraka",
  "Mt. Hagen Central", "Kagamuga", "Hagen Market",
  "Vanimo Town", "Wewak", "Madang", "Kerema", "Daru"
]

// Mock available units
const AVAILABLE_UNITS = [
  {
    id: "UNIT-001",
    callSign: "Port-1",
    type: "Patrol",
    status: "Available",
    location: "Port Moresby Central",
    officers: ["Const. John Mendi", "Const. Grace Temu"],
    vehicle: "Toyota Hilux - PAA-123",
    eta: "5 min",
    specialization: "General Patrol"
  },
  {
    id: "UNIT-002",
    callSign: "Port-2",
    type: "Response",
    status: "Available",
    location: "Waigani",
    officers: ["Sgt. Maria Bani", "Const. Peter Kaupa"],
    vehicle: "Ford Ranger - PAA-456",
    eta: "8 min",
    specialization: "Emergency Response"
  },
  {
    id: "UNIT-003",
    callSign: "Lae-1",
    type: "CID",
    status: "Available",
    location: "Lae Central",
    officers: ["Det. Sarah Johnson", "Const. David Namaliu"],
    vehicle: "Toyota Landcruiser - LAE-789",
    eta: "15 min",
    specialization: "Criminal Investigation"
  },
  {
    id: "UNIT-004",
    callSign: "Traffic-1",
    type: "Traffic",
    status: "Busy",
    location: "Highway Checkpoint",
    officers: ["Const. Lisa Siaguru"],
    vehicle: "Motorcycle - TRF-111",
    eta: "20 min",
    specialization: "Traffic Enforcement"
  },
  {
    id: "UNIT-005",
    callSign: "Port-3",
    type: "Patrol",
    status: "Available",
    location: "Gerehu",
    officers: ["Const. Michael Kila", "Const. Helen Agarobe"],
    vehicle: "Toyota Hilux - PAA-789",
    eta: "12 min",
    specialization: "Community Patrol"
  }
]

export default function NewDispatchPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [dispatchData, setDispatchData] = useState({
    // Basic Information
    incidentType: "",
    priority: "",
    title: "",
    description: "",

    // Location Information
    address: "",
    landmark: "",
    coordinates: "",
    district: "",

    // Caller Information
    callerName: "",
    callerPhone: "",
    callerRelation: "",
    callerOnScene: false,

    // Response Information
    assignedUnits: [] as string[],
    responseTime: "",
    specialRequirements: "",
    backupRequired: false,

    // Additional Information
    weaponsInvolved: false,
    injuriesReported: false,
    suspectDescription: "",
    vehicleInvolved: "",
    evidenceNotes: "",

    // System Information
    dispatchedBy: "",
    dispatchTime: new Date().toISOString(),
    estimatedArrival: "",
    notes: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setDispatchData(prev => ({
      ...prev,
      dispatchedBy: parsedUser.name
    }))
  }, [router])

  const updateField = (field: string, value: string | boolean | string[]) => {
    setDispatchData(prev => ({ ...prev, [field]: value }))
  }

  const addUnit = (unitId: string) => {
    if (!dispatchData.assignedUnits.includes(unitId)) {
      updateField("assignedUnits", [...dispatchData.assignedUnits, unitId])
    }
  }

  const removeUnit = (unitId: string) => {
    updateField("assignedUnits", dispatchData.assignedUnits.filter(id => id !== unitId))
  }

  const calculateETA = () => {
    if (dispatchData.assignedUnits.length === 0) return "N/A"

    const assignedUnitETAs = dispatchData.assignedUnits.map(unitId => {
      const unit = AVAILABLE_UNITS.find(u => u.id === unitId)
      return unit ? Number.parseInt(unit.eta.replace(' min', '')) : 999
    })

    return `${Math.min(...assignedUnitETAs)} min`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate dispatch ID
      const dispatchId = `DISP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

      console.log("Dispatch Data:", { ...dispatchData, id: dispatchId })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push(`/dispatch`)
      }, 2000)

    } catch (error) {
      console.error("Error creating dispatch:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="min-h-96 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Dispatch Sent Successfully</h2>
              <p className="text-gray-600">Units have been notified and are responding.</p>
              <p className="text-sm text-gray-500">Redirecting to dispatch control...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Dispatch</h1>
            <p className="text-gray-600">Coordinate emergency response and unit assignment</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Dispatch ID will be auto-generated
            </Badge>
            <Badge variant={PRIORITY_LEVELS[dispatchData.priority as keyof typeof PRIORITY_LEVELS]?.variant || "outline"}>
              {dispatchData.priority ? PRIORITY_LEVELS[dispatchData.priority as keyof typeof PRIORITY_LEVELS].label : "No Priority Set"}
            </Badge>
          </div>
        </div>

        {/* Priority Alert */}
        {dispatchData.priority === "critical" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL PRIORITY:</strong> This is a life-threatening emergency. Units will respond immediately with lights and sirens.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="incident" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="incident">Incident Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="caller">Caller Details</TabsTrigger>
              <TabsTrigger value="units">Unit Assignment</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>

            <TabsContent value="incident" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Incident Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level *</Label>
                      <Select value={dispatchData.priority} onValueChange={(value) => updateField("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PRIORITY_LEVELS).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentType">Incident Type *</Label>
                      <Select value={dispatchData.incidentType} onValueChange={(value) => updateField("incidentType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(INCIDENT_TYPES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Incident Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the incident"
                      value={dispatchData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the incident..."
                      rows={4}
                      value={dispatchData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="weaponsInvolved"
                        checked={dispatchData.weaponsInvolved}
                        onChange={(e) => updateField("weaponsInvolved", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="weaponsInvolved" className="text-red-600 font-medium">
                        Weapons Involved
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="injuriesReported"
                        checked={dispatchData.injuriesReported}
                        onChange={(e) => updateField("injuriesReported", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="injuriesReported" className="text-orange-600 font-medium">
                        Injuries Reported
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="backupRequired"
                        checked={dispatchData.backupRequired}
                        onChange={(e) => updateField("backupRequired", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="backupRequired" className="text-blue-600 font-medium">
                        Backup Required
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address/Location *</Label>
                    <Input
                      id="address"
                      placeholder="Street address or specific location"
                      value={dispatchData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="district">District/Area</Label>
                      <Select value={dispatchData.district} onValueChange={(value) => updateField("district", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {PNG_LOCATIONS.map((location) => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark">Nearest Landmark</Label>
                      <Input
                        id="landmark"
                        placeholder="Nearest landmark or reference point"
                        value={dispatchData.landmark}
                        onChange={(e) => updateField("landmark", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinates">GPS Coordinates (if available)</Label>
                    <Input
                      id="coordinates"
                      placeholder="Latitude, Longitude"
                      value={dispatchData.coordinates}
                      onChange={(e) => updateField("coordinates", e.target.value)}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Location Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Include building numbers, floor levels, or unit numbers</li>
                      <li>• Mention cross streets or nearby intersections</li>
                      <li>• Note any access restrictions or security gates</li>
                      <li>• Consider visibility from main roads</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="caller" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Caller Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="callerName">Caller Name</Label>
                      <Input
                        id="callerName"
                        placeholder="Name of person reporting"
                        value={dispatchData.callerName}
                        onChange={(e) => updateField("callerName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="callerPhone">Contact Number *</Label>
                      <Input
                        id="callerPhone"
                        placeholder="+675 XXX XXXX"
                        value={dispatchData.callerPhone}
                        onChange={(e) => updateField("callerPhone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="callerRelation">Relationship to Incident</Label>
                      <Select value={dispatchData.callerRelation} onValueChange={(value) => updateField("callerRelation", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="victim">Victim</SelectItem>
                          <SelectItem value="witness">Witness</SelectItem>
                          <SelectItem value="bystander">Bystander</SelectItem>
                          <SelectItem value="family">Family Member</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                          <SelectItem value="security">Security Guard</SelectItem>
                          <SelectItem value="anonymous">Anonymous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <input
                        type="checkbox"
                        id="callerOnScene"
                        checked={dispatchData.callerOnScene}
                        onChange={(e) => updateField("callerOnScene", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="callerOnScene">
                        Caller is still on scene
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="units" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Unit Assignment
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        ETA: {calculateETA()}
                      </Badge>
                      <Badge variant="outline">
                        {dispatchData.assignedUnits.length} Units Assigned
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {AVAILABLE_UNITS.map((unit) => (
                      <div
                        key={unit.id}
                        className={`p-4 border rounded-lg ${
                          unit.status === "Busy" ? "opacity-50 bg-gray-50" : "hover:bg-gray-50"
                        } ${
                          dispatchData.assignedUnits.includes(unit.id) ? "border-blue-500 bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{unit.callSign}</h4>
                              <Badge variant="outline">{unit.type}</Badge>
                              <Badge variant={unit.status === "Available" ? "default" : "secondary"}>
                                {unit.status}
                              </Badge>
                              {dispatchData.assignedUnits.includes(unit.id) && (
                                <Badge variant="default" className="bg-blue-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Assigned
                                </Badge>
                              )}
                            </div>

                            <div className="grid gap-2 md:grid-cols-2 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span>{unit.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Timer className="w-3 h-3 text-gray-400" />
                                  <span>ETA: {unit.eta}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-gray-400" />
                                  <span>{unit.officers.join(", ")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Car className="w-3 h-3 text-gray-400" />
                                  <span>{unit.vehicle}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Target className="w-3 h-3 mr-1" />
                                {unit.specialization}
                              </Badge>
                            </div>
                          </div>

                          <div className="ml-4">
                            {unit.status === "Available" ? (
                              dispatchData.assignedUnits.includes(unit.id) ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeUnit(unit.id)}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => addUnit(unit.id)}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Assign
                                </Button>
                              )
                            ) : (
                              <Button size="sm" disabled>
                                <Clock className="w-4 h-4 mr-2" />
                                Busy
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="Special equipment, expertise, or support needed..."
                      rows={3}
                      value={dispatchData.specialRequirements}
                      onChange={(e) => updateField("specialRequirements", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="suspectDescription">Suspect Description</Label>
                    <Textarea
                      id="suspectDescription"
                      placeholder="Physical description, clothing, behavior, direction of travel..."
                      rows={3}
                      value={dispatchData.suspectDescription}
                      onChange={(e) => updateField("suspectDescription", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleInvolved">Vehicle Information</Label>
                    <Textarea
                      id="vehicleInvolved"
                      placeholder="Make, model, color, license plate, damage..."
                      rows={2}
                      value={dispatchData.vehicleInvolved}
                      onChange={(e) => updateField("vehicleInvolved", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidenceNotes">Evidence Notes</Label>
                    <Textarea
                      id="evidenceNotes"
                      placeholder="Potential evidence at scene, items to secure..."
                      rows={2}
                      value={dispatchData.evidenceNotes}
                      onChange={(e) => updateField("evidenceNotes", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Dispatch Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional information for responding officers..."
                      rows={3}
                      value={dispatchData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispatchedBy">Dispatched By</Label>
                    <Input
                      id="dispatchedBy"
                      value={dispatchData.dispatchedBy}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !dispatchData.priority || !dispatchData.title || dispatchData.assignedUnits.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Dispatching Units...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Units
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
