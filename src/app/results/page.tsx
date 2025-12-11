'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { ProviderCard } from '@/components/cards/provider-card';
import { OrganizationCard } from '@/components/cards/organization-card';
import {
  FilterSidebar,
  FilterDrawer,
  type FilterState,
} from '@/components/results/filter-sidebar';
import { FilterPanel, ActiveFilters } from '@/components/results';
import type { ProviderCard as ProviderCardType, OrganizationCard as OrganizationCardType } from '@/types';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Pencil, 
  Loader2,
  Search,
  MapPin,
} from 'lucide-react';

const initialFilters: FilterState = {
  providerTypes: [],
  organizationTypes: [],
  serviceFormats: [],
  paymentTypes: [],
  ageGroups: [],
};

// Sort options
const sortOptions = [
  { value: 'relevance', label: 'Best match' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'availability', label: 'Soonest availability' },
  { value: 'distance', label: 'Closest to me' },
  { value: 'name', label: 'Name (A-Z)' },
];

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const responseId = searchParams.get('id');

  // State
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [providers, setProviders] = React.useState<ProviderCardType[]>([]);
  const [organizations, setOrganizations] = React.useState<OrganizationCardType[]>([]);
  const [allProviders, setAllProviders] = React.useState<ProviderCardType[]>([]); // Unfiltered results
  const [allOrganizations, setAllOrganizations] = React.useState<OrganizationCardType[]>([]); // Unfiltered results
  const [totalCount, setTotalCount] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<FilterState>(initialFilters);
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>({ sortBy: 'relevance' });
  const [sortBy, setSortBy] = React.useState('relevance');
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [navigatorInfo, setNavigatorInfo] = React.useState<{
    zipCode?: string;
    concern?: string;
    helpFor?: string;
    payment?: string;
  }>({});

  // Fetch results
  const fetchResults = React.useCallback(async (pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (responseId) {
        params.set('response_id', responseId);
      }
      
      params.set('page', pageNum.toString());
      params.set('limit', '20');
      params.set('sort_by', sortBy);
      
      if (filters.providerTypes.length > 0) {
        params.set('provider_types', filters.providerTypes.join(','));
      }
      if (filters.organizationTypes.length > 0) {
        params.set('organization_types', filters.organizationTypes.join(','));
      }
      if (filters.serviceFormats.length > 0) {
        params.set('service_formats', filters.serviceFormats.join(','));
      }
      if (filters.paymentTypes.length > 0) {
        params.set('payment_types', filters.paymentTypes.join(','));
      }
      if (filters.ageGroups.length > 0) {
        params.set('age_groups', filters.ageGroups.join(','));
      }

      const response = await fetch(`/api/results?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to fetch results');
      }

      const { data } = result;
      
      if (append) {
        setAllProviders(prev => [...prev, ...data.providers]);
        setAllOrganizations(prev => [...prev, ...data.organizations]);
      } else {
        setAllProviders(data.providers);
        setAllOrganizations(data.organizations);
      }
      
      setTotalCount(data.total_count);
      setHasMore(data.has_more);
      setPage(pageNum);

      // Extract navigator info from filters_applied
      if (data.filters_applied) {
        setNavigatorInfo({
          zipCode: data.filters_applied.zip_code,
          concern: data.filters_applied.issues?.[0],
          payment: data.filters_applied.payment_types?.[0],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [responseId, sortBy, filters]);

  // Client-side filtering and sorting
  React.useEffect(() => {
    let filteredProviders = [...allProviders];
    let filteredOrgs = [...allOrganizations];

    // Apply search filter
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      filteredProviders = filteredProviders.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.specialties?.some(s => s.toLowerCase().includes(searchLower))
      );
      filteredOrgs = filteredOrgs.filter(o =>
        o.name.toLowerCase().includes(searchLower) ||
        o.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply availability filter
    if (activeFilters.availability) {
      filteredProviders = filteredProviders.filter(p => 
        p.availability_status === activeFilters.availability
      );
    }

    // Apply insurance filter
    if (activeFilters.insurance) {
      filteredProviders = filteredProviders.filter(p =>
        p.insurance_accepted?.includes(activeFilters.insurance!)
      );
    }

    // Apply gender filter
    if (activeFilters.gender) {
      filteredProviders = filteredProviders.filter(p =>
        p.gender?.toLowerCase() === activeFilters.gender
      );
    }

    // Apply language filter
    if (activeFilters.language) {
      filteredProviders = filteredProviders.filter(p =>
        p.languages_spoken?.some(lang => 
          lang.toLowerCase() === activeFilters.language!.toLowerCase()
        )
      );
    }

    // Apply location/ZIP filter
    if (activeFilters.location && activeFilters.location.length === 5) {
      // Simple ZIP code prefix matching - in production you'd want distance calculation
      filteredProviders = filteredProviders.filter(p =>
        p.zip_code?.startsWith(activeFilters.location!)
      );
      filteredOrgs = filteredOrgs.filter(o =>
        o.zip_code?.startsWith(activeFilters.location!)
      );
    }

    // Apply rating filter
    if (activeFilters.rating) {
      const minRating = parseFloat(activeFilters.rating);
      filteredProviders = filteredProviders.filter(p =>
        (p.average_rating || 0) >= minRating
      );
    }

    // Apply sorting
    const sortValue = activeFilters.sortBy || 'relevance';
    
    if (sortValue === 'rating') {
      filteredProviders.sort((a, b) => 
        (b.average_rating || 0) - (a.average_rating || 0)
      );
    } else if (sortValue === 'name') {
      filteredProviders.sort((a, b) => a.name.localeCompare(b.name));
      filteredOrgs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'availability') {
      const availabilityOrder = {
        'accepting_new_clients': 1,
        'limited_availability': 2,
        'waitlist': 3,
      };
      filteredProviders.sort((a, b) => {
        const orderA = availabilityOrder[a.availability_status as keyof typeof availabilityOrder] || 999;
        const orderB = availabilityOrder[b.availability_status as keyof typeof availabilityOrder] || 999;
        return orderA - orderB;
      });
    }
    // 'relevance' and 'distance' keep original order from API

    setProviders(filteredProviders);
    setOrganizations(filteredOrgs);
  }, [allProviders, allOrganizations, activeFilters]);

  // Initial fetch
  React.useEffect(() => {
    fetchResults(1, false);
  }, [fetchResults]);

  // Clear filters
  const clearFilters = () => {
    setFilters(initialFilters);
  };

  // Load more
  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchResults(page + 1, true);
    }
  };

  // Format filter summary
  const filterSummary = React.useMemo(() => {
    const parts: string[] = [];
    
    if (navigatorInfo.zipCode) {
      parts.push(`near ${navigatorInfo.zipCode}`);
    }
    if (navigatorInfo.concern) {
      const labels: Record<string, string> = {
        anxiety: 'stress and anxiety',
        depression: 'depression',
        trauma: 'trauma',
        addiction: 'addiction',
      };
      parts.push(`for ${labels[navigatorInfo.concern] || navigatorInfo.concern}`);
    }
    if (navigatorInfo.payment) {
      const labels: Record<string, string> = {
        medicaid: 'Medicaid',
        medicare: 'Medicare',
        private_insurance: 'private insurance',
        free: 'free services',
      };
      parts.push(labels[navigatorInfo.payment] || navigatorInfo.payment);
    }
    
    return parts.length > 0 ? `Showing results ${parts.join(', ')}` : 'Showing all results';
  }, [navigatorInfo]);

  // Combined results for display
  const allResults = React.useMemo(() => {
    const combined: Array<{ type: 'provider' | 'organization'; data: ProviderCardType | OrganizationCardType }> = [
      ...providers.map((p) => ({ type: 'provider' as const, data: p })),
      ...organizations.map((o) => ({ type: 'organization' as const, data: o })),
    ];
    return combined;
  }, [providers, organizations]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h1 text-neutral-900">Your matches</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-body text-neutral-600">{filterSummary}</p>
            {responseId && (
              <Link
                href="/navigator"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit answers
              </Link>
            )}
          </div>
        </div>

        {/* Matching Info Banner */}
        {responseId && totalCount > 0 && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Search className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">
                  Found {totalCount} provider{totalCount !== 1 ? 's' : ''} matching your needs
                </h3>
                <p className="text-sm text-green-700">
                  These providers match your preferences for{' '}
                  {[
                    navigatorInfo.concern && `${navigatorInfo.concern}`,
                    navigatorInfo.helpFor && `${navigatorInfo.helpFor}`,
                    navigatorInfo.payment && `${navigatorInfo.payment}`,
                    navigatorInfo.zipCode && `your area (${navigatorInfo.zipCode})`
                  ].filter(Boolean).join(', ')}.
                  {' '}All providers shown accept your specified payment method and offer services in your preferred format.
                </p>
              </div>
            </div>
          </div>
        )}

        {totalCount === 0 && !isLoading && responseId && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">
                  No exact matches found
                </h3>
                <p className="text-sm text-orange-700">
                  We couldn't find providers that match all your criteria. Try adjusting your filters or{' '}
                  <Link href="/navigator" className="underline font-medium">
                    update your answers
                  </Link>{' '}
                  to see more results. You can also{' '}
                  <Link href="/results" className="underline font-medium">
                    browse all providers
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        <FilterPanel 
          onFilterChange={(newFilters) => {
            setActiveFilters(newFilters);
            if (newFilters.sortBy) {
              setSortBy(newFilters.sortBy);
            }
          }}
          initialFilters={activeFilters}
        />

        {/* Mobile filter/sort bar */}
        <div className="mb-4 flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setFilterDrawerOpen(true)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            className="flex-1"
          >
            Filters
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden w-72 shrink-0 lg:block">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
            />
          </div>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {/* Desktop sort bar */}
            <div className="mb-4 hidden items-center justify-between lg:flex">
              <p className="text-sm text-neutral-600">
                {totalCount} {totalCount === 1 ? 'result' : 'results'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading state */}
            {isLoading && page === 1 && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-lg bg-error-100 p-6 text-center">
                <p className="text-error-700">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => fetchResults(1, false)}
                  className="mt-4"
                >
                  Try again
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && allResults.length === 0 && (
              <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
                <Search className="mx-auto h-12 w-12 text-neutral-300" />
                <h2 className="mt-4 text-lg font-semibold text-neutral-900">
                  No matches found
                </h2>
                <p className="mt-2 text-neutral-600">
                  Try adjusting your filters or{' '}
                  <Link href="/" className="text-primary-600 hover:underline">
                    start a new search
                  </Link>
                  .
                </p>
                {Object.values(filters).some((arr) => arr.length > 0) && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* Results list */}
            {!isLoading && !error && allResults.length > 0 && (
              <>
                <div className="space-y-4">
                  {allResults.map((item) => (
                    item.type === 'provider' ? (
                      <ProviderCard
                        key={`provider-${item.data.id}`}
                        provider={item.data as ProviderCardType}
                      />
                    ) : (
                      <OrganizationCard
                        key={`org-${item.data.id}`}
                        organization={item.data as OrganizationCardType}
                      />
                    )
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      isLoading={isLoading}
                    >
                      Load more results
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        resultCount={totalCount}
      />

      <Footer />
    </div>
  );
}
