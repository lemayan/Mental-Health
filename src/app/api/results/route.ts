import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resultsFilterSchema, validateInput, formatZodErrors } from '@/lib/validations';
import type { ProviderCard, OrganizationCard, ResultsResponse } from '@/types';

/**
 * GET /api/results
 * Fetch filtered and sorted provider/organization results
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      // Handle array parameters (comma-separated)
      if (
        [
          'issues',
          'age_groups',
          'provider_types',
          'organization_types',
          'service_formats',
          'payment_types',
          'insurance_providers',
          'languages',
          'availability_status',
        ].includes(key)
      ) {
        params[key] = value.split(',').filter(Boolean);
      } else if (['include_providers', 'include_organizations'].includes(key)) {
        params[key] = value === 'true';
      } else {
        params[key] = value;
      }
    });
    
    // Validate input
    const validation = validateInput(resultsFilterSchema, params);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid filter parameters',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const filters = validation.data;
    const supabase = createClient();
    
    // If response_id provided, load the navigator response for filtering
    let navigatorResponse = null;
    if (filters.response_id) {
      const { data } = await supabase
        .from('navigator_responses')
        .select('*')
        .eq('id', filters.response_id)
        .single();
      navigatorResponse = data;
    }
    
    // Build results
    const results: ResultsResponse = {
      providers: [],
      organizations: [],
      total_count: 0,
      page: filters.page || 1,
      limit: filters.limit || 20,
      has_more: false,
      filters_applied: filters,
    };
    
    // Fetch providers if included
    if (filters.include_providers) {
      let providerQuery = supabase
        .from('providers')
        .select('*', { count: 'exact' })
        .eq('is_active', true);
      
      // Apply filters from navigator response or explicit filters
      const issues = filters.issues || (navigatorResponse?.primary_concern && navigatorResponse.primary_concern !== 'not_sure'
        ? [navigatorResponse.primary_concern]
        : null);
      
      if (issues && issues.length > 0) {
        providerQuery = providerQuery.overlaps('issues_treated', issues);
      }
      
      // Age group filter
      const ageGroups = filters.age_groups || (navigatorResponse?.help_for
        ? mapHelpForToAgeGroup(navigatorResponse.help_for)
        : null);
      
      if (ageGroups && ageGroups.length > 0) {
        providerQuery = providerQuery.overlaps('age_groups_served', ageGroups);
      }
      
      // Provider type filter
      if (filters.provider_types && filters.provider_types.length > 0) {
        providerQuery = providerQuery.in('provider_type', filters.provider_types);
      }
      
      // Service format filter - MUST MATCH if specified in navigator
      const serviceFormats = filters.service_formats || (navigatorResponse?.service_format
        ? mapServiceFormat(navigatorResponse.service_format)
        : null);
      
      if (serviceFormats && serviceFormats.length > 0) {
        providerQuery = providerQuery.overlaps('service_formats', serviceFormats);
      }
      
      // Payment type filter - MUST MATCH if specified in navigator
      const paymentTypes = filters.payment_types || (navigatorResponse?.payment_type
        ? [navigatorResponse.payment_type]
        : null);
      
      if (paymentTypes && paymentTypes.length > 0) {
        providerQuery = providerQuery.overlaps('payment_types', paymentTypes);
      }
      
      // Insurance filter - MUST MATCH if specified in navigator
      const insuranceProviders = filters.insurance_providers || (navigatorResponse?.insurance_provider
        ? [navigatorResponse.insurance_provider]
        : null);
      
      if (insuranceProviders && insuranceProviders.length > 0) {
        providerQuery = providerQuery.overlaps('insurance_accepted', insuranceProviders);
      }
      
      // Gender preference filter - MUST MATCH if specified
      if (navigatorResponse?.provider_gender_preference && navigatorResponse.provider_gender_preference !== 'no_preference') {
        providerQuery = providerQuery.eq('gender', navigatorResponse.provider_gender_preference);
      }
      
      // Language preference filter - MUST MATCH if specified
      if (navigatorResponse?.language_preference && navigatorResponse.language_preference !== 'english') {
        providerQuery = providerQuery.overlaps('languages', [navigatorResponse.language_preference]);
      }
      
      // Language filter
      if (filters.languages && filters.languages.length > 0) {
        providerQuery = providerQuery.overlaps('languages', filters.languages);
      }
      
      // Availability filter
      if (filters.availability_status && filters.availability_status.length > 0) {
        providerQuery = providerQuery.in('availability_status', filters.availability_status);
      }
      
      // ZIP code filter (exact match for now, could do radius later)
      const zipCode = filters.zip_code || navigatorResponse?.zip_code;
      if (zipCode) {
        // For now, filter by same ZIP code prefix (first 3 digits)
        const zipPrefix = zipCode.substring(0, 3);
        providerQuery = providerQuery.like('zip_code', `${zipPrefix}%`);
      }
      
      // Text search
      if (filters.query) {
        providerQuery = providerQuery.textSearch('search_vector', filters.query);
      }
      
      // Sorting
      switch (filters.sort_by) {
        case 'name':
          providerQuery = providerQuery.order('last_name', { ascending: filters.sort_order === 'asc' });
          break;
        case 'availability':
          providerQuery = providerQuery.order('typical_wait_weeks', { ascending: true, nullsFirst: false });
          break;
        default:
          // Relevance - if urgency is high, prioritize accepting new clients
          if (navigatorResponse?.urgency === 'immediate') {
            providerQuery = providerQuery
              .order('availability_status', { ascending: true }) // 'accepting_new_clients' comes first alphabetically
              .order('typical_wait_weeks', { ascending: true, nullsFirst: false });
          } else {
            // Normal relevance - featured first, then verified, then by wait time
            providerQuery = providerQuery
              .order('is_featured', { ascending: false })
              .order('is_verified', { ascending: false })
              .order('typical_wait_weeks', { ascending: true, nullsFirst: false });
          }
      }
      
      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;
      providerQuery = providerQuery.range(offset, offset + limit - 1);
      
      const { data: providers, count } = await providerQuery;
      
      if (providers) {
        // Fetch ratings for all providers
        const providerIds = providers.map(p => p.id);
        const { data: ratings } = await supabase
          .from('provider_ratings')
          .select('*')
          .in('provider_id', providerIds);
        
        // Create ratings map
        const ratingsMap = new Map();
        if (ratings) {
          ratings.forEach(r => ratingsMap.set(r.provider_id, r));
        }
        
        results.providers = providers.map(p => mapProviderToCard(p, ratingsMap.get(p.id)));
        results.total_count += count || 0;
      }
    }
    
    // Fetch organizations if included
    if (filters.include_organizations) {
      let orgQuery = supabase
        .from('organizations')
        .select('*', { count: 'exact' })
        .eq('is_active', true);
      
      // Apply similar filters for organizations
      const issues = filters.issues || (navigatorResponse?.primary_concern && navigatorResponse.primary_concern !== 'not_sure'
        ? [navigatorResponse.primary_concern]
        : null);
      
      if (issues && issues.length > 0) {
        orgQuery = orgQuery.overlaps('issues_addressed', issues);
      }
      
      // Age group filter
      const ageGroups = filters.age_groups || (navigatorResponse?.help_for
        ? mapHelpForToAgeGroup(navigatorResponse.help_for)
        : null);
      
      if (ageGroups && ageGroups.length > 0) {
        orgQuery = orgQuery.overlaps('age_groups_served', ageGroups);
      }
      
      // Organization type filter
      if (filters.organization_types && filters.organization_types.length > 0) {
        orgQuery = orgQuery.in('organization_type', filters.organization_types);
      }
      
      // Service format filter
      const serviceFormats = filters.service_formats || (navigatorResponse?.service_format
        ? mapServiceFormat(navigatorResponse.service_format)
        : null);
      
      if (serviceFormats && serviceFormats.length > 0) {
        orgQuery = orgQuery.overlaps('service_formats', serviceFormats);
      }
      
      // Payment type filter
      const paymentTypes = filters.payment_types || (navigatorResponse?.payment_type
        ? [navigatorResponse.payment_type]
        : null);
      
      if (paymentTypes && paymentTypes.length > 0) {
        orgQuery = orgQuery.overlaps('payment_types', paymentTypes);
      }
      
      // Text search
      if (filters.query) {
        orgQuery = orgQuery.textSearch('search_vector', filters.query);
      }
      
      // Sorting
      switch (filters.sort_by) {
        case 'name':
          orgQuery = orgQuery.order('name', { ascending: filters.sort_order === 'asc' });
          break;
        default:
          orgQuery = orgQuery
            .order('is_featured', { ascending: false })
            .order('is_verified', { ascending: false })
            .order('name', { ascending: true });
      }
      
      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;
      orgQuery = orgQuery.range(offset, offset + limit - 1);
      
      const { data: organizations, count } = await orgQuery;
      
      if (organizations) {
        results.organizations = organizations.map(mapOrganizationToCard);
        results.total_count += count || 0;
      }
    }
    
    // Calculate has_more
    const totalFetched = results.providers.length + results.organizations.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    results.has_more = results.total_count > page * limit;
    
    // Update navigator response with results viewed
    if (filters.response_id) {
      await supabase
        .from('navigator_responses')
        .update({
          results_viewed: true,
          results_count: results.total_count,
        })
        .eq('id', filters.response_id);
    }
    
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Results API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while fetching results',
        },
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function mapHelpForToAgeGroup(helpFor: string): string[] {
  switch (helpFor) {
    case 'child':
      return ['children'];
    case 'teen':
      return ['teens'];
    case 'adult':
    case 'couple':
      return ['adults'];
    case 'family':
      return ['children', 'teens', 'adults'];
    default:
      return [];
  }
}

function mapServiceFormat(format: string): string[] {
  switch (format) {
    case 'in_person':
      return ['in_person'];
    case 'online':
      return ['telehealth', 'phone'];
    case 'either':
      return ['in_person', 'telehealth', 'phone', 'hybrid'];
    default:
      return [];
  }
}

function mapProviderToCard(provider: any, rating?: any): ProviderCard {
  const fullName = `${provider.first_name} ${provider.last_name}`;
  const credentialsStr = provider.credentials?.join(', ') || '';
  
  return {
    id: provider.id,
    type: 'provider',
    name: credentialsStr ? `${fullName}, ${credentialsStr}` : fullName,
    credentials: provider.credentials || [],
    provider_type: provider.provider_type,
    photo_url: provider.photo_url,
    tagline: provider.tagline,
    bio_excerpt: provider.bio ? truncateText(provider.bio, 150) : undefined,
    neighborhood: provider.neighborhood_id, // TODO: Join with neighborhoods table
    zip_code: provider.zip_code,
    service_formats: provider.service_formats || [],
    availability_status: provider.availability_status,
    typical_wait_weeks: provider.typical_wait_weeks,
    issues_treated: provider.issues_treated || [],
    age_groups_served: provider.age_groups_served || [],
    specialties: provider.specialties || [],
    payment_summary: buildPaymentSummary(provider),
    insurance_accepted: provider.insurance_accepted || [],
    gender: provider.gender,
    languages_spoken: provider.languages_spoken || [],
    average_rating: rating?.average_rating || undefined,
    review_count: rating?.review_count || undefined,
  };
}

function mapOrganizationToCard(org: any): OrganizationCard {
  return {
    id: org.id,
    type: 'organization',
    name: org.name,
    organization_type: org.organization_type,
    logo_url: org.logo_url,
    tagline: org.tagline,
    description: org.description,
    description_excerpt: org.description ? truncateText(org.description, 150) : undefined,
    neighborhood: undefined, // TODO: Get from primary location
    zip_code: org.zip_code,
    service_formats: org.service_formats || [],
    services_summary: (org.services_offered || []).slice(0, 3),
    is_free: org.is_free,
    accepts_walk_ins: org.accepts_walk_ins,
    issues_addressed: org.issues_addressed || [],
    age_groups_served: org.age_groups_served || [],
    payment_summary: buildOrgPaymentSummary(org),
  };
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function buildPaymentSummary(provider: any): string {
  const parts: string[] = [];
  
  if (provider.payment_types?.includes('medicaid')) parts.push('Medicaid');
  if (provider.payment_types?.includes('medicare')) parts.push('Medicare');
  if (provider.payment_types?.includes('sliding_scale')) parts.push('Sliding scale');
  if (provider.payment_types?.includes('free')) parts.push('Free');
  if (provider.payment_types?.includes('private_insurance') && provider.insurance_accepted?.length > 0) {
    parts.push('Private insurance');
  }
  
  return parts.join(', ') || 'Contact for pricing';
}

function buildOrgPaymentSummary(org: any): string {
  if (org.is_free) return 'Free';
  
  const parts: string[] = [];
  if (org.payment_types?.includes('medicaid')) parts.push('Medicaid');
  if (org.payment_types?.includes('sliding_scale')) parts.push('Sliding scale');
  
  return parts.join(', ') || 'Contact for pricing';
}
