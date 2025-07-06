"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Eye,
  Edit,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Database,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Info,
  Lock,
  Unlock,
  UserCheck,
  Activity,
  History,
  Gavel,
  Scale
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// TypeScript interfaces for audit trail
interface AuditEntry {
  id: string
  timestamp: string
  action: string
  entityType: "logbook" | "custody" | "evidence" | "user" | "system"
  entityId: string
  userId: string
  userName: string
  userRole: string
  description: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress: string
  sessionId: string
  severity: "low" | "medium" | "high" | "critical"
  status: "success" | "failed" | "pending"
  reason?: string
  approvedBy?: string
  approvalTime?: string
}

interface SystemAccess {
  id: string
  userId: string
  userName: string
  userRole: string
  loginTime: string
  logoutTime?: string
  ipAddress: string
  sessionDuration?: string
  actionsPerformed: number
  status: "active" | "expired" | "terminated"
}

// Mock audit trail data
const MOCK_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "AUDIT-2024-001",
    timestamp: "2024-01-15T15:30:00Z",
    action: "Amendment Made",
    entityType: "logbook",
    entityId: "LOG-2024-002",
    userId: "USR-001",
    userName: "Insp. David Agarobe",
    userRole: "commander",
    description: "Amended log book entry - updated charges and added witness statement",
    oldValues: {
      charges: ["Domestic Violence"],
      witnessStatement: null
    },
    newValues: {
      charges: ["Domestic Violence", "Assault"],
      witnessStatement: "Statement from neighbor witness"
    },
    ipAddress: "192.168.1.100",
    sessionId: "SES-2024-001",
    severity: "high",
    status: "success",
    reason: "Additional evidence discovered during investigation"
  },
  {
    id: "AUDIT-2024-002",
    timestamp: "2024-01-15T14:45:00Z",
    action: "Log Entry Created",
    entityType: "logbook",
    entityId: "LOG-2024-001",
    userId: "USR-002",
    userName: "Const. Peter Bani",
    userRole: "officer",
    description: "Created new log book entry for armed robbery incident",
    newValues: {
      personName: "John Kaupa",
      incidentType: "Armed Robbery",
      status: "pending"
    },
    ipAddress: "192.168.1.101",
    sessionId: "SES-2024-002",
    severity: "medium",
    status: "success"
  },
  {
    id: "AUDIT-2024-003",
    timestamp: "2024-01-15T13:20:00Z",
    action: "Bail Processed",
    entityType: "custody",
    entityId: "CUST-2024-002",
    userId: "USR-003",
    userName: "Const. David Bani",
    userRole: "officer",
    description: "Processed bail payment for Mary Temu",
    newValues: {
      bailAmount: 500,
      guarantor: "Paul Temu",
      paymentMethod: "Cash"
    },
    ipAddress: "192.168.1.102",
    sessionId: "SES-2024-003",
    severity: "medium",
    status: "success"
  },
  {
    id: "AUDIT-2024-004",
    timestamp: "2024-01-15T11:45:00Z",
    action: "Entry Verification",
    entityType: "logbook",
    entityId: "LOG-2024-002",
    userId: "USR-004",
    userName: "Sgt. Michael Namaliu",
    userRole: "sergeant",
    description: "Verified log book entry and approved for processing",
    oldValues: { status: "pending" },
    newValues: { status: "verified" },
    ipAddress: "192.168.1.103",
    sessionId: "SES-2024-004",
    severity: "medium",
    status: "success"
  },
  {
    id: "AUDIT-2024-005",
    timestamp: "2024-01-15T09:15:00Z",
    action: "Failed Login Attempt",
    entityType: "system",
    entityId: "SYS-LOGIN",
    userId: "UNKNOWN",
    userName: "Unknown User",
    userRole: "unknown",
    description: "Failed login attempt with invalid credentials",
    ipAddress: "192.168.1.200",
    sessionId: "N/A",
    severity: "critical",
    status: "failed"
  }
]

const MOCK_SYSTEM_ACCESS: SystemAccess[] = [
  {
    id: "SES-2024-001",
    userId: "USR-001",
    userName: "Insp. David Agarobe",
    userRole: "commander",
    loginTime: "2024-01-15T08:00:00Z",
    ipAddress: "192.168.1.100",
    actionsPerformed: 15,
    status: "active"
  },
  {
    id: "SES-2024-002",
    userId: "USR-002",
    userName: "Const. Peter Bani",
    userRole: "officer",
    loginTime: "2024-01-15T08:30:00Z",
    logoutTime: "2024-01-15T16:30:00Z",
    ipAddress: "192.168.1.101",
    sessionDuration: "8 hours",
    actionsPerformed: 8,
    status: "expired"
  },
  {
    id: "SES-2024-003",
    userId: "USR-003",
    userName: "Const. David Bani",
    userRole: "officer",
    loginTime: "2024-01-15T09:00:00Z",
    ipAddress: "192.168.1.102",
    actionsPerformed: 5,
    status: "active"
  }
]

export default function AuditTrailPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(MOCK_AUDIT_ENTRIES)
  const [systemAccess, setSystemAccess] = useState<SystemAccess[]>(MOCK_SYSTEM_ACCESS)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  // Filter audit entries
  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.entityId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || entry.severity === severityFilter

    // Date filtering (simplified for demo)
    const matchesDate = dateFilter === "all" ||
                       (dateFilter === "today" && new Date(entry.timestamp).toDateString() === new Date().toDateString())

    return matchesSearch && matchesSeverity && matchesDate
  })

  const getSeverityBadge = (severity: string) => {
    const variants = {
      "low": { variant: "secondary" as const, color: "text-gray-600" },
      "medium": { variant: "default" as const, color: "text-blue-600" },
      "high": { variant: "destructive" as const, color: "text-orange-600" },
      "critical": { variant: "destructive" as const, color: "text-red-600" }
    }
    return variants[severity as keyof typeof variants] || variants.medium
  }

  const getActionIcon = (action: string) => {
    const icons = {
      "Amendment Made": Edit,
      "Log Entry Created": FileText,
      "Bail Processed": Scale,
      "Entry Verification": CheckCircle,
      "Failed Login Attempt": XCircle,
      "User Login": UserCheck,
      "User Logout": Lock,
      "Evidence Added": Database,
      "Custody Intake": Shield
    }
    return icons[action as keyof typeof icons] || Activity
  }

  const canViewFullAudit = user.role === "commander" || user.role === "admin"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-8 h-8" />
              Audit Trail & Accountability
            </h1>
            <p className="text-gray-600">
              Complete system activity log and amendment tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Audit Log
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>

        {/* Access Level Notice */}
        {!canViewFullAudit && (
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Limited Access:</strong> Your role permits viewing of basic audit information only.
              Contact your Commander for full audit trail access.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions Today</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {auditEntries.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length}
              </div>
              <p className="text-xs text-blue-600">System activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amendments Made</CardTitle>
              <Edit className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {auditEntries.filter(e => e.action === "Amendment Made").length}
              </div>
              <p className="text-xs text-orange-600">Commander changes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {auditEntries.filter(e => e.severity === "critical").length}
              </div>
              <p className="text-xs text-red-600">High priority alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemAccess.filter(s => s.status === "active").length}
              </div>
              <p className="text-xs text-green-600">Currently logged in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {auditEntries.filter(e => e.status === "failed").length}
              </div>
              <p className="text-xs text-red-600">Security events</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="amendments">Amendments</TabsTrigger>
            <TabsTrigger value="access">System Access</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search & Filter Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Input
                    placeholder="Search actions, users, or IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>

                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Entries */}
            <div className="space-y-4">
              {filteredEntries.map((entry) => {
                const severityConfig = getSeverityBadge(entry.severity)
                const ActionIcon = getActionIcon(entry.action)

                return (
                  <Card key={entry.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            entry.severity === "critical" ? "bg-red-100" :
                            entry.severity === "high" ? "bg-orange-100" :
                            entry.severity === "medium" ? "bg-blue-100" : "bg-gray-100"
                          }`}>
                            <ActionIcon className={`w-5 h-5 ${severityConfig.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{entry.action}</h3>
                            <p className="text-sm text-gray-600">{entry.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={severityConfig.variant}>
                            {entry.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={entry.status === "success" ? "default" : "destructive"}>
                            {entry.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Audit Details */}
                      <div className="grid gap-2 md:grid-cols-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {entry.userName} ({entry.userRole})
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {entry.entityType.toUpperCase()}: {entry.entityId}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {entry.ipAddress}
                        </div>
                      </div>

                      {/* Changes (if any) */}
                      {canViewFullAudit && (entry.oldValues || entry.newValues) && (
                        <div className="p-3 bg-gray-50 rounded mb-4">
                          <h4 className="font-medium text-sm mb-2">Changes Made:</h4>
                          <div className="grid gap-2 md:grid-cols-2 text-xs">
                            {entry.oldValues && (
                              <div>
                                <span className="font-medium text-red-600">Before:</span>
                                <pre className="text-xs bg-red-50 p-2 rounded mt-1">
                                  {JSON.stringify(entry.oldValues, null, 2)}
                                </pre>
                              </div>
                            )}
                            {entry.newValues && (
                              <div>
                                <span className="font-medium text-green-600">After:</span>
                                <pre className="text-xs bg-green-50 p-2 rounded mt-1">
                                  {JSON.stringify(entry.newValues, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Reason for amendment */}
                      {entry.reason && (
                        <div className="p-3 bg-blue-50 rounded mb-4">
                          <div className="text-sm">
                            <span className="font-medium">Reason:</span> {entry.reason}
                          </div>
                        </div>
                      )}

                      {/* Approval information */}
                      {entry.approvedBy && (
                        <div className="p-3 bg-green-50 rounded mb-4">
                          <div className="text-sm">
                            <span className="font-medium">Approved by:</span> {entry.approvedBy}
                            {entry.approvalTime && ` on ${new Date(entry.approvalTime).toLocaleString()}`}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {canViewFullAudit && (
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                          {entry.entityType === "logbook" && (
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              View Log Entry
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}

              {filteredEntries.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <History className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No audit entries found</h3>
                    <p className="text-gray-500">No entries match your search criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="amendments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Log Book Amendments & Commander Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditEntries.filter(e => e.action === "Amendment Made").map((entry) => (
                    <div key={entry.id} className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{entry.entityId} - Amendment</h3>
                          <p className="text-sm text-gray-600">{entry.description}</p>
                        </div>
                        <Badge variant="destructive">COMMANDER ACTION</Badge>
                      </div>

                      <div className="grid gap-2 md:grid-cols-3 text-sm mb-3">
                        <div>
                          <span className="font-medium">Amended by:</span> {entry.userName}
                        </div>
                        <div>
                          <span className="font-medium">Date/Time:</span> {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Audit ID:</span> {entry.id}
                        </div>
                      </div>

                      {entry.reason && (
                        <div className="text-sm bg-white p-2 rounded">
                          <span className="font-medium">Justification:</span> {entry.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  System Access & User Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAccess.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{session.userName}</h3>
                          <p className="text-sm text-gray-600">{session.userRole} • {session.ipAddress}</p>
                        </div>
                        <Badge variant={session.status === "active" ? "default" : "secondary"}>
                          {session.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid gap-2 md:grid-cols-4 text-sm">
                        <div>
                          <span className="font-medium">Login:</span> {new Date(session.loginTime).toLocaleString()}
                        </div>
                        {session.logoutTime && (
                          <div>
                            <span className="font-medium">Logout:</span> {new Date(session.logoutTime).toLocaleString()}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Duration:</span> {session.sessionDuration || "Active"}
                        </div>
                        <div>
                          <span className="font-medium">Actions:</span> {session.actionsPerformed}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Events & Failed Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditEntries.filter(e => e.severity === "critical" || e.status === "failed").map((entry) => (
                    <div key={entry.id} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-red-800">{entry.action}</h3>
                          <p className="text-sm text-red-600">{entry.description}</p>
                        </div>
                        <Badge variant="destructive">SECURITY EVENT</Badge>
                      </div>

                      <div className="grid gap-2 md:grid-cols-3 text-sm">
                        <div>
                          <span className="font-medium">Time:</span> {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">IP Address:</span> {entry.ipAddress}
                        </div>
                        <div>
                          <span className="font-medium">User:</span> {entry.userName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
