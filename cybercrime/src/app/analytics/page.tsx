"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  TrendingDown,
  Users,
  Shield,
  Calendar,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Target,
} from "lucide-react";

// Mock analytics data
const caseAnalytics = {
  totalCases: 156,
  activeCases: 67,
  closedCases: 44,
  pendingCases: 45,
  monthlyGrowth: 12.5,
  resolutionRate: 73.2,
  averageResolutionTime: 18, // days
};

const offenseAnalytics = [
  { type: "Romance Scams", cases: 34, percentage: 22, trend: "up", monthlyChange: 8 },
  { type: "Identity Theft", cases: 28, percentage: 18, trend: "up", monthlyChange: 5 },
  { type: "Phishing", cases: 25, percentage: 16, trend: "down", monthlyChange: -3 },
  { type: "Investment Fraud", cases: 19, percentage: 12, trend: "up", monthlyChange: 12 },
  { type: "Cyberbullying", cases: 18, percentage: 12, trend: "stable", monthlyChange: 0 },
  { type: "Online Shopping Fraud", cases: 15, percentage: 10, trend: "up", monthlyChange: 7 },
  { type: "Social Media Scams", cases: 12, percentage: 8, trend: "up", monthlyChange: 4 },
  { type: "Other", cases: 5, percentage: 3, trend: "stable", monthlyChange: 1 },
];

const platformAnalytics = [
  { platform: "Facebook", cases: 45, percentage: 35, victims: 67, avgLoss: "K18,500" },
  { platform: "Instagram", cases: 32, percentage: 25, victims: 48, avgLoss: "K12,300" },
  { platform: "WhatsApp", cases: 28, percentage: 22, victims: 35, avgLoss: "K22,100" },
  { platform: "TikTok", cases: 15, percentage: 12, victims: 23, avgLoss: "K8,900" },
  { platform: "Email", cases: 8, percentage: 6, victims: 12, avgLoss: "K15,600" },
];

const monthlyData = [
  { month: "Jul 2023", cases: 8, resolved: 6, pending: 2 },
  { month: "Aug 2023", cases: 12, resolved: 9, pending: 3 },
  { month: "Sep 2023", cases: 15, resolved: 11, pending: 4 },
  { month: "Oct 2023", cases: 18, resolved: 14, pending: 4 },
  { month: "Nov 2023", cases: 22, resolved: 17, pending: 5 },
  { month: "Dec 2023", cases: 19, resolved: 15, pending: 4 },
  { month: "Jan 2024", cases: 25, resolved: 18, pending: 7 },
];

const investigatorPerformance = [
  { name: "Det. Sarah Wilson", activeCases: 12, closedCases: 18, resolutionRate: 85, avgDays: 15 },
  { name: "Det. John Doe", activeCases: 15, closedCases: 16, resolutionRate: 78, avgDays: 19 },
  { name: "Det. Mike Johnson", activeCases: 8, closedCases: 22, resolutionRate: 92, avgDays: 12 },
  { name: "Sgt. Mary Kate", activeCases: 5, closedCases: 8, resolutionRate: 88, avgDays: 14 },
];

const geographicData = [
  { province: "National Capital District", cases: 45, percentage: 29 },
  { province: "Western Province", cases: 23, percentage: 15 },
  { province: "Morobe Province", cases: 18, percentage: 12 },
  { province: "Eastern Highlands", cases: 15, percentage: 10 },
  { province: "Central Province", cases: 12, percentage: 8 },
  { province: "Others", cases: 43, percentage: 28 },
];

const financialImpact = {
  totalLossReported: "K2,450,000",
  averageLossPerCase: "K15,700",
  recoveredAmount: "K180,000",
  recoveryRate: 7.3,
  highestSingleLoss: "K85,000",
  medianLoss: "K8,500",
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last-6-months");
  const [selectedMetric, setSelectedMetric] = useState("cases");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Analytics Dashboard</h1>
          <p className="text-zinc-600 mt-1">
            Comprehensive analytics and insights for cyber crime monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Cases</p>
                <p className="text-2xl font-bold text-zinc-900">{caseAnalytics.totalCases}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +{caseAnalytics.monthlyGrowth}% this month
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-zinc-900">{caseAnalytics.resolutionRate}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Above target (70%)
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-zinc-900">{caseAnalytics.averageResolutionTime}</p>
                <p className="text-xs text-zinc-500 mt-1">days</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Financial Impact</p>
                <p className="text-2xl font-bold text-zinc-900">{financialImpact.totalLossReported}</p>
                <p className="text-xs text-red-600 mt-1">
                  {financialImpact.recoveryRate}% recovered
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offenses">Offense Types</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Trend Analysis</CardTitle>
                <CardDescription>Monthly case registration and resolution trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-zinc-600">{month.cases} cases</span>
                      </div>
                      <div className="flex gap-1">
                        <div
                          className="bg-green-500 h-2 rounded-l"
                          style={{ width: `${(month.resolved / month.cases) * 100}%` }}
                        />
                        <div
                          className="bg-yellow-500 h-2 rounded-r"
                          style={{ width: `${(month.pending / month.cases) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{month.resolved} resolved</span>
                        <span>{month.pending} pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Status Distribution</CardTitle>
                <CardDescription>Current status of all cases in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Cases</span>
                      <span className="text-sm text-zinc-600">{caseAnalytics.activeCases}</span>
                    </div>
                    <Progress value={(caseAnalytics.activeCases / caseAnalytics.totalCases) * 100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Closed Cases</span>
                      <span className="text-sm text-zinc-600">{caseAnalytics.closedCases}</span>
                    </div>
                    <Progress value={(caseAnalytics.closedCases / caseAnalytics.totalCases) * 100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pending Cases</span>
                      <span className="text-sm text-zinc-600">{caseAnalytics.pendingCases}</span>
                    </div>
                    <Progress value={(caseAnalytics.pendingCases / caseAnalytics.totalCases) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Impact Analysis</CardTitle>
              <CardDescription>Economic impact of cyber crimes and recovery efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-red-900">Total Losses</p>
                      <p className="text-2xl font-bold text-red-600">{financialImpact.totalLossReported}</p>
                      <p className="text-xs text-red-700">Reported by victims</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-900">Average Loss</p>
                      <p className="text-2xl font-bold text-blue-600">{financialImpact.averageLossPerCase}</p>
                      <p className="text-xs text-blue-700">Per case</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-900">Recovered</p>
                      <p className="text-2xl font-bold text-green-600">{financialImpact.recoveredAmount}</p>
                      <p className="text-xs text-green-700">{financialImpact.recoveryRate}% recovery rate</p>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-orange-900">Highest Loss</p>
                      <p className="text-2xl font-bold text-orange-600">{financialImpact.highestSingleLoss}</p>
                      <p className="text-xs text-orange-700">Single case</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-purple-900">Median Loss</p>
                      <p className="text-2xl font-bold text-purple-600">{financialImpact.medianLoss}</p>
                      <p className="text-xs text-purple-700">Middle value</p>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-900">Total Cases</p>
                      <p className="text-2xl font-bold text-zinc-600">{caseAnalytics.totalCases}</p>
                      <p className="text-xs text-zinc-700">With financial loss</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offense Types Tab */}
        <TabsContent value="offenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offense Type Analysis</CardTitle>
              <CardDescription>Breakdown of cyber crime types and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offense Type</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Monthly Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offenseAnalytics.map((offense) => (
                    <TableRow key={offense.type}>
                      <TableCell className="font-medium">{offense.type}</TableCell>
                      <TableCell>{offense.cases}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={offense.percentage} className="w-16 h-2" />
                          <span className="text-sm">{offense.percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            offense.trend === "up" ? "text-red-600" :
                            offense.trend === "down" ? "text-green-600" :
                            "text-zinc-600"
                          }
                        >
                          {offense.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                          {offense.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                          {offense.trend}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={
                          offense.monthlyChange > 0 ? "text-red-600" :
                          offense.monthlyChange < 0 ? "text-green-600" :
                          "text-zinc-600"
                        }>
                          {offense.monthlyChange > 0 ? "+" : ""}{offense.monthlyChange}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Impact Analysis</CardTitle>
              <CardDescription>Cyber crime distribution across social media platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead>Distribution</TableHead>
                    <TableHead>Victims</TableHead>
                    <TableHead>Avg Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformAnalytics.map((platform) => (
                    <TableRow key={platform.platform}>
                      <TableCell className="font-medium">{platform.platform}</TableCell>
                      <TableCell>{platform.cases}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={platform.percentage} className="w-20 h-2" />
                          <span className="text-sm">{platform.percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{platform.victims}</TableCell>
                      <TableCell className="font-medium">{platform.avgLoss}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investigator Performance</CardTitle>
              <CardDescription>Performance metrics for cyber crime investigators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investigator</TableHead>
                    <TableHead>Active Cases</TableHead>
                    <TableHead>Closed Cases</TableHead>
                    <TableHead>Resolution Rate</TableHead>
                    <TableHead>Avg Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investigatorPerformance.map((investigator) => (
                    <TableRow key={investigator.name}>
                      <TableCell className="font-medium">{investigator.name}</TableCell>
                      <TableCell>{investigator.activeCases}</TableCell>
                      <TableCell>{investigator.closedCases}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={investigator.resolutionRate} className="w-16 h-2" />
                          <span className="text-sm">{investigator.resolutionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{investigator.avgDays}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Cyber crime cases by province and region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((location) => (
                  <div key={location.province} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{location.province}</span>
                        <span className="text-sm text-zinc-600">{location.cases} cases</span>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-medium">{location.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
