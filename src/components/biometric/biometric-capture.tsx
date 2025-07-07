"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  Mic,
  Search,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Camera,
  Fingerprint,
  Scan,
  Download
} from "lucide-react"

interface BiometricData {
  leftEye: boolean
  rightEye: boolean
  voiceRecording: boolean
  fingerprints: boolean
  faceRecognition: boolean
  searchResults: Array<{
    name: string
    id: string
    confidence: number
    warrant: boolean
    riskLevel: string
    lastSeen?: string
    charges?: string[]
  }>
  evidencePackage: {
    caseNumber: string
    hash: string
    courtReady: boolean
    timestamp: string
  } | null
  qualityScore: number
}

interface BiometricCaptureProps {
  onDataChange?: (data: BiometricData) => void
  caseNumber?: string
  readonly?: boolean
}

export function BiometricCapture({ onDataChange, caseNumber, readonly = false }: BiometricCaptureProps) {
  const [biometricData, setBiometricData] = useState<BiometricData>({
    leftEye: false,
    rightEye: false,
    voiceRecording: false,
    fingerprints: false,
    faceRecognition: false,
    searchResults: [],
    evidencePackage: null,
    qualityScore: 0
  })

  const [isScanning, setIsScanning] = useState({
    leftEye: false,
    rightEye: false,
    voice: false,
    fingerprints: false,
    face: false
  })

  const [showCriminalAlert, setShowCriminalAlert] = useState(false)

  useEffect(() => {
    if (onDataChange) {
      onDataChange(biometricData)
    }
  }, [biometricData, onDataChange])

  const scanIris = async (eye: 'left' | 'right') => {
    if (readonly) return

    setIsScanning(prev => ({ ...prev, [eye === 'left' ? 'leftEye' : 'rightEye']: true }))

    // Simulate iris scanning process
    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        [eye === 'left' ? 'leftEye' : 'rightEye']: true,
        qualityScore: Math.min(prev.qualityScore + 20, 100)
      }))
      setIsScanning(prev => ({ ...prev, [eye === 'left' ? 'leftEye' : 'rightEye']: false }))
    }, 3000)
  }

  const captureVoiceprint = async () => {
    if (readonly) return

    setIsScanning(prev => ({ ...prev, voice: true }))

    // Simulate voice recording
    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        voiceRecording: true,
        qualityScore: Math.min(prev.qualityScore + 15, 100)
      }))
      setIsScanning(prev => ({ ...prev, voice: false }))
    }, 5000)
  }

  const captureFingerprints = async () => {
    if (readonly) return

    setIsScanning(prev => ({ ...prev, fingerprints: true }))

    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        fingerprints: true,
        qualityScore: Math.min(prev.qualityScore + 25, 100)
      }))
      setIsScanning(prev => ({ ...prev, fingerprints: false }))
    }, 4000)
  }

  const captureFaceRecognition = async () => {
    if (readonly) return

    setIsScanning(prev => ({ ...prev, face: true }))

    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        faceRecognition: true,
        qualityScore: Math.min(prev.qualityScore + 15, 100)
      }))
      setIsScanning(prev => ({ ...prev, face: false }))
    }, 2500)
  }

  const searchCriminalDatabase = async () => {
    if (readonly) return

    // Simulate database search
    setTimeout(() => {
      const mockResults = [
        {
          name: "Michael Kaupa",
          id: "PNG-CRIM-2023-0001",
          confidence: 97.2,
          warrant: true,
          riskLevel: "HIGH",
          lastSeen: "2024-01-10",
          charges: ["Armed Robbery", "Assault", "Drug Possession"]
        },
        {
          name: "Sarah Temu",
          id: "PNG-CRIM-2023-0045",
          confidence: 89.5,
          warrant: false,
          riskLevel: "MEDIUM",
          lastSeen: "2023-12-15",
          charges: ["Theft", "Fraud"]
        }
      ]

      setBiometricData(prev => ({
        ...prev,
        searchResults: mockResults
      }))
      setShowCriminalAlert(true)
    }, 2000)
  }

  const generateEvidencePackage = () => {
    if (readonly) return

    const evidencePackage = {
      caseNumber: caseNumber || `ADV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      hash: `HASH-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      courtReady: true,
      timestamp: new Date().toISOString()
    }

    setBiometricData(prev => ({
      ...prev,
      evidencePackage
    }))
  }

  const getCompletionPercentage = () => {
    const completed = [
      biometricData.leftEye,
      biometricData.rightEye,
      biometricData.voiceRecording,
      biometricData.fingerprints,
      biometricData.faceRecognition
    ].filter(Boolean).length
    return (completed / 5) * 100
  }

  return (
    <div className="space-y-6">
      {/* Biometric Collection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Biometric Collection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Quality Score</span>
                <span className={`px-3 py-1 rounded text-white ${
                  biometricData.qualityScore >= 80 ? 'bg-green-600' :
                  biometricData.qualityScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {biometricData.qualityScore}/100
                </span>
              </div>
              <Progress value={biometricData.qualityScore} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Completion</span>
                <span className="text-sm text-gray-600">{getCompletionPercentage().toFixed(0)}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-3" />
            </div>
            <div className="space-y-2">
              <Button
                onClick={searchCriminalDatabase}
                disabled={getCompletionPercentage() < 40 || readonly}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Database
              </Button>
              {biometricData.searchResults.length > 0 && (
                <div className="text-xs text-red-600 font-medium text-center">
                  ⚠️ {biometricData.searchResults.length} matches found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criminal Alert */}
      {showCriminalAlert && biometricData.searchResults.some(r => r.warrant) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>CRITICAL ALERT:</strong> Active warrant detected! Contact supervisor immediately and request backup.
          </AlertDescription>
        </Alert>
      )}

      {/* Biometric Capture Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Iris Recognition */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Iris Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h4 className="font-medium text-purple-700 mb-3">Left Eye</h4>
                <div
                  className={`w-24 h-24 mx-auto border-4 border-purple-500 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    isScanning.leftEye ? 'animate-pulse bg-purple-200' : 'bg-purple-100 hover:bg-purple-200'
                  } ${readonly ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !readonly && scanIris('left')}
                >
                  {isScanning.leftEye ? (
                    <Scan className="w-8 h-8 text-purple-600 animate-spin" />
                  ) : biometricData.leftEye ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <Eye className="w-8 h-8 text-purple-600" />
                  )}
                </div>
                <Button
                  onClick={() => scanIris('left')}
                  disabled={isScanning.leftEye || biometricData.leftEye || readonly}
                  className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  size="sm"
                >
                  {biometricData.leftEye ? '✅ Captured' : isScanning.leftEye ? 'Scanning...' : '⚡ Scan'}
                </Button>
              </div>

              <div className="text-center">
                <h4 className="font-medium text-purple-700 mb-3">Right Eye</h4>
                <div
                  className={`w-24 h-24 mx-auto border-4 border-purple-500 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    isScanning.rightEye ? 'animate-pulse bg-purple-200' : 'bg-purple-100 hover:bg-purple-200'
                  } ${readonly ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !readonly && scanIris('right')}
                >
                  {isScanning.rightEye ? (
                    <Scan className="w-8 h-8 text-purple-600 animate-spin" />
                  ) : biometricData.rightEye ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <Eye className="w-8 h-8 text-purple-600" />
                  )}
                </div>
                <Button
                  onClick={() => scanIris('right')}
                  disabled={isScanning.rightEye || biometricData.rightEye || readonly}
                  className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  size="sm"
                >
                  {biometricData.rightEye ? '✅ Captured' : isScanning.rightEye ? 'Scanning...' : '⚡ Scan'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recognition */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Biometrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div
                className={`w-32 h-32 mx-auto border-4 border-orange-500 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isScanning.voice ? 'animate-pulse bg-orange-200' : 'bg-orange-100 hover:bg-orange-200'
                } ${readonly ? 'cursor-not-allowed' : ''}`}
                onClick={() => !readonly && captureVoiceprint()}
              >
                {isScanning.voice ? (
                  <div className="flex flex-col items-center">
                    <Mic className="w-8 h-8 text-orange-600 animate-pulse" />
                    <div className="text-xs mt-1">Recording...</div>
                  </div>
                ) : biometricData.voiceRecording ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <Mic className="w-12 h-12 text-orange-600" />
                )}
              </div>
              <Button
                onClick={captureVoiceprint}
                disabled={isScanning.voice || biometricData.voiceRecording || readonly}
                className="mt-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                {biometricData.voiceRecording ? '✅ Recording Complete' : isScanning.voice ? 'Recording...' : '🎤 Start Recording'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fingerprint Capture */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Fingerprint className="w-5 h-5" />
              Fingerprint Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div
                className={`w-32 h-32 mx-auto border-4 border-blue-500 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isScanning.fingerprints ? 'animate-pulse bg-blue-200' : 'bg-blue-100 hover:bg-blue-200'
                } ${readonly ? 'cursor-not-allowed' : ''}`}
                onClick={() => !readonly && captureFingerprints()}
              >
                {isScanning.fingerprints ? (
                  <Scan className="w-12 h-12 text-blue-600 animate-spin" />
                ) : biometricData.fingerprints ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <Fingerprint className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <Button
                onClick={captureFingerprints}
                disabled={isScanning.fingerprints || biometricData.fingerprints || readonly}
                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {biometricData.fingerprints ? '✅ Prints Captured' : isScanning.fingerprints ? 'Scanning...' : '👆 Scan Prints'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Face Recognition */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Face Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div
                className={`w-32 h-32 mx-auto border-4 border-green-500 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isScanning.face ? 'animate-pulse bg-green-200' : 'bg-green-100 hover:bg-green-200'
                } ${readonly ? 'cursor-not-allowed' : ''}`}
                onClick={() => !readonly && captureFaceRecognition()}
              >
                {isScanning.face ? (
                  <Scan className="w-12 h-12 text-green-600 animate-spin" />
                ) : biometricData.faceRecognition ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <Camera className="w-12 h-12 text-green-600" />
                )}
              </div>
              <Button
                onClick={captureFaceRecognition}
                disabled={isScanning.face || biometricData.faceRecognition || readonly}
                className="mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {biometricData.faceRecognition ? '✅ Face Captured' : isScanning.face ? 'Capturing...' : '📸 Capture Face'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Criminal Search Results */}
      {biometricData.searchResults.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Criminal Database Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biometricData.searchResults.map((result, index) => (
                <div key={index} className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
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
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{result.confidence}%</div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                  </div>

                  {result.charges && (
                    <div>
                      <span className="text-sm font-medium">Previous Charges: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.charges.map((charge, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {charge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Package Generation */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            Evidence Package Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-4">
                Generate a court-ready evidence package with all biometric data and chain of custody documentation.
              </p>
              <Button
                onClick={generateEvidencePackage}
                disabled={getCompletionPercentage() < 60 || readonly}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Evidence Package
              </Button>
            </div>

            {biometricData.evidencePackage && (
              <div className="bg-green-600 text-white p-4 rounded-lg">
                <div className="font-bold text-center mb-2">✅ COURT READY</div>
                <div className="text-sm space-y-1">
                  <div><strong>Case:</strong> {biometricData.evidencePackage.caseNumber}</div>
                  <div><strong>Hash:</strong> {biometricData.evidencePackage.hash}</div>
                  <div><strong>Generated:</strong> {new Date(biometricData.evidencePackage.timestamp).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
