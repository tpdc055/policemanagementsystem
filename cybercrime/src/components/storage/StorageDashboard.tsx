'use client';

import { useState, useEffect } from 'react';
import {
  Cloud,
  HardDrive,
  Upload,
  Download,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface StorageMetrics {
  storage: {
    totalFiles: number;
    totalSize: number;
    sizeByType: Record<string, number>;
    uploadTrends: Array<{
      date: string;
      uploads: number;
      totalSize: number;
    }>;
    storageByCase: Array<{
      caseId: string;
      fileCount: number;
      totalSize: number;
    }>;
  };
  utilization: {
    evidencePerCase: number;
    casesWithEvidencePercentage: number;
    averageFileSize: number;
  };
  uploaders: Array<{
    collectedBy: string;
    _count: { id: number };
    _sum: { size: number };
    user: { name: string; department: string };
  }>;
  growth: Array<{
    month: string;
    file_count: number;
    total_size: number;
  }>;
  costs: {
    estimated: {
      storage: number;
      requests: number;
      dataTransfer: number;
    };
    currency: string;
    period: string;
    disclaimer: string;
  };
  compliance: {
    retentionPolicy: string;
    encryption: string;
    backupPolicy: string;
    accessLogging: string;
  };
  alerts: Array<{
    type: 'warning' | 'info' | 'error';
    message: string;
    recommendation: string;
  }>;
}

export function StorageDashboard() {
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/storage/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        throw new Error('Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Failed to load storage metrics'}
        </AlertDescription>
      </Alert>
    );
  }

  const totalCost =
    metrics.costs.estimated.storage +
    metrics.costs.estimated.requests +
    metrics.costs.estimated.dataTransfer;

  const pieChartData = Object.entries(metrics.storage.sizeByType).map(([type, size]) => ({
    name: type,
    value: size,
    percentage: (size / metrics.storage.totalSize) * 100,
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cloud Storage Dashboard</h1>
          <p className="text-muted-foreground">
            AWS S3 Evidence Storage Monitoring & Analytics
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          AWS S3 Secure Storage
        </Badge>
      </div>

      {/* Alerts */}
      {metrics.alerts.length > 0 && (
        <div className="space-y-2">
          {metrics.alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.message}</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  {alert.recommendation}
                </span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.storage.totalFiles.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Evidence files stored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(metrics.storage.totalSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated AWS costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg File Size</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(metrics.utilization.averageFileSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per evidence file
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Storage by File Type */}
            <Card>
              <CardHeader>
                <CardTitle>Storage by File Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatBytes(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Upload Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Activity (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.storage.uploadTrends.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number, name: string) => [
                        name === 'uploads' ? value : formatBytes(value),
                        name === 'uploads' ? 'Files' : 'Total Size'
                      ]}
                    />
                    <Bar dataKey="uploads" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storage Growth (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metrics.growth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      name === 'file_count' ? value : formatBytes(value),
                      name === 'file_count' ? 'Files' : 'Total Size'
                    ]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="file_count"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total_size"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Uploaders */}
            <Card>
              <CardHeader>
                <CardTitle>Most Active Uploaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.uploaders.slice(0, 5).map((uploader, index) => (
                    <div key={uploader.collectedBy} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{uploader.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {uploader.user.department}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{uploader._count.id} files</div>
                        <div className="text-sm text-muted-foreground">
                          {formatBytes(uploader._sum.size || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Storage by Case */}
            <Card>
              <CardHeader>
                <CardTitle>Largest Cases by Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.storage.storageByCase
                    .sort((a, b) => b.totalSize - a.totalSize)
                    .slice(0, 5)
                    .map((caseStorage) => (
                      <div key={caseStorage.caseId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{caseStorage.caseId}</span>
                          <span>{formatBytes(caseStorage.totalSize)}</span>
                        </div>
                        <Progress
                          value={(caseStorage.totalSize / metrics.storage.totalSize) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {caseStorage.fileCount} files
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">Encryption</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.compliance.encryption}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Backup Policy</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.compliance.backupPolicy}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Access Logging</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.compliance.accessLogging}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Retention Policy</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.compliance.retentionPolicy}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span>{formatCurrency(metrics.costs.estimated.storage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requests</span>
                    <span>{formatCurrency(metrics.costs.estimated.requests)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Transfer</span>
                    <span>{formatCurrency(metrics.costs.estimated.dataTransfer)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics.costs.disclaimer}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
