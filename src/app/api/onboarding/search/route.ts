import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { providerSearchSchema, validateInput, formatZodErrors } from '@/lib/validations';

/**
 * GET /api/onboarding/search
 * Search for existing provider profiles to claim
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    // Validate input
    const validation = validateInput(providerSearchSchema, { query });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please enter a valid search query',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Search for providers by name
    const searchTerms = validation.data.query.trim().split(/\s+/);
    
    let providerQuery = supabase
      .from('providers')
      .select('id, first_name, last_name, credentials, provider_type, photo_url, tagline, city, zip_code, issues_treated')
      .eq('is_active', true)
      .is('claimed_by_user_id', null); // Only show unclaimed profiles
    
    // Build search conditions
    if (searchTerms.length === 1) {
      // Single term - search both first and last name
      providerQuery = providerQuery.or(
        `first_name.ilike.%${searchTerms[0]}%,last_name.ilike.%${searchTerms[0]}%`
      );
    } else {
      // Multiple terms - assume first name and last name
      providerQuery = providerQuery.or(
        `and(first_name.ilike.%${searchTerms[0]}%,last_name.ilike.%${searchTerms.slice(1).join(' ')}%),` +
        `and(first_name.ilike.%${searchTerms.slice(0, -1).join(' ')}%,last_name.ilike.%${searchTerms[searchTerms.length - 1]}%)`
      );
    }
    
    providerQuery = providerQuery.limit(10);
    
    const { data: providers, error } = await providerQuery;
    
    if (error) {
      console.error('Provider search error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Search failed. Please try again.',
          },
        },
        { status: 500 }
      );
    }
    
    // Map to card format
    const matches = (providers || []).map((p) => ({
      id: p.id,
      type: 'provider' as const,
      name: `${p.first_name} ${p.last_name}${p.credentials?.length ? ', ' + p.credentials.join(', ') : ''}`,
      credentials: p.credentials || [],
      provider_type: p.provider_type,
      photo_url: p.photo_url,
      tagline: p.tagline,
      neighborhood: undefined,
      service_formats: [],
      availability_status: 'accepting_new_clients' as const,
      issues_treated: p.issues_treated || [],
      age_groups_served: [],
      payment_summary: '',
    }));
    
    return NextResponse.json({
      data: {
        matches,
      },
    });
  } catch (error) {
    console.error('Provider search API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
