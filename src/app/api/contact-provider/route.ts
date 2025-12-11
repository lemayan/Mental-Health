import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, providerEmail, senderName, senderEmail, senderPhone, message } = body;

    // Validate required fields
    if (!providerId || !providerEmail || !senderName || !senderEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get provider name from database
    const supabase = createClient();
    const { data: provider } = await supabase
      .from('providers')
      .select('first_name, last_name')
      .eq('id', providerId)
      .single();

    const providerName = provider 
      ? `${provider.first_name} ${provider.last_name}`
      : 'Provider';

    // Store the message in database for tracking
    const { error: dbError } = await supabase
      .from('provider_messages')
      .insert({
        provider_id: providerId,
        sender_name: senderName,
        sender_email: senderEmail,
        sender_phone: senderPhone || null,
        message: message,
      });

    if (dbError) {
      console.error('Error storing message:', dbError);
      // Continue even if storage fails
    }

    // Send email notification to provider
    const emailResult = await sendContactEmail({
      providerName,
      providerEmail,
      senderName,
      senderEmail,
      senderPhone,
      message,
    });

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      // Still return success since message was stored
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
