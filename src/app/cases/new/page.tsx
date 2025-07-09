"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Save,
  Send,
  User,
  Users,
  Clock,
  Calendar,
  Scale,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  X
} from "lucide-react"
import type { User as UserType } from "@/types/user"

const CASE_TYPES = {
  "criminal": "Criminal Investigation",
  "civil": "Civil Matter",
  "missing_person": "Missing Person",
  "fraud": "Fraud Investigation",
  "cybercrime": "Cybercrime",
  "domestic_violence": "Domestic Violence",
  "trafficking": "Human/Drug Trafficking",
  "corruption": "Anti-Corruption",
  "terrorism": "Counter-Terrorism",
  "organized_crime": "Organized Crime"
}

const CASE_PRIORITIES = {
  "critical": "Critical - Immediate Investigation Required",
  "high": "High - Investigation within 24 hours",
  "medium": "Medium - Investigation within 1 week",
  "low": "Low - Investigation within 1 month"
}

const AVAILABLE_DETECTIVES = [
  { id: "det001", name: "Det. Sarah Johnson", rank: "Detective Sergeant", specialization: "Armed Robbery", available: true },
  { id: "det002", name: "Det. Michael Kila", rank: "Detective", specialization: "Fraud", available: true },
  { id: "det003", name: "Det. James Wanma", rank: "Detective Inspector", specialization: "Missing Persons", available: false },
  { id: "det004", name: "Det. Robert Mendi", rank: "Detective", specialization: "Financial Crime", available: true },
  { id: "det005", name: "Det. Maria Bani", rank: "Detective Sergeant", specialization: "Narcotics", available: true },
  { id: "det006", name: "Det. Paul Wapenamanda", rank: "Detective", specialization: "Violent Crime", available: true },
  { id: "det007", name: "Det. Grace Temu", rank: "Detective", specialization: "Cybercrime", available: true }
]

const AVAILABLE_OFFICERS = [
  "Const. Peter Namaliu", "Const. Lisa Kaupa", "Sgt. Joseph Lakane",
  "Const. David Bani", "Const. Helen Siaguru", "Const. Tony Agarobe"
]

const RELATED_INCIDENTS = [
  { id: "INC-2024-001", title: "Armed Robbery - ANZ Bank", date: "2024-01-15", priority: "critical" },
  { id: "INC-2024-002", title: "Missing Person - Mary Tamate", date: "2024-01-12", priority: "high" },
  { id: "INC-2024-003", title: "Fraud - Government Contracts", date: "2024-01-10", priority: "high" },
  { id: "INC-2024-004", title: "Tribal Fighting - Enga", date: "2024-01-08", priority: "medium" },
  { id: "INC-2024-005", title: "Drug Trafficking - Lae Port", date: "2024-01-05", priority: "critical" }
]

export default function NewCasePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [caseData, setCaseData] = useState({
    // Basic Information
    title: "",
    type: "",
    priority: "",
    description: "",
    objectives: "",

    // Related Information
    incidentIds: [] as string[],
    relatedCases: "",

    // Assignment
    leadDetective: "",
    assignedOfficers: [] as string[],

    // Timeline
    estimatedDuration: "",
    deadline: "",

    // Initial Evidence & Leads
    initialEvidence: "",
    leads: "",
    witnessCount: "",
    suspectCount: "",

    // Case Management
    budget: "",
    resources: "",
    specialRequirements: "",

    // Legal Aspects
    legalAdvice: "",
    courtDate: "",
    prosecutor: "",

    // Additional Information
    riskAssessment: "",
    confidentialityLevel: "standard",
    authorizedBy: "",
    notes: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setCaseData(prev => ({
      ...prev,
      authorizedBy: parsedUser.name
    }))
  }, [router])

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'submit') => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate case ID
      const caseId = `CASE-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`

      console.log("Case Data:", { ...caseData, id: caseId, action })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push(`/cases/${caseId}`)
      }, 2000)

    } catch (error) {
      console.error("Error creating case:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string | string[]) => {
    setCaseData(prev => ({ ...prev, [field]: value }))
  }

  const addIncident = (incidentId: string) => {
    if (!caseData.incidentIds.includes(incidentId)) {
      updateField("incidentIds", [...caseData.incidentIds, incidentId])
    }
  }

  const removeIncident = (incidentId: string) => {
    updateField("incidentIds", caseData.incidentIds.filter(id => id !== incidentId))
  }

  const addOfficer = (officer: string) => {
    if (!caseData.assignedOfficers.includes(officer)) {
      updateField("assignedOfficers", [...caseData.assignedOfficers, officer])
    }
  }

  const removeOfficer = (officer: string) => {
    updateField("assignedOfficers", caseData.assignedOfficers.filter(o => o !== officer))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="min-h-96 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Case Created Successfully</h2>
              <p className="text-gray-600">Your investigation case has been created and assigned a case number.</p>
              <p className="text-sm text-gray-500">Redirecting to case details...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Investigation Case</h1>
            <p className="text-gray-600">Complete all required fields to create a new investigation case</p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Case ID will be auto-generated
          </Badge>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Once created, this case will be assigned to the lead detective
            and tracking will begin immediately.
          </AlertDescription>
        </Alert>

        <form className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="incidents">Related Incidents</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="evidence">Evidence & Leads</TabsTrigger>
              <TabsTrigger value="legal">Legal Aspects</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Case Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Case Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive case title"
                      value={caseData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Case Type *</Label>
                      <Select value={caseData.type} onValueChange={(value) => updateField("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CASE_TYPES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level *</Label>
                      <Select value={caseData.priority} onValueChange={(value) => updateField("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CASE_PRIORITIES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Case Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the case..."
                      rows={4}
                      value={caseData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Investigation Objectives</Label>
                    <Textarea
                      id="objectives"
                      placeholder="What are the main objectives of this investigation?"
                      rows={3}
                      value={caseData.objectives}
                      onChange={(e) => updateField("objectives", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                      <Select value={caseData.estimatedDuration} onValueChange={(value) => updateField("estimatedDuration", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="1 month">1 month</SelectItem>
                          <SelectItem value="2-3 months">2-3 months</SelectItem>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="1 year+">1 year or more</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Target Completion Date</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={caseData.deadline}
                        onChange={(e) => updateField("deadline", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Related Incident Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Link Existing Incidents</h4>
                    <div className="grid gap-2">
                      {RELATED_INCIDENTS.map((incident) => (
                        <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{incident.id}</div>
                            <div className="text-sm text-gray-600">{incident.title}</div>
                            <div className="text-xs text-gray-500">{incident.date}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={incident.priority === "critical" ? "destructive" : "default"}>
                              {incident.priority}
                            </Badge>
                            {caseData.incidentIds.includes(incident.id) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeIncident(incident.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => addIncident(incident.id)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {caseData.incidentIds.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Linked Incidents ({caseData.incidentIds.length})</h5>
                        <div className="flex flex-wrap gap-2">
                          {caseData.incidentIds.map(id => (
                            <Badge key={id} variant="outline" className="bg-white">
                              {id}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-2 h-4 w-4 p-0"
                                onClick={() => removeIncident(id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relatedCases">Related Cases (if any)</Label>
                    <Input
                      id="relatedCases"
                      placeholder="Enter related case IDs or references"
                      value={caseData.relatedCases}
                      onChange={(e) => updateField("relatedCases", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Case Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leadDetective">Lead Detective *</Label>
                    <Select value={caseData.leadDetective} onValueChange={(value) => updateField("leadDetective", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead detective" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_DETECTIVES.filter(det => det.available).map((detective) => (
                          <SelectItem key={detective.id} value={detective.name}>
                            <div className="flex flex-col">
                              <span>{detective.name}</span>
                              <span className="text-sm text-gray-500">{detective.rank} - {detective.specialization}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Assigned Officers</Label>
                    <div className="grid gap-2">
                      {AVAILABLE_OFFICERS.map((officer) => (
                        <div key={officer} className="flex items-center justify-between p-2 border rounded">
                          <span>{officer}</span>
                          {caseData.assignedOfficers.includes(officer) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeOfficer(officer)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => addOfficer(officer)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {caseData.assignedOfficers.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2">Assigned Officers ({caseData.assignedOfficers.length})</h5>
                        <div className="flex flex-wrap gap-2">
                          {caseData.assignedOfficers.map(officer => (
                            <Badge key={officer} variant="outline" className="bg-white">
                              {officer}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-2 h-4 w-4 p-0"
                                onClick={() => removeOfficer(officer)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Initial Evidence & Leads
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialEvidence">Initial Evidence Description</Label>
                    <Textarea
                      id="initialEvidence"
                      placeholder="Describe any initial evidence available..."
                      rows={4}
                      value={caseData.initialEvidence}
                      onChange={(e) => updateField("initialEvidence", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leads">Investigation Leads</Label>
                    <Textarea
                      id="leads"
                      placeholder="Initial leads to follow up on..."
                      rows={3}
                      value={caseData.leads}
                      onChange={(e) => updateField("leads", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="witnessCount">Number of Witnesses</Label>
                      <Input
                        id="witnessCount"
                        type="number"
                        placeholder="0"
                        value={caseData.witnessCount}
                        onChange={(e) => updateField("witnessCount", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suspectCount">Number of Suspects</Label>
                      <Input
                        id="suspectCount"
                        type="number"
                        placeholder="0"
                        value={caseData.suspectCount}
                        onChange={(e) => updateField("suspectCount", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Legal Aspects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="legalAdvice">Legal Advice/Requirements</Label>
                    <Textarea
                      id="legalAdvice"
                      placeholder="Any legal advice or special requirements..."
                      rows={3}
                      value={caseData.legalAdvice}
                      onChange={(e) => updateField("legalAdvice", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="courtDate">Expected Court Date</Label>
                      <Input
                        id="courtDate"
                        type="date"
                        value={caseData.courtDate}
                        onChange={(e) => updateField("courtDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prosecutor">Assigned Prosecutor</Label>
                      <Input
                        id="prosecutor"
                        placeholder="Prosecutor name"
                        value={caseData.prosecutor}
                        onChange={(e) => updateField("prosecutor", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Case Management Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget (PGK)</Label>
                      <Input
                        id="budget"
                        placeholder="Investigation budget"
                        value={caseData.budget}
                        onChange={(e) => updateField("budget", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidentialityLevel">Confidentiality Level</Label>
                      <Select value={caseData.confidentialityLevel} onValueChange={(value) => updateField("confidentialityLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="confidential">Confidential</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                          <SelectItem value="secret">Secret</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resources">Required Resources</Label>
                    <Textarea
                      id="resources"
                      placeholder="Special equipment, vehicles, personnel, etc."
                      rows={3}
                      value={caseData.resources}
                      onChange={(e) => updateField("resources", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskAssessment">Risk Assessment</Label>
                    <Textarea
                      id="riskAssessment"
                      placeholder="Identify potential risks and mitigation strategies..."
                      rows={3}
                      value={caseData.riskAssessment}
                      onChange={(e) => updateField("riskAssessment", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      rows={3}
                      value={caseData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Authorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authorizedBy">Authorized By</Label>
                <Input
                  id="authorizedBy"
                  value={caseData.authorizedBy}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, 'save')}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, 'submit')}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating Case...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Case
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
