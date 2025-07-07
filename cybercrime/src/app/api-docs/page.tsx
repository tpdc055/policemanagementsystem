'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Book,
  Code,
  Shield,
  Zap,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function APIDocumentationPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSwaggerSpec();
  }, []);

  const fetchSwaggerSpec = async () => {
    try {
      const response = await fetch('/api/docs/swagger');
      if (response.ok) {
        const swaggerSpec = await response.json();
        setSpec(swaggerSpec);
      } else {
        throw new Error('Failed to load API specification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const codeExamples = {
    javascript: `// Authentication
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@police.gov.pg', password: 'password' })
});
const { token } = await response.json();

// Search for cases
const searchResponse = await fetch('/api/search?q=fraud&priorities=HIGH', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const results = await searchResponse.json();`,

    python: `import requests

# Authentication
auth_response = requests.post('https://api.cybercrime.police.gov.pg/api/auth/signin', {
    'email': 'user@police.gov.pg',
    'password': 'password'
})
token = auth_response.json()['token']

# Search for cases
headers = {'Authorization': f'Bearer {token}'}
search_response = requests.get(
    'https://api.cybercrime.police.gov.pg/api/search',
    params={'q': 'fraud', 'priorities': 'HIGH'},
    headers=headers
)
results = search_response.json()`,

    curl: `# Authentication
curl -X POST https://api.cybercrime.police.gov.pg/api/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@police.gov.pg", "password": "password"}'

# Search for cases
curl -X GET "https://api.cybercrime.police.gov.pg/api/search?q=fraud&priorities=HIGH" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,

    php: `<?php
// Authentication
$auth_data = [
    'email' => 'user@police.gov.pg',
    'password' => 'password'
];

$auth_response = file_get_contents(
    'https://api.cybercrime.police.gov.pg/api/auth/signin',
    false,
    stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($auth_data)
        ]
    ])
);

$token = json_decode($auth_response, true)['token'];

// Search for cases
$search_response = file_get_contents(
    'https://api.cybercrime.police.gov.pg/api/search?q=fraud&priorities=HIGH',
    false,
    stream_context_create([
        'http' => [
            'header' => "Authorization: Bearer $token"
        ]
    ])
);

$results = json_decode($search_response, true);
?>`,
  };

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with role-based access control',
      status: 'implemented',
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: 'RESTful API Design',
      description: 'Standard HTTP methods with consistent JSON responses',
      status: 'implemented',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Real-time Updates',
      description: 'WebSocket connections for live notifications',
      status: 'implemented',
    },
    {
      icon: <Book className="h-5 w-5" />,
      title: 'Comprehensive Documentation',
      description: 'Interactive API explorer with code examples',
      status: 'implemented',
    },
  ];

  const endpoints = [
    { method: 'POST', path: '/api/auth/signin', description: 'User authentication' },
    { method: 'GET', path: '/api/cases', description: 'List cyber crime cases' },
    { method: 'POST', path: '/api/cases', description: 'Create new case' },
    { method: 'GET', path: '/api/search', description: 'Advanced search across all entities' },
    { method: 'POST', path: '/api/storage/upload', description: 'Upload evidence to secure storage' },
    { method: 'GET', path: '/api/storage/metrics', description: 'Cloud storage analytics' },
    { method: 'GET', path: '/api/notifications', description: 'User notifications' },
    { method: 'GET', path: '/api/analytics', description: 'System analytics and reports' },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PUT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load API documentation: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground">
            Complete reference for the PNG Cyber Crime Monitoring System API
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">OpenAPI 3.0</Badge>
          <Badge variant="outline">v1.0.0</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="explorer">API Explorer</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="integration">Integration Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>API Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="text-primary mt-1">{feature.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{feature.title}</h3>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getMethodColor(endpoint.method)} variant="secondary">
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {endpoint.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Authentication Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">JWT Token Authentication</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  All API endpoints require authentication using JWT tokens. Include the token in the Authorization header.
                </p>
                <div className="bg-muted p-3 rounded-lg">
                  <code className="text-sm">Authorization: Bearer &lt;your-jwt-token&gt;</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">User Roles</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['ADMIN', 'UNIT_COMMANDER', 'SENIOR_INVESTIGATOR', 'INVESTIGATOR', 'ANALYST', 'OFFICER'].map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer">
          <Card>
            <CardHeader>
              <CardTitle>Interactive API Explorer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Test API endpoints directly from this interface. Authentication tokens will be automatically included.
              </p>
            </CardHeader>
            <CardContent>
              {spec && (
                <div className="swagger-ui-container">
                  <SwaggerUI
                    spec={spec}
                    docExpansion="none"
                    defaultModelsExpandDepth={1}
                    defaultModelExpandDepth={1}
                    displayOperationId={false}
                    filter={true}
                    showExtensions={true}
                    showCommonExtensions={true}
                    tryItOutEnabled={true}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <p className="text-sm text-muted-foreground">
                Integration examples in multiple programming languages
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="php">PHP</TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([language, code]) => (
                  <TabsContent key={language} value={language}>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                      <button
                        className="absolute top-2 right-2 p-2 hover:bg-background rounded"
                        onClick={() => navigator.clipboard.writeText(code)}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Register for API Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact the PNG Cyber Crime Unit to request API access credentials.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Authenticate</h4>
                      <p className="text-sm text-muted-foreground">
                        Use your credentials to obtain a JWT token via the /api/auth/signin endpoint.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Make API Calls</h4>
                      <p className="text-sm text-muted-foreground">
                        Include the JWT token in the Authorization header for all subsequent requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Rate Limits</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Authenticated users:</strong> 1,000 requests per hour</li>
                    <li>• <strong>File uploads:</strong> 100 requests per hour</li>
                    <li>• <strong>Search operations:</strong> 500 requests per hour</li>
                    <li>• <strong>Analytics queries:</strong> 50 requests per hour</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Always use HTTPS and never expose API tokens in client-side code.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Error Handling</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement proper error handling for all HTTP status codes.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Caching</h4>
                    <p className="text-sm text-muted-foreground">
                      Cache responses when appropriate to reduce API calls and improve performance.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Support</h3>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:cybercrime@police.gov.pg"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Email Support
                  </a>
                  <a
                    href="https://police.gov.pg/cyber-crime"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Documentation Portal
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
