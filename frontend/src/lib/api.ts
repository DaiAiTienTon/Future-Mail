const API_BASE = '/api';

export interface ScheduledEmail {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  scheduledAt: string;
  timezone: string;
  status: 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED';
  sentAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailPayload {
  recipient: string;
  subject: string;
  content: string;
  scheduledAt: string;
  timezone: string;
}

export async function fetchEmails(): Promise<ScheduledEmail[]> {
  const res = await fetch(`${API_BASE}/emails`);
  if (!res.ok) throw new Error('Failed to fetch emails');
  return res.json();
}

export async function fetchEmail(id: string): Promise<ScheduledEmail> {
  const res = await fetch(`${API_BASE}/emails/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Email not found');
    throw new Error('Failed to fetch email');
  }
  return res.json();
}

export async function createEmail(data: CreateEmailPayload): Promise<ScheduledEmail> {
  const res = await fetch(`${API_BASE}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to create email');
  }
  return res.json();
}

export async function cancelEmail(id: string): Promise<ScheduledEmail> {
  const res = await fetch(`${API_BASE}/emails/${id}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to cancel email');
  }
  return res.json();
}
