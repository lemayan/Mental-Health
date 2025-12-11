import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { contactFormSchema, validateInput, formatZodErrors } from '@/lib/validations';

/**
 * POST /api/contact
 * Submit a contact form inquiry to a provider or organization
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(contactFormSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please check your form and try again',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    const supabase = createClient();
    
    // Get default tenant ID
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
    
    // Verify the provider or organization exists
    if (data.provider_id) {
      const { data: provider } = await supabase
        .from('providers')
        .select('id, email, first_name, last_name')
        .eq('id', data.provider_id)
        .eq('is_active', true)
        .single();
      
      if (!provider) {
        return NextResponse.json(
          {
            error: {
              code: 'PROVIDER_NOT_FOUND',
              message: 'The provider you are trying to contact was not found',
            },
          },
          { status: 404 }
        );
      }
    }
    
    if (data.organization_id) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id, email, name')
        .eq('id', data.organization_id)
        .eq('is_active', true)
        .single();
      
      if (!org) {
        return NextResponse.json(
          {
            error: {
              code: 'ORGANIZATION_NOT_FOUND',
              message: 'The organization you are trying to contact was not found',
            },
          },
          { status: 404 }
        );
      }
    }
    
    // Insert contact submission
    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .insert({
        tenant_id: tenant.id,
        provider_id: data.provider_id || null,
        organization_id: data.organization_id || null,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        navigator_response_id: data.navigator_response_id || null,
        status: 'new',
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving contact submission:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to send your message. Please try again.',
          },
        },
        { status: 500 }
      );
    }
    
    // TODO: Send email notification to provider/organization
    // This would integrate with SendGrid or similar service
    
    return NextResponse.json({
      data: {
        success: true,
        submission_id: submission.id,
        message: 'Your message has been sent. The provider will respond to you directly.',
      },
    });
  } catch (error) {
    console.error('Contact API error:', error);
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
