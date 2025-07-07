'use client';

import { useState } from 'react';
import { FileText, Users, Shield, User, BookOpen, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { SearchResponse, SearchResult } from '../../lib/types/search';

interface SearchResultsProps {
  results: SearchResponse | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sort: 'relevance' | 'date' | 'type') => void;
}

export function SearchResults({ results, loading, onPageChange, onSortChange }: SearchResultsProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'type'>('relevance');

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          Enter a search query or apply filters to see results.
        </div>
      </div>
    );
  }

  if (results.results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">No results found.</div>
        <div className="text-sm text-muted-foreground">
          Try adjusting your search terms or filters.
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'case': return <FileText className="h-4 w-4" />;
      case 'evidence': return <Shield className="h-4 w-4" />;
      case 'suspect': return <User className="h-4 w-4" />;
      case 'victim': return <Users className="h-4 w-4" />;
      case 'knowledge': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'case': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'evidence': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'suspect': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'victim': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'knowledge': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredResults = selectedType
    ? results.results.filter(result => result.type === selectedType)
    : results.results;

  const handleSort = (sort: 'relevance' | 'date' | 'type') => {
    setSortBy(sort);
    onSortChange(sort);
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the specific result based on type
    const baseUrl = '/';
    let url = '';

    switch (result.type) {
      case 'case':
        url = `${baseUrl}cases/${result.id}`;
        break;
      case 'evidence':
        url = `${baseUrl}evidence/${result.id}`;
        break;
      case 'suspect':
        url = `${baseUrl}suspects/${result.id}`;
        break;
      case 'victim':
        url = `${baseUrl}victims/${result.id}`;
        break;
      case 'knowledge':
        url = `${baseUrl}knowledge-base/${result.id}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {results.totalCount.toLocaleString()} results found in {results.searchTime}ms
          </div>
          {results.facets && Object.keys(results.facets.types).length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedType || 'all'} onValueChange={(value) =>
                setSelectedType(value === 'all' ? null : value)
              }>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(results.facets.types).map(([type, count]) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Facets */}
      {results.facets && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-sm font-medium mb-2">Types</div>
            <div className="space-y-1">
              {Object.entries(results.facets.types).map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="capitalize">{type}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(results.facets.priorities).length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Priorities</div>
              <div className="space-y-1">
                {Object.entries(results.facets.priorities).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between text-xs">
                    <span>{priority}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(results.facets.statuses).length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Statuses</div>
              <div className="space-y-1">
                {Object.entries(results.facets.statuses).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-xs">
                    <span>{status.replace('_', ' ')}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(results.facets.departments).length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Departments</div>
              <div className="space-y-1">
                {Object.entries(results.facets.departments).map(([dept, count]) => (
                  <div key={dept} className="flex justify-between text-xs">
                    <span>{dept}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card
            key={result.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleResultClick(result)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(result.type)}
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <Badge className={getTypeColor(result.type)} variant="secondary">
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Score: {result.relevanceScore.toFixed(1)}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.description}
              </p>

              {result.highlights.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Highlights:</div>
                  {result.highlights.slice(0, 2).map((highlight, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-2 border-yellow-300"
                      dangerouslySetInnerHTML={{ __html: highlight }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-4">
                  {result.metadata.caseId && (
                    <span>Case: {result.metadata.caseId}</span>
                  )}
                  {result.metadata.priority && (
                    <Badge variant="outline" className="text-xs">
                      {result.metadata.priority}
                    </Badge>
                  )}
                  {result.metadata.status && (
                    <Badge variant="outline" className="text-xs">
                      {result.metadata.status}
                    </Badge>
                  )}
                </div>
                <div>
                  Updated: {new Date(result.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {results.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(results.page - 1)}
            disabled={results.page <= 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, results.totalPages))].map((_, i) => {
              const pageNum = Math.max(1, results.page - 2) + i;
              if (pageNum > results.totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === results.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(results.page + 1)}
            disabled={results.page >= results.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
