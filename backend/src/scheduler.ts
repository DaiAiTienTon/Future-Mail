/**
 * Future Mail — Open Source Project
 * Released under the MIT License.
 * Copyright (c) 2026 DaiAiTienTon
 */

import cron from 'node-cron';
import { prisma } from './prisma';
import { sendEmail } from './services/emailService';

let isRunning = false;

export function startScheduler() {
  console.log('🕒 Scheduler started. Checking for scheduled emails every 30 seconds...');
  
  // Schedule a task to run every 30 seconds
  // The expression '*/30 * * * * *' means every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    // Prevent overlapping executions if one takes longer than 30s
    if (isRunning) {
      console.log('⚠️ Previous scheduler execution is still running. Skipping this cycle.');
      return;
    }

    isRunning = true;
    try {
      await processScheduledEmails();
    } catch (error) {
      console.error('❌ Unexpected error in scheduler loop:', error);
    } finally {
      isRunning = false;
    }
  });
}

export async function processScheduledEmails(emailSender = sendEmail) {
  const now = new Date();

  // Find emails that are due
  const dueEmails = await prisma.scheduledEmail.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: {
        lte: now, // scheduled time is less than or equal to current time (UTC)
      },
    },
    // We can order by scheduledAt to process oldest first
    orderBy: {
      scheduledAt: 'asc',
    },
  });

  if (dueEmails.length > 0) {
    console.log(`🔍 Found ${dueEmails.length} email(s) due for sending.`);
  }

  for (const email of dueEmails) {
    try {
      // 1. Atomically claim the email to prevent duplicate sending (Race Condition protection)
      const claimResult = await prisma.scheduledEmail.updateMany({
        where: {
          id: email.id,
          status: 'SCHEDULED', // Only claim if it is still SCHEDULED
        },
        data: {
          status: 'SENDING',
        },
      });

      if (claimResult.count === 0) {
        // Another worker/process already claimed this email or it was cancelled
        console.log(`⏭️ Email ${email.id} was already claimed or cancelled. Skipping.`);
        continue;
      }

      console.log(`⏳ Claimed email ${email.id}. Sending...`);

      // 2. Send the email using the Email Service
      const sendResult = await emailSender({
        to: email.recipient,
        subject: email.subject,
        content: email.content,
        scheduledAt: email.scheduledAt,
        sentAt: new Date(),
      });

      // 3. Update the database based on the result
      if (sendResult.success) {
        console.log(`✅ Successfully sent email ${email.id}`);
        await prisma.scheduledEmail.update({
          where: { id: email.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
            failedAt: null,
            errorMessage: null,
          },
        });
      } else {
        console.error(`❌ Failed to send email ${email.id}:`, sendResult.error);
        await prisma.scheduledEmail.update({
          where: { id: email.id },
          data: {
            status: 'FAILED',
            failedAt: new Date(),
            errorMessage: sendResult.error || 'Unknown error',
            sentAt: null,
          },
        });
      }
    } catch (err) {
      console.error(`❌ Critical error processing email ${email.id}:`, err);
      // We don't throw here to ensure the loop continues for other emails
    }
  }
}
