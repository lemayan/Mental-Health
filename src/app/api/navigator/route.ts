import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { navigatorSubmitSchema, validateInput, formatZodErrors } from '@/lib/validations';

/**
 * POST /api/navigator
 * Submit navigator questionnaire responses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(navigatorSubmitSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    const supabase = createAdminClient();
    
    // Get default tenant ID (Baltimore)
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
            message: 'Unable to find tenant configuration',
          },
        },
        { status: 500 }
      );
    }
    
    // Generate session ID for tracking
    const sessionId = crypto.randomUUID();
    
    // Insert navigator response
    const { data: response, error } = await supabase
      .from('navigator_responses')
      .insert({
        tenant_id: tenant.id,
        primary_concern: data.primary_concern,
        help_for: data.help_for,
        urgency: data.urgency,
        service_format: data.service_format,
        payment_type: data.payment_type,
        insurance_provider: data.insurance_provider || null,
        zip_code: data.zip_code,
        provider_gender_preference: data.provider_gender_preference || null,
        language_preference: data.language_preference || null,
        open_to_community_programs: data.open_to_community_programs,
        session_id: sessionId,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving navigator response:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to save your responses. Please try again.',
          },
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data: {
        response_id: response.id,
        results_url: `/results?id=${response.id}`,
      },
    });
  } catch (error) {
    console.error('Navigator API error:', error);
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
