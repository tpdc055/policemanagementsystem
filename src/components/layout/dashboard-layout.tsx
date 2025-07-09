"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Users,
  FileText,
  Phone,
  Shield,
  BarChart3,
  Database,
  Car,
  MapPin,
  Settings,
  LogOut,
  Menu,
  AlertTriangle,
  Clock,
  User as UserIcon,
  Briefcase,
  BookOpen,
  Lock,
  Scale,
  History,
  Monitor,
  ExternalLink
} from "lucide-react"
import type { User } from "@/types/user"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Digital Log Book", href: "/logbook", icon: BookOpen },
  { name: "Custody Management", href: "/custody", icon: Lock },
  { name: "Audit Trail", href: "/audit-trail", icon: History },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Cases", href: "/cases", icon: FileText },
  { name: "Cybercrime Unit", href: "https://cybercrime-3h6o.vercel.app", icon: Monitor, external: true },
  { name: "Personnel", href: "/personnel", icon: Users },
  { name: "Dispatch", href: "/dispatch", icon: Phone },
  { name: "Evidence", href: "/evidence", icon: Database },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Criminals", href: "/criminals", icon: Shield },
]

export function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-4" : ""}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center shadow-sm">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg">Royal PNG</h1>
          <h2 className="font-bold text-lg">Constabulary</h2>
          <p className="text-sm text-gray-600">Police Management System</p>
        </div>
      </div>

      {/* Navigation - with flex-1 to take available space */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = !item.external && (pathname === item.href || pathname?.startsWith(`${item.href}/`))
          const linkClassName = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : item.external
              ? "text-red-700 hover:bg-red-50 border border-red-200 bg-red-25"
              : "text-gray-700 hover:bg-gray-100"
          }`

          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
                onClick={() => mobile && setSidebarOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={linkClassName}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info Section - Fixed at bottom */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {user.name?.split(" ").map(n => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-600">Badge #{user.badgeNumber}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs mb-3 w-full justify-center">
          {user.role}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {user.role}
            </Badge>
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {user.name?.split(" ").map(n => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
