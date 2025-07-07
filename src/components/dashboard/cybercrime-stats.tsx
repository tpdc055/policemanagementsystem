"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  ExternalLink,
  RefreshCw,
  Loader2,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import { cybercrimeApi, type CybercrimeStats } from "@/lib/cybercrime-api"

export function CybercrimeStatsSection() {
  const [stats, setStats] = useState<CybercrimeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cybercrimeUrl, setCybercrimeUrl] = useState<string>("")

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, systemUrl] = await Promise.all([
        cybercrimeApi.getStatistics(),
        cybercrimeApi.getCybercrimeSystemUrl()
      ])
      setStats(statsData)
      setCybercrimeUrl(systemUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cybercrime statistics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleAccessCybercrimeSystem = () => {
    if (cybercrimeUrl) {
      window.open(cybercrimeUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="w-5 h-5" />
            Cybercrime Unit Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-red-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading cybercrime statistics...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="w-5 h-5" />
            Cybercrime Unit Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || "Unable to connect to Cybercrime System"}
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={loadStats}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry Connection
                </Button>
                {cybercrimeUrl && (
                  <Button size="sm" onClick={handleAccessCybercrimeSystem}>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Access Cybercrime System
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const monthlyChange = stats.monthlyTrends.currentMonth.cases - stats.monthlyTrends.lastMonth.cases
  const solveRateChange = (stats.monthlyTrends.currentMonth.solved / Math.max(stats.monthlyTrends.currentMonth.cases, 1)) -
                         (stats.monthlyTrends.lastMonth.solved / Math.max(stats.monthlyTrends.lastMonth.cases, 1))

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Shield className="w-5 h-5" />
                Cybercrime Unit Integration
              </CardTitle>
              <p className="text-sm text-red-600 mt-1">
                Real-time data from the standalone Cybercrime Investigation System
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={loadStats}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={handleAccessCybercrimeSystem}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Access Cybercrime System
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Cyber Cases</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalCases}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  {monthlyChange >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(monthlyChange)} from last month
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Active Cases</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.openCases + stats.inProgressCases}</p>
                <p className="text-xs text-yellow-600">
                  {stats.urgentCases} high priority
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Cases Closed</p>
                <p className="text-2xl font-bold text-green-800">{stats.closedCases}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  {solveRateChange >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.round(Math.abs(solveRateChange) * 100)}% solve rate change
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Financial Recovery</p>
                <p className="text-2xl font-bold text-purple-800">
                  K{(stats.monthlyTrends.currentMonth.financialRecovery / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-purple-600">
                  This month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases & Top Offense Types */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Cybercrime Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentCases.slice(0, 4).map((case_) => (
                <div key={case_.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{case_.title}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Case #{case_.id} • {case_.offenseType}
                      </p>
                      {case_.assignedOfficer && (
                        <p className="text-xs text-gray-500">
                          Assigned to {case_.assignedOfficer}
                        </p>
                      )}
                      {case_.estimatedLoss && (
                        <p className="text-xs font-medium text-red-600 mt-1">
                          Loss: {case_.currency || 'PGK'} {case_.estimatedLoss.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="ml-2 space-y-1">
                      <Badge
                        variant={case_.priority === 'HIGH' || case_.priority === 'URGENT' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {case_.priority}
                      </Badge>
                      <Badge
                        variant={case_.status === 'CLOSED' ? 'default' : 'outline'}
                        className="text-xs block"
                      >
                        {case_.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentCases.length === 0 && (
                <p className="text-center text-gray-500 py-4">No recent cases</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Offense Types */}
        <Card>
          <CardHeader>
            <CardTitle>Top Cybercrime Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topOffenseTypes.map((offense) => (
                <div key={offense.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{offense.type}</span>
                    <span className="text-gray-600">{offense.count} cases</span>
                  </div>
                  <Progress value={offense.percentage} className="h-2" />
                </div>
              ))}
              {stats.topOffenseTypes.length === 0 && (
                <p className="text-center text-gray-500 py-4">No offense data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Cybercrime System Integration Active</p>
              <p className="text-sm text-green-600">
                Last data sync: {new Date().toLocaleString()} •
                Integration status: Connected •
                {stats.totalCases} cases synchronized
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
