export interface CybercrimeStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  closedCases: number;
  urgentCases: number;
  recentCases: Array<{
    id: string;
    title: string;
    offenseType: string;
    priority: string;
    status: string;
    estimatedLoss?: number;
    currency?: string;
    createdAt: string;
    assignedOfficer?: string;
  }>;
  topOffenseTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: {
    currentMonth: {
      cases: number;
      solved: number;
      financialRecovery: number;
    };
    lastMonth: {
      cases: number;
      solved: number;
      financialRecovery: number;
    };
  };
}

export interface CybercrimeApiResponse {
  success: boolean;
  data: unknown;
  error?: string;
}

class CybercrimeApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Use environment variables or fallback to localhost for development
    this.baseUrl = process.env.NEXT_PUBLIC_CYBERCRIME_API_URL || 'http://localhost:3001';
    this.apiKey = process.env.CYBERCRIME_API_KEY || 'dev-api-key';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<CybercrimeApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Cybercrime API request failed:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getStatistics(): Promise<CybercrimeStats | null> {
    try {
      // Fetch cases from the cybercrime system
      const casesResponse = await this.makeRequest('/api/integration/police-system?limit=10');

      if (!casesResponse.success || !casesResponse.data?.data) {
        // Return mock data if API is not available (development fallback)
        return this.getMockStatistics();
      }

      const cases = casesResponse.data.data;

      // Calculate statistics from real data
      const stats: CybercrimeStats = {
        totalCases: casesResponse.data.pagination?.total || cases.length,
        openCases: cases.filter((c: unknown) => (c as Record<string, unknown>).status === 'OPEN').length,
        inProgressCases: cases.filter((c: unknown) => {
          const status = (c as Record<string, unknown>).status;
          return status === 'IN_PROGRESS' || status === 'UNDER_INVESTIGATION';
        }).length,
        closedCases: cases.filter((c: unknown) => {
          const status = (c as Record<string, unknown>).status;
          return status === 'CLOSED' || status === 'RESOLVED';
        }).length,
        urgentCases: cases.filter((c: unknown) => {
          const priority = (c as Record<string, unknown>).priority;
          return priority === 'URGENT' || priority === 'HIGH';
        }).length,
        recentCases: cases.slice(0, 5).map((c: unknown) => {
          const caseData = c as Record<string, unknown>;
          const assignedOfficer = caseData.assignedOfficer as Record<string, unknown> | undefined;
          return {
            id: caseData.caseNumber as string,
            title: caseData.title as string,
            offenseType: caseData.offenseType as string,
            priority: caseData.priority as string,
            status: caseData.status as string,
            estimatedLoss: caseData.estimatedFinancialLoss as number,
            currency: (caseData.currency as string) || 'PGK',
            createdAt: caseData.createdAt as string,
            assignedOfficer: assignedOfficer?.name as string,
          };
        }),
        topOffenseTypes: this.calculateOffenseTypes(cases),
        monthlyTrends: this.calculateMonthlyTrends(cases),
      };

      return stats;
    } catch (error) {
      console.error('Failed to fetch cybercrime statistics:', error);
      return this.getMockStatistics();
    }
  }

  private calculateOffenseTypes(cases: unknown[]): Array<{type: string; count: number; percentage: number}> {
    const offenseMap = new Map<string, number>();

    for (const c of cases) {
      const caseData = c as Record<string, unknown>;
      const type = (caseData.offenseType as string) || 'Unknown';
      offenseMap.set(type, (offenseMap.get(type) || 0) + 1);
    }

    const total = cases.length;
    return Array.from(offenseMap.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateMonthlyTrends(cases: unknown[]): CybercrimeStats['monthlyTrends'] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = now.getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthCases = cases.filter(c => {
      const caseData = c as Record<string, unknown>;
      const caseDate = new Date(caseData.createdAt as string);
      return caseDate.getMonth() === currentMonth && caseDate.getFullYear() === currentYear;
    });

    const lastMonthCases = cases.filter(c => {
      const caseData = c as Record<string, unknown>;
      const caseDate = new Date(caseData.createdAt as string);
      return caseDate.getMonth() === lastMonth && caseDate.getFullYear() === lastMonthYear;
    });

    return {
      currentMonth: {
        cases: currentMonthCases.length,
        solved: currentMonthCases.filter(c => {
          const caseData = c as Record<string, unknown>;
          const status = caseData.status as string;
          return status === 'CLOSED' || status === 'RESOLVED';
        }).length,
        financialRecovery: currentMonthCases.reduce((sum, c) => {
          const caseData = c as Record<string, unknown>;
          return sum + ((caseData.estimatedFinancialLoss as number) || 0);
        }, 0),
      },
      lastMonth: {
        cases: lastMonthCases.length,
        solved: lastMonthCases.filter(c => {
          const caseData = c as Record<string, unknown>;
          const status = caseData.status as string;
          return status === 'CLOSED' || status === 'RESOLVED';
        }).length,
        financialRecovery: lastMonthCases.reduce((sum, c) => {
          const caseData = c as Record<string, unknown>;
          return sum + ((caseData.estimatedFinancialLoss as number) || 0);
        }, 0),
      },
    };
  }

  private getMockStatistics(): CybercrimeStats {
    return {
      totalCases: 156,
      openCases: 45,
      inProgressCases: 67,
      closedCases: 44,
      urgentCases: 8,
      recentCases: [
        {
          id: "CYBER-2024-001",
          title: "Online Romance Scam Investigation",
          offenseType: "Romance Scam",
          priority: "HIGH",
          status: "IN_PROGRESS",
          estimatedLoss: 15000,
          currency: "PGK",
          createdAt: new Date().toISOString(),
          assignedOfficer: "Det. Sarah Wilson",
        },
        {
          id: "CYBER-2024-002",
          title: "Facebook Identity Theft Case",
          offenseType: "Identity Theft",
          priority: "MEDIUM",
          status: "OPEN",
          assignedOfficer: "Det. Mike Johnson",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "CYBER-2024-003",
          title: "Cryptocurrency Investment Fraud",
          offenseType: "Investment Fraud",
          priority: "HIGH",
          status: "UNDER_INVESTIGATION",
          estimatedLoss: 45000,
          currency: "PGK",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          assignedOfficer: "Det. John Doe",
        },
      ],
      topOffenseTypes: [
        { type: "Romance Scams", count: 34, percentage: 22 },
        { type: "Identity Theft", count: 28, percentage: 18 },
        { type: "Investment Fraud", count: 22, percentage: 14 },
        { type: "Phishing", count: 18, percentage: 12 },
        { type: "Cyberbullying", count: 15, percentage: 10 },
      ],
      monthlyTrends: {
        currentMonth: {
          cases: 23,
          solved: 8,
          financialRecovery: 125000,
        },
        lastMonth: {
          cases: 19,
          solved: 12,
          financialRecovery: 89000,
        },
      },
    };
  }

  async getCybercrimeSystemUrl(): Promise<string> {
    return process.env.NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL || 'http://localhost:3001';
  }

  // Method to sync case data with cybercrime system
  async linkCase(policeSystemCaseId: string, cyberCrimeSystemCaseId: string): Promise<boolean> {
    const response = await this.makeRequest('/api/integration/police-system', {
      method: 'POST',
      body: JSON.stringify({
        event: 'case.linked',
        data: {
          mainSystemCaseId: policeSystemCaseId,
          cyberCaseId: cyberCrimeSystemCaseId,
          linkType: 'cross_reference',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    return response.success;
  }

  // Method to get case details for viewing
  async getCaseDetails(caseId: string): Promise<unknown> {
    const response = await this.makeRequest(`/api/cases/${caseId}`);
    return response.success ? response.data : null;
  }
}

export const cybercrimeApi = new CybercrimeApiService();
