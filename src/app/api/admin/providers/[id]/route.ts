import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import {
  adminProviderUpdateSchema,
  validateInput,
  formatZodErrors,
} from '@/lib/validations';

/**
 * Middleware to verify admin access
 */
async function verifyAdmin(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' };
  }
  
  const { data: appUser } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('id', user.id)
    .single();
  
  if (!appUser || appUser.role !== 'admin' || !appUser.is_active) {
    return { authorized: false, error: 'Forbidden' };
  }
  
  return { authorized: true, user };
}

/**
 * GET /api/admin/providers/[id]
 * Get a single provider's full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { authorized, error } = await verifyAdmin(supabase);
    
    if (!authorized) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: error } },
        { status: 403 }
      );
    }
    
    const adminClient = createAdminClient();
    
    const { data: provider, error: queryError } = await adminClient
      .from('providers')
      .select(`
        *,
        neighborhoods (
          id,
          name,
          slug
        ),
        users!providers_claimed_by_user_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (queryError || !provider) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Provider not found' } },
        { status: 404 }
      );
    }
    
    // Also fetch any claims for this provider
    const { data: claims } = await adminClient
      .from('provider_claims')
      .select('*')
      .eq('provider_id', params.id)
      .order('created_at', { ascending: false });
    
    // Fetch contact submissions
    const { data: contacts } = await adminClient
      .from('contact_submissions')
      .select('*')
      .eq('provider_id', params.id)
      .order('created_at', { ascending: false })
      .limit(20);
    
    return NextResponse.json({
      data: {
        provider,
        claims: claims || [],
        recent_contacts: contacts || [],
      },
    });
  } catch (error) {
    console.error('Admin provider detail API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/providers/[id]
 * Update a provider's details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { authorized, error } = await verifyAdmin(supabase);
    
    if (!authorized) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: error } },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(adminProviderUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid update data',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const adminClient = createAdminClient();
    
    // Check provider exists
    const { data: existing } = await adminClient
      .from('providers')
      .select('id')
      .eq('id', params.id)
      .single();
    
    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Provider not found' } },
        { status: 404 }
      );
    }
    
    // Update provider
    const { data: provider, error: updateError } = await adminClient
      .from('providers')
      .update(validation.data)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Admin provider update error:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update provider' } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data: provider });
  } catch (error) {
    console.error('Admin provider update API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/providers/[id]
 * Soft delete a provider (sets is_active to false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { authorized, error } = await verifyAdmin(supabase);
    
    if (!authorized) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: error } },
        { status: 403 }
      );
    }
    
    const adminClient = createAdminClient();
    
    // Soft delete by setting is_active to false
    const { error: deleteError } = await adminClient
      .from('providers')
      .update({ is_active: false })
      .eq('id', params.id);
    
    if (deleteError) {
      console.error('Admin provider delete error:', deleteError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to delete provider' } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error('Admin provider delete API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
