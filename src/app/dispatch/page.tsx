"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Radio,
  MapPin,
  Car,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Zap,
  Shield,
  Timer,
  Activity,
  Plus,
  RefreshCw
} from "lucide-react"
import type { User as UserType } from "@/types/user"

export default function DispatchPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedView, setSelectedView] = useState("units")
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispatch & Patrol Management</h1>
            <p className="text-gray-600">Real-time unit coordination and emergency response</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              New Dispatch
            </Button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Car className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Patrol vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-xs text-muted-foreground">Ready for dispatch</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Responding</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground">En route</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Scene</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Active incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
              <Phone className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-muted-foreground">Emergency calls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Timer className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">7m</div>
              <p className="text-xs text-muted-foreground">Average today</p>
            </CardContent>
          </Card>
        </div>

        {/* View Selector */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={selectedView === "units" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedView("units")}
          >
            <Car className="w-4 h-4 mr-2" />
            Units
          </Button>
          <Button
            variant={selectedView === "dispatches" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedView("dispatches")}
          >
            <Radio className="w-4 h-4 mr-2" />
            Active Dispatches
          </Button>
          <Button
            variant={selectedView === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedView("map")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Map View
          </Button>
        </div>

        {/* Content based on selected view */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedView === "units" && "Police Units"}
              {selectedView === "dispatches" && "Active Dispatches"}
              {selectedView === "map" && "Real-time Unit Locations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedView === "units" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Real-time monitoring of all police units with GPS tracking, status updates,
                  and resource management for Papua New Guinea operations.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-500" />
                      Patrol Units
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">8 units covering Port Moresby, Lae, Mt. Hagen</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      Response Units
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">3 rapid response teams for emergencies</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-green-500" />
                      Motorcycle Units
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">1 motorcycle unit for traffic enforcement</p>
                  </div>
                </div>
              </div>
            )}

            {selectedView === "dispatches" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Current emergency dispatches and response coordination across PNG.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <Badge variant="destructive">Emergency</Badge>
                    </div>
                    <h3 className="font-medium">Armed Robbery - ANZ Bank Boroko</h3>
                    <p className="text-sm text-gray-600">Unit Port-2 responding, ETA 5 minutes</p>
                  </div>
                  <div className="p-4 border rounded-lg border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <Badge variant="default">Urgent</Badge>
                    </div>
                    <h3 className="font-medium">Public Disturbance - Lae Market</h3>
                    <p className="text-sm text-gray-600">Unit Lae-1 on scene, situation under control</p>
                  </div>
                </div>
              </div>
            )}

            {selectedView === "map" && (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map View</h3>
                <p className="text-gray-600 mb-4">
                  Real-time GPS tracking of all police units across Papua New Guinea
                </p>
                <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium mb-2">Port Moresby Region</h4>
                    <p className="text-sm text-gray-600">3 units active, 2 available for dispatch</p>
                  </div>
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium mb-2">Lae Region</h4>
                    <p className="text-sm text-gray-600">1 unit on scene, emergency response</p>
                  </div>
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium mb-2">Mt. Hagen Region</h4>
                    <p className="text-sm text-gray-600">1 unit busy, traffic control operations</p>
                  </div>
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium mb-2">Coverage Statistics</h4>
                    <p className="text-sm text-gray-600">87% provincial coverage, 24/7 monitoring</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
