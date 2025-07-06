'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Camera,
  Upload,
  Download,
  Trash2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Zap,
  ZapOff,
  SwitchCamera,
  MapPin,
  Clock,
  FileImage,
  Fingerprint,
  Eye,
  Ruler,
  Hash
} from 'lucide-react'

interface PhotoMetadata {
  id: string
  filename: string
  timestamp: string
  location?: { latitude: number; longitude: number }
  device_info: string
  camera_settings: {
    flash: boolean
    zoom: number
    resolution: string
    facing_mode: 'user' | 'environment'
  }
  evidence_info: {
    category: string
    description: string
    chain_of_custody: string
    photographer: string
    witness?: string
  }
  analysis: {
    file_size: number
    dimensions: { width: number; height: number }
    hash: string
    quality_score: number
  }
}

interface CapturedPhoto {
  id: string
  blob: Blob
  url: string
  metadata: PhotoMetadata
}

interface PhotoCaptureProps {
  onPhotosCapture: (photos: CapturedPhoto[]) => void
  maxPhotos?: number
  category: 'evidence' | 'mugshot' | 'scene' | 'vehicle' | 'document' | 'injury'
  evidenceNumber?: string
  incidentNumber?: string
  photographer: string
  allowMultiple?: boolean
}

export default function PhotoCapture({
  onPhotosCapture,
  maxPhotos = 10,
  category,
  evidenceNumber,
  incidentNumber,
  photographer,
  allowMultiple = true
}: PhotoCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [deviceInfo, setDeviceInfo] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get device information
  useEffect(() => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    setDeviceInfo(`${platform} - ${userAgent.slice(0, 100)}`)
  }, [])

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
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          zoom: { ideal: zoom }
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      setIsCapturing(true)
    } catch (error) {
      console.error('Error starting camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }, [facingMode, zoom])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }, [stream])

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    if (isCapturing) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }, [isCapturing, stopCamera, startCamera])

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Apply flash effect
    if (flashEnabled) {
      const flashOverlay = document.createElement('div')
      flashOverlay.style.position = 'fixed'
      flashOverlay.style.top = '0'
      flashOverlay.style.left = '0'
      flashOverlay.style.width = '100%'
      flashOverlay.style.height = '100%'
      flashOverlay.style.backgroundColor = 'white'
      flashOverlay.style.zIndex = '9999'
      flashOverlay.style.opacity = '0.8'
      document.body.appendChild(flashOverlay)

      setTimeout(() => {
        document.body.removeChild(flashOverlay)
      }, 100)
    }

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return

      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const url = URL.createObjectURL(blob)

      // Calculate file hash (simplified)
      const arrayBuffer = await blob.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Create metadata
      const metadata: PhotoMetadata = {
        id: photoId,
        filename: `${category}_${photoId}.jpg`,
        timestamp: new Date().toISOString(),
        location,
        device_info: deviceInfo,
        camera_settings: {
          flash: flashEnabled,
          zoom,
          resolution: `${canvas.width}x${canvas.height}`,
          facing_mode: facingMode
        },
        evidence_info: {
          category,
          description: '',
          chain_of_custody: photographer,
          photographer,
          witness: ''
        },
        analysis: {
          file_size: blob.size,
          dimensions: { width: canvas.width, height: canvas.height },
          hash: hashHex,
          quality_score: calculateQualityScore(canvas.width, canvas.height, blob.size)
        }
      }

      const newPhoto: CapturedPhoto = {
        id: photoId,
        blob,
        url,
        metadata
      }

      setPhotos(prev => [...prev, newPhoto])

      if (!allowMultiple || photos.length + 1 >= maxPhotos) {
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }, [flashEnabled, zoom, facingMode, location, deviceInfo, category, photographer, allowMultiple, maxPhotos, photos.length, stopCamera])

  // Calculate quality score based on resolution and file size
  const calculateQualityScore = (width: number, height: number, fileSize: number): number => {
    const pixels = width * height
    const bitsPerPixel = (fileSize * 8) / pixels

    // Score based on resolution and compression
    let score = 0
    if (pixels >= 2073600) score += 40 // 1920x1080 or higher
    else if (pixels >= 921600) score += 30 // 1280x720
    else if (pixels >= 307200) score += 20 // 640x480
    else score += 10

    if (bitsPerPixel >= 12) score += 30 // High quality
    else if (bitsPerPixel >= 8) score += 20 // Medium quality
    else score += 10 // Low quality

    return Math.min(score, 100)
  }

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith('image/')) return

      const photoId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const url = URL.createObjectURL(file)

      // Get image dimensions
      const img = new Image()
      img.onload = async () => {
        const arrayBuffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        const metadata: PhotoMetadata = {
          id: photoId,
          filename: file.name,
          timestamp: new Date().toISOString(),
          location,
          device_info: deviceInfo,
          camera_settings: {
            flash: false,
            zoom: 1,
            resolution: `${img.width}x${img.height}`,
            facing_mode: 'environment'
          },
          evidence_info: {
            category,
            description: '',
            chain_of_custody: photographer,
            photographer,
            witness: ''
          },
          analysis: {
            file_size: file.size,
            dimensions: { width: img.width, height: img.height },
            hash: hashHex,
            quality_score: calculateQualityScore(img.width, img.height, file.size)
          }
        }

        const newPhoto: CapturedPhoto = {
          id: photoId,
          blob: file,
          url,
          metadata
        }

        setPhotos(prev => [...prev, newPhoto])
      }
      img.src = url
    })
  }, [location, deviceInfo, category, photographer, calculateQualityScore])

  // Delete photo
  const deletePhoto = useCallback((photoId: string) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== photoId)
      const photoToDelete = prev.find(p => p.id === photoId)
      if (photoToDelete) {
        URL.revokeObjectURL(photoToDelete.url)
      }
      return updated
    })
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }
  }, [selectedPhoto])

  // Update photo metadata
  const updatePhotoMetadata = useCallback((photoId: string, updates: Partial<PhotoMetadata['evidence_info']>) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === photoId
        ? {
            ...photo,
            metadata: {
              ...photo.metadata,
              evidence_info: { ...photo.metadata.evidence_info, ...updates }
            }
          }
        : photo
    ))
  }, [])

  // Submit photos
  const submitPhotos = useCallback(() => {
    onPhotosCapture(photos)
  }, [photos, onPhotosCapture])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
      photos.forEach(photo => URL.revokeObjectURL(photo.url))
    }
  }, [stopCamera, photos])

  return (
    <div className="space-y-6">
      {/* Camera Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Photo Capture - {category.charAt(0).toUpperCase() + category.slice(1)}
            {evidenceNumber && <Badge variant="outline">Evidence: {evidenceNumber}</Badge>}
            {incidentNumber && <Badge variant="outline">Incident: {incidentNumber}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {!isCapturing ? (
              <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture ({photos.length}/{maxPhotos})
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Stop Camera
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>

            {isCapturing && (
              <>
                <Button variant="outline" onClick={switchCamera}>
                  <SwitchCamera className="w-4 h-4 mr-2" />
                  Switch Camera
                </Button>
                <Button
                  variant={flashEnabled ? "default" : "outline"}
                  onClick={() => setFlashEnabled(!flashEnabled)}
                >
                  {flashEnabled ? <Zap className="w-4 h-4 mr-2" /> : <ZapOff className="w-4 h-4 mr-2" />}
                  Flash
                </Button>
              </>
            )}
          </div>

          {/* Camera View */}
          {isCapturing && (
            <div className="relative border rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />

              {/* Camera overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {facingMode === 'user' ? 'Front Camera' : 'Rear Camera'}
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
                {location && (
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={allowMultiple}
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Captured Photos ({photos.length})
              </span>
              <Button onClick={submitPhotos} className="bg-purple-600 hover:bg-purple-700">
                Submit Photos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={`Captured ${photo.metadata.filename}`}
                    className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-1 right-1">
                    <Badge
                      variant={photo.metadata.analysis.quality_score >= 70 ? "default" :
                               photo.metadata.analysis.quality_score >= 50 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {photo.metadata.analysis.quality_score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Details Modal */}
      {selectedPhoto && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Photo Details</CardTitle>
              <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Preview */}
              <div>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.metadata.filename}
                  className="w-full rounded border"
                />
              </div>

              {/* Photo Metadata */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Filename</Label>
                    <p className="text-sm font-mono">{selectedPhoto.metadata.filename}</p>
                  </div>
                  <div>
                    <Label>Timestamp</Label>
                    <p className="text-sm">{new Date(selectedPhoto.metadata.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Resolution</Label>
                    <p className="text-sm">{selectedPhoto.metadata.camera_settings.resolution}</p>
                  </div>
                  <div>
                    <Label>File Size</Label>
                    <p className="text-sm">{(selectedPhoto.metadata.analysis.file_size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <Label>Quality Score</Label>
                    <p className="text-sm">{selectedPhoto.metadata.analysis.quality_score}%</p>
                  </div>
                  <div>
                    <Label>Hash</Label>
                    <p className="text-sm font-mono text-xs">{selectedPhoto.metadata.analysis.hash.substring(0, 16)}...</p>
                  </div>
                </div>

                {selectedPhoto.metadata.location && (
                  <div>
                    <Label>Location</Label>
                    <p className="text-sm">
                      {selectedPhoto.metadata.location.latitude.toFixed(6)}, {selectedPhoto.metadata.location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

                {/* Evidence Information */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">Evidence Information</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor={`description-${selectedPhoto.id}`}>Description</Label>
                      <Textarea
                        id={`description-${selectedPhoto.id}`}
                        value={selectedPhoto.metadata.evidence_info.description}
                        onChange={(e) => updatePhotoMetadata(selectedPhoto.id, { description: e.target.value })}
                        placeholder="Describe what this photo shows..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`witness-${selectedPhoto.id}`}>Witness Present</Label>
                      <Input
                        id={`witness-${selectedPhoto.id}`}
                        value={selectedPhoto.metadata.evidence_info.witness || ''}
                        onChange={(e) => updatePhotoMetadata(selectedPhoto.id, { witness: e.target.value })}
                        placeholder="Name of witness present during photo capture"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
