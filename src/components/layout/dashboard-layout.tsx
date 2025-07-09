"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Phone, Shield, BarChart3, Database, Settings, LogOut, Menu, AlertTriangle, BookOpen, Lock, History, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types/user"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Digital Log Book", href: "/logbook", icon: BookOpen },
  { name: "Custody Management", href: "/custody", icon: Lock },
  { name: "Audit Trail", href: "/audit-trail", icon: History },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Cases", href: "/cases", icon: FileText },
  { name: "Personnel", href: "/personnel", icon: Users },
  { name: "Dispatch", href: "/dispatch", icon: Phone },
  { name: "Evidence", href: "/evidence", icon: Database },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Criminals", href: "/criminals", icon: Shield },
  {
    name: "Cybercrime Unit",
    href: "https://cybercrime-3h6o.vercel.app",
    icon: Shield,
    external: true,
    className: "text-red-600 hover:text-red-700 hover:bg-red-50"
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center shadow-sm">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg">PNG Police</h1>
          <p className="text-sm text-gray-600">Management System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = !item.external && (pathname === item.href || pathname?.startsWith(`${item.href}/`))
          
          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-red-600 hover:text-red-700 hover:bg-red-50"
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        {currentUser && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-600">{currentUser.badgeNumber}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">PNG Police System</h1>
          <div className="w-10" />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
