"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, User } from "lucide-react"

const USER_ROLES = {
  "admin": "System Administrator",
  "commander": "Police Commander",
  "officer": "Police Officer",
  "detective": "Detective/CID",
  "dispatcher": "Dispatcher",
  "analyst": "Crime Analyst",
  "clerk": "Administrative Clerk"
}

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [credentials, setCredentials] = useState({
    badgeNumber: "",
    password: "",
    role: ""
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For demo purposes, accept any badge number/password combination
      if (credentials.badgeNumber && credentials.password && credentials.role) {
        // Store user info in localStorage (in real app, use secure session management)
        localStorage.setItem("user", JSON.stringify({
          badgeNumber: credentials.badgeNumber,
          role: credentials.role,
          name: `Officer ${credentials.badgeNumber}`,
          loginTime: new Date().toISOString()
        }))
        router.push("/dashboard")
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="badgeNumber" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Badge Number
        </Label>
        <Input
          id="badgeNumber"
          type="text"
          placeholder="Enter your badge number"
          value={credentials.badgeNumber}
          onChange={(e) => setCredentials(prev => ({ ...prev, badgeNumber: e.target.value }))}
          disabled={loading}
          className="w-full"
          autoComplete="username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          disabled={loading}
          className="w-full"
          autoComplete="current-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Role
        </Label>
        <Select
          value={credentials.role}
          onValueChange={(value) => setCredentials(prev => ({ ...prev, role: value }))}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(USER_ROLES).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        <p className="font-semibold">Demo Credentials:</p>
        <p>Badge: Any number | Password: Any | Role: Any</p>
      </div>
    </form>
  )
}
