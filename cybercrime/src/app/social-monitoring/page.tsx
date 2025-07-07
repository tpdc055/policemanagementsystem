"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle,
  Globe,
  Users,
  MessageSquare,
  Image,
  Video,
  Link,
  Calendar,
} from "lucide-react";

// Mock data for social media monitoring
const monitoredProfiles = [
  {
    id: 1,
    platform: "Facebook",
    profileName: "John Smith Romance",
    profileUrl: "https://facebook.com/johnsmith.romance.fake",
    caseId: "CYBER-2024-001",
    status: "Active Monitoring",
    risk: "High",
    lastActivity: "2024-01-05 16:30",
    followerCount: "1,250",
    postsCount: 45,
    suspiciousActivities: 12,
    reportedBy: "Victim Maria Santos",
    addedDate: "2024-01-02",
    investigator: "Det. Sarah Wilson",
  },
  {
    id: 2,
    platform: "Instagram",
    profileName: "crypto_investment_guru",
    profileUrl: "https://instagram.com/crypto_investment_guru",
    caseId: "CYBER-2024-003",
    status: "Under Review",
    risk: "Medium",
    lastActivity: "2024-01-05 14:15",
    followerCount: "8,450",
    postsCount: 127,
    suspiciousActivities: 8,
    reportedBy: "Multiple victims",
    addedDate: "2024-01-01",
    investigator: "Det. John Doe",
  },
  {
    id: 3,
    platform: "TikTok",
    profileName: "quick_money_png",
    profileUrl: "https://tiktok.com/@quick_money_png",
    caseId: "CYBER-2024-005",
    status: "Escalated",
    risk: "High",
    lastActivity: "2024-01-05 12:00",
    followerCount: "15,600",
    postsCount: 89,
    suspiciousActivities: 15,
    reportedBy: "Public Report",
    addedDate: "2023-12-28",
    investigator: "Det. Mike Johnson",
  },
  {
    id: 4,
    platform: "WhatsApp",
    profileName: "+675 XXXX XXXX",
    profileUrl: "WhatsApp Business Profile",
    caseId: "CYBER-2024-002",
    status: "Investigation Complete",
    risk: "Low",
    lastActivity: "2024-01-04 10:30",
    followerCount: "N/A",
    postsCount: 0,
    suspiciousActivities: 3,
    reportedBy: "Bank Alert",
    addedDate: "2023-12-30",
    investigator: "Det. Sarah Wilson",
  },
];

const platforms = [
  { name: "Facebook", icon: "📘", active: true },
  { name: "Instagram", icon: "📷", active: true },
  { name: "TikTok", icon: "🎵", active: true },
  { name: "WhatsApp", icon: "💬", active: true },
  { name: "Twitter/X", icon: "🐦", active: true },
  { name: "Telegram", icon: "✈️", active: true },
  { name: "LinkedIn", icon: "💼", active: false },
  { name: "Snapchat", icon: "👻", active: false },
];

const riskLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
];

const monitoringStatuses = [
  { value: "active", label: "Active Monitoring", color: "bg-blue-100 text-blue-800" },
  { value: "review", label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "escalated", label: "Escalated", color: "bg-red-100 text-red-800" },
  { value: "complete", label: "Investigation Complete", color: "bg-green-100 text-green-800" },
  { value: "suspended", label: "Suspended", color: "bg-zinc-100 text-zinc-800" },
];

export default function SocialMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRisk, setFilterRisk] = useState("");

  const filteredProfiles = monitoredProfiles.filter(profile => {
    const matchesSearch = profile.profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = !filterPlatform || profile.platform === filterPlatform;
    const matchesStatus = !filterStatus || profile.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesRisk = !filterRisk || profile.risk.toLowerCase() === filterRisk;
    return matchesSearch && matchesPlatform && matchesStatus && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    const riskConfig = riskLevels.find(r => r.label.toLowerCase() === risk.toLowerCase());
    return riskConfig?.color || "bg-zinc-100 text-zinc-800";
  };

  const getStatusColor = (status: string) => {
    const statusConfig = monitoringStatuses.find(s => s.label === status);
    return statusConfig?.color || "bg-zinc-100 text-zinc-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Social Media Monitoring</h1>
          <p className="text-zinc-600 mt-1">
            Monitor suspicious social media profiles and track cybercrime activities across platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Data
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Profile for Monitoring</DialogTitle>
                <DialogDescription>
                  Add a social media profile to the monitoring system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.filter(p => p.active).map((platform) => (
                          <SelectItem key={platform.name} value={platform.name}>
                            <span className="flex items-center gap-2">
                              <span>{platform.icon}</span>
                              {platform.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseId">Related Case ID</Label>
                    <Input id="caseId" placeholder="CYBER-2024-XXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileName">Profile Name/Handle</Label>
                  <Input id="profileName" placeholder="Profile name or username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileUrl">Profile URL</Label>
                  <Input id="profileUrl" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Risk Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportedBy">Reported By</Label>
                    <Input id="reportedBy" placeholder="Victim name or source" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Initial observations or concerns about this profile..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Add to Monitoring</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Monitored Profiles</p>
                <p className="text-2xl font-bold text-zinc-900">{monitoredProfiles.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  +3 this week
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">High Risk Profiles</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {monitoredProfiles.filter(p => p.risk === "High").length}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Requires attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Active Platforms</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {platforms.filter(p => p.active).length}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Currently monitoring
                </p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Suspicious Activities</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {monitoredProfiles.reduce((sum, profile) => sum + profile.suspiciousActivities, 0)}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Last 30 days
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search profiles or case IDs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Platforms</SelectItem>
                  {platforms.filter(p => p.active).map((platform) => (
                    <SelectItem key={platform.name} value={platform.name}>
                      {platform.icon} {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  {monitoringStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.label}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Risk</SelectItem>
                  {riskLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitored Profiles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monitored Profiles ({filteredProfiles.length})</CardTitle>
          <CardDescription>
            Social media profiles under active monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{profile.profileName}</p>
                      <p className="text-sm text-zinc-500">
                        Reported by: {profile.reportedBy}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Added: {profile.addedDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{platforms.find(p => p.name === profile.platform)?.icon}</span>
                      <span>{profile.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{profile.caseId}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(profile.status)}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(profile.risk)}>
                      {profile.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p><strong>{profile.suspiciousActivities}</strong> suspicious</p>
                      <p className="text-zinc-500">{profile.postsCount} posts</p>
                      {profile.followerCount !== "N/A" && (
                        <p className="text-zinc-500">{profile.followerCount} followers</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {profile.lastActivity}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Image className="h-4 w-4 mr-2" />
                          Capture Evidence
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Report to Platform
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove from Monitoring
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Platform Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>
              Monitoring capabilities by platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{platform.icon}</span>
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-zinc-500">
                      {monitoredProfiles.filter(p => p.platform === platform.name).length} profiles monitored
                    </p>
                  </div>
                </div>
                <Badge
                  variant={platform.active ? "default" : "secondary"}
                  className={platform.active ? "bg-green-100 text-green-800" : ""}
                >
                  {platform.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Monitoring Activity</CardTitle>
            <CardDescription>
              Latest monitoring events and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">High-risk activity detected</p>
                  <p className="text-xs text-red-700">Profile "crypto_investment_guru" posted suspicious content</p>
                  <p className="text-xs text-red-600 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">New profile added to monitoring</p>
                  <p className="text-xs text-blue-700">TikTok profile "quick_money_png" added by Det. Johnson</p>
                  <p className="text-xs text-blue-600 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Investigation completed</p>
                  <p className="text-xs text-green-700">WhatsApp profile monitoring concluded for CYBER-2024-002</p>
                  <p className="text-xs text-green-600 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">Profile requires review</p>
                  <p className="text-xs text-yellow-700">Facebook profile "John Smith Romance" needs status update</p>
                  <p className="text-xs text-yellow-600 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
