"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Set default user data in localStorage and redirect to dashboard
    const defaultUser = {
      badgeNumber: "12345",
      role: "commander",
      name: "Officer 12345",
      department: "RPNGC",
      loginTime: new Date().toISOString()
    }

    // Store user info in localStorage
    localStorage.setItem("user", JSON.stringify(defaultUser))

    // Redirect to dashboard immediately
    router.push("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center text-white space-y-4">
        <div className="mx-auto w-28 h-28 mb-6 bg-white rounded-full p-6 shadow-lg flex items-center justify-center">
          <Shield className="w-full h-full text-blue-900 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold">Royal Papua New Guinea Constabulary</h1>
        <p className="text-blue-100">Accessing Police Management System...</p>
        <div className="animate-pulse">
          <p className="text-sm">Loading dashboard for Officer 12345...</p>
        </div>
      </div>
    </div>
  )
}
