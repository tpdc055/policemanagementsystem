import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search } from "lucide-react";

export default function SuspectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Suspect Management</h1>
          <p className="text-zinc-600 mt-1">
            Manage suspect profiles, track relationships, and monitor repeat offenders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Suspects
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Suspect
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suspect Database</CardTitle>
          <CardDescription>
            Comprehensive suspect profiles and case relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">Suspect Management System</h3>
            <p className="text-zinc-600 mb-4">
              This module will provide comprehensive suspect profiling, relationship tracking, and repeat offender monitoring.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
