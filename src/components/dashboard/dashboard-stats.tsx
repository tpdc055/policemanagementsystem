import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  TrendingDown,
  TrendingUp,
  Users
} from "lucide-react"

const STATS_DATA = [
  {
    title: "Active Cases",
    value: "247",
    change: "+12",
    changeType: "increase" as const,
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Incidents Today",
    value: "18",
    change: "-3",
    changeType: "decrease" as const,
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Officers on Duty",
    value: "156",
    change: "94%",
    changeType: "neutral" as const,
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Response Time Avg",
    value: "12 min",
    change: "-2 min",
    changeType: "decrease" as const,
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Cases Resolved",
    value: "89%",
    change: "+5%",
    changeType: "increase" as const,
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Community Reports",
    value: "34",
    change: "+8",
    changeType: "increase" as const,
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {STATS_DATA.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1">
                {stat.changeType === "increase" && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {stat.changeType === "decrease" && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <Badge
                  variant={
                    stat.changeType === "increase" ? "default" :
                    stat.changeType === "decrease" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.changeType === "neutral" ? "Current capacity" : "vs last week"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
