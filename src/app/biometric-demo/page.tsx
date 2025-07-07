"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BiometricLogPage() {
  const [user, setUser] = useState(null)
  const [biometricData, setBiometricData] = useState({
    leftEye: false,
    rightEye: false,
    voiceRecording: false,
    searchResults: [],
    evidencePackage: null
  })

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const scanIris = (eye) => {
    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        [eye === 'left' ? 'leftEye' : 'rightEye']: true
      }))
    }, 3000)
  }

  const startVoiceRecording = () => {
    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        voiceRecording: true
      }))
    }, 5000)
  }

  const searchCriminalDatabase = () => {
    setTimeout(() => {
      setBiometricData(prev => ({
        ...prev,
        searchResults: [
          {
            name: "Michael Kaupa",
            id: "PNG-CRIM-2023-0001",
            confidence: 97.2,
            warrant: true,
            riskLevel: "HIGH"
          }
        ]
      }))
    }, 2000)
  }

  const generateEvidence = () => {
    setBiometricData(prev => ({
      ...prev,
      evidencePackage: {
        caseNumber: "ADV-2024-7891",
        hash: "HASH-A7B9C2E4F1G6H8J3",
        courtReady: true
      }
    }))
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Royal Papua New Guinea Constabulary</h1>
              <p className="text-blue-200">Advanced Biometric Identification System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">👁️</div>
            <div className="font-bold text-purple-900">Iris Recognition</div>
            <div className="text-sm text-purple-700">99.9% Accuracy</div>
          </div>
          <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎤</div>
            <div className="font-bold text-orange-900">Voice Biometrics</div>
            <div className="text-sm text-orange-700">Voiceprint Analysis</div>
          </div>
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-bold text-red-900">Criminal Search</div>
            <div className="text-sm text-red-700">Repeat Offenders</div>
          </div>
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="font-bold text-green-900">Court Export</div>
            <div className="text-sm text-green-700">Evidence Package</div>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">🛡️ Biometric Collection Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Quality Score</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded">94/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
            <div>
              <button
                onClick={searchCriminalDatabase}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🔍 Search Database
              </button>
              {biometricData.searchResults.length > 0 && (
                <div className="text-sm mt-2 text-red-600">
                  ⚠️ {biometricData.searchResults.length} matches found
                </div>
              )}
            </div>
            <div>
              <button
                onClick={generateEvidence}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                📋 Generate Evidence
              </button>
              {biometricData.evidencePackage && (
                <div className="text-sm mt-2 text-green-600">
                  ✅ Court package ready
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Iris Recognition */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-purple-900 mb-4">🔍 Iris Recognition System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="font-medium text-purple-700 mb-4">Left Eye</h4>
              <div
                className="w-32 h-32 mx-auto border-4 border-purple-500 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer hover:bg-purple-200"
                onClick={() => scanIris('left')}
              >
                {biometricData.leftEye ? (
                  <span className="text-4xl">✅</span>
                ) : (
                  <span className="text-4xl">👁️</span>
                )}
              </div>
              <button
                onClick={() => scanIris('left')}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                {biometricData.leftEye ? '✅ Captured' : '⚡ Scan Left Eye'}
              </button>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-purple-700 mb-4">Right Eye</h4>
              <div
                className="w-32 h-32 mx-auto border-4 border-purple-500 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer hover:bg-purple-200"
                onClick={() => scanIris('right')}
              >
                {biometricData.rightEye ? (
                  <span className="text-4xl">✅</span>
                ) : (
                  <span className="text-4xl">👁️</span>
                )}
              </div>
              <button
                onClick={() => scanIris('right')}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                {biometricData.rightEye ? '✅ Captured' : '⚡ Scan Right Eye'}
              </button>
            </div>
          </div>
        </div>

        {/* Voice Recognition */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-orange-900 mb-4">🎤 Voice Recognition</h3>
          <div className="text-center">
            <div
              className="w-32 h-32 mx-auto border-4 border-orange-500 rounded-full bg-orange-100 flex items-center justify-center cursor-pointer hover:bg-orange-200"
              onClick={startVoiceRecording}
            >
              {biometricData.voiceRecording ? (
                <span className="text-4xl">🔊</span>
              ) : (
                <span className="text-4xl">🎤</span>
              )}
            </div>
            <button
              onClick={startVoiceRecording}
              className="mt-4 bg-orange-600 text-white px-8 py-3 rounded hover:bg-orange-700"
            >
              {biometricData.voiceRecording ? '✅ Recording Complete' : '🎤 Start Recording'}
            </button>
          </div>
        </div>

        {/* Criminal Search Results */}
        {biometricData.searchResults.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-red-900 mb-4">🚨 Criminal Database Matches</h3>
            {biometricData.searchResults.map((result, index) => (
              <div key={index} className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold">{result.name}</h4>
                      {result.warrant && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                          🚨 ACTIVE WARRANT
                        </span>
                      )}
                      <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                        {result.riskLevel} RISK
                      </span>
                    </div>
                    <p className="text-gray-700">ID: {result.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{result.confidence}%</div>
                    <div className="text-sm">Confidence</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 bg-red-600 text-white p-4 rounded">
              <div className="font-bold">⚠️ CRITICAL ALERT</div>
              <div>Active warrant detected. Contact supervisor and request backup.</div>
            </div>
          </div>
        )}

        {/* Evidence Package */}
        {biometricData.evidencePackage && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">⚖️ Court Evidence Package</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Case Number:</span>
                    <span className="font-bold">{biometricData.evidencePackage.caseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evidence Hash:</span>
                    <span className="font-mono text-sm">{biometricData.evidencePackage.hash}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white px-6 py-3 rounded font-bold">
                  ✅ COURT READY
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}