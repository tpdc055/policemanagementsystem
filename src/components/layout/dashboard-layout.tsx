// ... existing code ... <import statements>
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
  ExternalLink
} from "lucide-react"
// ... existing code ... <interface and navigation array setup>

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

// ... existing code ... <component definition and other parts before the Sidebar component>

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-4" : ""}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center shadow-sm">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg">PNG Police</h1>
          <p className="text-sm text-gray-600">Management System</p>
        </div>
      </div>

      {/* Navigation */}
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.className || "text-red-600 hover:text-red-700 hover:bg-red-50"
                }`}
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

      // ... existing code ... <rest of sidebar content and component>
