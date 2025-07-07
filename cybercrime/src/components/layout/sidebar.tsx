"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Home,
  FileText,
  Search,
  Users,
  AlertTriangle,
  Archive,
  Eye,
  Gavel,
  BarChart3,
  Settings,
  UserCog,
  Database,
  Globe,
  BookOpen,
  Phone,
  FileImage,
  ClipboardList,
} from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationItems: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        badge: "3", // Active alerts
      },
    ],
  },
  {
    title: "Case Management",
    items: [
      {
        title: "Case Intake & Registration",
        href: "/cases/intake",
        icon: FileText,
      },
      {
        title: "Investigation Management",
        href: "/investigations",
        icon: Search,
      },
      {
        title: "Evidence Management",
        href: "/evidence",
        icon: Archive,
      },
      {
        title: "Digital Forensics",
        href: "/forensics",
        icon: FileImage,
      },
    ],
  },
  {
    title: "People & Entities",
    items: [
      {
        title: "Suspect Management",
        href: "/suspects",
        icon: Users,
      },
      {
        title: "Victim Management",
        href: "/victims",
        icon: Users,
      },
    ],
  },
  {
    title: "Monitoring & Intelligence",
    items: [
      {
        title: "Social Media Monitoring",
        href: "/social-monitoring",
        icon: Eye,
      },
      {
        title: "Offense Categories",
        href: "/offenses",
        icon: ClipboardList,
      },
      {
        title: "Knowledge Base",
        href: "/knowledge-base",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Legal & Liaison",
    items: [
      {
        title: "Legal Requests",
        href: "/legal-requests",
        icon: Gavel,
      },
      {
        title: "Platform Liaison",
        href: "/platform-liaison",
        icon: Phone,
      },
    ],
  },
  {
    title: "Analytics & Reports",
    items: [
      {
        title: "Analytics Dashboard",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Workflow Management",
        href: "/workflow",
        icon: AlertTriangle,
      },
      {
        title: "User Management",
        href: "/users",
        icon: UserCog,
      },
      {
        title: "System Integration",
        href: "/integration",
        icon: Globe,
      },
      {
        title: "Audit Logs",
        href: "/audit",
        icon: Database,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-50 border-r">
      {/* Logo/Header */}
      <div className="flex items-center gap-2 p-6 border-b">
        <Shield className="h-8 w-8 text-zinc-900" />
        <div>
          <h1 className="font-bold text-lg text-zinc-900">PNG Police</h1>
          <p className="text-sm text-zinc-600">Cyber Crime Unit</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationItems.map((section, index) => (
          <div key={index}>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        isActive && "bg-zinc-900 text-white hover:bg-zinc-800"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "outline" : "secondary"}
                          className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
            {index < navigationItems.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <div className="text-xs text-zinc-500 text-center">
          <p>Royal PNG Police</p>
          <p>Cyber Crime Monitoring v1.0</p>
        </div>
      </div>
    </div>
  );
}
