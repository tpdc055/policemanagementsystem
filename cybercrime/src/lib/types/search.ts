export interface SearchFilters {
  query?: string;
  startDate?: string;
  endDate?: string;
  caseTypes?: string[];
  priorities?: string[];
  statuses?: string[];
  departments?: string[];
  assignedTo?: string[];
  location?: string;
  estimatedLossMin?: number;
  estimatedLossMax?: number;
  evidenceTypes?: string[];
  tags?: string[];
}

export interface SearchResult {
  id: string;
  type: 'case' | 'evidence' | 'suspect' | 'victim' | 'knowledge';
  title: string;
  description: string;
  relevanceScore: number;
  highlights: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  facets: {
    types: { [key: string]: number };
    priorities: { [key: string]: number };
    statuses: { [key: string]: number };
    departments: { [key: string]: number };
  };
  searchTime: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  filters: SearchFilters;
  userId: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchAnalytics {
  searchQuery: string;
  filters: SearchFilters;
  resultsCount: number;
  executionTime: number;
  userId: string;
  timestamp: string;
  resultClicks: string[];
}
