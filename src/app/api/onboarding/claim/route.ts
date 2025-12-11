import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { providerClaimSchema, validateInput, formatZodErrors } from '@/lib/validations';

/**
 * POST /api/onboarding/claim
 * Request to claim an existing provider profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(providerClaimSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please check your information and try again',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Please sign in to claim a profile',
          },
        },
        { status: 401 }
      );
    }
    
    // Verify provider exists and is not already claimed
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id, claimed_by_user_id, tenant_id')
      .eq('id', data.provider_id)
      .single();
    
    if (providerError || !provider) {
      return NextResponse.json(
        {
          error: {
            code: 'PROVIDER_NOT_FOUND',
            message: 'Provider profile not found',
          },
        },
        { status: 404 }
      );
    }
    
    if (provider.claimed_by_user_id) {
      return NextResponse.json(
        {
          error: {
            code: 'ALREADY_CLAIMED',
            message: 'This profile has already been claimed by another user',
          },
        },
        { status: 409 }
      );
    }
    
    // Check if user already has a pending claim for this provider
    const { data: existingClaim } = await supabase
      .from('provider_claims')
      .select('id, status')
      .eq('provider_id', data.provider_id)
      .eq('user_id', user.id)
      .single();
    
    if (existingClaim) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_CLAIM',
            message: `You already have a ${existingClaim.status} claim for this profile`,
          },
        },
        { status: 409 }
      );
    }
    
    // Ensure user exists in users table
    const { data: appUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (!appUser) {
      // Create user record
      await supabase.from('users').insert({
        id: user.id,
        tenant_id: provider.tenant_id,
        email: user.email!,
        role: 'provider',
      });
    }
    
    // Create claim request
    const { data: claim, error: claimError } = await supabase
      .from('provider_claims')
      .insert({
        tenant_id: provider.tenant_id,
        provider_id: data.provider_id,
        user_id: user.id,
        verification_email: data.verification_email,
        verification_method: 'email',
        status: 'pending',
      })
      .select('id')
      .single();
    
    if (claimError) {
      console.error('Error creating claim:', claimError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to submit your claim. Please try again.',
          },
        },
        { status: 500 }
      );
    }
    
    // TODO: Send verification email
    // TODO: Notify admins of new claim
    
    return NextResponse.json({
      data: {
        claim_id: claim.id,
        status: 'pending',
        message: 'Your claim has been submitted. We will review it within 2 business days and send a verification email.',
      },
    });
  } catch (error) {
    console.error('Provider claim API error:', error);
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
