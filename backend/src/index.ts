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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
