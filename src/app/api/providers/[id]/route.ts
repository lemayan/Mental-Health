import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/providers/[id]
 * Fetch a single provider's full profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    // Fetch provider with neighborhood info
    const { data: provider, error } = await supabase
      .from('providers')
      .select(`
        *,
        neighborhoods (
          id,
          name,
          slug
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single();
    
    if (error || !provider) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Provider not found',
          },
        },
        { status: 404 }
      );
    }
    
    // Fetch similar providers (same issues, same area)
    const { data: similarProviders } = await supabase
      .from('providers')
      .select('id, first_name, last_name, credentials, provider_type, photo_url, tagline, availability_status, issues_treated, service_formats')
      .eq('is_active', true)
      .neq('id', params.id)
      .overlaps('issues_treated', provider.issues_treated || [])
      .like('zip_code', `${provider.zip_code.substring(0, 3)}%`)
      .limit(4);
    
    return NextResponse.json({
      data: {
        provider,
        similar_providers: similarProviders?.map((p) => ({
          id: p.id,
          type: 'provider' as const,
          name: `${p.first_name} ${p.last_name}${p.credentials?.length ? ', ' + p.credentials.join(', ') : ''}`,
          credentials: p.credentials || [],
          provider_type: p.provider_type,
          photo_url: p.photo_url,
          tagline: p.tagline,
          service_formats: p.service_formats || [],
          availability_status: p.availability_status,
          issues_treated: p.issues_treated || [],
          age_groups_served: [],
          payment_summary: '',
        })) || [],
      },
    });
  } catch (error) {
    console.error('Provider profile API error:', error);
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
