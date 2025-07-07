"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
          </div>

          {/* Success Message */}
          <Card className="shadow-lg border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                Reset Link Sent
              </h2>
              <p className="text-green-700 mb-6">
                If an account with that email exists, a password reset link has been sent to{" "}
                <strong>{email}</strong>
              </p>
              <div className="bg-white p-4 rounded border border-green-200 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1 text-left">
                  <li>• Check your email for the reset link</li>
                  <li>• Click the link to create a new password</li>
                  <li>• The link expires in 1 hour</li>
                  <li>• Check your spam folder if you don't see the email</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/auth/signin")}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="flex-1"
                >
                  Send Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            Reset Your Password
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="shadow-lg border-zinc-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" />
              Forgot Password
            </CardTitle>
            <CardDescription>
              We'll email you a secure link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
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
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800"
                disabled={isLoading || !email}
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="text-sm text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Security Notice
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Password reset links expire after 1 hour</li>
            <li>• Only use official PNG Police email addresses</li>
            <li>• Never share reset links with anyone</li>
            <li>• Contact IT support if you continue having issues</li>
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
