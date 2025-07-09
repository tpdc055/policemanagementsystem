"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  MapPin,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  Target,
  PieChart,
  Activity
} from "lucide-react"
import type { User as UserType } from "@/types/user"

export default function AnalyticsPage() {
  const [user, setUser] = useState<UserType | null>(null)
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600">Crime statistics, trends, and performance metrics for Papua New Guinea</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PieChart className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crime Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-12%</div>
              <p className="text-xs text-green-600">↓ Down from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5m</div>
              <p className="text-xs text-green-600">↓ 2m faster</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-green-600">↑ +5% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Officer Efficiency</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-blue-600">↑ +3% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hotspots</CardTitle>
              <MapPin className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-orange-600">Active crime areas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Crime Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Theft/Burglary</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 h-2 rounded-full w-16" />
                    <span className="text-sm">32%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Domestic Violence</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-red-500 h-2 rounded-full w-12" />
                    <span className="text-sm">24%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Traffic Offenses</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500 h-2 rounded-full w-10" />
                    <span className="text-sm">18%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tribal Fighting</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500 h-2 rounded-full w-8" />
                    <span className="text-sm">15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Crime Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded border-red-200 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="destructive" className="mb-1">High Risk</Badge>
                      <h4 className="font-medium">Gerehu Suburb</h4>
                    </div>
                    <span className="text-lg font-bold text-red-600">23</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded border-orange-200 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="default" className="mb-1">Medium Risk</Badge>
                      <h4 className="font-medium">Lae Market Area</h4>
                    </div>
                    <span className="text-lg font-bold text-orange-600">15</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded border-yellow-200 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="secondary" className="mb-1">Watch Area</Badge>
                      <h4 className="font-medium">Mt. Hagen CBD</h4>
                    </div>
                    <span className="text-lg font-bold text-yellow-600">8</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Regional Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">National Capital District</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Incidents:</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <span className="text-green-600">76 (85%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>7.2m</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Morobe Province</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Incidents:</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <span className="text-green-600">32 (71%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>9.8m</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Western Highlands</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Incidents:</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <span className="text-green-600">48 (72%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>11.5m</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Southern Highlands</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Incidents:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <span className="text-green-600">19 (83%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>8.9m</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
