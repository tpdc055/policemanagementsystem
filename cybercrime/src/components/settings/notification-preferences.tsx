"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  TestTube,
  Save,
  CheckCircle,
  AlertTriangle,
  Info,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";

interface NotificationPreferences {
  caseAssigned: { email: boolean; realtime: boolean };
  caseUpdated: { email: boolean; realtime: boolean };
  evidenceUploaded: { email: boolean; realtime: boolean };
  legalRequestResponse: { email: boolean; realtime: boolean };
  urgentAlerts: { email: boolean; realtime: boolean };
  systemNotifications: { email: boolean; realtime: boolean };
  digestFrequency: "none" | "daily" | "weekly";
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationPreferencesProps {
  userId?: string;
}

export function NotificationPreferences({ userId }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/notifications/preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      } else {
        console.error("Failed to load preferences");
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!preferences) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaveMessage({
          type: "success",
          message: "Notification preferences saved successfully",
        });
      } else {
        const data = await response.json();
        setSaveMessage({
          type: "error",
          message: data.error || "Failed to save preferences",
        });
      }
    } catch (error) {
      setSaveMessage({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testNotification = async (type: string) => {
    setIsTesting(type);

    try {
      const response = await fetch("/api/notifications/preferences/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        setSaveMessage({
          type: "success",
          message: `Test notification sent for ${type}`,
        });
      } else {
        setSaveMessage({
          type: "error",
          message: "Failed to send test notification",
        });
      }
    } catch (error) {
      setSaveMessage({
        type: "error",
        message: "Failed to send test notification",
      });
    } finally {
      setIsTesting(null);
    }
  };

  const updatePreference = (
    category: keyof Omit<NotificationPreferences, "digestFrequency" | "quietHours">,
    type: "email" | "realtime",
    value: boolean
  ) => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [type]: value,
      },
    });
  };

  const updateDigestFrequency = (frequency: "none" | "daily" | "weekly") => {
    if (!preferences) return;
    setPreferences({ ...preferences, digestFrequency: frequency });
  };

  const updateQuietHours = (field: keyof NotificationPreferences["quietHours"], value: boolean | string) => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours,
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
          <div className="h-32 bg-zinc-200 rounded"></div>
          <div className="h-32 bg-zinc-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load notification preferences. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const notificationCategories = [
    {
      key: "caseAssigned" as const,
      title: "Case Assignments",
      description: "When new cases are assigned to you",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      key: "caseUpdated" as const,
      title: "Case Updates",
      description: "When your cases are updated by others",
      icon: <Info className="h-4 w-4" />,
    },
    {
      key: "evidenceUploaded" as const,
      title: "Evidence Uploads",
      description: "When new evidence is added to your cases",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      key: "legalRequestResponse" as const,
      title: "Legal Request Responses",
      description: "When platforms respond to legal data requests",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      key: "urgentAlerts" as const,
      title: "Urgent Alerts",
      description: "High-priority notifications requiring immediate attention",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      key: "systemNotifications" as const,
      title: "System Notifications",
      description: "System updates, maintenance, and general announcements",
      icon: <Info className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Notification Preferences</h2>
        <p className="text-zinc-600 mt-1">
          Customize how and when you receive notifications from the cyber crime monitoring system
        </p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Alert className={
          saveMessage.type === "success"
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }>
          {saveMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={
            saveMessage.type === "success" ? "text-green-800" : "text-red-800"
          }>
            {saveMessage.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Types
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified for different types of events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationCategories.map((category, index) => (
            <div key={category.key}>
              <div className="flex items-start gap-4">
                <div className="mt-1">{category.icon}</div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-medium text-zinc-900">{category.title}</h4>
                    <p className="text-sm text-zinc-600">{category.description}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      <Label htmlFor={`${category.key}-email`} className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id={`${category.key}-email`}
                        checked={preferences[category.key].email}
                        onCheckedChange={(checked) =>
                          updatePreference(category.key, "email", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-zinc-500" />
                      <Label htmlFor={`${category.key}-realtime`} className="text-sm">
                        Real-time
                      </Label>
                      <Switch
                        id={`${category.key}-realtime`}
                        checked={preferences[category.key].realtime}
                        onCheckedChange={(checked) =>
                          updatePreference(category.key, "realtime", checked)
                        }
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testNotification(category.key)}
                      disabled={isTesting === category.key}
                      className="ml-auto"
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      {isTesting === category.key ? "Testing..." : "Test"}
                    </Button>
                  </div>
                </div>
              </div>
              {index < notificationCategories.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Digest Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Digest
          </CardTitle>
          <CardDescription>
            Receive periodic summaries of your notifications via email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="digest-frequency" className="text-sm font-medium">
                Frequency:
              </Label>
              <Select
                value={preferences.digestFrequency}
                onValueChange={updateDigestFrequency}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No digest emails</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {preferences.digestFrequency !== "none" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {preferences.digestFrequency === "daily"
                    ? "You'll receive a daily summary email at 8:00 AM with your notifications from the past 24 hours."
                    : "You'll receive a weekly summary email every Monday at 8:00 AM with your notifications from the past week."
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Disable notifications during specific hours (real-time only, emails are not affected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                id="quiet-hours-enabled"
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) => updateQuietHours("enabled", checked)}
              />
              <Label htmlFor="quiet-hours-enabled" className="text-sm font-medium">
                Enable quiet hours
              </Label>
              {preferences.quietHours.enabled ? (
                <VolumeX className="h-4 w-4 text-zinc-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-zinc-500" />
              )}
            </div>

            {preferences.quietHours.enabled && (
              <div className="flex items-center gap-4 ml-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="quiet-start" className="text-sm">
                    From:
                  </Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => updateQuietHours("start", e.target.value)}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="quiet-end" className="text-sm">
                    To:
                  </Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => updateQuietHours("end", e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>
            )}

            {preferences.quietHours.enabled && (
              <Alert>
                <Moon className="h-4 w-4" />
                <AlertDescription>
                  Real-time notifications will be disabled from {preferences.quietHours.start} to{" "}
                  {preferences.quietHours.end}. Urgent alerts will still be delivered immediately.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSaving} className="min-w-32">
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Changes to notification preferences take effect immediately.
          You can test your settings using the "Test" buttons above.
          If you're not receiving notifications, check your email spam folder and
          contact your system administrator if issues persist.
        </AlertDescription>
      </Alert>
    </div>
  );
}
