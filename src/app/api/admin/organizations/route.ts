import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import {
  adminListSchema,
  adminOrganizationUpdateSchema,
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
 * GET /api/admin/organizations
 * List all organizations with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { authorized, error } = await verifyAdmin(supabase);
    
    if (!authorized) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: error } },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const params: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    const validation = validateInput(adminListSchema, params);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid parameters',
            details: formatZodErrors(validation.error),
          },
        },
        { status: 400 }
      );
    }
    
    const filters = validation.data;
    const adminClient = createAdminClient();
    
    let query = adminClient
      .from('organizations')
      .select('*', { count: 'exact' });
    
    // Apply status filter
    if (filters.status === 'active') {
      query = query.eq('is_active', true);
    } else if (filters.status === 'inactive') {
      query = query.eq('is_active', false);
    } else if (filters.status === 'pending') {
      query = query.eq('is_verified', false);
    }
    
    // Apply search
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }
    
    // Apply sorting
    const sortBy = filters.sort_by || 'created_at';
    query = query.order(sortBy, { ascending: filters.sort_order === 'asc' });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    
    const { data: organizations, count, error: queryError } = await query;
    
    if (queryError) {
      console.error('Admin organizations list error:', queryError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch organizations' } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data: {
        items: organizations || [],
        total_count: count || 0,
        page: page,
        limit: limit,
        has_more: (count || 0) > page * limit,
      },
    });
  } catch (error) {
    console.error('Admin organizations API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/organizations
 * Create a new organization (admin only)
 */
export async function POST(request: NextRequest) {
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
    const adminClient = createAdminClient();
    
    // Get default tenant
    const { data: tenant } = await adminClient
      .from('tenants')
      .select('id')
      .eq('slug', 'baltimore')
      .single();
    
    if (!tenant) {
      return NextResponse.json(
        { error: { code: 'TENANT_NOT_FOUND', message: 'Tenant not found' } },
        { status: 500 }
      );
    }
    
    const { data: organization, error: insertError } = await adminClient
      .from('organizations')
      .insert({
        tenant_id: tenant.id,
        ...body,
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Admin organization create error:', insertError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create organization' } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data: organization }, { status: 201 });
  } catch (error) {
    console.error('Admin organization create API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
