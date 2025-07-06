import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-white space-y-4">
          <div className="mx-auto w-28 h-28 mb-6 bg-white rounded-full p-6 shadow-lg flex items-center justify-center">
            <Shield className="w-full h-full text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold">Royal Papua New Guinea Constabulary</h1>
          <p className="text-blue-100">Police Management System</p>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="text-center text-blue-100 text-sm">
          <p>For technical support, contact IT Department</p>
          <p className="mt-1">Emergency: 000 | Police: 111</p>
        </div>
      </div>
    </div>
  )
}
