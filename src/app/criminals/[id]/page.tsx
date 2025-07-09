"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User as UserIcon,
  MapPin,
  Calendar,
  Phone,
  Shield,
  AlertTriangle,
  Fingerprint,
  Camera,
  Database,
  FileText,
  Users,
  Edit,
  Printer,
  Download,
  Eye,
  Clock,
  Scale,
  Car,
  Home,
  Target,
  Activity,

  CheckCircle
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// TypeScript interfaces for criminal data
interface CaseHistoryItem {
  caseId: string
  title: string
  date: string
  status: string
  role: string
  charges: string[]
}

interface ArrestHistoryItem {
  date: string
  location: string
  charges: string[]
  outcome: string
  arrestingOfficer: string
}

interface Criminal {
  id: string
  firstName: string
  lastName: string
  aliases: string[]
  dateOfBirth: string
  age: number
  gender: string
  nationality: string
  province: string
  district: string
  village: string
  height: string
  weight: string
  eyeColor: string
  hairColor: string
  scarsMarks: string
  tattoos: string
  physicalDescription: string
  threatLevel: string
  status: string
  charges: string[]
  convictions: number
  gangAffiliation: string
  armedAndDangerous: boolean
  hasFingerprints: boolean
  hasPhoto: boolean
  photo?: string
  hasDNA: boolean
  biometricNotes: string
  knownAddresses: string[]
  phoneNumbers: string[]
  associatedVehicles: string[]
  knownAssociates: string[]
  familyMembers: string[]
  emergencyContact: string
  warrants: string[]
  courtCases: string[]
  probationOfficer: string
  lastArrest: string
  knownHabits: string
  frequentLocations: string
  operatingMethods: string
  riskAssessment: string
  lastSeen: string
  lastSeenDate: string
  lastSeenBy: string
  addedBy: string
  dateAdded: string
  lastUpdated: string
  notes: string
  caseHistory: CaseHistoryItem[]
  arrestHistory: ArrestHistoryItem[]
}

// TypeScript interfaces for criminal data
interface CaseHistoryItem {
  caseId: string
  title: string
  date: string
  status: string
  role: string
  charges: string[]
}

interface ArrestHistoryItem {
  date: string
  location: string
  charges: string[]
  outcome: string
  arrestingOfficer: string
}

interface Criminal {
  id: string
  firstName: string
  lastName: string
  aliases: string[]
  dateOfBirth: string
  age: number
  gender: string
  nationality: string
  province: string
  district: string
  village: string
  height: string
  weight: string
  eyeColor: string
  hairColor: string
  scarsMarks: string
  tattoos: string
  physicalDescription: string
  threatLevel: string
  status: string
  charges: string[]
  convictions: number
  gangAffiliation: string
  armedAndDangerous: boolean
  hasFingerprints: boolean
  hasPhoto: boolean
  photo?: string
  hasDNA: boolean
  biometricNotes: string
  knownAddresses: string[]
  phoneNumbers: string[]
  associatedVehicles: string[]
  knownAssociates: string[]
  familyMembers: string[]
  emergencyContact: string
  warrants: string[]
  courtCases: string[]
  probationOfficer: string
  lastArrest: string
  knownHabits: string
  frequentLocations: string
  operatingMethods: string
  riskAssessment: string
  lastSeen: string
  lastSeenDate: string
  lastSeenBy: string
  addedBy: string
  dateAdded: string
  lastUpdated: string
  notes: string
  caseHistory: CaseHistoryItem[]
  arrestHistory: ArrestHistoryItem[]
}

// Mock criminal data - in real app this would come from database
const getCriminalData = (id: string) => {
  const criminals = {
    "CRIM-001": {
      id: "CRIM-001",
      firstName: "John",
      lastName: "Kaupa",
      aliases: ["Johnny K", "Big John", "JK"],
      dateOfBirth: "1989-03-15",
      age: 35,
      gender: "Male",
      nationality: "Papua New Guinean",
      province: "National Capital District",
      district: "Port Moresby",
      village: "Gerehu",
      height: "5'8\"",
      weight: "180lbs",
      eyeColor: "Brown",
      hairColor: "Black",
      scarsMarks: "Scar above left eyebrow, burn mark on right hand",
      tattoos: "Tribal tattoo on left arm, 'PNG' on right shoulder",
      physicalDescription: "Muscular build, walks with slight limp on left leg",
      threatLevel: "high",
      status: "Wanted",
      charges: ["Armed Robbery", "Assault with Weapon", "Theft", "Intimidation"],
      convictions: 3,
      gangAffiliation: "Raskol Gang Alpha",
      armedAndDangerous: true,
      hasFingerprints: true,
      hasPhoto: true,
      hasDNA: true,
      biometricNotes: "Fingerprints collected during 2020 arrest, DNA from blood sample",
      knownAddresses: ["Gerehu Stage 4, Port Moresby", "Kila Kila Settlement", "Morata 2"],
      phoneNumbers: ["+675 7123 4567", "+675 8234 5678"],
      associatedVehicles: ["White Toyota Hilux - AAA123", "Red Honda Civic - BBB456"],
      knownAssociates: ["Maria Bani", "Peter Namaliu", "Tony Agarobe"],
      familyMembers: ["Grace Kaupa (Mother)", "Paul Kaupa (Brother)", "Susan Kaupa (Sister)"],
      emergencyContact: "Grace Kaupa - +675 325 8901",
      warrants: ["Armed Robbery Warrant #2024-001", "Assault Warrant #2024-045"],
      courtCases: ["PNG vs Kaupa 2020", "PNG vs Kaupa 2022"],
      probationOfficer: "Officer Michael Temu",
      lastArrest: "2022-08-15",
      knownHabits: "Frequents PMV stops, often seen at night markets, drinks at local bars",
      frequentLocations: "Boroko Market, Ela Beach, Gerehu Settlement, Waigani shops",
      operatingMethods: "Uses intimidation, works in groups of 3-4, targets isolated victims",
      riskAssessment: "High risk of violence, known to carry weapons, unpredictable behavior",
      lastSeen: "Port Moresby Central Market",
      lastSeenDate: "2024-01-10",
      lastSeenBy: "Const. Lisa Kaupa",
      addedBy: "Det. Sarah Johnson",
      dateAdded: "2020-03-20",
      lastUpdated: "2024-01-15",
      notes: "Subject is considered extremely dangerous. Use caution when approaching. Has history of resisting arrest.",
      caseHistory: [
        {
          caseId: "CASE-2024-001",
          title: "Armed Robbery at ANZ Bank",
          date: "2024-01-10",
          status: "Active",
          role: "Primary Suspect",
          charges: ["Armed Robbery", "Assault"]
        },
        {
          caseId: "CASE-2022-156",
          title: "Aggravated Assault",
          date: "2022-08-15",
          status: "Convicted",
          role: "Defendant",
          charges: ["Assault", "Intimidation"]
        },
        {
          caseId: "CASE-2020-089",
          title: "Theft from Motor Vehicle",
          date: "2020-05-22",
          status: "Convicted",
          role: "Defendant",
          charges: ["Theft", "Damage to Property"]
        }
      ],
      arrestHistory: [
        {
          date: "2022-08-15",
          location: "Gerehu Stage 4",
          charges: ["Assault", "Intimidation"],
          outcome: "Convicted - 18 months imprisonment",
          arrestingOfficer: "Sgt. Michael Kila"
        },
        {
          date: "2020-05-22",
          location: "Boroko Market",
          charges: ["Theft", "Damage to Property"],
          outcome: "Convicted - 12 months suspended sentence",
          arrestingOfficer: "Const. David Bani"
        },
        {
          date: "2020-03-20",
          location: "Waigani",
          charges: ["Public Disturbance"],
          outcome: "Released - Warning issued",
          arrestingOfficer: "Const. Helen Siaguru"
        }
      ]
    }
  }

  return criminals[id as keyof typeof criminals] || null
}

export default function CriminalProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [criminal, setCriminal] = useState<Criminal | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    // Load criminal data
    const criminalData = getCriminalData(params.id as string)
    if (criminalData) {
      setCriminal(criminalData)
    }
    setLoading(false)
  }, [router, params.id])

  if (!user || loading) {
    return <div>Loading...</div>
  }

  if (!criminal) {
    return (
      <DashboardLayout>
        <div className="min-h-96 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="text-xl font-semibold">Criminal Not Found</h2>
              <p className="text-gray-600">The requested criminal profile could not be found.</p>
              <Link href="/criminals">
                <Button>Return to Criminal Database</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const getThreatLevelBadge = (level: string) => {
    const variants = {
      "extreme": "destructive" as const,
      "high": "destructive" as const,
      "medium": "default" as const,
      "low": "secondary" as const
    }
    return variants[level as keyof typeof variants] || "default"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={criminal.photo} />
              <AvatarFallback className="bg-gray-200 text-2xl">
                {criminal.firstName[0]}{criminal.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{criminal.firstName} {criminal.lastName}</h1>
                <Badge variant="outline">ID: {criminal.id}</Badge>
                {criminal.armedAndDangerous && (
                  <Badge variant="destructive" className="animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Armed & Dangerous
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  {criminal.age} years, {criminal.gender}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {criminal.district}, {criminal.province}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last seen: {criminal.lastSeenDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={getThreatLevelBadge(criminal.threatLevel)}>
                  {criminal.threatLevel.toUpperCase()} THREAT
                </Badge>
                <Badge variant={criminal.status === "Wanted" ? "destructive" : "default"}>
                  {criminal.status.toUpperCase()}
                </Badge>
                {criminal.gangAffiliation && (
                  <Badge variant="destructive">
                    <Users className="w-3 h-3 mr-1" />
                    {criminal.gangAffiliation}
                  </Badge>
                )}
              </div>

              {criminal.aliases.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Known as: </span>
                  {criminal.aliases.map((alias: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {alias}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Alert for Armed & Dangerous */}
        {criminal.armedAndDangerous && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>WARNING: ARMED AND DANGEROUS</strong> - Subject is known to carry weapons and has history of violence.
              Exercise extreme caution. Do not approach alone.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Charges */}
        {criminal.charges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Current Charges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {criminal.charges.map((charge: string, index: number) => (
                  <Badge key={index} variant="destructive">
                    {charge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="history">Case History</TabsTrigger>
            <TabsTrigger value="associates">Associates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{criminal.firstName} {criminal.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium">{criminal.dateOfBirth || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{criminal.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{criminal.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="font-medium">{criminal.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Province:</span>
                      <span className="font-medium">{criminal.province}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">District:</span>
                      <span className="font-medium">{criminal.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Village:</span>
                      <span className="font-medium">{criminal.village}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Criminal Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Threat Level:</span>
                      <Badge variant={getThreatLevelBadge(criminal.threatLevel)}>
                        {criminal.threatLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <Badge variant={criminal.status === "Wanted" ? "destructive" : "default"}>
                        {criminal.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Convictions:</span>
                      <span className="font-medium">{criminal.convictions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gang Affiliation:</span>
                      <span className="font-medium">{criminal.gangAffiliation || "None"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Arrest:</span>
                      <span className="font-medium">{criminal.lastArrest || "Never"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Probation Officer:</span>
                      <span className="font-medium">{criminal.probationOfficer || "None"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Last Known Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <span className="text-gray-600 text-sm">Last Seen Location:</span>
                    <div className="font-medium">{criminal.lastSeen}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Last Seen Date:</span>
                    <div className="font-medium">{criminal.lastSeenDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Reported By:</span>
                    <div className="font-medium">{criminal.lastSeenBy}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Physical Characteristics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">{criminal.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{criminal.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Eye Color:</span>
                      <span className="font-medium">{criminal.eyeColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hair Color:</span>
                      <span className="font-medium">{criminal.hairColor}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Identifying Marks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Scars & Marks:</span>
                    <div className="font-medium">{criminal.scarsMarks}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Tattoos:</span>
                    <div className="font-medium">{criminal.tattoos}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Physical Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{criminal.physicalDescription}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biometrics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5" />
                    Fingerprints
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  {criminal.hasFingerprints ? (
                    <>
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                      <Badge variant="default">Available</Badge>
                      <Button size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Prints
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                      <Badge variant="secondary">Not Available</Badge>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photographs
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  {criminal.hasPhoto ? (
                    <>
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                      <Badge variant="default">Available</Badge>
                      <Button size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Photos
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                      <Badge variant="secondary">Not Available</Badge>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    DNA Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  {criminal.hasDNA ? (
                    <>
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                      <Badge variant="default">Available</Badge>
                      <Button size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                      <Badge variant="secondary">Not Available</Badge>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {criminal.biometricNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Biometric Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{criminal.biometricNotes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Known Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{criminal.knownHabits}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Frequent Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{criminal.frequentLocations}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Operating Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{criminal.operatingMethods}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{criminal.riskAssessment}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Known Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criminal.knownAddresses.map((address: string, index: number) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        {address}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Phone Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criminal.phoneNumbers.map((phone: string, index: number) => (
                      <div key={index} className="p-2 border rounded text-sm font-mono">
                        {phone}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Associated Vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criminal.associatedVehicles.map((vehicle: string, index: number) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        {vehicle}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Case History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criminal.caseHistory.map((case_: CaseHistoryItem, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{case_.title}</h4>
                          <p className="text-sm text-gray-600">Case ID: {case_.caseId}</p>
                        </div>
                        <Badge variant={case_.status === "Active" ? "destructive" : "default"}>
                          {case_.status}
                        </Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span> {case_.date}
                        </div>
                        <div>
                          <span className="text-gray-600">Role:</span> {case_.role}
                        </div>
                        <div>
                          <span className="text-gray-600">Charges:</span> {case_.charges.join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Arrest History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criminal.arrestHistory.map((arrest: ArrestHistoryItem, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">Arrest #{criminal.arrestHistory.length - index}</h4>
                          <p className="text-sm text-gray-600">{arrest.date} - {arrest.location}</p>
                        </div>
                        <Badge variant="outline">{arrest.charges.join(", ")}</Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div>
                          <span className="text-gray-600">Arresting Officer:</span> {arrest.arrestingOfficer}
                        </div>
                        <div>
                          <span className="text-gray-600">Outcome:</span> {arrest.outcome}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="associates" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Known Associates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criminal.knownAssociates.map((associate: string, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span>{associate}</span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Family Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criminal.familyMembers.map((member: string, index: number) => (
                      <div key={index} className="p-2 border rounded">
                        {member}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{criminal.emergencyContact}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Issue BOLO Alert
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Create Case
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Add Sighting
              </Button>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Update Information
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
