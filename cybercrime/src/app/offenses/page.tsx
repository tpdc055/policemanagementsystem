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
  ClipboardList,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Shield,
  Globe,
  Users,
  DollarSign,
} from "lucide-react";

// Predefined offense types with detailed information
const offenseTypes = [
  {
    id: 1,
    name: "Romance Scam",
    category: "Online Fraud",
    severity: "High",
    description: "Fraudulent romantic relationships established online to extract money from victims",
    commonPlatforms: ["Facebook", "Instagram", "Dating Apps", "WhatsApp"],
    averageLoss: "K25,000",
    casesThisYear: 34,
    trend: "increasing",
    investigationComplexity: "High",
    evidenceTypes: ["Social media profiles", "Financial records", "Communication logs"],
    legalFramework: "Criminal Code Act - Fraud provisions",
    isActive: true,
  },
  {
    id: 2,
    name: "Identity Theft/Impersonation",
    category: "Identity Crimes",
    severity: "High",
    description: "Unauthorized use of another person's identity for fraudulent purposes",
    commonPlatforms: ["Facebook", "Instagram", "Government portals", "Banking sites"],
    averageLoss: "K15,000",
    casesThisYear: 28,
    trend: "stable",
    investigationComplexity: "Medium",
    evidenceTypes: ["Fake profiles", "Stolen documents", "Fraudulent transactions"],
    legalFramework: "Identity Protection Act, Criminal Code",
    isActive: true,
  },
  {
    id: 3,
    name: "Phishing",
    category: "Online Fraud",
    severity: "Medium",
    description: "Deceptive attempts to obtain sensitive information through fake communications",
    commonPlatforms: ["Email", "SMS", "WhatsApp", "Fake websites"],
    averageLoss: "K8,000",
    casesThisYear: 45,
    trend: "increasing",
    investigationComplexity: "Low",
    evidenceTypes: ["Phishing emails", "Fake websites", "Communication logs"],
    legalFramework: "Cybercrime Act, Criminal Code",
    isActive: true,
  },
  {
    id: 4,
    name: "Investment Fraud",
    category: "Financial Fraud",
    severity: "High",
    description: "Fraudulent investment schemes promising high returns",
    commonPlatforms: ["Facebook", "WhatsApp", "Telegram", "Email"],
    averageLoss: "K45,000",
    casesThisYear: 19,
    trend: "increasing",
    investigationComplexity: "High",
    evidenceTypes: ["Investment documents", "Financial records", "Communication logs"],
    legalFramework: "Securities Act, Criminal Code",
    isActive: true,
  },
  {
    id: 5,
    name: "Cyberbullying/Harassment",
    category: "Online Harassment",
    severity: "Medium",
    description: "Intentional and repeated harm inflicted through electronic devices",
    commonPlatforms: ["Facebook", "Instagram", "TikTok", "WhatsApp"],
    averageLoss: "N/A",
    casesThisYear: 52,
    trend: "stable",
    investigationComplexity: "Low",
    evidenceTypes: ["Screenshots", "Chat logs", "Social media posts"],
    legalFramework: "Cybercrime Act, Family Protection Act",
    isActive: true,
  },
  {
    id: 6,
    name: "Defamation/Fake News",
    category: "Information Crimes",
    severity: "Medium",
    description: "False statements damaging reputation or spreading misinformation",
    commonPlatforms: ["Facebook", "Twitter", "Instagram", "News websites"],
    averageLoss: "N/A",
    casesThisYear: 23,
    trend: "increasing",
    investigationComplexity: "Medium",
    evidenceTypes: ["Social media posts", "Articles", "Screenshots"],
    legalFramework: "Defamation Act, Criminal Code",
    isActive: true,
  },
  {
    id: 7,
    name: "Child Exploitation/Online Abuse",
    category: "Child Protection",
    severity: "Critical",
    description: "Exploitation or abuse of children through digital platforms",
    commonPlatforms: ["Various social media", "Gaming platforms", "Messaging apps"],
    averageLoss: "N/A",
    casesThisYear: 8,
    trend: "stable",
    investigationComplexity: "Critical",
    evidenceTypes: ["Digital communications", "Images/videos", "Device data"],
    legalFramework: "Child Protection Act, Criminal Code",
    isActive: true,
  },
];

const categories = [
  "Online Fraud",
  "Identity Crimes",
  "Financial Fraud",
  "Online Harassment",
  "Information Crimes",
  "Child Protection",
  "Cyber Attacks",
  "Intellectual Property",
];

const severityLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

const complexityLevels = [
  { value: "low", label: "Low", description: "Standard investigation procedures" },
  { value: "medium", label: "Medium", description: "Requires specialized skills" },
  { value: "high", label: "High", description: "Complex multi-jurisdictional" },
  { value: "critical", label: "Critical", description: "Urgent specialized response" },
];

export default function OffensesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");

  const filteredOffenses = offenseTypes.filter(offense => {
    const matchesSearch = offense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || offense.category === filterCategory;
    const matchesSeverity = !filterSeverity || offense.severity.toLowerCase() === filterSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    const severityConfig = severityLevels.find(s => s.label.toLowerCase() === severity.toLowerCase());
    return severityConfig?.color || "bg-zinc-100 text-zinc-800";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "increasing" ? "↗️" : trend === "decreasing" ? "↘️" : "➡️";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Offense Categorization & Typology</h1>
          <p className="text-zinc-600 mt-1">
            Manage cyber crime offense types, categories, and investigation guidelines
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Categories
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Offense Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Offense Type</DialogTitle>
                <DialogDescription>
                  Define a new cyber crime offense type with investigation guidelines
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offenseName">Offense Name</Label>
                    <Input id="offenseName" placeholder="e.g., Cryptocurrency Scam" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offenseCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offenseDescription">Description</Label>
                  <Textarea
                    id="offenseDescription"
                    placeholder="Detailed description of the offense type..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offenseSeverity">Severity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offenseComplexity">Investigation Complexity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {complexityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commonPlatforms">Common Platforms</Label>
                  <Input id="commonPlatforms" placeholder="Facebook, Instagram, Email..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalFramework">Legal Framework</Label>
                  <Input id="legalFramework" placeholder="Relevant laws and regulations..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Offense Type</Button>
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
                <p className="text-sm font-medium text-zinc-600">Total Offense Types</p>
                <p className="text-2xl font-bold text-zinc-900">{offenseTypes.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Active Categories</p>
                <p className="text-2xl font-bold text-zinc-900">{categories.length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Cases This Year</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {offenseTypes.reduce((sum, offense) => sum + offense.casesThisYear, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">High Severity</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {offenseTypes.filter(o => o.severity === "High" || o.severity === "Critical").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search offense types..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {severityLevels.map((level) => (
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

      {/* Offense Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Offense Types ({filteredOffenses.length})</CardTitle>
          <CardDescription>
            Manage cyber crime offense categories and investigation guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offense Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Cases (2024)</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Avg. Loss</TableHead>
                <TableHead>Complexity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffenses.map((offense) => (
                <TableRow key={offense.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{offense.name}</p>
                      <p className="text-sm text-zinc-500 max-w-xs truncate">
                        {offense.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{offense.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(offense.severity)}>
                      {offense.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{offense.casesThisYear}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{getTrendIcon(offense.trend)}</span>
                      <span className="capitalize text-sm">{offense.trend}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{offense.averageLoss}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        offense.investigationComplexity === "Critical" ? "text-red-600" :
                        offense.investigationComplexity === "High" ? "text-orange-600" :
                        offense.investigationComplexity === "Medium" ? "text-yellow-600" :
                        "text-green-600"
                      }
                    >
                      {offense.investigationComplexity}
                    </Badge>
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Offense Type
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Related Cases
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deactivate
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

      {/* Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories Breakdown</CardTitle>
            <CardDescription>
              Offense types by category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => {
              const categoryOffenses = offenseTypes.filter(o => o.category === category);
              const totalCases = categoryOffenses.reduce((sum, offense) => sum + offense.casesThisYear, 0);
              return (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{category}</p>
                    <p className="text-sm text-zinc-500">
                      {categoryOffenses.length} offense types, {totalCases} cases
                    </p>
                  </div>
                  <Badge variant="secondary">{categoryOffenses.length}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investigation Guidelines</CardTitle>
            <CardDescription>
              Quick reference for investigation complexity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complexityLevels.map((level) => (
              <div key={level.value} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={
                      level.value === "critical" ? "text-red-600" :
                      level.value === "high" ? "text-orange-600" :
                      level.value === "medium" ? "text-yellow-600" :
                      "text-green-600"
                    }
                  >
                    {level.label} Complexity
                  </Badge>
                  <span className="text-sm text-zinc-500">
                    {offenseTypes.filter(o => o.investigationComplexity.toLowerCase() === level.label.toLowerCase()).length} types
                  </span>
                </div>
                <p className="text-sm text-zinc-600">{level.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
