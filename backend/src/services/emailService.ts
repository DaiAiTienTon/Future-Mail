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
 * Định dạng Date sang định dạng tiếng Việt rõ ràng, trang nhã.
 * Ví dụ: "18 tháng 8, 2026"
 */
function formatDateVi(date: Date): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day} tháng ${month}, ${year}`;
}

/**
 * Tính số ngày email "du hành thời gian".
 */
function calcTravelDays(scheduledAt: Date, sentAt: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round(Math.abs(sentAt.getTime() - scheduledAt.getTime()) / msPerDay));
}

/**
 * Chuyển đổi nội dung văn bản thuần (có ngắt dòng) sang các đoạn thẻ HTML an toàn.
 */
function textToHtml(text: string): string {
  return text
    .split(/\n/)
    .map((line) => {
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return escaped.trim() === '' ? '<br style="margin-bottom:8px;" />' : `<p style="margin:0 0 14px 0;">${escaped}</p>`;
    })
    .join('');
}

/**
 * Xây dựng mẫu HTML Email trang nhã, sáng sủa, đồng bộ tiếng Việt và chuẩn bố cục thẻ card như ảnh mẫu.
 */
function buildEmailHtml(options: SendEmailOptions): string {
  const deliveredAt = options.sentAt ?? new Date();
  const travelDays = calcTravelDays(options.scheduledAt, deliveredAt);
  const scheduledDateStr = formatDateVi(options.scheduledAt);
  const deliveredDateStr = formatDateVi(deliveredAt);
  const contentHtml = textToHtml(options.content);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${options.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding:32px 32px 24px 32px;border-bottom:1px solid #f0f0f0;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="vertical-align:middle;">
                    <span style="font-size:24px;line-height:1;margin-right:8px;color:#ef4444;">✉️</span>
                    <span style="font-size:22px;font-weight:700;color:#e11d48;letter-spacing:-0.3px;vertical-align:middle;">FutureMail</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.4;">Lá thư vượt thời gian từ ngày ${scheduledDateStr} của bạn đã đến nơi</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- EMAIL CONTENT -->
          <tr>
            <td style="padding:36px 32px;font-size:15px;line-height:1.75;color:#1f2937;min-height:100px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- METADATA / PHỤ LỤC -->
          <tr>
            <td style="padding:24px 32px;background-color:#ffffff;border-top:1px solid #f0f0f0;color:#4b5563;font-size:14px;line-height:1.7;">
              <p style="margin:0 0 4px 0;">Lá thư này đã du hành thời gian qua ${travelDays} ngày.</p>
              <p style="margin:0 0 4px 0;">Đã lên lịch vào ngày ${scheduledDateStr}.</p>
              <p style="margin:0;">Được gửi đến vào ngày ${deliveredDateStr}.</p>
            </td>
          </tr>

        </table>

        <!-- FOOTER -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;margin-top:18px;">
          <tr>
            <td align="center" style="font-size:13px;color:#9ca3af;padding:4px;">
              Gửi bởi <a href="https://github.com/DaiAiTienTon/Future-Mail" style="color:#e11d48;text-decoration:none;font-weight:600;">Future Mail</a>
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
 * Gửi email qua dịch vụ đã cấu hình (Nodemailer SMTP hoặc Resend API).
 *
 * @param options - Thông tin email (to, subject, content, scheduledAt, sentAt)
 * @returns Promise chứa SendEmailResult
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

  // 1. Dùng Nodemailer SMTP nếu có SMTP_USER và SMTP_PASS
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
        error: err.message || 'Lỗi khi gửi email qua SMTP',
      };
    }
  }

  // 2. Fallback sang Resend API nếu có cấu hình
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
          error: error.message || 'Lỗi từ Resend API',
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Lỗi không mong muốn khi gửi qua Resend API',
      };
    }
  }

  return {
    success: false,
    error: 'Dịch vụ email chưa được cấu hình (thiếu SMTP_USER/SMTP_PASS hoặc RESEND_API_KEY)',
  };
}
