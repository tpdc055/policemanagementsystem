"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CybercrimeStatsSection } from "@/components/dashboard/cybercrime-stats"
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

// ... existing code ... <component definition and all existing content until Quick Actions>

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

        {/* Cybercrime Unit Integration */}
        <CybercrimeStatsSection />

        // ... existing code ... <rest of the dashboard content>
