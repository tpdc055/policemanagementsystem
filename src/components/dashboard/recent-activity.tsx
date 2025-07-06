import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Radio,
  Shield,
  User,
  Car,
  AlertTriangle,
  Database
} from "lucide-react"

const ACTIVITY_DATA = [
  {
    id: 1,
    type: "case_closed",
    user: "Det. Johnson",
    userBadge: "DJ",
    action: "closed case",
    target: "Theft Case #2024-0156",
    location: "Port Moresby",
    time: "5 minutes ago",
    icon: CheckCircle,
    iconColor: "text-green-600"
  },
  {
    id: 2,
    type: "incident_reported",
    user: "Const. Williams",
    userBadge: "CW",
    action: "reported incident",
    target: "Domestic Violence - Boroko",
    location: "Boroko",
    time: "12 minutes ago",
    icon: AlertTriangle,
    iconColor: "text-orange-600"
  },
  {
    id: 3,
    type: "patrol_assigned",
    user: "Sgt. Tamate",
    userBadge: "ST",
    action: "assigned patrol",
    target: "Unit 7 to Waigani District",
    location: "Waigani",
    time: "25 minutes ago",
    icon: Shield,
    iconColor: "text-blue-600"
  },
  {
    id: 4,
    type: "evidence_logged",
    user: "Const. Kila",
    userBadge: "CK",
    action: "logged evidence",
    target: "Physical Evidence #E2024-089",
    location: "Evidence Room",
    time: "35 minutes ago",
    icon: Database,
    iconColor: "text-purple-600"
  },
  {
    id: 5,
    type: "vehicle_check",
    user: "Const. Mendi",
    userBadge: "CM",
    action: "checked vehicle",
    target: "Registration PAA-456",
    location: "Highway Checkpoint",
    time: "42 minutes ago",
    icon: Car,
    iconColor: "text-indigo-600"
  },
  {
    id: 6,
    type: "dispatch",
    user: "Dispatcher Lima",
    userBadge: "DL",
    action: "dispatched units",
    target: "Units 3, 5 to Gerehu",
    location: "Control Room",
    time: "1 hour ago",
    icon: Radio,
    iconColor: "text-cyan-600"
  },
  {
    id: 7,
    type: "case_created",
    user: "Det. Namaliu",
    userBadge: "DN",
    action: "opened case",
    target: "Fraud Investigation #2024-0157",
    location: "CID Office",
    time: "1 hour ago",
    icon: FileText,
    iconColor: "text-gray-600"
  },
  {
    id: 8,
    type: "user_login",
    user: "Insp. Kaupa",
    userBadge: "IK",
    action: "logged into system",
    target: "Command Dashboard",
    location: "Headquarters",
    time: "2 hours ago",
    icon: User,
    iconColor: "text-gray-500"
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ACTIVITY_DATA.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                  {activity.userBadge}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                  <span className="text-sm font-medium">{activity.user}</span>
                  <span className="text-sm text-gray-600">{activity.action}</span>
                </div>

                <p className="text-sm text-gray-800 mb-1">{activity.target}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {activity.location}
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-500">Actions Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-xs text-gray-500">Pending Tasks</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
