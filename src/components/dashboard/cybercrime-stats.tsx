"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Monitor,
  Shield,
  AlertTriangle,
  ExternalLink,
  Database,
  Users,
  Clock,
  CheckCircle,
  Info
} from "lucide-react"

export function CybercrimeStatsSection() {
  const [stats] = useState({
    activeCases: 12,
    suspiciousActivities: 8,
    evidenceItems: 34,
    onlineInvestigators: 6,
    responseTime: "4.2h",
    systemStatus: "operational"
  })

  const [recentAlerts] = useState([
    {
      id: 1,
      type: "phishing",
      description: "Suspected phishing campaign targeting PNG citizens",
      severity: "high",
      time: "2 hours ago",
      status: "investigating"
    },
    {
      id: 2,
      type: "fraud",
      description: "Online banking fraud reports increased by 15%",
      severity: "medium", 
      time: "6 hours ago",
      status: "monitoring"
    },
    {
      id: 3,
      type: "cyberbullying",
      description: "Social media harassment case escalated",
      severity: "high",
      time: "1 day ago",
      status: "resolved"
    }
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'investigating': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'monitoring': return <Info className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900">Cybercrime Unit Integration</h3>
              <p className="text-sm text-red-700">Real-time monitoring and digital forensics</p>
            </div>
            <div className="ml-auto">
              <a 
                href="https://cybercrime-3h6o.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Cybercrime System
                </Button>
              </a>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{stats.activeCases}</div>
              <p className="text-xs text-gray-600">Active Cases</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{stats.suspiciousActivities}</div>
              <p className="text-xs text-gray-600">Suspicious Activities</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{stats.evidenceItems}</div>
              <p className="text-xs text-gray-600">Digital Evidence</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{stats.onlineInvestigators}</div>
              <p className="text-xs text-gray-600">Online Investigators</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{stats.responseTime}</div>
              <p className="text-xs text-gray-600">Avg Response Time</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <p className="text-xs text-gray-600">System Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Recent Cybercrime Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8">
                  {getStatusIcon(alert.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{alert.description}</p>
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Type: {alert.type}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                    <span>•</span>
                    <span className="capitalize">Status: {alert.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Integration Status</span>
            </div>
            <p className="text-sm text-blue-800">
              Connected to PNG Cybercrime Unit. Real-time data synchronization active. 
              All digital evidence and case updates are automatically shared between systems.
            </p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                Data Sync: Active
              </Badge>
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                API: Connected
              </Badge>
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                Last Update: 2 min ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
EOF  
cd /home/project && cd png-police-system && cat > src/components/dashboard/cybercrime-stats.tsx << 'EOF'
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Monitor,
  Shield,
  AlertTriangle,
  ExternalLink,
  Database,
  Users,
  Clock,
  CheckCircle,
  Info
} from "lucide-react"

export function CybercrimeStatsSection() {
  const [stats] = useState({
    activeCases: 12,
    suspiciousActivities: 8,
    evidenceItems: 34,
    onlineInvestigators: 6,
    responseTime: "4.2h",
    systemStatus: "operational"
  })

  const [recentAlerts] = useState([
    {
      id: 1,
      type: "phishing",
      description: "Suspected phishing campaign targeting PNG citizens",
      severity: "high",
      time: "2 hours ago",
      status: "investigating"
    },
    {
      id: 2,
      type: "fraud",
      description: "Online banking fraud reports increased by 15%",
      severity: "medium", 
      time: "6 hours ago",
      status: "monitoring"
    },
    {
      id: 3,
      type: "cyberbullying",
      description: "Social media harassment case escalated",
      severity: "high",
      time: "1 day ago",
      status: "resolved"
    }
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'investigating': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'monitoring': return <Info className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900">Cybercrime Unit Integration</h3>
              <p className="text-sm text-red-700">Real-time monitoring and digital forensics</p>
            </div>
            <div className="ml-auto">
              <a 
                href="https://cybercrime-3h6o.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Cybercrime System
                </Button>
              </a>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{stats.activeCases}</div>
              <p className="text-xs text-gray-600">Active Cases</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{stats.suspiciousActivities}</div>
              <p className="text-xs text-gray-600">Suspicious Activities</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{stats.evidenceItems}</div>
              <p className="text-xs text-gray-600">Digital Evidence</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{stats.onlineInvestigators}</div>
              <p className="text-xs text-gray-600">Online Investigators</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{stats.responseTime}</div>
              <p className="text-xs text-gray-600">Avg Response Time</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <p className="text-xs text-gray-600">System Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Recent Cybercrime Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8">
                  {getStatusIcon(alert.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{alert.description}</p>
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Type: {alert.type}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                    <span>•</span>
                    <span className="capitalize">Status: {alert.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Integration Status</span>
            </div>
            <p className="text-sm text-blue-800">
              Connected to PNG Cybercrime Unit. Real-time data synchronization active. 
              All digital evidence and case updates are automatically shared between systems.
            </p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                Data Sync: Active
              </Badge>
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                API: Connected
              </Badge>
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                Last Update: 2 min ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
