'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Save, Clock, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { DatePickerWithRange } from '../ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import type { SearchFilters, SavedSearch } from '../../lib/types/search';

interface AdvancedSearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  initialFilters?: SearchFilters;
}

export function AdvancedSearchForm({ onSearch, loading, initialFilters }: AdvancedSearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const response = await fetch('/api/search/saved');
      if (response.ok) {
        const searches = await response.json();
        setSavedSearches(searches);
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    }
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplySavedSearch = async (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    onSearch(savedSearch.filters);

    // Track usage
    try {
      await fetch(`/api/search/saved/${savedSearch.id}`, { method: 'POST' });
    } catch (error) {
      console.error('Error tracking search usage:', error);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  });

  const caseTypes = [
    'Online Fraud/Scam',
    'Social Media Fraud',
    'Email Fraud',
    'Identity Theft',
    'Cyberbullying',
    'Online Harassment',
    'Phishing',
    'Financial Fraud',
    'Crypto Fraud',
    'Romance Scam',
    'Investment Scam',
    'Other'
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'UNDER_INVESTIGATION', 'PENDING_LEGAL', 'SUSPENDED', 'CLOSED'];
  const evidenceTypes = ['DIGITAL', 'PHYSICAL', 'FINANCIAL', 'TESTIMONIAL', 'FORENSIC'];

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases, evidence, suspects, victims, or knowledge base..."
            value={filters.query || ''}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <DatePickerWithRange
                  startDate={filters.startDate ? new Date(filters.startDate) : undefined}
                  endDate={filters.endDate ? new Date(filters.endDate) : undefined}
                  onDateChange={(range) => {
                    handleFilterChange('startDate', range?.from?.toISOString());
                    handleFilterChange('endDate', range?.to?.toISOString());
                  }}
                />
              </div>

              {/* Case Types */}
              <div className="space-y-2">
                <Label>Case Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {caseTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`case-type-${type}`}
                        checked={filters.caseTypes?.includes(type) || false}
                        onCheckedChange={(checked) => {
                          const current = filters.caseTypes || [];
                          if (checked) {
                            handleFilterChange('caseTypes', [...current, type]);
                          } else {
                            handleFilterChange('caseTypes', current.filter(t => t !== type));
                          }
                        }}
                      />
                      <Label htmlFor={`case-type-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex gap-2">
                  {priorities.map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={filters.priorities?.includes(priority) || false}
                        onCheckedChange={(checked) => {
                          const current = filters.priorities || [];
                          if (checked) {
                            handleFilterChange('priorities', [...current, priority]);
                          } else {
                            handleFilterChange('priorities', current.filter(p => p !== priority));
                          }
                        }}
                      />
                      <Label htmlFor={`priority-${priority}`} className="text-sm">
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.statuses?.includes(status) || false}
                        onCheckedChange={(checked) => {
                          const current = filters.statuses || [];
                          if (checked) {
                            handleFilterChange('statuses', [...current, status]);
                          } else {
                            handleFilterChange('statuses', current.filter(s => s !== status));
                          }
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm">
                        {status.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Filter by location..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>

              {/* Estimated Loss Range */}
              <div className="space-y-2">
                <Label>Estimated Loss Range (PGK)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={filters.estimatedLossMin || ''}
                    onChange={(e) => handleFilterChange('estimatedLossMin',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )}
                  />
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={filters.estimatedLossMax || ''}
                    onChange={(e) => handleFilterChange('estimatedLossMax',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )}
                  />
                </div>
              </div>

              {/* Evidence Types */}
              <div className="space-y-2">
                <Label>Evidence Types</Label>
                <div className="flex flex-wrap gap-2">
                  {evidenceTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`evidence-${type}`}
                        checked={filters.evidenceTypes?.includes(type) || false}
                        onCheckedChange={(checked) => {
                          const current = filters.evidenceTypes || [];
                          if (checked) {
                            handleFilterChange('evidenceTypes', [...current, type]);
                          } else {
                            handleFilterChange('evidenceTypes', current.filter(t => t !== type));
                          }
                        }}
                      />
                      <Label htmlFor={`evidence-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSearch} disabled={loading} className="flex-1">
                  {loading ? 'Searching...' : 'Apply Filters'}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
            <Save className="h-3 w-3 mr-1" />
            Save Search
          </Button>
        )}
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Saved Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedSearches.slice(0, 5).map((search) => (
                <Button
                  key={search.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplySavedSearch(search)}
                  className="text-xs"
                >
                  {search.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {search.usageCount}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
