'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Fingerprint,
  Camera,
  Eye,
  Scan,
  User,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Hash,
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react'

interface BiometricData {
  id: string
  type: 'fingerprint' | 'facial' | 'iris' | 'voice' | 'signature'
  data: string // Base64 encoded biometric template
  rawImage?: string // Base64 encoded original image
  quality_score: number
  confidence_level: number
  extraction_algorithm: string
  template_format: string
  capture_device: string
  capture_timestamp: string
  capture_location?: { latitude: number; longitude: number }
  operator: string
  subject_info: {
    name?: string
    id_number?: string
    finger_position?: 'thumb' | 'index' | 'middle' | 'ring' | 'little'
    hand: 'left' | 'right'
  }
  verification_attempts?: Array<{
    timestamp: string
    result: 'match' | 'no_match' | 'error'
    score: number
    operator: string
  }>
  metadata: {
    dpi: number
    image_dimensions: { width: number; height: number }
    compression: string
    encryption: boolean
    hash: string
  }
}

interface BiometricCaptureProps {
  onBiometricCapture: (biometrics: BiometricData[]) => void
  subjectName?: string
  subjectId?: string
  operator: string
  incidentNumber?: string
  allowedTypes?: Array<'fingerprint' | 'facial' | 'iris' | 'voice' | 'signature'>
  required?: boolean
}

export default function BiometricCapture({
  onBiometricCapture,
  subjectName,
  subjectId,
  operator,
  incidentNumber,
  allowedTypes = ['fingerprint', 'facial'],
  required = false
}: BiometricCaptureProps) {
  const [capturedBiometrics, setCapturedBiometrics] = useState<BiometricData[]>([])
  const [currentCapture, setCurrentCapture] = useState<'fingerprint' | 'facial' | 'iris' | 'voice' | 'signature' | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [fingerprintPosition, setFingerprintPosition] = useState<'thumb' | 'index' | 'middle' | 'ring' | 'little'>('index')
  const [handPosition, setHandPosition] = useState<'left' | 'right'>('right')
  const [captureProgress, setCaptureProgress] = useState(0)
  const [qualityScore, setQualityScore] = useState(0)
  const [verificationMode, setVerificationMode] = useState(false)
  const [verificationResult, setVerificationResult] = useState<'match' | 'no_match' | 'pending' | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fingerprintCanvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }, [])

  // Start fingerprint capture simulation
  const startFingerprintCapture = useCallback(async () => {
    setCurrentCapture('fingerprint')
    setIsCapturing(true)
    setCaptureProgress(0)
    setQualityScore(0)

    // Simulate fingerprint capture process
    const interval = setInterval(() => {
      setCaptureProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsCapturing(false)

          // Simulate quality assessment
          const quality = 70 + Math.random() * 30 // 70-100%
          setQualityScore(quality)

          // Generate simulated biometric data
          generateBiometricData('fingerprint', quality)
          return 100
        }
        return newProgress
      })
    }, 200)
  }, [])

  // Start facial recognition capture
  const startFacialCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      setCurrentCapture('facial')
      setIsCapturing(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera for facial capture')
    }
  }, [])

  // Capture facial biometric
  const captureFacialBiometric = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9)

    // Simulate facial recognition processing
    setCaptureProgress(0)
    const interval = setInterval(() => {
      setCaptureProgress(prev => {
        const newProgress = prev + Math.random() * 20
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsCapturing(false)

          const quality = 75 + Math.random() * 25 // 75-100%
          setQualityScore(quality)

          generateBiometricData('facial', quality, imageData)

          // Stop camera
          const stream = video.srcObject as MediaStream
          if (stream) {
            stream.getTracks().forEach(track => track.stop())
          }

          return 100
        }
        return newProgress
      })
    }, 150)
  }, [])

  // Generate biometric data (simulated)
  const generateBiometricData = useCallback((
    type: 'fingerprint' | 'facial' | 'iris' | 'voice' | 'signature',
    quality: number,
    rawImage?: string
  ) => {
    // Generate simulated biometric template
    const template = generateSimulatedTemplate(type)
    const hash = generateHash(template)

    const biometricData: BiometricData = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: template,
      rawImage,
      quality_score: Math.round(quality),
      confidence_level: Math.round(quality * 0.9 + Math.random() * 10),
      extraction_algorithm: type === 'fingerprint' ? 'Minutiae-based' : 'Deep Neural Network',
      template_format: type === 'fingerprint' ? 'ISO/IEC 19794-2' : 'Proprietary',
      capture_device: 'PNG Police Digital Scanner v2.0',
      capture_timestamp: new Date().toISOString(),
      capture_location: location,
      operator,
      subject_info: {
        name: subjectName,
        id_number: subjectId,
        finger_position: type === 'fingerprint' ? fingerprintPosition : undefined,
        hand: handPosition
      },
      verification_attempts: [],
      metadata: {
        dpi: type === 'fingerprint' ? 500 : 300,
        image_dimensions: { width: 512, height: 512 },
        compression: 'JPEG2000',
        encryption: true,
        hash
      }
    }

    setCapturedBiometrics(prev => [...prev, biometricData])
  }, [location, operator, subjectName, subjectId, fingerprintPosition, handPosition])

  // Generate simulated biometric template
  const generateSimulatedTemplate = (type: string): string => {
    // Generate a realistic looking base64 encoded template
    const templateSize = type === 'fingerprint' ? 1024 : 2048
    const bytes = new Uint8Array(templateSize)

    for (let i = 0; i < templateSize; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }

    return btoa(String.fromCharCode(...bytes))
  }

  // Generate hash
  const generateHash = (data: string): string => {
    // Simple hash simulation
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0')
  }

  // Verify biometric
  const verifyBiometric = useCallback(async (biometricId: string) => {
    setVerificationMode(true)
    setVerificationResult('pending')

    // Simulate verification process
    setTimeout(() => {
      const isMatch = Math.random() > 0.3 // 70% chance of match
      const score = isMatch ? 85 + Math.random() * 15 : Math.random() * 40

      setVerificationResult(isMatch ? 'match' : 'no_match')

      // Update biometric data with verification attempt
      setCapturedBiometrics(prev => prev.map(bio =>
        bio.id === biometricId
          ? {
              ...bio,
              verification_attempts: [
                ...(bio.verification_attempts || []),
                {
                  timestamp: new Date().toISOString(),
                  result: isMatch ? 'match' : 'no_match',
                  score: Math.round(score),
                  operator
                }
              ]
            }
          : bio
      ))

      setTimeout(() => {
        setVerificationMode(false)
        setVerificationResult(null)
      }, 3000)
    }, 2000)
  }, [operator])

  // Delete biometric
  const deleteBiometric = useCallback((biometricId: string) => {
    setCapturedBiometrics(prev => prev.filter(bio => bio.id !== biometricId))
  }, [])

  // Submit biometrics
  const submitBiometrics = useCallback(() => {
    onBiometricCapture(capturedBiometrics)
  }, [capturedBiometrics, onBiometricCapture])

  return (
    <div className="space-y-6">
      {/* Biometric Capture Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Biometric Data Capture
            {incidentNumber && <Badge variant="outline">Incident: {incidentNumber}</Badge>}
            {required && <Badge variant="destructive">Required</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fingerprint" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              {allowedTypes.includes('fingerprint') && (
                <TabsTrigger value="fingerprint" className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  Fingerprint
                </TabsTrigger>
              )}
              {allowedTypes.includes('facial') && (
                <TabsTrigger value="facial" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Facial
                </TabsTrigger>
              )}
            </TabsList>

            {/* Fingerprint Capture */}
            {allowedTypes.includes('fingerprint') && (
              <TabsContent value="fingerprint" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Finger Position</Label>
                    <Select value={fingerprintPosition} onValueChange={(value: any) => setFingerprintPosition(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thumb">Thumb</SelectItem>
                        <SelectItem value="index">Index Finger</SelectItem>
                        <SelectItem value="middle">Middle Finger</SelectItem>
                        <SelectItem value="ring">Ring Finger</SelectItem>
                        <SelectItem value="little">Little Finger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Hand</Label>
                    <Select value={handPosition} onValueChange={(value: any) => setHandPosition(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="right">Right Hand</SelectItem>
                        <SelectItem value="left">Left Hand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="text-center space-y-4">
                    {!isCapturing || currentCapture !== 'fingerprint' ? (
                      <>
                        <Fingerprint className="w-16 h-16 mx-auto text-gray-400" />
                        <p className="text-gray-600">Place {handPosition} {fingerprintPosition} finger on scanner</p>
                        <Button onClick={startFingerprintCapture} className="bg-blue-600 hover:bg-blue-700">
                          <Scan className="w-4 h-4 mr-2" />
                          Start Fingerprint Capture
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="animate-pulse">
                          <Fingerprint className="w-16 h-16 mx-auto text-blue-500" />
                        </div>
                        <p className="text-blue-600 font-medium">Scanning fingerprint...</p>
                        <Progress value={captureProgress} className="w-full" />
                        <p className="text-sm text-gray-600">Keep finger steady on scanner</p>
                        {qualityScore > 0 && (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm">Quality:</span>
                            <Badge variant={qualityScore >= 80 ? "default" : qualityScore >= 60 ? "secondary" : "destructive"}>
                              {qualityScore}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <canvas ref={fingerprintCanvasRef} className="hidden" />
              </TabsContent>
            )}

            {/* Facial Recognition Capture */}
            {allowedTypes.includes('facial') && (
              <TabsContent value="facial" className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-black">
                  {!isCapturing || currentCapture !== 'facial' ? (
                    <div className="aspect-video flex items-center justify-center text-white">
                      <div className="text-center space-y-4">
                        <Camera className="w-16 h-16 mx-auto text-gray-400" />
                        <p className="text-gray-400">Position face within frame</p>
                        <Button onClick={startFacialCapture} className="bg-green-600 hover:bg-green-700">
                          <Camera className="w-4 h-4 mr-2" />
                          Start Facial Capture
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto"
                        style={{ transform: 'scaleX(-1)' }}
                      />

                      {/* Face detection overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-green-400 rounded-lg w-64 h-80 flex items-center justify-center">
                          <div className="text-green-400 text-sm font-medium">
                            Align face within frame
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-y-2">
                        <Button onClick={captureFacialBiometric} className="bg-red-600 hover:bg-red-700">
                          <Camera className="w-4 h-4 mr-2" />
                          Capture Face
                        </Button>
                        {captureProgress > 0 && captureProgress < 100 && (
                          <div className="bg-black/50 p-2 rounded">
                            <Progress value={captureProgress} className="w-64" />
                            <p className="text-white text-sm text-center mt-1">Processing...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Captured Biometrics */}
      {capturedBiometrics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Captured Biometric Data ({capturedBiometrics.length})
              </CardTitle>
              <Button onClick={submitBiometrics} className="bg-purple-600 hover:bg-purple-700">
                Submit Biometrics
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {capturedBiometrics.map((biometric) => (
                <div key={biometric.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {biometric.type === 'fingerprint' ? (
                        <Fingerprint className="w-8 h-8 text-blue-500" />
                      ) : (
                        <Camera className="w-8 h-8 text-green-500" />
                      )}
                      <div>
                        <h4 className="font-medium capitalize">{biometric.type} Biometric</h4>
                        <p className="text-sm text-gray-600">
                          {biometric.type === 'fingerprint' &&
                            `${biometric.subject_info.hand} ${biometric.subject_info.finger_position}`
                          }
                          {biometric.type === 'facial' && 'Facial Recognition Data'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(biometric.capture_timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={biometric.quality_score >= 80 ? "default" :
                                   biometric.quality_score >= 60 ? "secondary" : "destructive"}>
                        {biometric.quality_score}% Quality
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => verifyBiometric(biometric.id)}
                        disabled={verificationMode}
                      >
                        {verificationMode ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Scan className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBiometric(biometric.id)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Confidence:</span>
                      <p className="font-medium">{biometric.confidence_level}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Algorithm:</span>
                      <p className="font-medium">{biometric.extraction_algorithm}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Format:</span>
                      <p className="font-medium">{biometric.template_format}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Hash:</span>
                      <p className="font-mono text-xs">{biometric.metadata.hash}</p>
                    </div>
                  </div>

                  {/* Verification Results */}
                  {verificationResult && (
                    <div className={`p-3 rounded border-2 ${
                      verificationResult === 'match' ? 'border-green-200 bg-green-50' :
                      verificationResult === 'no_match' ? 'border-red-200 bg-red-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        {verificationResult === 'match' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {verificationResult === 'no_match' && <XCircle className="w-5 h-5 text-red-600" />}
                        {verificationResult === 'pending' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
                        <span className="font-medium">
                          {verificationResult === 'match' && 'Biometric Match Confirmed'}
                          {verificationResult === 'no_match' && 'No Biometric Match Found'}
                          {verificationResult === 'pending' && 'Verifying Biometric...'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Verification History */}
                  {biometric.verification_attempts && biometric.verification_attempts.length > 0 && (
                    <div className="border-t pt-3">
                      <h5 className="text-sm font-medium mb-2">Verification History</h5>
                      <div className="space-y-1">
                        {biometric.verification_attempts.map((attempt, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">
                              {new Date(attempt.timestamp).toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant={attempt.result === 'match' ? "default" : "secondary"} className="text-xs">
                                {attempt.result === 'match' ? 'Match' : 'No Match'} ({attempt.score}%)
                              </Badge>
                              <span className="text-gray-500">{attempt.operator}</span>
                            </div>
                          </div>
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
    </div>
  )
}
