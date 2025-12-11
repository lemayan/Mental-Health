import { NextResponse } from 'next/server';
import { sendApprovalEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerName, providerEmail } = body;

    if (!providerName || !providerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/provider-panel/login`;

    const result = await sendApprovalEmail({
      providerName,
      providerEmail,
      loginEmail: providerEmail,
      dashboardUrl,
    });

    if (!result.success) {
      console.error('Failed to send approval email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Approval email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
