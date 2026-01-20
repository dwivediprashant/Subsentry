const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Subscription {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'custom';
  category: 'entertainment' | 'music' | 'education' | 'productivity' | 'finance' | 'health' | 'other';
  renewalDate: string;
  isTrial: boolean;
  trialEndsAt?: string;
  source: 'manual' | 'gmail' | 'imported';
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  data: Subscription[];
  meta?: {
    monthlySpend?: number;
    yearlySpend?: number;
  };
}

export async function getSubscriptions(token: string): Promise<SubscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  const payload = await response.json();

  if (Array.isArray(payload?.subscriptions)) {
    return {
      data: payload.subscriptions,
      meta: payload.meta ?? {},
    };
  }

  return payload;
}

export async function createSubscription(
  token: string,
  data: Omit<Subscription, '_id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ message: string; subscription: Subscription }> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
}

export async function updateSubscription(
  token: string,
  id: string,
  data: Partial<Omit<Subscription, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string; subscription: Subscription }> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Update subscription error:', error);
    throw new Error('Failed to update subscription');
  }

  return response.json();
}

export async function deleteSubscription(
  token: string,
  id: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Delete subscription error:', error);
    throw new Error('Failed to delete subscription');
  }

  return response.json();
}

// ============================================
// Gmail OAuth API Functions
// ============================================

export interface GmailStatusResponse {
  success: boolean;
  connected: boolean;
  email?: string;
  connectedAt?: string;
  message?: string;
  error?: string;
}

export interface GmailAuthResponse {
  success: boolean;
  authUrl?: string;
  error?: string;
}

/**
 * Get Gmail OAuth authorization URL
 */
export async function getGmailAuthUrl(token: string): Promise<GmailAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/gmail/auth`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Gmail auth URL');
  }

  return response.json();
}

/**
 * Get Gmail connection status
 */
export async function getGmailStatus(token: string): Promise<GmailStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/gmail/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Gmail status');
  }

  return response.json();
}

/**
 * Disconnect Gmail account
 */
export async function disconnectGmail(token: string): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/gmail/disconnect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to disconnect Gmail');
  }

  return response.json();
}

// ============================================
// Gmail Email Import API Functions  
// ============================================

export interface ImportResult {
  serviceName: string;
  saved: boolean;
  reason: string;
}

export interface ImportSubscriptionsResponse {
  success: boolean;
  saved: number;
  skipped: number;
  errors: number;
  total: number;
  results: ImportResult[];
  message?: string;
  error?: string;
}

/**
 * Import subscriptions from Gmail emails
 */
export async function importSubscriptionsFromGmail(
  token: string,
  limit: number = 50
): Promise<ImportSubscriptionsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/gmail/save?limit=${limit}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to import subscriptions');
  }

  return response.json();
}

