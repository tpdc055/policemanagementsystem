"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Database,
  AlertTriangle,
  Eye,
  Plus,
  Search,
  Users,
  Fingerprint,
  Camera,
  Shield,
  AlertCircle
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const MOCK_CRIMINALS = [
  {
    id: "CRIM-001",
    name: "John Kaupa",
    age: 35,
    gender: "Male",
    threat: "High",
    status: "Wanted",
    lastSeen: "Port Moresby",
    charges: "Armed Robbery, Assault",
    gang: "Raskol Gang Alpha"
  },
  {
    id: "CRIM-002",
    name: "Maria Bani",
    age: 28,
    gender: "Female",
    threat: "Medium",
    status: "Arrested",
    lastSeen: "Lae",
    charges: "Fraud, Embezzlement",
    gang: null
  },
  {
    id: "CRIM-003",
    name: "Peter Namaliu",
    age: 42,
    gender: "Male",
    threat: "Extreme",
    status: "Wanted",
    lastSeen: "Mt. Hagen",
    charges: "Drug Trafficking, Money Laundering",
    gang: "PNG Drug Cartel"
  }
]

export default function CriminalsPage() {
  const [user, setUser] = useState<UserType | null>(null)
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

  const filteredCriminals = MOCK_CRIMINALS.filter(criminal =>
    criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criminal.charges.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criminal Records Database</h1>
            <p className="text-gray-600">Manage criminal profiles, history, and biometric data</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Criminal Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Database className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_CRIMINALS.length}</div>
              <p className="text-xs text-muted-foreground">Criminal profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wanted</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {MOCK_CRIMINALS.filter(c => c.status === "Wanted").length}
              </div>
              <p className="text-xs text-muted-foreground">Active warrants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Threat</CardTitle>
              <Shield className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_CRIMINALS.filter(c => ["Extreme", "High"].includes(c.threat)).length}
              </div>
              <p className="text-xs text-muted-foreground">Dangerous individuals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gang Members</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_CRIMINALS.filter(c => c.gang).length}
              </div>
              <p className="text-xs text-muted-foreground">Organized crime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biometrics</CardTitle>
              <Fingerprint className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {MOCK_CRIMINALS.length}
              </div>
              <p className="text-xs text-muted-foreground">With fingerprints</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photos</CardTitle>
              <Camera className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {MOCK_CRIMINALS.length}
              </div>
              <p className="text-xs text-muted-foreground">With mugshots</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Criminal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or charges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert for Dangerous Individuals */}
        {filteredCriminals.filter(c => c.threat === "Extreme" && c.status === "Wanted").length > 0 && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <div className="text-red-800">
                <strong>Alert:</strong> {filteredCriminals.filter(c => c.threat === "Extreme" && c.status === "Wanted").length}
                {' '}extremely dangerous individuals are currently wanted. Exercise extreme caution.
              </div>
            </div>
          </div>
        )}

        {/* Criminal Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Criminal Records ({filteredCriminals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Criminal ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Threat Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gang Affiliation</TableHead>
                  <TableHead>Primary Charges</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCriminals.map((criminal) => (
                  <TableRow key={criminal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-200">
                          {criminal.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{criminal.id}</TableCell>
                    <TableCell className="font-medium">{criminal.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{criminal.age} years</div>
                        <div className="text-gray-500">{criminal.gender}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        criminal.threat === "Extreme" ? "destructive" :
                        criminal.threat === "High" ? "destructive" :
                        criminal.threat === "Medium" ? "default" : "secondary"
                      }>
                        {criminal.threat}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={criminal.status === "Wanted" ? "destructive" : "default"}>
                        {criminal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {criminal.gang ? (
                        <Badge variant="destructive" className="text-xs">
                          {criminal.gang}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate">{criminal.charges}</div>
                    </TableCell>
                    <TableCell>{criminal.lastSeen}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
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
