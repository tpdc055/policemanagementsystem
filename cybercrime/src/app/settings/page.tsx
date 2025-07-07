"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationPreferences } from "@/components/settings/notification-preferences";
import {
  Settings,
  Bell,
  User,
  Shield,
  Database,
  Download,
  Smartphone,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
          <p className="text-zinc-600 mt-1">
            Manage your account preferences and system settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationPreferences />
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <User className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">Profile Management</h3>
                <p className="text-zinc-600 mb-4">
                  Profile editing functionality will be implemented here. This will include updating
                  personal information, contact details, and profile picture.
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Password</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Last changed: Never (use forgot password to set up)
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Enable 2FA
                      <Badge variant="secondary" className="ml-2">Soon</Badge>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Active Sessions</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Manage your active login sessions
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Sessions
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Security Logs</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      View your account security activity
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>
                Control how your data is used and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-zinc-600">Download a copy of your account data</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Request Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Audit Trail</h4>
                  <p className="text-sm text-zinc-600">View your account activity history</p>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Interface Theme</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Choose your preferred interface theme
                    </p>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Dark Mode
                      <Badge variant="secondary" className="ml-2">Soon</Badge>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Language & Region</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Set your language and regional preferences
                    </p>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      English (PNG)
                      <Badge variant="secondary" className="ml-2">Soon</Badge>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Mobile App</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Download the mobile companion app
                    </p>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Download App
                      <Badge variant="secondary" className="ml-2">Soon</Badge>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">System Status</h4>
                    <p className="text-sm text-zinc-600 mb-3">
                      Check current system status and health
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      System Status
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Information about the current system version and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">System Version</Label>
                  <p className="text-zinc-600">Cyber Crime Monitoring v1.0.0</p>
                </div>
                <div>
                  <Label className="font-medium">Build Date</Label>
                  <p className="text-zinc-600">January 2024</p>
                </div>
                <div>
                  <Label className="font-medium">Environment</Label>
                  <p className="text-zinc-600">Production</p>
                </div>
                <div>
                  <Label className="font-medium">Support</Label>
                  <p className="text-zinc-600">IT Department</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
