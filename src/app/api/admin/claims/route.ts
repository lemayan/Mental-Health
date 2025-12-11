import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { adminListSchema, validateInput, formatZodErrors } from '@/lib/validations';

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
 * GET /api/admin/claims
 * List all provider claims with filtering and pagination
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
      .from('provider_claims')
      .select(`
        *,
        providers (
          id,
          first_name,
          last_name,
          email,
          credentials
        ),
        users!provider_claims_user_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `, { count: 'exact' });
    
    // Apply status filter
    if (filters.status === 'pending') {
      query = query.eq('status', 'pending');
    } else if (filters.status === 'active') {
      query = query.eq('status', 'approved');
    } else if (filters.status === 'inactive') {
      query = query.eq('status', 'rejected');
    }
    
    // Apply sorting
    const sortBy = filters.sort_by || 'created_at';
    query = query.order(sortBy, { ascending: filters.sort_order === 'asc' });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    
    const { data: claims, count, error: queryError } = await query;
    
    if (queryError) {
      console.error('Admin claims list error:', queryError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch claims' } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data: {
        items: claims || [],
        total_count: count || 0,
        page: page,
        limit: limit,
        has_more: (count || 0) > page * limit,
      },
    });
  } catch (error) {
    console.error('Admin claims API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
