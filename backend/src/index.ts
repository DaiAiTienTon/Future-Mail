import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { prisma } from './prisma';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import { startScheduler } from './scheduler';

// Start the scheduler
startScheduler();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Zod schemas
const createEmailSchema = z.object({
  recipient: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  timezone: z.string().min(1, 'Timezone is required'),
}).refine((data) => {
  const scheduledTime = new Date(data.scheduledAt).getTime();
  return scheduledTime > Date.now();
}, {
  message: 'Scheduled time must be in the future',
  path: ['scheduledAt'],
});

// Routes
// 1. GET /api/emails
app.get('/api/emails', async (req, res) => {
  try {
    const emails = await prisma.scheduledEmail.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } });
  }
});

// 2. GET /api/emails/:id
app.get('/api/emails/:id', async (req, res) => {
  try {
    const email = await prisma.scheduledEmail.findUnique({
      where: { id: req.params.id }
    });
    
    if (!email) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Email not found' } });
    }
    
    res.json(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } });
  }
});

// 3. POST /api/emails
app.post('/api/emails', async (req, res) => {
  try {
    const parseResult = createEmailSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid input data', 
          details: parseResult.error.flatten().fieldErrors 
        } 
      });
    }

    const { recipient, subject, content, scheduledAt, timezone } = parseResult.data;

    // Save in UTC
    const utcDate = new Date(scheduledAt);

    const email = await prisma.scheduledEmail.create({
      data: {
        recipient,
        subject,
        content,
        scheduledAt: utcDate,
        timezone,
        status: 'SCHEDULED'
      }
    });

    res.status(201).json(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } });
  }
});

// 4. POST /api/emails/:id/cancel
app.post('/api/emails/:id/cancel', async (req, res) => {
  try {
    const email = await prisma.scheduledEmail.findUnique({
      where: { id: req.params.id }
    });

    if (!email) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Email not found' } });
    }

    if (email.status !== 'SCHEDULED') {
      return res.status(400).json({ 
        error: { 
          code: 'INVALID_STATE_TRANSITION', 
          message: `Cannot cancel email in ${email.status} state. Only SCHEDULED emails can be cancelled.` 
        } 
      });
    }

    const updateResult = await prisma.scheduledEmail.updateMany({
      where: { id: email.id, status: 'SCHEDULED' },
      data: { status: 'CANCELLED' }
    });

    if (updateResult.count === 0) {
      return res.status(400).json({ 
        error: { 
          code: 'INVALID_STATE_TRANSITION', 
          message: 'Cannot cancel email. It may have already been processed.' 
        } 
      });
    }

    const updatedEmail = await prisma.scheduledEmail.findUnique({ where: { id: email.id }});
    res.json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } });
  }
});

// 5. POST /api/ai/chat - AI Assistant for writing letters
const aiChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1, 'Content is required')
  })).min(1, 'Messages cannot be empty')
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const parseResult = aiChatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: parseResult.error.flatten().fieldErrors
        }
      });
    }

    const { messages } = parseResult.data;

    // LLaMA 3.1 Instruct requires conversation to start with 'user' role after system prompt.
    // Filter out initial welcome assistant messages prior to the first user message.
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    const sanitizedMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

    const aiWorkerUrl = process.env.AI_WORKER_URL || 'https://rough-boat-ebb6.tuvkdt2003.workers.dev/';

    // Call Cloudflare worker API
    const response = await fetch(aiWorkerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: sanitizedMessages
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Worker returned HTTP error:', response.status, responseText);
      throw new Error(`AI Worker API error: ${response.statusText}`);
    }

    let replyText = responseText;

    try {
      const json = JSON.parse(responseText);
      
      if (json.success === false) {
        throw new Error(json.error || 'AI Worker returned unsuccessful status');
      }

      if (typeof json.response === 'string') {
        replyText = json.response;
      } else if (json.response && typeof json.response.response === 'string') {
        replyText = json.response.response;
      } else if (json.response && typeof json.response.text === 'string') {
        replyText = json.response.text;
      } else {
        replyText = json.response || json.reply || json.content || json.text || json.message || responseText;
      }
    } catch (e: any) {
      if (e.message && e.message.includes('AI Worker')) {
        throw e;
      }
      // If parsing failed, fallback to plain text
    }

    res.json({ reply: String(replyText).trim() });
  } catch (error: any) {
    console.error('Error in AI Chat endpoint:', error);
    res.status(500).json({
      error: {
        code: 'AI_SERVICE_ERROR',
        message: error.message || 'Khôn thể kết nối với dịch vụ AI công khai.'
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

