'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AdvancedSearchForm } from '../../components/search/AdvancedSearchForm';
import { SearchResults } from '../../components/search/SearchResults';
import type { SearchFilters, SearchResponse } from '../../lib/types/search';

export default function SearchPage() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'type'>('relevance');

  const performSearch = useCallback(async (
    filters: SearchFilters,
    page = 1,
    sort = sortBy
  ) => {
    setLoading(true);
    setCurrentFilters(filters);
    setCurrentPage(page);

    try {
      const searchParams = new URLSearchParams();

      // Add filters to search params
      if (filters.query) searchParams.set('q', filters.query);
      if (filters.startDate) searchParams.set('startDate', filters.startDate);
      if (filters.endDate) searchParams.set('endDate', filters.endDate);
      if (filters.caseTypes?.length) searchParams.set('caseTypes', filters.caseTypes.join(','));
      if (filters.priorities?.length) searchParams.set('priorities', filters.priorities.join(','));
      if (filters.statuses?.length) searchParams.set('statuses', filters.statuses.join(','));
      if (filters.departments?.length) searchParams.set('departments', filters.departments.join(','));
      if (filters.assignedTo?.length) searchParams.set('assignedTo', filters.assignedTo.join(','));
      if (filters.location) searchParams.set('location', filters.location);
      if (filters.estimatedLossMin) searchParams.set('estimatedLossMin', filters.estimatedLossMin.toString());
      if (filters.estimatedLossMax) searchParams.set('estimatedLossMax', filters.estimatedLossMax.toString());
      if (filters.evidenceTypes?.length) searchParams.set('evidenceTypes', filters.evidenceTypes.join(','));
      if (filters.tags?.length) searchParams.set('tags', filters.tags.join(','));

      searchParams.set('page', page.toString());
      searchParams.set('pageSize', '20');
      searchParams.set('sort', sort);

      const response = await fetch(`/api/search?${searchParams.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Search failed:', response.statusText);
        setResults({
          results: [],
          totalCount: 0,
          facets: { types: {}, priorities: {}, statuses: {}, departments: {} },
          searchTime: 0,
          page: 1,
          pageSize: 20,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        results: [],
        totalCount: 0,
        facets: { types: {}, priorities: {}, statuses: {}, departments: {} },
        searchTime: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const handleSearch = (filters: SearchFilters) => {
    performSearch(filters, 1, sortBy);
  };

  const handlePageChange = (page: number) => {
    performSearch(currentFilters, page, sortBy);
  };

  const handleSortChange = (sort: 'relevance' | 'date' | 'type') => {
    setSortBy(sort);
    performSearch(currentFilters, 1, sort);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Search</h1>
          <p className="text-muted-foreground">
            Search across cases, evidence, suspects, victims, and knowledge base
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedSearchForm
            onSearch={handleSearch}
            loading={loading}
            initialFilters={currentFilters}
          />
        </CardContent>
      </Card>

      <SearchResults
        results={results}
        loading={loading}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
