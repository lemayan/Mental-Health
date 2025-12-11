import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailParams {
  providerName: string;
  providerEmail: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}

interface ApprovalEmailParams {
  providerName: string;
  providerEmail: string;
  loginEmail: string;
  dashboardUrl: string;
}

export async function sendContactEmail({
  providerName,
  providerEmail,
  senderName,
  senderEmail,
  senderPhone,
  message,
}: ContactEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Baltimore MHN <noreply@baltimoremhn.org>',
      to: providerEmail,
      replyTo: senderEmail,
      subject: `New message from ${senderName} - Baltimore Mental Health Navigator`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0066CC; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
              .message-box { background: white; padding: 20px; border-left: 4px solid #0066CC; margin: 20px 0; }
              .contact-info { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .button { display: inline-block; background: #0066CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Message from Baltimore Mental Health Navigator</h1>
              </div>
              <div class="content">
                <p>Hi ${providerName},</p>
                <p>You have received a new message from someone looking for mental health support:</p>
                
                <div class="contact-info">
                  <strong>From:</strong> ${senderName}<br>
                  <strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a><br>
                  ${senderPhone ? `<strong>Phone:</strong> ${senderPhone}<br>` : ''}
                </div>

                <div class="message-box">
                  <strong>Message:</strong><br>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>

                <p>Please respond to this potential client at your earliest convenience.</p>
                
                <a href="mailto:${senderEmail}" class="button">Reply to ${senderName}</a>
              </div>
              <div class="footer">
                <p>This message was sent through Baltimore Mental Health Navigator</p>
                <p>If you have questions, contact us at support@baltimoremhn.org</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export async function sendApprovalEmail({
  providerName,
  providerEmail,
  loginEmail,
  dashboardUrl,
}: ApprovalEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Baltimore MHN <noreply@baltimoremhn.org>',
      to: providerEmail,
      subject: '🎉 Your profile has been approved - Baltimore Mental Health Navigator',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
              .success-badge { background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
              .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #10B981; }
              .button { display: inline-block; background: #0066CC; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              ul { padding-left: 20px; }
              li { margin: 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Congratulations!</h1>
                <div class="success-badge">Profile Approved</div>
              </div>
              <div class="content">
                <p>Hi ${providerName},</p>
                <p>Great news! Your provider profile on Baltimore Mental Health Navigator has been approved and is now live.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0;">What's Next?</h3>
                  <ul>
                    <li>Your profile is now visible to people searching for mental health support in Baltimore</li>
                    <li>You'll receive email notifications when someone contacts you through the platform</li>
                    <li>You can track engagement through your provider dashboard</li>
                    <li>You can edit your profile anytime</li>
                  </ul>
                </div>

                <h3>Login Information:</h3>
                <div class="info-box">
                  <strong>Login Email:</strong> ${loginEmail}<br>
                  <strong>Dashboard:</strong> <a href="${dashboardUrl}">${dashboardUrl}</a>
                </div>

                <p style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
                </p>

                <p>Thank you for joining Baltimore Mental Health Navigator. Together, we're making mental health support more accessible.</p>
              </div>
              <div class="footer">
                <p>Baltimore Mental Health Navigator</p>
                <p>Questions? Email us at support@baltimoremhn.org</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export async function sendReviewNotificationEmail({
  providerName,
  providerEmail,
  reviewerName,
  rating,
  reviewText,
}: {
  providerName: string;
  providerEmail: string;
  reviewerName: string;
  rating: number;
  reviewText?: string;
}) {
  try {
    const stars = '⭐'.repeat(rating);
    
    const { data, error } = await resend.emails.send({
      from: 'Baltimore MHN <noreply@baltimoremhn.org>',
      to: providerEmail,
      subject: `New ${rating}-star review from ${reviewerName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0066CC; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
              .review-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .stars { font-size: 24px; margin: 10px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Review Received!</h1>
              </div>
              <div class="content">
                <p>Hi ${providerName},</p>
                <p>You've received a new review on your Baltimore Mental Health Navigator profile:</p>
                
                <div class="review-box">
                  <div class="stars">${stars}</div>
                  <strong>From:</strong> ${reviewerName}<br>
                  ${reviewText ? `<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">${reviewText}</p>` : ''}
                </div>

                <p>Thank you for providing quality mental health services to the Baltimore community!</p>
              </div>
              <div class="footer">
                <p>Baltimore Mental Health Navigator</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
