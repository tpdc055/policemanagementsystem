"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Filter,
  AlertTriangle,
  Info,
  Shield,
  TrendingUp,
  Users,
  Globe,
  FileText,
  Download,
  Plus,
  Star,
  Calendar,
  Eye,
} from "lucide-react";

// Mock knowledge base data
const scamLibrary = [
  {
    id: 1,
    title: "Romance Scam - Military Personnel Impersonation",
    category: "Romance Scams",
    severity: "High",
    lastUpdated: "2024-01-05",
    views: 245,
    rating: 4.8,
    description: "Scammers pose as military personnel deployed overseas to build emotional relationships and extract money.",
    commonSigns: [
      "Claims to be deployed military personnel",
      "Requests money for emergency leave",
      "Uses stolen military photos",
      "Avoids video calls or phone calls",
      "Stories about being unable to access funds"
    ],
    redFlags: [
      "Immediate declarations of love",
      "Requests for money or gift cards",
      "Inconsistent stories about deployment",
      "Professional quality photos that seem too good to be true"
    ],
    investigationTips: [
      "Reverse image search profile photos",
      "Check military deployment databases if accessible",
      "Analyze communication patterns and language",
      "Trace financial transactions and requests"
    ],
    preventionAdvice: [
      "Never send money to someone you've only met online",
      "Be wary of immediate romantic declarations",
      "Verify identity through video calls",
      "Research common military scam tactics"
    ],
    relatedCases: ["CYBER-2024-001", "CYBER-2023-089"],
    platforms: ["Facebook", "Instagram", "Dating Apps"],
    targetDemographics: ["Women 35-65", "Recently divorced", "Lonely individuals"],
  },
  {
    id: 2,
    title: "Cryptocurrency Investment Fraud - Fake Trading Platforms",
    category: "Investment Fraud",
    severity: "High",
    lastUpdated: "2024-01-03",
    views: 189,
    rating: 4.6,
    description: "Fraudulent cryptocurrency trading platforms that promise high returns but steal investor funds.",
    commonSigns: [
      "Guaranteed high returns with no risk",
      "Pressure to invest quickly",
      "Fake trading interfaces showing profits",
      "Difficulty withdrawing funds",
      "Testimonials from fake users"
    ],
    redFlags: [
      "Unregulated investment platforms",
      "Promises of unrealistic returns",
      "Requests for additional fees to withdraw",
      "No proper business registration",
      "Celebrity endorsements that seem fake"
    ],
    investigationTips: [
      "Check business registration and licensing",
      "Analyze website creation dates and hosting",
      "Track cryptocurrency wallet addresses",
      "Identify fake testimonials and reviews"
    ],
    preventionAdvice: [
      "Only use licensed and regulated platforms",
      "Research investment opportunities thoroughly",
      "Be skeptical of guaranteed returns",
      "Start with small amounts if testing platforms"
    ],
    relatedCases: ["CYBER-2024-003", "CYBER-2023-076"],
    platforms: ["Facebook", "Instagram", "WhatsApp", "Telegram"],
    targetDemographics: ["Young adults", "Tech-savvy individuals", "People seeking quick money"],
  },
  {
    id: 3,
    title: "Phishing - PNG Government Service Impersonation",
    category: "Phishing",
    severity: "Medium",
    lastUpdated: "2023-12-28",
    views: 167,
    rating: 4.4,
    description: "Fraudulent emails and messages claiming to be from PNG government services to steal personal information.",
    commonSigns: [
      "Urgent requests for personal information",
      "Claims about expired government documents",
      "Requests to pay fines or fees online",
      "Poor grammar and spelling in official communications",
      "Suspicious email addresses"
    ],
    redFlags: [
      "Emails from non-government domains",
      "Urgent threats about account suspension",
      "Requests for passwords or PINs",
      "Payment requests via gift cards or crypto"
    ],
    investigationTips: [
      "Verify email headers and routing",
      "Check website SSL certificates",
      "Analyze phishing kit components",
      "Track payment methods requested"
    ],
    preventionAdvice: [
      "Verify government communications independently",
      "Never provide personal info via email",
      "Check official government websites",
      "Report suspicious communications"
    ],
    relatedCases: ["CYBER-2023-156", "CYBER-2023-143"],
    platforms: ["Email", "SMS", "WhatsApp"],
    targetDemographics: ["General public", "Government employees", "Elderly citizens"],
  },
];

const advisories = [
  {
    id: 1,
    title: "Increase in TikTok Investment Scams Targeting Youth",
    type: "Security Alert",
    priority: "High",
    publishDate: "2024-01-05",
    summary: "Rising trend of cryptocurrency and forex investment scams targeting young Papua New Guineans through TikTok videos.",
    content: "Recent intelligence indicates a significant increase in investment fraud cases originating from TikTok promotional videos. Scammers are specifically targeting young Papua New Guineans aged 18-30 with promises of quick profits through cryptocurrency and forex trading...",
    affectedDemographics: ["Youth 18-30", "Students", "Unemployed individuals"],
    recommendedActions: [
      "Monitor TikTok for investment-related scam content",
      "Educate youth about investment fraud risks",
      "Coordinate with schools and universities for awareness campaigns",
      "Track financial flows to identify scam operations"
    ],
    relatedThreats: ["Investment Fraud", "Social Media Scams"],
  },
  {
    id: 2,
    title: "WhatsApp Business Account Hijacking Trend",
    type: "Threat Intelligence",
    priority: "Medium",
    publishDate: "2024-01-02",
    summary: "Criminals are hijacking legitimate WhatsApp Business accounts to conduct fraud using established business reputations.",
    content: "A new trend has emerged where cybercriminals target legitimate businesses' WhatsApp accounts, taking control and using them to defraud customers...",
    affectedDemographics: ["Small business owners", "Regular customers"],
    recommendedActions: [
      "Advise businesses to enable two-factor authentication",
      "Monitor for reports of business account compromises",
      "Educate public about verifying business communications",
      "Develop rapid response protocols for hijacked accounts"
    ],
    relatedThreats: ["Account Takeover", "Business Fraud"],
  },
];

const bestPractices = [
  {
    category: "Investigation Techniques",
    practices: [
      {
        title: "Digital Evidence Collection",
        description: "Proper methods for collecting and preserving digital evidence from social media platforms",
        importance: "Critical",
        steps: [
          "Screenshot evidence with timestamp and URL visible",
          "Use screen recording for dynamic content",
          "Maintain chain of custody documentation",
          "Store evidence in secure, tamper-proof systems"
        ]
      },
      {
        title: "Social Media Account Verification",
        description: "Techniques to verify the authenticity of social media accounts",
        importance: "High",
        steps: [
          "Check account creation date and activity history",
          "Analyze follower patterns and engagement rates",
          "Reverse image search profile pictures",
          "Look for verification badges and business registrations"
        ]
      },
    ]
  },
  {
    category: "Victim Support",
    practices: [
      {
        title: "Initial Victim Interview",
        description: "Best practices for conducting initial interviews with cybercrime victims",
        importance: "Critical",
        steps: [
          "Create a safe, non-judgmental environment",
          "Gather timeline of events systematically",
          "Document all communication evidence",
          "Provide immediate safety and financial advice"
        ]
      },
    ]
  },
];

const resources = [
  {
    title: "PNG Cybercrime Laws Reference",
    type: "Legal Document",
    description: "Comprehensive guide to Papua New Guinea cybercrime legislation",
    lastUpdated: "2023-12-15",
    downloadUrl: "#",
    tags: ["Legal", "Reference", "Legislation"]
  },
  {
    title: "Social Media Investigation Toolkit",
    type: "Training Material",
    description: "Tools and techniques for investigating crimes on social media platforms",
    lastUpdated: "2024-01-01",
    downloadUrl: "#",
    tags: ["Investigation", "Social Media", "Tools"]
  },
  {
    title: "Financial Crime Prevention Guide",
    type: "Prevention Guide",
    description: "Strategies for preventing and investigating financial cybercrimes",
    lastUpdated: "2023-11-20",
    downloadUrl: "#",
    tags: ["Financial Crime", "Prevention", "Investigation"]
  },
];

const categories = [
  "Romance Scams",
  "Investment Fraud",
  "Phishing",
  "Identity Theft",
  "Cyberbullying",
  "Social Media Scams",
  "Online Shopping Fraud",
  "Business Email Compromise"
];

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");

  const filteredScams = scamLibrary.filter(scam => {
    const matchesSearch = scam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || scam.category === filterCategory;
    const matchesSeverity = !filterSeverity || scam.severity.toLowerCase() === filterSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Knowledge Base</h1>
          <p className="text-zinc-600 mt-1">
            Comprehensive cybercrime information, scam library, and investigation resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Knowledge
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Scam Types</p>
                <p className="text-2xl font-bold text-zinc-900">{scamLibrary.length}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Updated regularly
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Active Advisories</p>
                <p className="text-2xl font-bold text-zinc-900">{advisories.length}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Threat alerts
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Resources</p>
                <p className="text-2xl font-bold text-zinc-900">{resources.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  Training materials
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Views</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {scamLibrary.reduce((sum, scam) => sum + scam.views, 0)}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Knowledge accessed
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="scams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scams">Scam Library</TabsTrigger>
          <TabsTrigger value="advisories">Advisories</TabsTrigger>
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Scam Library Tab */}
        <TabsContent value="scams" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      placeholder="Search scam types, descriptions, or platforms..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scam Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScams.map((scam) => (
              <Card key={scam.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{scam.title}</CardTitle>
                      <CardDescription className="mt-2">{scam.description}</CardDescription>
                    </div>
                    <Badge
                      className={
                        scam.severity === "High" ? "bg-red-100 text-red-800" :
                        scam.severity === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }
                    >
                      {scam.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge variant="outline">{scam.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {scam.rating}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                      <Eye className="h-4 w-4" />
                      {scam.views}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                      <Calendar className="h-4 w-4" />
                      {scam.lastUpdated}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Signs:</h4>
                    <ul className="text-sm text-zinc-600 space-y-1">
                      {scam.commonSigns.slice(0, 3).map((sign, index) => (
                        <li key={index}>• {sign}</li>
                      ))}
                      {scam.commonSigns.length > 3 && (
                        <li className="text-blue-600">+ {scam.commonSigns.length - 3} more...</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Target Platforms:</h4>
                    <div className="flex flex-wrap gap-1">
                      {scam.platforms.map((platform) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {scam.relatedCases.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Related Cases:</h4>
                      <div className="flex flex-wrap gap-1">
                        {scam.relatedCases.map((caseId) => (
                          <Badge key={caseId} variant="outline" className="text-xs">
                            {caseId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Advisories Tab */}
        <TabsContent value="advisories" className="space-y-6">
          {advisories.map((advisory) => (
            <Card key={advisory.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      {advisory.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge
                        className={
                          advisory.priority === "High" ? "bg-red-100 text-red-800" :
                          advisory.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }
                      >
                        {advisory.priority} Priority
                      </Badge>
                      <Badge variant="outline">{advisory.type}</Badge>
                      <span className="text-sm text-zinc-500">{advisory.publishDate}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-700">{advisory.summary}</p>

                <div>
                  <h4 className="font-medium mb-2">Affected Demographics:</h4>
                  <div className="flex flex-wrap gap-1">
                    {advisory.affectedDemographics.map((demographic) => (
                      <Badge key={demographic} variant="secondary" className="text-xs">
                        {demographic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommended Actions:</h4>
                  <ul className="text-sm text-zinc-600 space-y-1">
                    {advisory.recommendedActions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="practices" className="space-y-6">
          {bestPractices.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {category.practices.map((practice, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">{practice.title}</h4>
                      <Badge
                        className={
                          practice.importance === "Critical" ? "bg-red-100 text-red-800" :
                          practice.importance === "High" ? "bg-orange-100 text-orange-800" :
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {practice.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-600 mb-3">{practice.description}</p>
                    <div>
                      <h5 className="font-medium mb-2">Steps:</h5>
                      <ol className="text-sm text-zinc-600 space-y-1">
                        {practice.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{resource.type}</Badge>
                    <span className="text-xs text-zinc-500">Updated: {resource.lastUpdated}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-zinc-600">{resource.description}</p>

                  <div>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
