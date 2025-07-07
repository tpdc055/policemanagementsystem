"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Eye,
  MoreHorizontal,
  Image,
  Video,
  FileAudio,
  File,
  Shield,
  Clock,
  User,
  Hash,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface EvidenceItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  evidenceType: string;
  hash: string;
  source: string;
  collectedAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  chainOfCustody: Array<{
    action: string;
    userId: string;
    userName: string;
    timestamp: string;
    notes: string;
  }>;
  isSecure: boolean;
  createdAt: string;
}

interface EvidenceViewerProps {
  caseId: string;
  evidence: EvidenceItem[];
  onEvidenceUpdate: () => void;
}

export function EvidenceViewer({ caseId, evidence, onEvidenceUpdate }: EvidenceViewerProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isViewing, setIsViewing] = useState<string | null>(null);

  const getFileIcon = (mimeType: string, evidenceType: string) => {
    if (mimeType.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (mimeType.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (mimeType.startsWith("audio/")) return <FileAudio className="h-4 w-4" />;
    if (mimeType.includes("pdf") || evidenceType === "DOCUMENT") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isViewable = (mimeType: string) => {
    const viewableTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "text/plain", "text/csv",
    ];
    return viewableTypes.includes(mimeType);
  };

  const handleDownload = async (evidenceId: string, fileName: string) => {
    setIsDownloading(evidenceId);
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/download`);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onEvidenceUpdate(); // Refresh to show updated chain of custody
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(null);
    }
  };

  const handleView = async (evidenceId: string) => {
    setIsViewing(evidenceId);
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/view`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("View failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);

      onEvidenceUpdate(); // Refresh to show updated chain of custody
    } catch (error) {
      console.error("View error:", error);
      alert("Failed to view file. Please try again.");
    } finally {
      setIsViewing(null);
    }
  };

  const getEvidenceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SCREENSHOT: "bg-blue-100 text-blue-800",
      DOCUMENT: "bg-green-100 text-green-800",
      VIDEO: "bg-purple-100 text-purple-800",
      AUDIO: "bg-orange-100 text-orange-800",
      EMAIL: "bg-yellow-100 text-yellow-800",
      CHAT_LOG: "bg-pink-100 text-pink-800",
      FINANCIAL_RECORD: "bg-red-100 text-red-800",
      DEVICE_DATA: "bg-indigo-100 text-indigo-800",
      NETWORK_LOG: "bg-gray-100 text-gray-800",
      OTHER: "bg-zinc-100 text-zinc-800",
    };
    return colors[type] || colors.OTHER;
  };

  return (
    <div className="space-y-6">
      {/* Evidence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Evidence</p>
                <p className="text-2xl font-bold text-zinc-900">{evidence.length}</p>
              </div>
              <File className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Images</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {evidence.filter(e => e.mimeType.startsWith("image/")).length}
                </p>
              </div>
              <Image className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Documents</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {evidence.filter(e => e.evidenceType === "DOCUMENT").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Size</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {formatFileSize(evidence.reduce((sum, e) => sum + (e.fileSize || 0), 0))}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Table */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Files ({evidence.length})</CardTitle>
          <CardDescription>
            Digital evidence collected for this case with chain of custody tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evidence.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-600">No evidence files uploaded yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Collected</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidence.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getFileIcon(item.mimeType, item.evidenceType)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-zinc-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-sm text-zinc-500 truncate">
                            {item.fileName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            Hash: {item.hash?.substring(0, 16)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEvidenceTypeColor(item.evidenceType)}>
                        {item.evidenceType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatFileSize(item.fileSize || 0)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-600">{item.source}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-zinc-900">
                          {new Date(item.collectedAt).toLocaleDateString()}
                        </p>
                        <p className="text-zinc-500">
                          by {item.uploadedBy.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.isSecure ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-xs">
                          {item.isSecure ? "Secure" : "Review"}
                        </span>
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
                          <DropdownMenuLabel>Evidence Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {isViewable(item.mimeType) && (
                            <DropdownMenuItem
                              onClick={() => handleView(item.id)}
                              disabled={isViewing === item.id}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {isViewing === item.id ? "Opening..." : "View"}
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleDownload(item.id, item.fileName)}
                            disabled={isDownloading === item.id}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {isDownloading === item.id ? "Downloading..." : "Download"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Shield className="h-4 w-4 mr-2" />
                                Chain of Custody
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chain of Custody</DialogTitle>
                                <DialogDescription>
                                  Complete chain of custody for {item.fileName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-lg">
                                  <div>
                                    <Label className="text-sm font-medium">File Hash (SHA-256)</Label>
                                    <p className="text-xs font-mono break-all">{item.hash}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Original Source</Label>
                                    <p className="text-sm">{item.source}</p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <Label className="text-sm font-medium">Custody History</Label>
                                  {item.chainOfCustody.map((custody, index) => (
                                    <div key={index} className="border rounded-lg p-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">
                                            {custody.action}
                                          </Badge>
                                          <span className="text-sm font-medium">
                                            {custody.userName}
                                          </span>
                                        </div>
                                        <span className="text-xs text-zinc-500">
                                          {new Date(custody.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      {custody.notes && (
                                        <p className="text-sm text-zinc-600 mt-2">
                                          {custody.notes}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Evidence Details</DialogTitle>
                                <DialogDescription>
                                  Detailed information about {item.fileName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Title</Label>
                                    <p className="text-sm">{item.title}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">File Name</Label>
                                    <p className="text-sm">{item.fileName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">File Size</Label>
                                    <p className="text-sm">{formatFileSize(item.fileSize || 0)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">MIME Type</Label>
                                    <p className="text-sm">{item.mimeType}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Evidence Type</Label>
                                    <Badge className={getEvidenceTypeColor(item.evidenceType)}>
                                      {item.evidenceType.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Security Status</Label>
                                    <div className="flex items-center gap-1">
                                      {item.isSecure ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                      )}
                                      <span className="text-sm">
                                        {item.isSecure ? "Secure" : "Requires Review"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Source</Label>
                                  <p className="text-sm">{item.source}</p>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Collected By</Label>
                                  <p className="text-sm">{item.uploadedBy.name} ({item.uploadedBy.email})</p>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Collection Date</Label>
                                  <p className="text-sm">{new Date(item.collectedAt).toLocaleString()}</p>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">File Hash (SHA-256)</Label>
                                  <p className="text-xs font-mono break-all bg-zinc-50 p-2 rounded">
                                    {item.hash}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
