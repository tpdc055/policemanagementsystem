import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";

export default function InvestigationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Investigation Management</h1>
          <p className="text-zinc-600 mt-1">
            Manage ongoing investigations, assign tasks, and track progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Investigation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Investigations</CardTitle>
          <CardDescription>
            Currently ongoing cyber crime investigations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">Investigation Management</h3>
            <p className="text-zinc-600 mb-4">
              This module will allow investigators to manage cases, assign tasks, and track investigation progress.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
