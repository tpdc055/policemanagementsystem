"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Eye,
  FileText,
  Shield,
  Calendar,
} from "lucide-react";

// Mock data - in real app this would come from API
const caseStats = {
  total: 156,
  open: 45,
  inProgress: 67,
  closed: 44,
  urgent: 8,
};

const recentCases = [
  {
    id: "CYBER-2024-001",
    title: "Online Romance Scam - Maria Santos",
    type: "Romance Scam",
    priority: "High",
    status: "In Progress",
    assignee: "Det. Sarah Wilson",
    createdAt: "2024-01-05",
    amount: "K15,000",
  },
  {
    id: "CYBER-2024-002",
    title: "Facebook Impersonation Case",
    type: "Identity Theft",
    priority: "Medium",
    status: "Open",
    assignee: "Det. Mike Johnson",
    createdAt: "2024-01-04",
    amount: "N/A",
  },
  {
    id: "CYBER-2024-003",
    title: "Cryptocurrency Investment Fraud",
    type: "Investment Fraud",
    priority: "High",
    status: "Under Investigation",
    assignee: "Det. John Doe",
    createdAt: "2024-01-03",
    amount: "K45,000",
  },
];

const alerts = [
  {
    type: "urgent",
    title: "High-value fraud case requires immediate attention",
    description: "CYBER-2024-001 involves K45,000 loss and multiple victims",
    time: "2 hours ago",
  },
  {
    type: "info",
    title: "New evidence uploaded for Case CYBER-2024-002",
    description: "Digital forensics team uploaded device analysis report",
    time: "4 hours ago",
  },
  {
    type: "warning",
    title: "Case deadline approaching",
    description: "CYBER-2024-003 legal request deadline is tomorrow",
    time: "6 hours ago",
  },
];

const quickStats = [
  {
    title: "Active Cases",
    value: caseStats.open,
    change: "+5 this week",
    trend: "up",
    icon: FileText,
    color: "blue",
  },
  {
    title: "Cases Closed",
    value: caseStats.closed,
    change: "+12 this month",
    trend: "up",
    icon: CheckCircle,
    color: "green",
  },
  {
    title: "Suspects Identified",
    value: 23,
    change: "+3 this week",
    trend: "up",
    icon: Users,
    color: "orange",
  },
  {
    title: "Evidence Items",
    value: 387,
    change: "+45 this week",
    trend: "up",
    icon: Shield,
    color: "purple",
  },
];

const offenseTypes = [
  { type: "Romance Scams", count: 34, percentage: 65 },
  { type: "Identity Theft", count: 22, percentage: 45 },
  { type: "Phishing", count: 18, percentage: 35 },
  { type: "Investment Fraud", count: 15, percentage: 30 },
  { type: "Cyberbullying", count: 12, percentage: 25 },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-600 mt-1">
            Welcome back, Det. John Doe. Here's what's happening in cyber crime investigations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Calendar className="h-4 w-4" />
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Latest cyber crime cases and their status</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                View All Cases
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCases.map((case_) => (
                    <TableRow key={case_.id} className="cursor-pointer hover:bg-zinc-50">
                      <TableCell className="font-medium">{case_.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{case_.title}</p>
                          <p className="text-xs text-zinc-500">Assigned to {case_.assignee}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{case_.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={case_.priority === "High" ? "destructive" : "secondary"}
                        >
                          {case_.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            case_.status === "In Progress" ? "default" :
                            case_.status === "Open" ? "secondary" : "outline"
                          }
                        >
                          {case_.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{case_.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <Alert key={index} className={
                  alert.type === "urgent" ? "border-red-200 bg-red-50" :
                  alert.type === "warning" ? "border-yellow-200 bg-yellow-50" :
                  "border-blue-200 bg-blue-50"
                }>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-zinc-600">{alert.description}</p>
                      <p className="text-xs text-zinc-500">{alert.time}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Offense Types */}
          <Card>
            <CardHeader>
              <CardTitle>Top Offense Types</CardTitle>
              <CardDescription>Most common cyber crimes this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {offenseTypes.map((offense) => (
                <div key={offense.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{offense.type}</span>
                    <span className="text-zinc-600">{offense.count} cases</span>
                  </div>
                  <Progress value={offense.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Case Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{caseStats.total}</div>
            <p className="text-sm text-blue-600">Total Cases</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{caseStats.open}</div>
            <p className="text-sm text-yellow-600">Open Cases</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{caseStats.inProgress}</div>
            <p className="text-sm text-orange-600">In Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{caseStats.closed}</div>
            <p className="text-sm text-green-600">Closed Cases</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
