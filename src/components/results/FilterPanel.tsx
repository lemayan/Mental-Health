'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { X, Search, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: ActiveFilters) => void;
  initialFilters?: ActiveFilters;
}

export interface ActiveFilters {
  search?: string;
  availability?: string;
  insurance?: string;
  location?: string;
  gender?: string;
  language?: string;
  rating?: string;
  sortBy?: string;
}

const availabilityOptions = [
  { value: '', label: 'All' },
  { value: 'accepting_new_clients', label: 'Accepting New Clients' },
  { value: 'waitlist', label: 'Waitlist Available' },
  { value: 'limited_availability', label: 'Limited Availability' },
];

const insuranceOptions = [
  { value: '', label: 'All Insurance' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'aetna', label: 'Aetna' },
  { value: 'blue_cross', label: 'Blue Cross Blue Shield' },
  { value: 'cigna', label: 'Cigna' },
  { value: 'united', label: 'United Healthcare' },
  { value: 'kaiser', label: 'Kaiser' },
  { value: 'self_pay', label: 'Self-Pay / Sliding Scale' },
];

const genderOptions = [
  { value: '', label: 'All Genders' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-Binary' },
];

const languageOptions = [
  { value: '', label: 'All Languages' },
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'french', label: 'French' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
];

const ratingOptions = [
  { value: '', label: 'All Ratings' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' },
];

const sortOptions = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'availability', label: 'Soonest Available' },
  { value: 'name', label: 'Name (A-Z)' },
];

export function FilterPanel({ onFilterChange, initialFilters = {} }: FilterPanelProps) {
  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ActiveFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared: ActiveFilters = { sortBy: filters.sortBy || 'relevance' };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'sortBy'
  ).length;

  return (
    <Card padding="lg" className="mb-6">
      <div className="space-y-4">
        {/* Search and Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by name, specialty..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
              Sort by:
            </label>
            <Select
              value={filters.sortBy || 'relevance'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={sortOptions}
              className="flex-1"
            />
          </div>
        </div>

        {/* Toggle Filters Button */}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              leftIcon={<X className="h-4 w-4" />}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Availability
              </label>
              <Select
                value={filters.availability || ''}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                options={availabilityOptions}
              />
            </div>

            {/* Insurance */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Insurance
              </label>
              <Select
                value={filters.insurance || ''}
                onChange={(e) => handleFilterChange('insurance', e.target.value)}
                options={insuranceOptions}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Provider Gender
              </label>
              <Select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                options={genderOptions}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Language
              </label>
              <Select
                value={filters.language || ''}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                options={languageOptions}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ZIP Code
              </label>
              <Input
                type="text"
                placeholder="Enter ZIP code"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                maxLength={5}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Minimum Rating
              </label>
              <Select
                value={filters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                options={ratingOptions}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
