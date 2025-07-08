"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  Users,
  Car,
  Database,
  BarChart3,
  Plus,
  Eye,
  User,
  Calendar,
  Target
} from "lucide-react"
import type { User } from "@/types/user"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name}
            </h1>
            <p className="text-gray-600">
              Royal Papua New Guinea Constabulary - {user.role}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Badge #{user.badgeNumber}
            </Badge>
            <Badge variant="default" className="text-sm bg-green-600">
              On Duty
            </Badge>
          </div>
        </div>

        {/* Emergency Alerts */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Active BOLO Alert:</strong> Armed robbery suspect, white Toyota Hilux, license AAA123.
            Last seen Port Moresby Central Market. Use extreme caution.
          </AlertDescription>
        </Alert>

        {/* Key Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-red-600">
                +3 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-blue-600">
                12 solved this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Officers on Duty</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-green-600">
                92% deployment rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5m</div>
              <p className="text-xs text-green-600">
                ↓ 2min faster
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/incidents/new">
                <Button className="w-full h-20 flex flex-col gap-2 bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="w-6 h-6" />
                  <span>Report Incident</span>
                </Button>
              </Link>

              <Link href="/cases/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span>New Case</span>
                </Button>
              </Link>

              <Link href="/dispatch">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Phone className="w-6 h-6" />
                  <span>Emergency Dispatch</span>
                </Button>
              </Link>

              <Link href="/criminals/search">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Database className="w-6 h-6" />
                  <span>Search Criminal</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Alerts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Armed Robbery - Boroko Market</p>
                    <p className="text-xs text-gray-600">Incident #INC-2024-001 • 25 minutes ago</p>
                    <Badge variant="destructive" className="mt-1 text-xs">High Priority</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Case Closed - Theft Investigation</p>
                    <p className="text-xs text-gray-600">Case #CASE-2024-045 • 2 hours ago</p>
                    <Badge variant="default" className="mt-1 text-xs bg-green-600">Resolved</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Criminal Profile Added</p>
                    <p className="text-xs text-gray-600">Profile #CRIM-2024-012 • 4 hours ago</p>
                    <Badge variant="outline" className="mt-1 text-xs">Database Update</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Patrol Route Completed</p>
                    <p className="text-xs text-gray-600">Unit #12 - Gerehu Area • 6 hours ago</p>
                    <Badge variant="outline" className="mt-1 text-xs">Routine</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Regional Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded border-red-200 border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">National Capital District</h4>
                    <Badge variant="destructive">High Activity</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Incidents:</span>
                      <div className="font-medium">15</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Units:</span>
                      <div className="font-medium">23</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Response:</span>
                      <div className="font-medium">7.2m</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded border-yellow-200 border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Morobe Province</h4>
                    <Badge variant="default">Normal</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Incidents:</span>
                      <div className="font-medium">5</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Units:</span>
                      <div className="font-medium">12</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Response:</span>
                      <div className="font-medium">9.8m</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded border-green-200 border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Southern Highlands</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Low Activity</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Incidents:</span>
                      <div className="font-medium">2</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Units:</span>
                      <div className="font-medium">8</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Response:</span>
                      <div className="font-medium">12.1m</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
              <Link href="/analytics">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>

              <Link href="/personnel">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Personnel
                </Button>
              </Link>

              <Link href="/vehicles/search">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Car className="w-4 h-4 mr-2" />
                  Vehicles
                </Button>
              </Link>

              <Link href="/evidence">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Evidence
                </Button>
              </Link>

              <Link href="/crime-mapping">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Crime Map
                </Button>
              </Link>

              <Link href="/patrol/assign">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Patrol
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
