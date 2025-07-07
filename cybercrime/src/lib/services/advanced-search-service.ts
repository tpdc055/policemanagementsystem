/**
 * Advanced Search Service for PNG Police Cyber Crime Monitoring System
 * Provides comprehensive search capabilities across all system entities
 */

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Search request schema
const SearchRequestSchema = z.object({
  query: z.string().min(1),
  filters: z.object({
    type: z.array(z.enum(['cases', 'evidence', 'suspects', 'victims', 'investigations'])).optional(),
    dateRange: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    }).optional(),
    status: z.array(z.string()).optional(),
    priority: z.array(z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])).optional(),
    assignedOfficer: z.string().optional(),
    caseType: z.array(z.string()).optional(),
  }).optional(),
  sort: z.object({
    field: z.enum(['relevance', 'date', 'priority', 'status']).default('relevance'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }).optional(),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }).optional(),
});

type SearchRequest = z.infer<typeof SearchRequestSchema>;

export interface SearchResult {
  id: string;
  type: 'case' | 'evidence' | 'suspect' | 'victim' | 'investigation';
  title: string;
  description: string;
  relevanceScore: number;
  highlights: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchTime: number;
  suggestions: string[];
  facets: {
    types: Array<{ value: string; count: number }>;
    statuses: Array<{ value: string; count: number }>;
    priorities: Array<{ value: string; count: number }>;
    dateRanges: Array<{ range: string; count: number }>;
  };
}

export class AdvancedSearchService {
  private prisma: PrismaClient;
  private searchCache = new Map<string, { data: SearchResponse; timestamp: number }>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Perform comprehensive search across all entities
   */
  async search(request: SearchRequest, userId: string): Promise<SearchResponse> {
    const startTime = performance.now();
    
    // Validate search request
    const validatedRequest = SearchRequestSchema.parse(request);
    const { query, filters = {}, sort = { field: 'relevance', order: 'desc' }, pagination = { page: 1, limit: 20 } } = validatedRequest;

    // Check cache first
    const cacheKey = this.generateCacheKey(validatedRequest);
    const cached = this.searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Perform parallel searches across all entity types
      const searchPromises = await Promise.allSettled([
        this.searchCases(query, filters, sort, pagination),
        this.searchEvidence(query, filters, sort, pagination),
        this.searchSuspects(query, filters, sort, pagination),
        this.searchVictims(query, filters, sort, pagination),
        this.searchInvestigations(query, filters, sort, pagination),
      ]);

      // Combine and rank results
      const allResults: SearchResult[] = [];
      let totalCount = 0;

      searchPromises.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value.results);
          totalCount += result.value.total;
        }
      });

      // Sort by relevance score
      allResults.sort((a, b) => {
        if (sort.field === 'relevance') {
          return sort.order === 'desc' ? b.relevanceScore - a.relevanceScore : a.relevanceScore - b.relevanceScore;
        }
        // Add other sorting logic here
        return 0;
      });

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedResults = allResults.slice(startIndex, startIndex + pagination.limit);

      // Generate search suggestions
      const suggestions = await this.generateSearchSuggestions(query);

      // Generate facets for filtering
      const facets = this.generateFacets(allResults);

      const searchTime = performance.now() - startTime;

      const response: SearchResponse = {
        results: paginatedResults,
        total: totalCount,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(totalCount / pagination.limit),
        searchTime,
        suggestions,
        facets,
      };

      // Cache the response
      this.searchCache.set(cacheKey, { data: response, timestamp: Date.now() });

      // Track search analytics
      await this.trackSearchAnalytics(userId, query, totalCount, searchTime);

      return response;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Search failed');
    }
  }

  /**
   * Search cases with full-text search
   */
  private async searchCases(query: string, filters: any, sort: any, pagination: any) {
    const whereClause: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { caseNumber: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Apply filters
    if (filters.status) {
      whereClause.status = { in: filters.status };
    }
    if (filters.priority) {
      whereClause.priority = { in: filters.priority };
    }
    if (filters.assignedOfficer) {
      whereClause.assignedOfficerId = filters.assignedOfficer;
    }
    if (filters.caseType) {
      whereClause.type = { in: filters.caseType };
    }
    if (filters.dateRange) {
      const dateFilter: any = {};
      if (filters.dateRange.from) {
        dateFilter.gte = new Date(filters.dateRange.from);
      }
      if (filters.dateRange.to) {
        dateFilter.lte = new Date(filters.dateRange.to);
      }
      if (Object.keys(dateFilter).length > 0) {
        whereClause.createdAt = dateFilter;
      }
    }

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where: whereClause,
        include: {
          assignedOfficer: { select: { name: true, badgeNumber: true } },
          createdBy: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
      }),
      this.prisma.case.count({ where: whereClause }),
    ]);

    const results: SearchResult[] = cases.map(case_ => ({
      id: case_.id,
      type: 'case' as const,
      title: case_.title,
      description: case_.description,
      relevanceScore: this.calculateRelevanceScore(query, [case_.title, case_.description, case_.caseNumber]),
      highlights: this.generateHighlights(query, [case_.title, case_.description]),
      metadata: {
        caseNumber: case_.caseNumber,
        status: case_.status,
        priority: case_.priority,
        type: case_.type,
        assignedOfficer: case_.assignedOfficer?.name,
        createdBy: case_.createdBy.name,
      },
      createdAt: case_.createdAt,
      updatedAt: case_.updatedAt,
    }));

    return { results, total };
  }

  /**
   * Search evidence files
   */
  private async searchEvidence(query: string, filters: any, sort: any, pagination: any) {
    const whereClause: any = {
      OR: [
        { fileName: { contains: query, mode: 'insensitive' } },
        { originalName: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ],
    };

    if (filters.dateRange) {
      const dateFilter: any = {};
      if (filters.dateRange.from) {
        dateFilter.gte = new Date(filters.dateRange.from);
      }
      if (filters.dateRange.to) {
        dateFilter.lte = new Date(filters.dateRange.to);
      }
      if (Object.keys(dateFilter).length > 0) {
        whereClause.uploadedAt = dateFilter;
      }
    }

    const [evidence, total] = await Promise.all([
      this.prisma.evidence.findMany({
        where: whereClause,
        include: {
          case: { select: { title: true, caseNumber: true } },
          uploadedBy: { select: { name: true } },
        },
        orderBy: { uploadedAt: 'desc' },
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
      }),
      this.prisma.evidence.count({ where: whereClause }),
    ]);

    const results: SearchResult[] = evidence.map(ev => ({
      id: ev.id,
      type: 'evidence' as const,
      title: ev.fileName,
      description: ev.description || 'No description',
      relevanceScore: this.calculateRelevanceScore(query, [ev.fileName, ev.originalName, ev.description || '', ...ev.tags]),
      highlights: this.generateHighlights(query, [ev.fileName, ev.description || '']),
      metadata: {
        originalName: ev.originalName,
        fileSize: ev.fileSize,
        mimeType: ev.mimeType,
        caseTitle: ev.case.title,
        caseNumber: ev.case.caseNumber,
        uploadedBy: ev.uploadedBy.name,
        tags: ev.tags,
      },
      createdAt: ev.uploadedAt,
      updatedAt: ev.uploadedAt,
    }));

    return { results, total };
  }

  /**
   * Search suspects
   */
  private async searchSuspects(query: string, filters: any, sort: any, pagination: any) {
    const whereClause: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { alias: { hasSome: [query] } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [suspects, total] = await Promise.all([
      this.prisma.suspect.findMany({
        where: whereClause,
        include: {
          case: { select: { title: true, caseNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
      }),
      this.prisma.suspect.count({ where: whereClause }),
    ]);

    const results: SearchResult[] = suspects.map(suspect => ({
      id: suspect.id,
      type: 'suspect' as const,
      title: suspect.name,
      description: suspect.description || 'No description',
      relevanceScore: this.calculateRelevanceScore(query, [suspect.name, ...suspect.alias, suspect.email || '', suspect.description || '']),
      highlights: this.generateHighlights(query, [suspect.name, suspect.description || '']),
      metadata: {
        alias: suspect.alias,
        email: suspect.email,
        phone: suspect.phone,
        nationality: suspect.nationality,
        caseTitle: suspect.case.title,
        caseNumber: suspect.case.caseNumber,
        status: suspect.status,
      },
      createdAt: suspect.createdAt,
      updatedAt: suspect.updatedAt,
    }));

    return { results, total };
  }

  /**
   * Search victims
   */
  private async searchVictims(query: string, filters: any, sort: any, pagination: any) {
    const whereClause: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [victims, total] = await Promise.all([
      this.prisma.victim.findMany({
        where: whereClause,
        include: {
          case: { select: { title: true, caseNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
      }),
      this.prisma.victim.count({ where: whereClause }),
    ]);

    const results: SearchResult[] = victims.map(victim => ({
      id: victim.id,
      type: 'victim' as const,
      title: victim.name,
      description: victim.description || 'No description',
      relevanceScore: this.calculateRelevanceScore(query, [victim.name, victim.email || '', victim.description || '']),
      highlights: this.generateHighlights(query, [victim.name, victim.description || '']),
      metadata: {
        email: victim.email,
        phone: victim.phone,
        nationality: victim.nationality,
        caseTitle: victim.case.title,
        caseNumber: victim.case.caseNumber,
        status: victim.status,
      },
      createdAt: victim.createdAt,
      updatedAt: victim.updatedAt,
    }));

    return { results, total };
  }

  /**
   * Search investigations
   */
  private async searchInvestigations(query: string, filters: any, sort: any, pagination: any) {
    const whereClause: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { findings: { contains: query, mode: 'insensitive' } },
        { recommendations: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [investigations, total] = await Promise.all([
      this.prisma.investigation.findMany({
        where: whereClause,
        include: {
          case: { select: { title: true, caseNumber: true } },
          leadInvestigator: { select: { name: true } },
        },
        orderBy: { startDate: 'desc' },
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
      }),
      this.prisma.investigation.count({ where: whereClause }),
    ]);

    const results: SearchResult[] = investigations.map(investigation => ({
      id: investigation.id,
      type: 'investigation' as const,
      title: investigation.title,
      description: investigation.description,
      relevanceScore: this.calculateRelevanceScore(query, [investigation.title, investigation.description, investigation.findings || '', investigation.recommendations || '']),
      highlights: this.generateHighlights(query, [investigation.title, investigation.description]),
      metadata: {
        status: investigation.status,
        leadInvestigator: investigation.leadInvestigator.name,
        caseTitle: investigation.case.title,
        caseNumber: investigation.case.caseNumber,
        startDate: investigation.startDate,
        targetDate: investigation.targetDate,
      },
      createdAt: investigation.startDate,
      updatedAt: investigation.completedDate || investigation.startDate,
    }));

    return { results, total };
  }

  /**
   * Calculate relevance score based on query matches
   */
  private calculateRelevanceScore(query: string, fields: string[]): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    fields.forEach((field, index) => {
      if (!field) return;
      
      const fieldLower = field.toLowerCase();
      
      // Exact match gets highest score
      if (fieldLower === queryLower) {
        score += 100;
      }
      // Starts with query gets high score
      else if (fieldLower.startsWith(queryLower)) {
        score += 75;
      }
      // Contains query gets medium score
      else if (fieldLower.includes(queryLower)) {
        score += 50;
      }
      
      // Weight by field importance (title more important than description)
      score *= (fields.length - index) / fields.length;
    });

    return Math.round(score);
  }

  /**
   * Generate highlighted text snippets
   */
  private generateHighlights(query: string, fields: string[]): string[] {
    const highlights: string[] = [];
    const queryLower = query.toLowerCase();

    fields.forEach(field => {
      if (!field) return;
      
      const fieldLower = field.toLowerCase();
      const index = fieldLower.indexOf(queryLower);
      
      if (index !== -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(field.length, index + query.length + 30);
        let highlight = field.substring(start, end);
        
        // Add ellipsis if truncated
        if (start > 0) highlight = '...' + highlight;
        if (end < field.length) highlight = highlight + '...';
        
        // Bold the search term
        highlight = highlight.replace(
          new RegExp(`(${query})`, 'gi'),
          '<mark>$1</mark>'
        );
        
        highlights.push(highlight);
      }
    });

    return highlights;
  }

  /**
   * Generate search suggestions
   */
  private async generateSearchSuggestions(query: string): Promise<string[]> {
    // This could be enhanced with a more sophisticated suggestion system
    const suggestions: string[] = [];
    
    if (query.length < 3) return suggestions;

    // Get recent popular searches
    const recentSearches = await this.prisma.searchHistory.findMany({
      where: {
        query: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: { query: true },
      distinct: ['query'],
      orderBy: { timestamp: 'desc' },
      take: 5,
    });

    suggestions.push(...recentSearches.map(s => s.query));

    return suggestions;
  }

  /**
   * Generate facets for search filtering
   */
  private generateFacets(results: SearchResult[]) {
    const types = new Map<string, number>();
    const statuses = new Map<string, number>();
    const priorities = new Map<string, number>();

    results.forEach(result => {
      // Count types
      types.set(result.type, (types.get(result.type) || 0) + 1);
      
      // Count statuses
      if (result.metadata.status) {
        statuses.set(result.metadata.status, (statuses.get(result.metadata.status) || 0) + 1);
      }
      
      // Count priorities
      if (result.metadata.priority) {
        priorities.set(result.metadata.priority, (priorities.get(result.metadata.priority) || 0) + 1);
      }
    });

    return {
      types: Array.from(types.entries()).map(([value, count]) => ({ value, count })),
      statuses: Array.from(statuses.entries()).map(([value, count]) => ({ value, count })),
      priorities: Array.from(priorities.entries()).map(([value, count]) => ({ value, count })),
      dateRanges: [
        { range: 'Last 7 days', count: 0 },
        { range: 'Last 30 days', count: 0 },
        { range: 'Last 90 days', count: 0 },
      ],
    };
  }

  /**
   * Generate cache key for search request
   */
  private generateCacheKey(request: SearchRequest): string {
    return JSON.stringify(request);
  }

  /**
   * Track search analytics
   */
  private async trackSearchAnalytics(userId: string, query: string, resultsCount: number, responseTime: number): Promise<void> {
    try {
      await this.prisma.searchHistory.create({
        data: {
          userId,
          query,
          resultsCount,
          responseTime: Math.round(responseTime),
        },
      });
    } catch (error) {
      console.error('Failed to track search analytics:', error);
    }
  }

  /**
   * Get search analytics for admin dashboard
   */
  async getSearchAnalytics(dateRange: { from: Date; to: Date }) {
    const analytics = await this.prisma.searchHistory.findMany({
      where: {
        timestamp: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return {
      totalSearches: analytics.length,
      averageResponseTime: analytics.reduce((sum, search) => sum + search.responseTime, 0) / analytics.length,
      popularQueries: this.getPopularQueries(analytics),
      searchTrends: this.getSearchTrends(analytics),
    };
  }

  private getPopularQueries(analytics: any[]) {
    const queryCount = new Map<string, number>();
    analytics.forEach(search => {
      queryCount.set(search.query, (queryCount.get(search.query) || 0) + 1);
    });
    
    return Array.from(queryCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }

  private getSearchTrends(analytics: any[]) {
    // Group by day and count searches
    const trends = new Map<string, number>();
    analytics.forEach(search => {
      const day = search.timestamp.toISOString().split('T')[0];
      trends.set(day, (trends.get(day) || 0) + 1);
    });
    
    return Array.from(trends.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }
}