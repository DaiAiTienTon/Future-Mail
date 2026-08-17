import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  content: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends an email using the configured email service (Nodemailer SMTP or Resend API).
 * 
 * @param options - The email details (to, subject, content)
 * @returns A promise that resolves to a SendEmailResult
 */
export async function sendEmail({ to, subject, content }: SendEmailOptions): Promise<SendEmailResult> {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || smtpUser;

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
