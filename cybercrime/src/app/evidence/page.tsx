"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EvidenceViewer } from "@/components/evidence/evidence-viewer";
import { Archive, Upload, Search, Filter, Plus, FileText, AlertTriangle, Info } from "lucide-react";

// Mock evidence data - in real app this would come from API
const mockEvidence = [
  {
    id: "1",
    title: "Facebook conversation screenshots",
    fileName: "facebook_chat_evidence.png",
    fileSize: 2048576,
    mimeType: "image/png",
    evidenceType: "SCREENSHOT",
    hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    source: "Victim's Facebook account",
    collectedAt: "2024-01-05T10:30:00Z",
    uploadedBy: {
      id: "user1",
      name: "Det. Sarah Wilson",
      email: "sarah.wilson@pngpolice.gov.pg",
    },
    chainOfCustody: [
      {
        action: "UPLOADED",
        userId: "user1",
        userName: "Det. Sarah Wilson",
        timestamp: "2024-01-05T10:30:00Z",
        notes: "Evidence uploaded to system with security analysis",
      },
      {
        action: "VIEWED",
        userId: "user2",
        userName: "Det. John Doe",
        timestamp: "2024-01-05T14:20:00Z",
        notes: "File viewed for case review",
      },
    ],
    isSecure: true,
    createdAt: "2024-01-05T10:30:00Z",
  },
  {
    id: "2",
    title: "Bank transaction records",
    fileName: "bank_statements.pdf",
    fileSize: 1048576,
    mimeType: "application/pdf",
    evidenceType: "FINANCIAL_RECORD",
    hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1",
    source: "Bank of PNG - Official Request",
    collectedAt: "2024-01-04T15:45:00Z",
    uploadedBy: {
      id: "user1",
      name: "Det. Sarah Wilson",
      email: "sarah.wilson@pngpolice.gov.pg",
    },
    chainOfCustody: [
      {
        action: "UPLOADED",
        userId: "user1",
        userName: "Det. Sarah Wilson",
        timestamp: "2024-01-04T15:45:00Z",
        notes: "Bank statements received via official channels",
      },
    ],
    isSecure: true,
    createdAt: "2024-01-04T15:45:00Z",
  },
  {
    id: "3",
    title: "Suspect's WhatsApp messages",
    fileName: "whatsapp_export.txt",
    fileSize: 512000,
    mimeType: "text/plain",
    evidenceType: "CHAT_LOG",
    hash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2",
    source: "WhatsApp chat export from victim's phone",
    collectedAt: "2024-01-03T12:15:00Z",
    uploadedBy: {
      id: "user3",
      name: "Sgt. Mike Johnson",
      email: "mike.johnson@pngpolice.gov.pg",
    },
    chainOfCustody: [
      {
        action: "UPLOADED",
        userId: "user3",
        userName: "Sgt. Mike Johnson",
        timestamp: "2024-01-03T12:15:00Z",
        notes: "WhatsApp chat export from victim's device",
      },
      {
        action: "DOWNLOADED",
        userId: "user1",
        userName: "Det. Sarah Wilson",
        timestamp: "2024-01-05T09:30:00Z",
        notes: "File downloaded for analysis",
      },
    ],
    isSecure: false,
    createdAt: "2024-01-03T12:15:00Z",
  },
];

export default function EvidencePage() {
  const [evidence, setEvidence] = useState(mockEvidence);
  const [selectedCase, setSelectedCase] = useState("CYBER-2024-001");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock case options
  const caseOptions = [
    { id: "CYBER-2024-001", title: "Romance Scam - Maria Santos" },
    { id: "CYBER-2024-002", title: "Cryptocurrency Investment Fraud" },
    { id: "CYBER-2024-003", title: "Facebook Impersonation Case" },
  ];

  const evidenceTypes = [
    "SCREENSHOT",
    "DOCUMENT",
    "VIDEO",
    "AUDIO",
    "EMAIL",
    "CHAT_LOG",
    "FINANCIAL_RECORD",
    "DEVICE_DATA",
    "NETWORK_LOG",
    "OTHER",
  ];

  const handleEvidenceUpdate = () => {
    // In real app, this would refetch evidence from API
    console.log("Evidence updated, refreshing...");
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        // In real app, would refresh evidence list here
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || item.evidenceType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Evidence Management</h1>
          <p className="text-zinc-600 mt-1">
            Manage digital evidence, maintain chain of custody, and organize case materials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Evidence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Evidence</DialogTitle>
                <DialogDescription>
                  Upload digital evidence with proper documentation and chain of custody
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Ensure you have proper authorization to upload this evidence. All uploads are logged and tracked.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="case-select">Case</Label>
                  <Select value={selectedCase} onValueChange={setSelectedCase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseOptions.map((case_) => (
                        <SelectItem key={case_.id} value={case_.id}>
                          {case_.id} - {case_.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence-title">Evidence Title</Label>
                  <Input
                    id="evidence-title"
                    placeholder="Brief description of the evidence"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence-type">Evidence Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                    <SelectContent>
                      {evidenceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="Where this evidence was obtained from"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the evidence and its relevance to the case"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Files</Label>
                  <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FileText className="h-12 w-12 text-zinc-400 mb-4" />
                      <p className="text-zinc-600 mb-2">
                        {isUploading ? "Uploading..." : "Drop files here or click to upload"}
                      </p>
                      <p className="text-sm text-zinc-500">
                        Support for images, documents, videos, and audio files (Max 50MB each)
                      </p>
                    </label>

                    {isUploading && (
                      <div className="mt-4">
                        <div className="w-full bg-zinc-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-zinc-600 mt-2">{uploadProgress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Evidence"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Case Selection and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="case-filter" className="text-sm font-medium mb-2 block">
                Viewing Evidence for Case:
              </Label>
              <Select value={selectedCase} onValueChange={setSelectedCase}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {caseOptions.map((case_) => (
                    <SelectItem key={case_.id} value={case_.id}>
                      {case_.id} - {case_.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Search Evidence:
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="search"
                  placeholder="Search by title, filename, or source..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1">
              <Label htmlFor="filter-type" className="text-sm font-medium mb-2 block">
                Filter by Type:
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All evidence types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {evidenceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Viewer */}
      <EvidenceViewer
        caseId={selectedCase}
        evidence={filteredEvidence}
        onEvidenceUpdate={handleEvidenceUpdate}
      />

      {/* Security Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> All evidence access is logged and monitored.
          Maintain proper chain of custody and only access evidence relevant to your assigned cases.
          Report any security concerns to your supervisor immediately.
        </AlertDescription>
      </Alert>
    </div>
  );
}
