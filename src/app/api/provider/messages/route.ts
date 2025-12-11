import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const providerId = searchParams.get('provider_id');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    // Fetch messages for the provider
    const { data: messages, error } = await supabase
      .from('provider_messages')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    // Get unread count
    const unreadCount = messages?.filter(m => !m.is_read).length || 0;

    return NextResponse.json({
      messages: messages || [],
      unread_count: unreadCount,
      total_count: messages?.length || 0,
    });
  } catch (error) {
    console.error('Error in messages API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { message_id, is_read, is_replied } = body;

    if (!message_id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof is_read === 'boolean') updateData.is_read = is_read;
    if (typeof is_replied === 'boolean') updateData.is_replied = is_replied;

    const { data, error } = await supabase
      .from('provider_messages')
      .update(updateData)
      .eq('id', message_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating message:', error);
      return NextResponse.json(
        { error: 'Failed to update message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: data });
  } catch (error) {
    console.error('Error in messages PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
