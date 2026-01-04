/**
 * Email Service
 * Simple email sending functionality using Resend API
 * 
 * To enable email sending:
 * 1. Sign up at https://resend.com (free tier: 100 emails/day)
 * 2. Create an API key
 * 3. Add VITE_RESEND_API_KEY to your .env file
 * 4. Verify your domain or use the onboarding@resend.dev sender
 */

import { logger } from '../utils';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.VITE_EMAIL_FROM || 'HelloData <onboarding@resend.dev>';
const APP_NAME = 'HelloData Content Builder';
const APP_URL = import.meta.env.VITE_APP_URL || 'https://your-app.vercel.app';

/**
 * Check if email service is configured
 * @returns {boolean}
 */
export function isEmailConfigured() {
  return !!RESEND_API_KEY;
}

/**
 * Send an email using Resend API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text content (fallback)
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!isEmailConfigured()) {
    logger.warn('Email not configured. Set VITE_RESEND_API_KEY to enable email sending.');
    return { success: false, error: new Error('Email service not configured') };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text: text || subject,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();
    logger.log('Email sent successfully:', data.id);
    return { success: true, error: null, id: data.id };
  } catch (error) {
    logger.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send a team invite email
 * @param {Object} options - Invite options
 * @param {string} options.to - Recipient email
 * @param {string} options.inviterName - Name of the person sending invite
 * @param {string} options.role - Role being offered (viewer/editor/admin)
 * @param {string} options.inviteId - Unique invite ID for tracking
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function sendTeamInviteEmail({ to, inviterName, role, inviteId }) {
  const inviteUrl = `${APP_URL}/invite/${inviteId}`;
  
  const subject = `${inviterName} invited you to join their team on ${APP_NAME}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 40px 20px; margin: 0;">
      <div style="max-width: 480px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(100, 102, 233, 0.3);">
        
        <!-- Logo/Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #6466e9 0%, #8b5cf6 100%); padding: 12px 24px; border-radius: 8px;">
            <span style="font-size: 20px; font-weight: 700; color: white;">${APP_NAME}</span>
          </div>
        </div>
        
        <!-- Main Content -->
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center; color: #ffffff;">
          You're Invited! 🎉
        </h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #a0a0b0; margin: 0 0 24px 0; text-align: center;">
          <strong style="color: #ffffff;">${inviterName}</strong> has invited you to join their team as a <strong style="color: #8b5cf6;">${role}</strong>.
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #6466e9 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Accept Invitation
          </a>
        </div>
        
        <!-- Role Description -->
        <div style="background: rgba(100, 102, 233, 0.1); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="font-size: 14px; color: #a0a0b0; margin: 0;">
            <strong style="color: #ffffff;">As a ${role}, you'll be able to:</strong><br>
            ${getRoleDescription(role)}
          </p>
        </div>
        
        <!-- Expiry Notice -->
        <p style="font-size: 13px; color: #666; text-align: center; margin: 24px 0 0 0;">
          This invitation expires in 7 days.
        </p>
        
        <!-- Footer -->
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px; padding-top: 24px; text-align: center;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
${inviterName} invited you to join their team on ${APP_NAME}!

You've been invited as a ${role}.

Accept your invitation: ${inviteUrl}

This invitation expires in 7 days.
  `.trim();
  
  return sendEmail({ to, subject, html, text });
}

/**
 * Get role description for email
 * @param {string} role
 * @returns {string}
 */
function getRoleDescription(role) {
  const descriptions = {
    viewer: 'View projects and designs shared with the team',
    editor: 'View and edit projects, create new designs',
    admin: 'Full access including team management and settings',
  };
  return descriptions[role] || descriptions.viewer;
}

export default {
  isEmailConfigured,
  sendEmail,
  sendTeamInviteEmail,
};

