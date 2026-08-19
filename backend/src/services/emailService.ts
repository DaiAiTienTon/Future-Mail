/**
 * Future Mail — Open Source Project
 * Released under the MIT License.
 * Copyright (c) 2026 DaiAiTienTon
 */

import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  content: string;
  scheduledAt: Date;
  sentAt?: Date;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Formats a Date object to a human-readable string.
 * Example: "August 18, 2026"
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculates the number of days the email "travelled through time".
 * Returns the difference in whole days between scheduledAt and sentAt.
 */
function calcTravelDays(scheduledAt: Date, sentAt: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(Math.abs(sentAt.getTime() - scheduledAt.getTime()) / msPerDay);
}

/**
 * Converts plain text content (with newlines) to safe HTML paragraphs.
 */
function textToHtml(text: string): string {
  return text
    .split(/\n/)
    .map((line) => {
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return escaped.trim() === '' ? '<br>' : `<p style="margin:0 0 12px 0;">${escaped}</p>`;
    })
    .join('');
}

/**
 * Builds a beautiful HTML email for Future Mail.
 */
function buildEmailHtml(options: SendEmailOptions): string {
  const deliveredAt = options.sentAt ?? new Date();
  const travelDays = calcTravelDays(options.scheduledAt, deliveredAt);
  const scheduledDateStr = formatDate(options.scheduledAt);
  const deliveredDateStr = formatDate(deliveredAt);
  const contentHtml = textToHtml(options.content);

  const travelText =
    travelDays === 0
      ? 'This email was delivered on the same day it was scheduled.'
      : `This email was travelling through time for ${travelDays} day${travelDays !== 1 ? 's' : ''}.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${options.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:36px 48px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="font-size:28px;">✉️</span>
                <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Future Mail</span>
              </div>
              <p style="margin:10px 0 0 0;font-size:13px;color:#94a3b8;letter-spacing:0.5px;">Your time capsule has arrived</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:40px 48px 32px 48px;">
              <div style="font-size:15px;line-height:1.75;color:#374151;">
                ${contentHtml}
              </div>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 48px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- METADATA / APPENDIX -->
          <tr>
            <td style="padding:24px 48px 32px 48px;background-color:#f9fafb;border-bottom-left-radius:12px;border-bottom-right-radius:12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:8px;">
                    <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Time Capsule Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:6px;">
                    <span style="font-size:14px;color:#6b7280;">⏳&nbsp; ${travelText}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:6px;">
                    <span style="font-size:14px;color:#6b7280;">📅&nbsp; Scheduled on ${scheduledDateStr}.</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size:14px;color:#6b7280;">📬&nbsp; Delivered on ${deliveredDateStr}.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 48px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent by <a href="https://github.com/DaiAiTienTon/Future-Mail" style="color:#6366f1;text-decoration:none;font-weight:600;">Future Mail</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Sends an email using the configured email service (Nodemailer SMTP or Resend API).
 *
 * @param options - The email details (to, subject, content, scheduledAt, sentAt)
 * @returns A promise that resolves to a SendEmailResult
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, content } = options;
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || smtpUser;

  const html = buildEmailHtml(options);

  // 1. Use Nodemailer SMTP if SMTP_USER and SMTP_PASS are configured
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Future Mail'}" <${emailFrom}>`,
        to: to,
        subject: subject,
        text: content,
        html: html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Error sending email via SMTP',
      };
    }
  }

  // 2. Fallback to Resend API if configured
  if (apiKey && emailFrom) {
    const resend = new Resend(apiKey);

    try {
      const { data, error } = await resend.emails.send({
        from: emailFrom,
        to: [to],
        subject: subject,
        text: content,
        html: html,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Unknown error from Resend API',
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Unexpected error while sending email via Resend',
      };
    }
  }

  return {
    success: false,
    error: 'Email service is not configured (missing SMTP_USER/SMTP_PASS or RESEND_API_KEY)',
  };
}
