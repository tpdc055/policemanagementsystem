import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileImage, Plus, Search, Shield } from "lucide-react";

export default function ForensicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Digital Forensics</h1>
          <p className="text-zinc-600 mt-1">
            Manage digital forensics investigations, device analysis, and forensic reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Forensics
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Digital Forensics Laboratory</CardTitle>
          <CardDescription>
            Advanced digital evidence analysis and device forensics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">Digital Forensics System</h3>
            <p className="text-zinc-600 mb-4">
              This module will provide device analysis tracking, forensic report management, and chain of custody for digital evidence.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
