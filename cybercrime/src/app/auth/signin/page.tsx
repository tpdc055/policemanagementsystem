"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        // Get session to check user role and redirect appropriately
        const session = await getSession();
        if (session) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-zinc-900" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">PNG Police</h1>
              <p className="text-sm text-zinc-600">Cyber Crime Unit</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-zinc-800">
            Secure Access Portal
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Sign in to access the Cyber Crime Monitoring System
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="shadow-lg border-zinc-200">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@pngpolice.gov.pg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-xs text-zinc-500">
                  Forgot your password?
                  <Link
                    href="/auth/forgot-password"
                    className="ml-1 text-zinc-700 hover:text-zinc-900 font-medium"
                  >
                    Reset it here
                  </Link>
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  For other issues, contact your system administrator.
                </p>
              </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Security Notice
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• This system is for authorized personnel only</li>
            <li>• All activities are logged and monitored</li>
            <li>• Report any suspicious activity immediately</li>
            <li>• Do not share your login credentials</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          <p>Royal Papua New Guinea Police Force</p>
          <p>Cyber Crime Monitoring System v1.0</p>
        </div>
      </div>
    </div>
  );
}
