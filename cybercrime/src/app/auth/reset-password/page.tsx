"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/auth/forgot-password");
    }
  }, [token, router]);

  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password));
  }, [password]);

  const evaluatePasswordStrength = (pwd: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (pwd.length >= 12) {
      score += 1;
    } else {
      feedback.push("At least 12 characters long");
    }

    if (/[a-z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push("At least one lowercase letter");
    }

    if (/[A-Z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push("At least one uppercase letter");
    }

    if (/\d/.test(pwd)) {
      score += 1;
    } else {
      feedback.push("At least one number");
    }

    if (/[@$!%*?&]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push("At least one special character (@$!%*?&)");
    }

    return {
      score,
      feedback,
      isValid: score === 5,
    };
  };

  const getStrengthColor = (score: number) => {
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return "Weak";
    if (score < 4) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!passwordStrength.isValid) {
      setError("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-12 w-12 text-zinc-900" />
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">PNG Police</h1>
                <p className="text-sm text-zinc-600">Cyber Crime Unit</p>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                Password Reset Successfully
              </h2>
              <p className="text-green-700 mb-6">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <Button
                onClick={() => router.push("/auth/signin")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue to Sign In
              </Button>
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
            Create New Password
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Enter a strong password for your account
          </p>
        </div>

        {/* Reset Password Form */}
        <Card className="shadow-lg border-zinc-200">
          <CardHeader className="text-center">
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>
              Choose a strong password to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-400" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score < 2 ? "text-red-600" :
                        passwordStrength.score < 4 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {getStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-zinc-600">
                        <p className="font-medium">Requirements:</p>
                        <ul className="mt-1 space-y-1">
                          {passwordStrength.feedback.map((item, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <XCircle className="h-3 w-3 text-red-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-400" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Passwords don't match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800"
                disabled={
                  isLoading ||
                  !passwordStrength.isValid ||
                  password !== confirmPassword ||
                  !password ||
                  !confirmPassword
                }
              >
                {isLoading ? "Updating Password..." : "Update Password"}
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
            Password Security Tips
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use a unique password for this account</li>
            <li>• Don't share your password with anyone</li>
            <li>• Consider using a password manager</li>
            <li>• Change your password if you suspect it's compromised</li>
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
