"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BiometricCapture } from "@/components/biometric/biometric-capture"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Fingerprint,
  Shield,
  Database,
  FileDown,
  Search,
  History,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import type { User as UserType } from "@/types/user"

// Mock data for recent biometric searches
const RECENT_SEARCHES = [
  {
    id: "SEARCH-2024-001",
    timestamp: "2024-01-15T14:30:00Z",
    officer: "Const. Peter Bani",
    matches: 1,
    confidence: 97.2,
    warrant: true,
    caseNumber: "INC-2024-001"
  },
  {
    id: "SEARCH-2024-002",
    timestamp: "2024-01-15T11:15:00Z",
    officer: "Sgt. Sarah Kila",
    matches: 0,
    confidence: 0,
    warrant: false,
    caseNumber: "INC-2024-002"
  },
  {
    id: "SEARCH-2024-003",
    timestamp: "2024-01-14T16:45:00Z",
    officer: "Const. Helen Bani",
    matches: 2,
    confidence: 89.5,
    warrant: false,
    caseNumber: "INC-2024-003"
  }
]

export default function BiometricManagementPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [currentBiometricData, setCurrentBiometricData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("capture")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleBiometricDataChange = (data: any) => {
    setCurrentBiometricData(data)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const getCaptureStats = () => {
    if (!currentBiometricData) return { total: 0, quality: 0 }

    const captures = [
      currentBiometricData.leftEye,
      currentBiometricData.rightEye,
      currentBiometricData.voiceRecording,
      currentBiometricData.fingerprints,
      currentBiometricData.faceRecognition
    ].filter(Boolean).length

    return {
      total: captures,
      quality: currentBiometricData.qualityScore || 0
    }
  }

  const captureStats = getCaptureStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Fingerprint className="w-8 h-8 text-blue-600" />
              Advanced Biometric Identification System
            </h1>
            <p className="text-gray-600">
              Royal Papua New Guinea Constabulary - Biometric Management & Criminal Database Search
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Officer: {user.name}
            </Badge>
            <Badge variant="default" className="text-sm bg-blue-600">
              System Active
            </Badge>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-green-600">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Records</CardTitle>
              <Database className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47,892</div>
              <p className="text-xs text-blue-600">Criminal profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Searches</CardTitle>
              <Search className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-purple-600">+5 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34.8%</div>
              <p className="text-xs text-orange-600">↑ 2.1% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {currentBiometricData?.searchResults?.some((r: any) => r.warrant) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL ALERT:</strong> Active warrant detected in biometric search!
              Contact supervisor immediately and request backup.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Tabs Interface */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="capture" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Biometric Capture
                  {captureStats.total > 0 && (
                    <Badge className="ml-1 bg-green-600 text-xs">
                      {captureStats.total}/5
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Database Search
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Search History
                </TabsTrigger>
              </TabsList>

              {/* Biometric Capture Tab */}
              <TabsContent value="capture" className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Advanced Biometric Collection</h3>
                  <p className="text-gray-600">
                    Capture multiple biometric identifiers for comprehensive subject identification and criminal database comparison.
                  </p>
                </div>

                <BiometricCapture
                  onDataChange={handleBiometricDataChange}
                  caseNumber={`BIOM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`}
                />

                {/* Quick Actions */}
                {captureStats.total > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <Button
                        onClick={() => setActiveTab("search")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search Criminal Database
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/logbook/new")}
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Create Log Entry
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Database Search Tab */}
              <TabsContent value="search" className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Criminal Database Search</h3>
                  <p className="text-gray-600">
                    Search the national criminal database using captured biometric data for positive identification.
                  </p>
                </div>

                {!currentBiometricData || captureStats.total === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please capture biometric data first before performing a database search.
                      Switch to the "Biometric Capture" tab to begin.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    {/* Search Results */}
                    {currentBiometricData.searchResults?.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-red-900">
                          Criminal Database Matches ({currentBiometricData.searchResults.length})
                        </h4>
                        {currentBiometricData.searchResults.map((result: any, index: number) => (
                          <Card key={index} className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-lg font-bold">{result.name}</h4>
                                    {result.warrant && (
                                      <Badge variant="destructive" className="bg-red-600">
                                        🚨 ACTIVE WARRANT
                                      </Badge>
                                    )}
                                    <Badge variant={result.riskLevel === 'HIGH' ? 'destructive' : 'secondary'}>
                                      {result.riskLevel} RISK
                                    </Badge>
                                  </div>
                                  <p className="text-gray-700 text-sm">ID: {result.id}</p>
                                  {result.lastSeen && (
                                    <p className="text-gray-600 text-sm">Last seen: {result.lastSeen}</p>
                                  )}
                                  {result.charges && (
                                    <div className="mt-2">
                                      <span className="text-sm font-medium">Previous Charges: </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {result.charges.map((charge: string, i: number) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {charge}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-red-600">{result.confidence}%</div>
                                  <div className="text-sm text-gray-600">Confidence</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-6 text-center">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h4 className="font-semibold text-green-900 mb-2">No Criminal Records Found</h4>
                          <p className="text-green-700">
                            The biometric search did not return any matches in the criminal database.
                            This individual does not appear to have a criminal record.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Evidence Package */}
                    {currentBiometricData.evidencePackage && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                          <CardTitle className="text-blue-900">Evidence Package Generated</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <strong>Case Number:</strong> {currentBiometricData.evidencePackage.caseNumber}
                            </div>
                            <div>
                              <strong>Evidence Hash:</strong>
                              <code className="ml-2 text-sm">{currentBiometricData.evidencePackage.hash}</code>
                            </div>
                            <div>
                              <strong>Generated:</strong> {new Date(currentBiometricData.evidencePackage.timestamp).toLocaleString()}
                            </div>
                            <div>
                              <Badge className="bg-green-600">✅ COURT READY</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Search History Tab */}
              <TabsContent value="history" className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Recent Biometric Searches</h3>
                  <p className="text-gray-600">
                    View recent biometric database searches performed by your station.
                  </p>
                </div>

                <div className="space-y-4">
                  {RECENT_SEARCHES.map((search) => (
                    <Card key={search.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{search.id}</span>
                              <Badge variant="outline">{search.caseNumber}</Badge>
                              {search.warrant && (
                                <Badge variant="destructive" className="text-xs">
                                  WARRANT
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Officer: {search.officer}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(search.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {search.matches} match{search.matches !== 1 ? 'es' : ''}
                            </div>
                            {search.confidence > 0 && (
                              <div className="text-sm text-gray-600">
                                {search.confidence}% confidence
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <h4 className="font-medium mb-2">Biometric Capabilities</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Iris Recognition (99.9% accuracy)</li>
                  <li>• Voice Biometric Analysis</li>
                  <li>• Fingerprint Scanning</li>
                  <li>• Facial Recognition</li>
                  <li>• Multi-modal Verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Database Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Real-time Criminal Search</li>
                  <li>• Warrant Detection</li>
                  <li>• Risk Assessment</li>
                  <li>• Evidence Generation</li>
                  <li>• Audit Trail Logging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Legal Compliance</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Court-admissible Evidence</li>
                  <li>• Chain of Custody</li>
                  <li>• PNG Legal Standards</li>
                  <li>• Privacy Protection</li>
                  <li>• Data Encryption</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
