import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  FileText,
  Phone,
  Search,
  Car,
  Users,
  AlertTriangle,
  MapPin,
  Shield,
  Camera
} from "lucide-react"

const QUICK_ACTIONS = [
  {
    title: "Report Incident",
    description: "Create new incident report",
    icon: ClipboardList,
    href: "/incidents/new",
    color: "bg-red-500 hover:bg-red-600"
  },
  {
    title: "Search Criminal",
    description: "Look up criminal records",
    icon: Search,
    href: "/criminals/search",
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    title: "Dispatch Unit",
    description: "Send unit to location",
    icon: Phone,
    href: "/dispatch/new",
    color: "bg-orange-500 hover:bg-orange-600"
  },
  {
    title: "Open Case",
    description: "Create new investigation case",
    icon: FileText,
    href: "/cases/new",
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "Vehicle Check",
    description: "Check vehicle registration",
    icon: Car,
    href: "/vehicles/search",
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    title: "Missing Person",
    description: "Report missing person",
    icon: Users,
    href: "/incidents/missing-person",
    color: "bg-amber-500 hover:bg-amber-600"
  },
  {
    title: "Emergency Alert",
    description: "Send emergency broadcast",
    icon: AlertTriangle,
    href: "/alerts/emergency",
    color: "bg-red-600 hover:bg-red-700"
  },
  {
    title: "Crime Mapping",
    description: "View crime hotspots",
    icon: MapPin,
    href: "/crime-mapping",
    color: "bg-indigo-500 hover:bg-indigo-600"
  },
  {
    title: "Patrol Assignment",
    description: "Assign patrol routes",
    icon: Shield,
    href: "/patrol/assign",
    color: "bg-cyan-500 hover:bg-cyan-600"
  },
  {
    title: "Evidence Log",
    description: "Log physical evidence",
    icon: Camera,
    href: "/evidence/new",
    color: "bg-teal-500 hover:bg-teal-600"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
              >
                <div className={`p-2 rounded-full text-white ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs">{action.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Emergency Contacts</h4>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="text-sm">
              <span className="font-medium">Police Emergency:</span>
              <span className="ml-2 text-blue-600 font-bold">111</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">General Emergency:</span>
              <span className="ml-2 text-red-600 font-bold">000</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Fire/Ambulance:</span>
              <span className="ml-2 text-green-600 font-bold">110</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
