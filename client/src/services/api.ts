import { ServiceItem, TriageResponse } from '../types/support';

const API_BASE = '/api';

/**
 * Sends student's natural language concern to Express backend for triage
 */
export async function triageMessage(message: string): Promise<TriageResponse> {
  const response = await fetch(`${API_BASE}/triage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const err = new Error(errorData?.error || 'Failed to process triage request');
    (err as any).status = response.status;
    (err as any).detail = errorData?.detail;
    throw err;
  }

  const data: TriageResponse = await response.json();
  return data;
}

/**
 * Fetches the full directory of 12 example services (for directory modal/drawer)
 */
export async function fetchServices(): Promise<ServiceItem[]> {
  const response = await fetch(`${API_BASE}/services`);
  if (!response.ok) {
    throw new Error('Failed to load services directory');
  }
  const data = await response.json();
  return data.services || [];
}
