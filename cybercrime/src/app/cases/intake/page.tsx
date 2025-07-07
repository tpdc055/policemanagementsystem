"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Users,
  AlertTriangle,
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Info,
} from "lucide-react";

const offenseTypes = [
  "Online Fraud/Scam",
  "Romance Scam",
  "Identity Theft/Impersonation",
  "Cyberbullying/Harassment",
  "Defamation/Fake News",
  "Child Exploitation/Online Abuse",
  "Phishing",
  "Investment Fraud",
  "Hacking/Malware/Ransomware",
  "Unauthorized Access/Data Breach",
  "Cyberstalking",
  "Intellectual Property Violation",
  "Social Media Abuse/Misinformation",
  "Other"
];

const priorityLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

export default function CaseIntakePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offenseType: "",
    priority: "",
    parentCaseId: "",
    incidentDate: "",
    reportedDate: "",
    location: "",
    estimatedLoss: "",
    currency: "PGK"
  });

  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Case Intake & Registration</h1>
          <p className="text-zinc-600 mt-1">
            Register new cyber crime cases and link to existing police cases
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Submit Case</Button>
        </div>
      </div>

      {/* Alert for important information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All mandatory fields must be completed. Cases marked as "Urgent" will be automatically escalated to senior investigators.
        </AlertDescription>
      </Alert>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="victim">Victim</TabsTrigger>
              <TabsTrigger value="suspect">Suspect</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Case Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about the cyber crime incident
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Case Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the incident"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentCase">Parent Police Case ID</Label>
                      <Input
                        id="parentCase"
                        placeholder="e.g., CASE-2024-001 (if applicable)"
                        value={formData.parentCaseId}
                        onChange={(e) => setFormData({...formData, parentCaseId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Incident Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of what happened, including timeline of events..."
                      className="min-h-24"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="offenseType">Offense Type *</Label>
                      <Select value={formData.offenseType} onValueChange={(value) => setFormData({...formData, offenseType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select offense type" />
                        </SelectTrigger>
                        <SelectContent>
                          {offenseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level *</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${level.color}`} />
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="City, Province"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incidentDate">Incident Date *</Label>
                      <Input
                        id="incidentDate"
                        type="date"
                        value={formData.incidentDate}
                        onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reportedDate">Reported Date *</Label>
                      <Input
                        id="reportedDate"
                        type="date"
                        value={formData.reportedDate}
                        onChange={(e) => setFormData({...formData, reportedDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedLoss">Estimated Financial Loss</Label>
                      <div className="flex gap-2">
                        <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PGK">PGK</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="0.00"
                          value={formData.estimatedLoss}
                          onChange={(e) => setFormData({...formData, estimatedLoss: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Victim Information Tab */}
            <TabsContent value="victim" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Victim Information
                  </CardTitle>
                  <CardDescription>
                    Details about the victim(s) of the cyber crime
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="victimName">Full Name *</Label>
                      <Input id="victimName" placeholder="Victim's full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="victimAge">Age</Label>
                      <Input id="victimAge" type="number" placeholder="Age" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="victimPhone">Phone Number</Label>
                      <Input id="victimPhone" placeholder="+675 xxx xxxx" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="victimEmail">Email Address</Label>
                      <Input id="victimEmail" type="email" placeholder="victim@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="victimAddress">Address</Label>
                    <Textarea id="victimAddress" placeholder="Full address including province" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="victimOccupation">Occupation</Label>
                    <Input id="victimOccupation" placeholder="Victim's occupation" />
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox id="additionalVictims" />
                    <Label htmlFor="additionalVictims">Multiple victims involved</Label>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Victim
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suspect Information Tab */}
            <TabsContent value="suspect" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Suspect Information
                  </CardTitle>
                  <CardDescription>
                    Known information about the suspect(s)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Only enter confirmed information. Leave fields blank if information is unknown or unverified.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="suspectName">Known Name/Alias</Label>
                      <Input id="suspectName" placeholder="Name or online alias" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suspectGender">Gender</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="suspectPhone">Phone Number</Label>
                      <Input id="suspectPhone" placeholder="Known phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suspectEmail">Email Address</Label>
                      <Input id="suspectEmail" placeholder="Known email address" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suspectSocial">Social Media Profiles</Label>
                    <Textarea
                      id="suspectSocial"
                      placeholder="Facebook, Instagram, TikTok profiles, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suspectLocation">Known Location</Label>
                    <Input id="suspectLocation" placeholder="City, province, or country if known" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suspectDescription">Physical Description</Label>
                    <Textarea
                      id="suspectDescription"
                      placeholder="Age, height, build, distinctive features, etc."
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Suspect
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Initial Evidence
                  </CardTitle>
                  <CardDescription>
                    Upload and document initial evidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                    <p className="text-zinc-600 mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-zinc-500">Support for screenshots, documents, videos, and audio files</p>
                    <Button variant="outline" className="mt-4">
                      Choose Files
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidenceDescription">Evidence Description</Label>
                    <Textarea
                      id="evidenceDescription"
                      placeholder="Describe the evidence being submitted, including source and relevance to the case..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="chainOfCustody" />
                    <Label htmlFor="chainOfCustody">
                      I confirm proper chain of custody has been maintained
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Case Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Case ID</Label>
                <p className="text-sm text-zinc-600">Will be auto-generated</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Reporting Officer</Label>
                <p className="text-sm text-zinc-600">Det. John Doe</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Creation Date</Label>
                <p className="text-sm text-zinc-600">{new Date().toLocaleDateString()}</p>
              </div>

              {formData.priority && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge
                    className={
                      priorityLevels.find(p => p.value === formData.priority)?.color || ""
                    }
                  >
                    {priorityLevels.find(p => p.value === formData.priority)?.label}
                  </Badge>
                </div>
              )}

              {formData.offenseType && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Offense Type</Label>
                  <Badge variant="outline">{formData.offenseType}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Case Templates
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Search Existing Cases
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Offense Categories
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
