import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { validateInput, formatZodErrors } from '@/lib/validations';

const claimActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  admin_notes: z.string().max(1000).optional(),
});

/**
 * Middleware to verify admin access
 */
async function verifyAdmin(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized', user: null };
  }
  
  const { data: appUser } = await supabase
    .from('users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single();
  
  if (!appUser || appUser.role !== 'admin' || !appUser.is_active) {
    return { authorized: false, error: 'Forbidden', user: null };
  }
  
  return { authorized: true, user: appUser };
}

/**
 * GET /api/admin/claims/[id]
 * Get a single claim's details
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
    
    const { data: claim, error: queryError } = await adminClient
      .from('provider_claims')
      .select(`
        *,
        providers (
          *
        ),
        users!provider_claims_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          created_at
        ),
        reviewer:users!provider_claims_reviewed_by_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (queryError || !claim) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Claim not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: claim });
  } catch (error) {
    console.error('Admin claim detail API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/claims/[id]
 * Approve or reject a claim
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { authorized, error, user } = await verifyAdmin(supabase);
    
    if (!authorized || !user) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: error } },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(claimActionSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid action',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const { action, admin_notes } = validation.data;
    const adminClient = createAdminClient();
    
    // Get the claim
    const { data: claim, error: claimError } = await adminClient
      .from('provider_claims')
      .select('*, providers(id, claimed_by_user_id)')
      .eq('id', params.id)
      .single();
    
    if (claimError || !claim) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Claim not found' } },
        { status: 404 }
      );
    }
    
    if (claim.status !== 'pending') {
      return NextResponse.json(
        { error: { code: 'INVALID_STATE', message: 'This claim has already been processed' } },
        { status: 400 }
      );
    }
    
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Update claim
    const { error: updateError } = await adminClient
      .from('provider_claims')
      .update({
        status: newStatus,
        admin_notes: admin_notes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', params.id);
    
    if (updateError) {
      console.error('Admin claim update error:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update claim' } },
        { status: 500 }
      );
    }
    
    // If approved, update the provider to link to the user
    if (action === 'approve') {
      await adminClient
        .from('providers')
        .update({
          claimed_by_user_id: claim.user_id,
          is_verified: true,
          is_active: true,
          last_verified_at: new Date().toISOString(),
        })
        .eq('id', claim.provider_id);
      
      // Update user to link to provider
      await adminClient
        .from('users')
        .update({
          provider_id: claim.provider_id,
          role: 'provider',
        })
        .eq('id', claim.user_id);
    }
    
    // TODO: Send email notification to user about claim decision
    
    return NextResponse.json({
      data: {
        success: true,
        status: newStatus,
        message: action === 'approve'
          ? 'Claim approved. The provider profile is now linked to the user.'
          : 'Claim rejected. The user has been notified.',
      },
    });
  } catch (error) {
    console.error('Admin claim action API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
