import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/organizations/[id]
 * Fetch a single organization's full profile with locations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    // Fetch organization
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single();
    
    if (error || !organization) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Organization not found',
          },
        },
        { status: 404 }
      );
    }
    
    // Fetch locations
    const { data: locations } = await supabase
      .from('organization_locations')
      .select(`
        *,
        neighborhoods (
          id,
          name,
          slug
        )
      `)
      .eq('organization_id', params.id)
      .order('is_primary', { ascending: false });
    
    // Fetch similar organizations
    const { data: similarOrganizations } = await supabase
      .from('organizations')
      .select('id, name, organization_type, logo_url, tagline, services_offered, is_free, accepts_walk_ins, issues_addressed, service_formats')
      .eq('is_active', true)
      .neq('id', params.id)
      .overlaps('issues_addressed', organization.issues_addressed || [])
      .limit(4);
    
    return NextResponse.json({
      data: {
        organization,
        locations: locations || [],
        similar_organizations: similarOrganizations?.map((org) => ({
          id: org.id,
          type: 'organization' as const,
          name: org.name,
          organization_type: org.organization_type,
          logo_url: org.logo_url,
          tagline: org.tagline,
          service_formats: org.service_formats || [],
          services_summary: (org.services_offered || []).slice(0, 3),
          is_free: org.is_free,
          accepts_walk_ins: org.accepts_walk_ins,
          issues_addressed: org.issues_addressed || [],
          age_groups_served: [],
          payment_summary: org.is_free ? 'Free' : '',
        })) || [],
      },
    });
  } catch (error) {
    console.error('Organization profile API error:', error);
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
