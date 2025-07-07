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
  Gavel,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Send,
  Calendar,
  Building,
  Mail,
  Phone,
} from "lucide-react";

// Mock data for legal requests
const legalRequests = [
  {
    id: 1,
    requestId: "LR-2024-001",
    caseId: "CYBER-2024-001",
    platform: "Facebook",
    requestType: "User Data Request",
    status: "Pending Response",
    priority: "High",
    submittedDate: "2024-01-03",
    expectedResponse: "2024-01-17",
    actualResponse: null,
    requestedBy: "Det. Sarah Wilson",
    targetAccount: "john.smith.romance.fake",
    dataRequested: ["Account information", "IP logs", "Message history"],
    legalBasis: "Criminal Investigation - Romance Scam",
    documentsSent: 3,
    documentsReceived: 0,
    platformContact: "law-enforcement@facebook.com",
    notes: "Initial request for user data in romance scam investigation",
  },
  {
    id: 2,
    requestId: "LR-2024-002",
    caseId: "CYBER-2024-003",
    platform: "Instagram",
    requestType: "Content Preservation",
    status: "Completed",
    priority: "Medium",
    submittedDate: "2024-01-01",
    expectedResponse: "2024-01-15",
    actualResponse: "2024-01-12",
    requestedBy: "Det. John Doe",
    targetAccount: "@crypto_investment_guru",
    dataRequested: ["Posts", "Stories", "Account details"],
    legalBasis: "Investment Fraud Investigation",
    documentsSent: 2,
    documentsReceived: 1,
    platformContact: "legal@instagram.com",
    notes: "Content preservation successful, data received",
  },
  {
    id: 3,
    requestId: "LR-2024-003",
    caseId: "CYBER-2024-005",
    platform: "TikTok",
    requestType: "Account Takedown",
    status: "In Progress",
    priority: "High",
    submittedDate: "2024-01-04",
    expectedResponse: "2024-01-18",
    actualResponse: null,
    requestedBy: "Det. Mike Johnson",
    targetAccount: "@quick_money_png",
    dataRequested: ["Account removal"],
    legalBasis: "Fraudulent Investment Scheme",
    documentsSent: 4,
    documentsReceived: 0,
    platformContact: "law-enforcement@tiktok.com",
    notes: "Awaiting platform review for account takedown",
  },
  {
    id: 4,
    requestId: "LR-2024-004",
    caseId: "CYBER-2024-002",
    platform: "WhatsApp",
    requestType: "Emergency Disclosure",
    status: "Response Overdue",
    priority: "Urgent",
    submittedDate: "2023-12-30",
    expectedResponse: "2024-01-05",
    actualResponse: null,
    requestedBy: "Det. Sarah Wilson",
    targetAccount: "+675XXXXXXXX",
    dataRequested: ["Registration data", "Connection logs"],
    legalBasis: "Identity Theft Investigation",
    documentsSent: 2,
    documentsReceived: 0,
    platformContact: "legal@whatsapp.com",
    notes: "Response overdue, follow-up required",
  },
];

const platforms = [
  {
    name: "Facebook",
    legalContact: "law-enforcement@facebook.com",
    portal: "https://www.facebook.com/records",
    responseTime: "14 days",
    supportedRequests: ["User Data", "Content Preservation", "Emergency Disclosure", "Takedown"],
    requirements: ["Court Order", "Warrant", "Subpoena"],
  },
  {
    name: "Instagram",
    legalContact: "legal@instagram.com",
    portal: "https://help.instagram.com/494561080557017",
    responseTime: "14 days",
    supportedRequests: ["User Data", "Content Preservation", "Emergency Disclosure"],
    requirements: ["Court Order", "Warrant"],
  },
  {
    name: "TikTok",
    legalContact: "law-enforcement@tiktok.com",
    portal: "https://www.tiktok.com/legal/law-enforcement",
    responseTime: "21 days",
    supportedRequests: ["User Data", "Content Preservation", "Account Takedown"],
    requirements: ["Court Order", "Subpoena"],
  },
  {
    name: "WhatsApp",
    legalContact: "legal@whatsapp.com",
    portal: "https://www.whatsapp.com/legal/law-enforcement-guidelines",
    responseTime: "7 days",
    supportedRequests: ["Emergency Disclosure", "User Data"],
    requirements: ["Warrant", "Emergency Request"],
  },
  {
    name: "Telegram",
    legalContact: "abuse@telegram.org",
    portal: "https://telegram.org/faq#q-how-do-you-process-take-down-requests",
    responseTime: "30 days",
    supportedRequests: ["Content Takedown", "User Data"],
    requirements: ["Court Order"],
  },
];

const requestTypes = [
  { value: "user-data", label: "User Data Request", description: "Account information, logs, metadata" },
  { value: "content-preservation", label: "Content Preservation", description: "Preserve posts, messages, media" },
  { value: "emergency-disclosure", label: "Emergency Disclosure", description: "Urgent safety-related data" },
  { value: "account-takedown", label: "Account Takedown", description: "Remove fraudulent accounts" },
  { value: "content-takedown", label: "Content Takedown", description: "Remove specific content" },
];

const statusTypes = [
  { value: "draft", label: "Draft", color: "bg-zinc-100 text-zinc-800" },
  { value: "submitted", label: "Submitted", color: "bg-blue-100 text-blue-800" },
  { value: "pending", label: "Pending Response", color: "bg-yellow-100 text-yellow-800" },
  { value: "in-progress", label: "In Progress", color: "bg-orange-100 text-orange-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "overdue", label: "Response Overdue", color: "bg-red-100 text-red-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

const priorityLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

export default function LegalRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const filteredRequests = legalRequests.filter(request => {
    const matchesSearch = request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.targetAccount.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = !filterPlatform || request.platform === filterPlatform;
    const matchesStatus = !filterStatus || request.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesPriority = !filterPriority || request.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesPlatform && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const statusConfig = statusTypes.find(s => s.label === status);
    return statusConfig?.color || "bg-zinc-100 text-zinc-800";
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = priorityLevels.find(p => p.label.toLowerCase() === priority.toLowerCase());
    return priorityConfig?.color || "bg-zinc-100 text-zinc-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Legal Requests & Liaison</h1>
          <p className="text-zinc-600 mt-1">
            Manage legal data requests to social media platforms and track communications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Requests
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Legal Request</DialogTitle>
                <DialogDescription>
                  Submit a new legal data request to a social media platform
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
                        {platforms.map((platform) => (
                          <SelectItem key={platform.name} value={platform.name}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseId">Case ID</Label>
                    <Input id="caseId" placeholder="CYBER-2024-XXX" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <p className="font-medium">{type.label}</p>
                              <p className="text-xs text-zinc-500">{type.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAccount">Target Account/Profile</Label>
                  <Input id="targetAccount" placeholder="Username, profile URL, or phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRequested">Data Requested</Label>
                  <Textarea
                    id="dataRequested"
                    placeholder="Specify the exact data requested (account info, messages, IP logs, etc.)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalBasis">Legal Basis</Label>
                  <Textarea
                    id="legalBasis"
                    placeholder="Legal justification for the request (investigation type, applicable laws)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgencyJustification">Urgency Justification (if applicable)</Label>
                  <Textarea
                    id="urgencyJustification"
                    placeholder="Explain why this request is urgent or time-sensitive"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Save as Draft</Button>
                  <Button className="flex-1">Submit Request</Button>
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
                <p className="text-sm font-medium text-zinc-600">Total Requests</p>
                <p className="text-2xl font-bold text-zinc-900">{legalRequests.length}</p>
                <p className="text-xs text-blue-600 mt-1">
                  +2 this month
                </p>
              </div>
              <Gavel className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Pending Responses</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {legalRequests.filter(r => r.status === "Pending Response" || r.status === "In Progress").length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Awaiting platforms
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Overdue Responses</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {legalRequests.filter(r => r.status === "Response Overdue").length}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Requires follow-up
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
                <p className="text-sm font-medium text-zinc-600">Completed</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {legalRequests.filter(r => r.status === "Completed").length}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Success rate: 75%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
                  placeholder="Search requests, case IDs, or accounts..."
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
                  {platforms.map((platform) => (
                    <SelectItem key={platform.name} value={platform.name}>
                      {platform.name}
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
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.label}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priority</SelectItem>
                  {priorityLevels.map((level) => (
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

      {/* Legal Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>
            Track legal data requests submitted to social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Response Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.requestId}</p>
                      <p className="text-sm text-zinc-500">Case: {request.caseId}</p>
                      <p className="text-xs text-zinc-400">
                        By: {request.requestedBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{request.requestType}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{request.targetAccount}</p>
                      <p className="text-zinc-500">{request.dataRequested.length} data types</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className={
                        request.status === "Response Overdue" ? "text-red-600 font-medium" :
                        new Date(request.expectedResponse) < new Date() ? "text-orange-600" :
                        "text-zinc-600"
                      }>
                        {request.expectedResponse}
                      </p>
                      {request.actualResponse && (
                        <p className="text-xs text-green-600">
                          Received: {request.actualResponse}
                        </p>
                      )}
                    </div>
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Send Follow-up
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Response
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Add Notes
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

      {/* Platform Information and Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Contact Information</CardTitle>
            <CardDescription>
              Legal contacts and submission requirements for each platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{platform.name}</h4>
                  <Badge variant="outline">
                    {legalRequests.filter(r => r.platform === platform.name).length} requests
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-zinc-500">Legal Contact:</p>
                    <p className="font-medium">{platform.legalContact}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Response Time:</p>
                    <p className="font-medium">{platform.responseTime}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-zinc-500">Supported Requests:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {platform.supportedRequests.map((req) => (
                      <Badge key={req} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-zinc-500">Requirements:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {platform.requirements.map((req) => (
                      <Badge key={req} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Templates & Guidelines</CardTitle>
            <CardDescription>
              Standard templates and best practices for legal requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Emergency Disclosure Request</h4>
                <p className="text-sm text-blue-700 mb-3">
                  For immediate threats to safety or life-threatening situations
                </p>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Standard User Data Request</h4>
                <p className="text-sm text-green-700 mb-3">
                  For account information, logs, and metadata in criminal investigations
                </p>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Content Preservation Request</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  To preserve content before formal legal process is complete
                </p>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Account Takedown Request</h4>
                <p className="text-sm text-orange-700 mb-3">
                  For removal of fraudulent or harmful accounts
                </p>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm text-zinc-600 space-y-1">
                <li>• Include specific legal basis for each request</li>
                <li>• Provide clear timeline for urgency</li>
                <li>• Attach relevant court orders or warrants</li>
                <li>• Follow up on overdue responses</li>
                <li>• Maintain detailed documentation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
