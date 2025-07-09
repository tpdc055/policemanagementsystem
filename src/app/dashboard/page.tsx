"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CybercrimeStatsSection } from "@/components/dashboard/cybercrime-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Clock, FileText, Phone, Shield, Users, Car, Database, Target } from "lucide-react"
import type { User } from "@/types/user"

export default function DashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.push('/')
      return
    }
    setCurrentUser(JSON.parse(user))
  }, [router])

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Incidents</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cases</p>
                  <p className="text-2xl font-bold">67</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Officers</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vehicles</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <Car className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
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

        <CybercrimeStatsSection />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All systems operational. Database backup completed successfully.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
