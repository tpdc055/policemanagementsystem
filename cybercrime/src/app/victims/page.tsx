import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, Heart } from "lucide-react";

export default function VictimsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Victim Management</h1>
          <p className="text-zinc-600 mt-1">
            Manage victim profiles, track support services, and monitor case progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Victims
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Victim
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Victim Support System</CardTitle>
          <CardDescription>
            Comprehensive victim profiles and support tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">Victim Management System</h3>
            <p className="text-zinc-600 mb-4">
              This module will provide victim profiling, support service tracking, and case progress monitoring.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
