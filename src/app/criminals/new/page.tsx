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
  User,
  Save,
  Upload,
  Camera,
  Fingerprint,
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  FileText,
  Shield,
  Users,
  MapPin,
  Clock,
  Database
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

const DISTRICTS = {
  "National Capital District": ["Port Moresby", "Moresby South", "Moresby Northeast"],
  "Morobe Province": ["Lae", "Bulolo", "Finschhafen", "Huon Gulf", "Kabwum", "Markham", "Menyamya", "Nawae", "Tewae-Siassi"],
  "Western Highlands Province": ["Mt. Hagen", "Dei", "Mul Baiyer", "Tambul Nebilyer", "Anglimp South Wahgi"]
}

const CHARGE_CATEGORIES = {
  "violent": "Violent Crimes",
  "property": "Property Crimes",
  "drug": "Drug Offenses",
  "fraud": "Fraud & Financial",
  "gang": "Gang Related",
  "tribal": "Tribal Conflicts",
  "cyber": "Cybercrime",
  "trafficking": "Human/Drug Trafficking",
  "corruption": "Corruption",
  "domestic": "Domestic Violence",
  "traffic": "Traffic Offenses",
  "public_order": "Public Order"
}

const COMMON_CHARGES = {
  "violent": ["Murder", "Manslaughter", "Assault", "Armed Robbery", "Rape", "Kidnapping"],
  "property": ["Theft", "Burglary", "Breaking & Entering", "Vandalism", "Arson"],
  "drug": ["Drug Possession", "Drug Trafficking", "Drug Manufacturing", "Drug Distribution"],
  "fraud": ["Fraud", "Embezzlement", "Money Laundering", "Forgery", "Identity Theft"],
  "tribal": ["Tribal Fighting", "Payback Killing", "Compensation Disputes", "Land Disputes"],
  "gang": ["Gang Activity", "Racketeering", "Organized Crime", "Gang Violence"]
}

const KNOWN_GANGS = [
  "Raskol Gang Alpha", "Raskol Gang Beta", "PNG Drug Cartel", "Port Moresby Gang",
  "Lae Criminal Network", "Mt. Hagen Gang", "Youth Gang PNG", "Urban Raskols",
  "Highway Gang", "Market Gang", "Tribal Warriors"
]

export default function NewCriminalPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [criminalData, setCriminalData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    aliases: [] as string[],
    dateOfBirth: "",
    age: "",
    gender: "",
    nationality: "Papua New Guinean",
    province: "",
    district: "",
    village: "",

    // Physical Description
    height: "",
    weight: "",
    eyeColor: "",
    hairColor: "",
    scarsMarks: "",
    tattoos: "",
    physicalDescription: "",

    // Criminal Information
    threatLevel: "",
    status: "Active",
    charges: [] as string[],
    convictions: "",
    gangAffiliation: "",
    armedAndDangerous: false,

    // Biometric Data
    hasFingerprints: false,
    hasPhoto: false,
    hasDNA: false,
    biometricNotes: "",

    // Contact Information
    knownAddresses: [] as string[],
    phoneNumbers: [] as string[],
    associatedVehicles: [] as string[],

    // Family & Associates
    knownAssociates: [] as string[],
    familyMembers: [] as string[],
    emergencyContact: "",

    // Legal Information
    warrants: [] as string[],
    courtCases: [] as string[],
    probationOfficer: "",
    lastArrest: "",

    // Intelligence
    knownHabits: "",
    frequentLocations: "",
    operatingMethods: "",
    riskAssessment: "",

    // System Information
    addedBy: "",
    dateAdded: new Date().toISOString().split('T')[0],
    notes: ""
  })

  const [currentAlias, setCurrentAlias] = useState("")
  const [currentCharge, setCurrentCharge] = useState("")
  const [currentAddress, setCurrentAddress] = useState("")
  const [currentPhone, setCurrentPhone] = useState("")
  const [currentVehicle, setCurrentVehicle] = useState("")
  const [currentAssociate, setCurrentAssociate] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setCriminalData(prev => ({
      ...prev,
      addedBy: parsedUser.name
    }))
  }, [router])

  const updateField = (field: string, value: string | boolean | string[]) => {
    setCriminalData(prev => ({ ...prev, [field]: value }))
  }

  const addToArray = (field: string, value: string, currentSetter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = criminalData[field as keyof typeof criminalData] as string[]
      if (!currentArray.includes(value.trim())) {
        updateField(field, [...currentArray, value.trim()])
        currentSetter("")
      }
    }
  }

  const removeFromArray = (field: string, index: number) => {
    const currentArray = criminalData[field as keyof typeof criminalData] as string[]
    updateField(field, currentArray.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate criminal ID
      const criminalId = `CRIM-${String(Math.floor(Math.random() * 9000) + 1000)}`

      console.log("Criminal Data:", { ...criminalData, id: criminalId })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push(`/criminals/${criminalId}`)
      }, 2000)

    } catch (error) {
      console.error("Error creating criminal profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableDistricts = () => {
    return DISTRICTS[criminalData.province as keyof typeof DISTRICTS] || []
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
              <h2 className="text-xl font-semibold">Criminal Profile Created</h2>
              <p className="text-gray-600">The criminal profile has been added to the database.</p>
              <p className="text-sm text-gray-500">Redirecting to profile...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Add Criminal Profile</h1>
            <p className="text-gray-600">Create a new criminal record with comprehensive information</p>
          </div>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Criminal ID will be auto-generated
          </Badge>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Confidential:</strong> All information entered will be encrypted and access-controlled.
            Ensure accuracy as this will be used for law enforcement operations.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="criminal">Criminal Info</TabsTrigger>
              <TabsTrigger value="biometric">Biometrics</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="legal">Legal Status</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={criminalData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={criminalData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Known Aliases</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter alias"
                        value={currentAlias}
                        onChange={(e) => setCurrentAlias(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addToArray("aliases", currentAlias, setCurrentAlias)
                          }
                        }}
                      />
                      <Button type="button" onClick={() => addToArray("aliases", currentAlias, setCurrentAlias)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {criminalData.aliases.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {criminalData.aliases.map((alias, index) => (
                          <Badge key={index} variant="outline">
                            {alias}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="ml-2 h-4 w-4 p-0"
                              onClick={() => removeFromArray("aliases", index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={criminalData.dateOfBirth}
                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age (if DOB unknown)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Estimated age"
                        value={criminalData.age}
                        onChange={(e) => updateField("age", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={criminalData.gender} onValueChange={(value) => updateField("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select value={criminalData.province} onValueChange={(value) => updateField("province", value)}>
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

                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select value={criminalData.district} onValueChange={(value) => updateField("district", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableDistricts().map((district) => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="village">Village/Suburb</Label>
                      <Input
                        id="village"
                        placeholder="Village or suburb"
                        value={criminalData.village}
                        onChange={(e) => updateField("village", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Physical Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        placeholder="e.g., 5'8&quot;"
                        value={criminalData.height}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        placeholder="e.g., 180lbs"
                        value={criminalData.weight}
                        onChange={(e) => updateField("weight", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eyeColor">Eye Color</Label>
                      <Select value={criminalData.eyeColor} onValueChange={(value) => updateField("eyeColor", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Eye color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Blue">Blue</SelectItem>
                          <SelectItem value="Green">Green</SelectItem>
                          <SelectItem value="Hazel">Hazel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hairColor">Hair Color</Label>
                      <Select value={criminalData.hairColor} onValueChange={(value) => updateField("hairColor", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Hair color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Blonde">Blonde</SelectItem>
                          <SelectItem value="Gray">Gray</SelectItem>
                          <SelectItem value="Bald">Bald</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scarsMarks">Scars & Marks</Label>
                    <Textarea
                      id="scarsMarks"
                      placeholder="Describe any visible scars, birthmarks, or other identifying marks..."
                      value={criminalData.scarsMarks}
                      onChange={(e) => updateField("scarsMarks", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tattoos">Tattoos</Label>
                    <Textarea
                      id="tattoos"
                      placeholder="Describe tattoos, their location, and any significance..."
                      value={criminalData.tattoos}
                      onChange={(e) => updateField("tattoos", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="physicalDescription">General Physical Description</Label>
                    <Textarea
                      id="physicalDescription"
                      placeholder="Overall physical appearance, build, posture, etc..."
                      value={criminalData.physicalDescription}
                      onChange={(e) => updateField("physicalDescription", e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="criminal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Criminal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="threatLevel">Threat Level *</Label>
                      <Select value={criminalData.threatLevel} onValueChange={(value) => updateField("threatLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select threat level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="extreme">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={criminalData.status} onValueChange={(value) => updateField("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Wanted">Wanted</SelectItem>
                          <SelectItem value="In Custody">In Custody</SelectItem>
                          <SelectItem value="Released">Released</SelectItem>
                          <SelectItem value="Deceased">Deceased</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="convictions">Number of Convictions</Label>
                      <Input
                        id="convictions"
                        type="number"
                        placeholder="0"
                        value={criminalData.convictions}
                        onChange={(e) => updateField("convictions", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Charges & Offenses</Label>
                    <div className="flex gap-2">
                      <Select value={currentCharge} onValueChange={setCurrentCharge}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select common charge" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(COMMON_CHARGES).map(([category, charges]) => (
                            <div key={category}>
                              <div className="font-medium text-sm px-2 py-1 text-gray-600">
                                {CHARGE_CATEGORIES[category as keyof typeof CHARGE_CATEGORIES]}
                              </div>
                              {charges.map((charge) => (
                                <SelectItem key={charge} value={charge}>{charge}</SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={() => addToArray("charges", currentCharge, setCurrentCharge)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {criminalData.charges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {criminalData.charges.map((charge, index) => (
                          <Badge key={index} variant="destructive">
                            {charge}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="ml-2 h-4 w-4 p-0 text-white hover:text-red-600"
                              onClick={() => removeFromArray("charges", index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gangAffiliation">Gang Affiliation</Label>
                    <Select value={criminalData.gangAffiliation} onValueChange={(value) => updateField("gangAffiliation", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gang or none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Gang Affiliation</SelectItem>
                        {KNOWN_GANGS.map((gang) => (
                          <SelectItem key={gang} value={gang}>{gang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="armedAndDangerous"
                      checked={criminalData.armedAndDangerous}
                      onChange={(e) => updateField("armedAndDangerous", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="armedAndDangerous" className="text-red-600 font-medium">
                      Armed and Dangerous
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="biometric" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5" />
                    Biometric Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg text-center">
                      <Fingerprint className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                      <div className="flex items-center justify-center space-x-2">
                        <input
                          type="checkbox"
                          id="hasFingerprints"
                          checked={criminalData.hasFingerprints}
                          onChange={(e) => updateField("hasFingerprints", e.target.checked)}
                        />
                        <Label htmlFor="hasFingerprints">Fingerprints Available</Label>
                      </div>
                      <Button size="sm" className="mt-2" disabled={!criminalData.hasFingerprints}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Prints
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <Camera className="mx-auto h-12 w-12 text-green-500 mb-2" />
                      <div className="flex items-center justify-center space-x-2">
                        <input
                          type="checkbox"
                          id="hasPhoto"
                          checked={criminalData.hasPhoto}
                          onChange={(e) => updateField("hasPhoto", e.target.checked)}
                        />
                        <Label htmlFor="hasPhoto">Photo Available</Label>
                      </div>
                      <Button size="sm" className="mt-2" disabled={!criminalData.hasPhoto}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <Database className="mx-auto h-12 w-12 text-purple-500 mb-2" />
                      <div className="flex items-center justify-center space-x-2">
                        <input
                          type="checkbox"
                          id="hasDNA"
                          checked={criminalData.hasDNA}
                          onChange={(e) => updateField("hasDNA", e.target.checked)}
                        />
                        <Label htmlFor="hasDNA">DNA Sample Available</Label>
                      </div>
                      <Button size="sm" className="mt-2" disabled={!criminalData.hasDNA}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload DNA Data
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biometricNotes">Biometric Notes</Label>
                    <Textarea
                      id="biometricNotes"
                      placeholder="Notes about biometric data quality, collection circumstances, etc..."
                      value={criminalData.biometricNotes}
                      onChange={(e) => updateField("biometricNotes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Intelligence Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="knownHabits">Known Habits & Patterns</Label>
                    <Textarea
                      id="knownHabits"
                      placeholder="Behavioral patterns, habits, preferred methods of operation..."
                      value={criminalData.knownHabits}
                      onChange={(e) => updateField("knownHabits", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequentLocations">Frequent Locations</Label>
                    <Textarea
                      id="frequentLocations"
                      placeholder="Places commonly frequented, hideouts, meeting spots..."
                      value={criminalData.frequentLocations}
                      onChange={(e) => updateField("frequentLocations", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operatingMethods">Operating Methods</Label>
                    <Textarea
                      id="operatingMethods"
                      placeholder="Modus operandi, preferred methods, techniques used..."
                      value={criminalData.operatingMethods}
                      onChange={(e) => updateField("operatingMethods", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskAssessment">Risk Assessment</Label>
                    <Textarea
                      id="riskAssessment"
                      placeholder="Assessment of risk to public, officers, likelihood of violence..."
                      value={criminalData.riskAssessment}
                      onChange={(e) => updateField("riskAssessment", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Legal Status & System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lastArrest">Last Arrest Date</Label>
                      <Input
                        id="lastArrest"
                        type="date"
                        value={criminalData.lastArrest}
                        onChange={(e) => updateField("lastArrest", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="probationOfficer">Probation Officer</Label>
                      <Input
                        id="probationOfficer"
                        placeholder="Assigned probation officer"
                        value={criminalData.probationOfficer}
                        onChange={(e) => updateField("probationOfficer", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addedBy">Added By</Label>
                    <Input
                      id="addedBy"
                      value={criminalData.addedBy}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information or notes..."
                      value={criminalData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      rows={4}
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
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Criminal Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
