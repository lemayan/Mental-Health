import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { providerCreateSchema, validateInput, formatZodErrors } from '@/lib/validations';

/**
 * POST /api/onboarding/create
 * Create a new provider profile (open to public, no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(providerCreateSchema, body);
    if (!validation.success) {
      console.error('Validation errors:', formatZodErrors(validation.error));
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
    
    // Get default tenant (no auth required)
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', 'baltimore')
      .single();
    
    if (!tenant) {
      return NextResponse.json(
        {
          error: {
            code: 'TENANT_NOT_FOUND',
            message: 'Unable to process your request',
          },
        },
        { status: 500 }
      );
    }
    
    // Prepare provider data
    const providerData: any = {
      tenant_id: tenant.id,
      first_name: data.firstName,
      last_name: data.lastName,
      gender: data.gender || null,
      provider_type: data.providerType,
      credentials: data.credentials ? [data.credentials] : [],
      email: data.email,
      phone: data.phone || null,
      bio: data.bio,
      tagline: data.tagline || null,
      address_line1: data.address_line1,
      address_line2: data.address_line2 || null,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      website: data.website || null,
      photo_url: data.photo_url || null,
      languages: data.languages || ['english'],
      issues_treated: data.issues_treated || [],
      age_groups_served: data.age_groups_served || [],
      service_formats: data.service_formats || [],
      payment_types: data.payment_types || [],
      // Convert insurance string to array (split by comma if provided)
      insurance_accepted: data.insurance_accepted 
        ? data.insurance_accepted.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      availability_status: data.availability_status || 'accepting_new_clients',
      is_verified: false,
      is_active: false, // Will be activated after admin review
    };
    
    // Create new provider profile
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .insert(providerData)
      .select('id')
      .single();
    
    if (providerError) {
      console.error('Error creating provider:', providerError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create your profile. Please try again.',
            details: providerError.message,
          },
        },
        { status: 500 }
      );
    }
    
    // TODO: Send confirmation email to provider
    // TODO: Notify admins of new provider registration
    
    return NextResponse.json({
      data: {
        provider_id: provider.id,
        status: 'pending_review',
        message: 'Your profile has been created and is pending review. We will notify you within 24 hours once your profile is activated.',
      },
    });
  } catch (error) {
    console.error('Provider create API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}


