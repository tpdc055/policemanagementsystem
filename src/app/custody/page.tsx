"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Lock,
  Users,
  Clock,
  CreditCard,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Download,
  Printer,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Shield,
  Scale,
  FileText,
  Phone,
  Home,
  Camera,
  Bell
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// TypeScript interfaces for custody management
interface CustodyRecord {
  id: string
  logBookEntryId: string
  personName: string
  personAge: number
  charges: string[]
  cellNumber: string
  admissionTime: string
  plannedRelease?: string
  status: "in-custody" | "released" | "transferred" | "bailed"
  bail?: {
    amount: number
    type: string
    guarantor: string
    paidTime?: string
    receiptNumber?: string
  }
  personalProperty: PropertyItem[]
  medicalNotes?: string
  specialInstructions?: string
  lastMealTime?: string
  visitorsToday: number
  admittingOfficer: string
  releasingOfficer?: string
  duration: string
}

interface PropertyItem {
  id: string
  description: string
  condition: string
  evidenceTag?: string
  isEvidence: boolean
  secureLocation: string
}

interface BailTransaction {
  id: string
  receiptNumber: string
  custodyRecordId: string
  personName: string
  amount: number
  type: "cash" | "surety" | "property" | "card"
  guarantorName: string
  guarantorPhone: string
  guarantorAddress: string
  paymentMethod: string
  transactionTime: string
  processedBy: string
  status: "paid" | "pending" | "refunded"
}

// Mock custody data
const MOCK_CUSTODY_RECORDS: CustodyRecord[] = [
  {
    id: "CUST-2024-001",
    logBookEntryId: "LOG-2024-001",
    personName: "John Kaupa",
    personAge: 29,
    charges: ["Armed Robbery", "Possession of Stolen Property"],
    cellNumber: "A-3",
    admissionTime: "2024-01-15T14:45:00Z",
    status: "in-custody",
    personalProperty: [
      {
        id: "PROP-001",
        description: "Samsung Galaxy S21 (Black)",
        condition: "Good",
        isEvidence: false,
        secureLocation: "Property Room A, Shelf 3"
      },
      {
        id: "PROP-002",
        description: "Leather wallet with K45 cash",
        condition: "Good",
        isEvidence: true,
        evidenceTag: "EVD-2024-001-A",
        secureLocation: "Evidence Room, Locker 15"
      }
    ],
    medicalNotes: "No known medical conditions",
    specialInstructions: "High risk - maintain visual surveillance",
    lastMealTime: "2024-01-15T18:00:00Z",
    visitorsToday: 1,
    admittingOfficer: "Const. Peter Bani",
    duration: "6 hours"
  },
  {
    id: "CUST-2024-002",
    logBookEntryId: "LOG-2024-002",
    personName: "Mary Temu",
    personAge: 35,
    charges: ["Domestic Violence", "Assault"],
    cellNumber: "B-1",
    admissionTime: "2024-01-15T09:30:00Z",
    plannedRelease: "2024-01-15T18:00:00Z",
    status: "bailed",
    bail: {
      amount: 500,
      type: "Cash",
      guarantor: "Paul Temu",
      paidTime: "2024-01-15T11:45:00Z",
      receiptNumber: "BAIL-2024-0001"
    },
    personalProperty: [
      {
        id: "PROP-003",
        description: "Gold wedding ring",
        condition: "Excellent",
        isEvidence: false,
        secureLocation: "Property Room A, Shelf 1"
      }
    ],
    visitorsToday: 2,
    admittingOfficer: "Const. Sarah Kila",
    releasingOfficer: "Sgt. Michael Namaliu",
    duration: "2 hours 15 minutes"
  }
]

const MOCK_BAIL_TRANSACTIONS: BailTransaction[] = [
  {
    id: "BAIL-TXN-001",
    receiptNumber: "BAIL-2024-0001",
    custodyRecordId: "CUST-2024-002",
    personName: "Mary Temu",
    amount: 500,
    type: "cash",
    guarantorName: "Paul Temu",
    guarantorPhone: "+675 325 8901",
    guarantorAddress: "Gerehu Stage 4, Port Moresby",
    paymentMethod: "Cash",
    transactionTime: "2024-01-15T11:45:00Z",
    processedBy: "Const. David Bani",
    status: "paid"
  }
]

export default function CustodyManagementPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [custodyRecords, setCustodyRecords] = useState<CustodyRecord[]>(MOCK_CUSTODY_RECORDS)
  const [bailTransactions, setBailTransactions] = useState<BailTransaction[]>(MOCK_BAIL_TRANSACTIONS)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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

  // Filter records
  const filteredRecords = custodyRecords.filter(record => {
    const matchesSearch = record.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.cellNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      "in-custody": { variant: "destructive" as const, label: "IN CUSTODY" },
      "released": { variant: "default" as const, label: "RELEASED" },
      "transferred": { variant: "secondary" as const, label: "TRANSFERRED" },
      "bailed": { variant: "default" as const, label: "BAILED" }
    }
    return variants[status as keyof typeof variants] || variants["in-custody"]
  }

  const calculateDuration = (admissionTime: string) => {
    const start = new Date(admissionTime)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const generateReceipt = (transaction: BailTransaction) => {
    const receiptData = {
      receiptNumber: transaction.receiptNumber,
      date: new Date(transaction.transactionTime).toLocaleString(),
      personName: transaction.personName,
      amount: transaction.amount,
      guarantor: transaction.guarantorName,
      officer: transaction.processedBy
    }

    // In a real system, this would generate and download a PDF
    console.log("Generating receipt:", receiptData)
    alert(`Receipt ${transaction.receiptNumber} generated successfully!`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-8 h-8" />
              Custody Management
            </h1>
            <p className="text-gray-600">
              Detention tracking, bail processing, and property management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Records
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Register
            </Button>
            <Link href="/custody/intake">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                New Intake
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently In Custody</CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {custodyRecords.filter(r => r.status === "in-custody").length}
              </div>
              <p className="text-xs text-red-600">Active detainees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Released Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {custodyRecords.filter(r => r.status === "released").length}
              </div>
              <p className="text-xs text-green-600">Processed releases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bail Processed</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bailTransactions.filter(t => t.status === "paid").length}
              </div>
              <p className="text-xs text-blue-600">Bail transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bail Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                K{bailTransactions.reduce((sum, t) => sum + t.amount, 0)}
              </div>
              <p className="text-xs text-purple-600">Collected today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Property Items</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {custodyRecords.reduce((sum, r) => sum + r.personalProperty.length, 0)}
              </div>
              <p className="text-xs text-orange-600">Stored securely</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="custody" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="custody">Custody Records</TabsTrigger>
            <TabsTrigger value="bail">Bail Processing</TabsTrigger>
            <TabsTrigger value="property">Property Management</TabsTrigger>
            <TabsTrigger value="receipts">Digital Receipts</TabsTrigger>
          </TabsList>

          <TabsContent value="custody" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Search Custody Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Search by name, custody ID, or cell number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md min-w-32"
                  >
                    <option value="all">All Status</option>
                    <option value="in-custody">In Custody</option>
                    <option value="released">Released</option>
                    <option value="bailed">Bailed</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Custody Records */}
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const statusConfig = getStatusBadge(record.status)

                return (
                  <Card key={record.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{record.personName}</h3>
                            <p className="text-sm text-gray-600">
                              Custody ID: {record.id} • Cell {record.cellNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                          {record.status === "in-custody" && (
                            <Badge variant="outline" className="text-orange-600">
                              {calculateDuration(record.admissionTime)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Key Information */}
                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-2">Admission Details</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(record.admissionTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {record.admittingOfficer}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-2">Charges</h4>
                          <div className="flex flex-wrap gap-1">
                            {record.charges.slice(0, 2).map((charge, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {charge}
                              </Badge>
                            ))}
                            {record.charges.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{record.charges.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-2">Status Information</h4>
                          <div className="text-sm space-y-1">
                            {record.bail && (
                              <div>Bail: K{record.bail.amount} ({record.bail.type})</div>
                            )}
                            <div>Property items: {record.personalProperty.length}</div>
                            <div>Visitors today: {record.visitorsToday}</div>
                          </div>
                        </div>
                      </div>

                      {/* Special Alerts */}
                      {record.specialInstructions && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Special Instructions:</strong> {record.specialInstructions}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Medical Notes */}
                      {record.medicalNotes && (
                        <Alert className="mb-4">
                          <FileText className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Medical:</strong> {record.medicalNotes}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 justify-end">
                        <Link href={`/custody/${record.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </Link>

                        {record.status === "in-custody" && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600">
                              <Scale className="w-4 h-4 mr-1" />
                              Process Bail
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Release
                            </Button>
                          </>
                        )}

                        {record.bail && (
                          <Button variant="outline" size="sm" className="text-purple-600">
                            <Receipt className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="bail" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Bail Processing & Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bailTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{transaction.personName}</h3>
                          <p className="text-sm text-gray-600">
                            Receipt: {transaction.receiptNumber} • {new Date(transaction.transactionTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">K{transaction.amount}</div>
                          <Badge variant="default" className="bg-green-600">
                            {transaction.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Type:</span> {transaction.type}
                        </div>
                        <div>
                          <span className="text-gray-600">Guarantor:</span> {transaction.guarantorName}
                        </div>
                        <div>
                          <span className="text-gray-600">Processed by:</span> {transaction.processedBy}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateReceipt(transaction)}
                        >
                          <Receipt className="w-4 h-4 mr-1" />
                          Generate Receipt
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="w-4 h-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="property" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Personal Property Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {custodyRecords.flatMap(record =>
                    record.personalProperty.map(property => (
                      <div key={property.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{property.description}</h3>
                            <p className="text-sm text-gray-600">
                              Owner: {record.personName} • Condition: {property.condition}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {property.isEvidence && (
                              <Badge variant="destructive">EVIDENCE</Badge>
                            )}
                            <Badge variant="outline">
                              {property.secureLocation}
                            </Badge>
                          </div>
                        </div>

                        {property.evidenceTag && (
                          <div className="text-sm text-red-600 mb-2">
                            Evidence Tag: {property.evidenceTag}
                          </div>
                        )}

                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-1" />
                            Photo
                          </Button>
                          {!property.isEvidence && (
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Return
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Digital Receipts & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Bail Receipt Template</h3>
                    <div className="text-sm space-y-1 mb-3">
                      <div>• Automated receipt generation</div>
                      <div>• Official PNG Constabulary letterhead</div>
                      <div>• QR code for verification</div>
                      <div>• Duplicate copies for records</div>
                    </div>
                    <Button size="sm" className="w-full">
                      <Receipt className="w-4 h-4 mr-2" />
                      Generate Sample
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Property Receipt</h3>
                    <div className="text-sm space-y-1 mb-3">
                      <div>• Itemized property list</div>
                      <div>• Condition assessment</div>
                      <div>• Storage location tracking</div>
                      <div>• Return acknowledgment</div>
                    </div>
                    <Button size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Sample
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
