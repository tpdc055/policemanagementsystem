"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  UserCog,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  User,
  Eye,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

// Mock user data
const users = [
  {
    id: 1,
    name: "Det. John Doe",
    email: "john.doe@pngpolice.gov.pg",
    role: "Senior Investigator",
    department: "Cyber Crime Unit",
    status: "Active",
    lastLogin: "2024-01-05 14:30",
    casesAssigned: 12,
    permissions: ["cases.read", "cases.write", "evidence.read", "evidence.write"],
  },
  {
    id: 2,
    name: "Det. Sarah Wilson",
    email: "sarah.wilson@pngpolice.gov.pg",
    role: "Investigator",
    department: "Cyber Crime Unit",
    status: "Active",
    lastLogin: "2024-01-05 13:45",
    casesAssigned: 8,
    permissions: ["cases.read", "cases.write", "evidence.read"],
  },
  {
    id: 3,
    name: "Sgt. Mike Johnson",
    email: "mike.johnson@pngpolice.gov.pg",
    role: "Analyst",
    department: "Digital Forensics",
    status: "Active",
    lastLogin: "2024-01-05 09:15",
    casesAssigned: 15,
    permissions: ["cases.read", "evidence.read", "evidence.write", "forensics.read", "forensics.write"],
  },
  {
    id: 4,
    name: "Admin User",
    email: "admin@pngpolice.gov.pg",
    role: "System Administrator",
    department: "IT Department",
    status: "Active",
    lastLogin: "2024-01-05 16:20",
    casesAssigned: 0,
    permissions: ["*"],
  },
  {
    id: 5,
    name: "Inspector Mary Kate",
    email: "mary.kate@pngpolice.gov.pg",
    role: "Unit Commander",
    department: "Cyber Crime Unit",
    status: "Active",
    lastLogin: "2024-01-04 17:30",
    casesAssigned: 3,
    permissions: ["cases.read", "cases.write", "users.read", "reports.read"],
  },
];

const roles = [
  { value: "admin", label: "System Administrator", color: "bg-red-100 text-red-800" },
  { value: "commander", label: "Unit Commander", color: "bg-purple-100 text-purple-800" },
  { value: "senior-investigator", label: "Senior Investigator", color: "bg-blue-100 text-blue-800" },
  { value: "investigator", label: "Investigator", color: "bg-green-100 text-green-800" },
  { value: "analyst", label: "Analyst", color: "bg-yellow-100 text-yellow-800" },
  { value: "officer", label: "Police Officer", color: "bg-zinc-100 text-zinc-800" },
];

const departments = [
  "Cyber Crime Unit",
  "Digital Forensics",
  "Criminal Investigation Division",
  "IT Department",
  "Legal Department",
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    const roleConfig = roles.find(r => r.label === role);
    return roleConfig?.color || "bg-zinc-100 text-zinc-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">User Management</h1>
          <p className="text-zinc-600 mt-1">
            Manage system users, roles, and permissions for the cyber crime monitoring system
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for the cyber crime monitoring system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserName">Full Name</Label>
                  <Input id="newUserName" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserEmail">Email Address</Label>
                  <Input id="newUserEmail" type="email" placeholder="user@pngpolice.gov.pg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserRole">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserDepartment">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create User</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search users by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.label}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cases</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "secondary"}
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-800"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.casesAssigned}</span>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {user.lastLogin}
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
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deactivate User
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

      {/* Role Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Role Definitions
            </CardTitle>
            <CardDescription>
              System roles and their access levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.map((role) => (
              <div key={role.value} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={role.color}>
                    {role.label}
                  </Badge>
                  <div className="text-sm text-zinc-600">
                    {role.value === "admin" && "Full system access"}
                    {role.value === "commander" && "Unit oversight and reporting"}
                    {role.value === "senior-investigator" && "Lead investigations, manage cases"}
                    {role.value === "investigator" && "Handle cases, manage evidence"}
                    {role.value === "analyst" && "Data analysis and forensics"}
                    {role.value === "officer" && "Basic case access"}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Overview
            </CardTitle>
            <CardDescription>
              System security status and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.status === "Active").length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Admin Users</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {users.filter(u => u.role === "System Administrator").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-zinc-50 rounded">
                  <span>New user login: Det. John Doe</span>
                  <span className="text-zinc-500">2 hours ago</span>
                </div>
                <div className="flex justify-between p-2 bg-zinc-50 rounded">
                  <span>Permission updated: Sarah Wilson</span>
                  <span className="text-zinc-500">1 day ago</span>
                </div>
                <div className="flex justify-between p-2 bg-zinc-50 rounded">
                  <span>User created: Mike Johnson</span>
                  <span className="text-zinc-500">3 days ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
