import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Clock,
  Eye,
  MapPin,
  Radio,
  Users,
  Bell,
  ExternalLink
} from "lucide-react"

const ALERTS_DATA = [
  {
    id: 1,
    type: "URGENT",
    title: "Armed Robbery in Progress",
    location: "Port Moresby Central",
    time: "2 minutes ago",
    description: "Multiple units requested at Ela Beach Road",
    priority: "high" as const,
    icon: AlertTriangle,
    action: "Respond"
  },
  {
    id: 2,
    type: "BOLO",
    title: "Be On Look Out - Stolen Vehicle",
    location: "Nationwide",
    time: "15 minutes ago",
    description: "White Toyota Hilux, Plate: AAA-123",
    priority: "medium" as const,
    icon: Eye,
    action: "View Details"
  },
  {
    id: 3,
    type: "MISSING",
    title: "Missing Child Alert",
    location: "Lae City",
    time: "1 hour ago",
    description: "8-year-old child, last seen at Lae Market",
    priority: "high" as const,
    icon: Users,
    action: "Join Search"
  },
  {
    id: 4,
    type: "WEATHER",
    title: "Severe Weather Warning",
    location: "Morobe Province",
    time: "2 hours ago",
    description: "Heavy rains expected, potential flooding",
    priority: "medium" as const,
    icon: MapPin,
    action: "View Map"
  },
  {
    id: 5,
    type: "SYSTEM",
    title: "Radio System Maintenance",
    location: "System Wide",
    time: "3 hours ago",
    description: "Scheduled maintenance tonight 2-4 AM",
    priority: "low" as const,
    icon: Radio,
    action: "Details"
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-500"
    case "medium": return "bg-orange-500"
    case "low": return "bg-blue-500"
    default: return "bg-gray-500"
  }
}

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "high": return "destructive" as const
    case "medium": return "default" as const
    case "low": return "secondary" as const
    default: return "outline" as const
  }
}

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Active Alerts
        </CardTitle>
        <Badge variant="destructive" className="animate-pulse">
          {ALERTS_DATA.filter(alert => alert.priority === "high").length} High Priority
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {ALERTS_DATA.map((alert) => (
          <div
            key={alert.id}
            className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${getPriorityColor(alert.priority)}`}>
                  <alert.icon className="w-3 h-3 text-white" />
                </div>
                <Badge variant={getPriorityBadgeVariant(alert.priority)} className="text-xs">
                  {alert.type}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {alert.time}
              </div>
            </div>

            <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{alert.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {alert.location}
              </div>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                {alert.action}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
