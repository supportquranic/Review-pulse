import { BusinessProfile, ReviewRequest } from './types';

const STORAGE_KEYS = {
  PROFILE: 'g_review_business_profile',
  REQUESTS: 'g_review_requests_list',
  CURRENT_USER: 'g_review_current_user',
};

export interface CurrentUser {
  id: string;
  email: string;
  business_name?: string;
}

// Helper to access LocalStorage safely
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage error:', err);
  }
}

// -------------------------------------------------------------
// USER AUTH STATE HELPERS
// -------------------------------------------------------------
export function getCurrentUser(): CurrentUser | null {
  return getLocalItem<CurrentUser | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: CurrentUser | null): void {
  setLocalItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
  }
}

// -------------------------------------------------------------
// BUSINESS PROFILE SERVICES (MongoDB + LocalStorage Fallback)
// -------------------------------------------------------------
export async function getBusinessProfile(userId?: string): Promise<BusinessProfile | null> {
  const activeUserId = userId || getCurrentUser()?.id;

  try {
    const url = activeUserId ? `/api/profile?userId=${encodeURIComponent(activeUserId)}` : '/api/profile';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        setLocalItem(STORAGE_KEYS.PROFILE, data.profile);
        return data.profile as BusinessProfile;
      }
    }
  } catch (e) {
    console.warn('API profile fetch fallback to local:', e);
  }

  // Fallback to local storage
  const local = getLocalItem<BusinessProfile | null>(STORAGE_KEYS.PROFILE, null);
  if (local) return local;

  // Clean empty profile for brand new user
  const cleanProfile: BusinessProfile = {
    id: activeUserId ? `biz_${activeUserId}` : 'biz_default',
    user_id: activeUserId || 'user_default',
    business_name: getCurrentUser()?.business_name || 'My Business',
    business_category: 'Services',
    city: '',
    google_review_link: '',
    preferred_language: 'en',
    discount_percentage: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return cleanProfile;
}

export async function saveBusinessProfile(profile: Partial<BusinessProfile>): Promise<BusinessProfile> {
  const activeUserId = profile.user_id || getCurrentUser()?.id;
  const current = (await getBusinessProfile(activeUserId)) || {
    id: activeUserId ? `biz_${activeUserId}` : 'biz_default',
    user_id: activeUserId || 'user_default',
    business_name: 'My Business',
    business_category: 'Services',
    city: '',
    google_review_link: '',
    preferred_language: 'en',
    discount_percentage: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updated: BusinessProfile = {
    ...current,
    ...profile,
    updated_at: new Date().toISOString(),
  };

  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        setLocalItem(STORAGE_KEYS.PROFILE, data.profile);
        return data.profile as BusinessProfile;
      }
    }
  } catch (e) {
    console.warn('API profile save fallback to local:', e);
  }

  setLocalItem(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

// -------------------------------------------------------------
// REVIEW REQUESTS SERVICES (MongoDB + Clean Zero Slate)
// -------------------------------------------------------------
export async function getReviewRequests(businessId?: string): Promise<ReviewRequest[]> {
  const user = getCurrentUser();
  const activeBizId = businessId || user?.id;

  try {
    const url = activeBizId ? `/api/requests?businessId=${encodeURIComponent(activeBizId)}` : '/api/requests';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.requests)) {
        setLocalItem(STORAGE_KEYS.REQUESTS, data.requests);
        return data.requests as ReviewRequest[];
      }
    }
  } catch (e) {
    console.warn('API requests fetch fallback to local:', e);
  }

  // Local storage fallback (starts empty [] for clean slate)
  const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, []);
  return list;
}

export async function createReviewRequest(
  requestData: Omit<ReviewRequest, 'id' | 'created_at' | 'updated_at'>
): Promise<ReviewRequest> {
  const user = getCurrentUser();
  const activeBizId = requestData.business_id || user?.id || 'biz_default';
  const newId = 'req-' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const newRecord: ReviewRequest = {
    ...requestData,
    business_id: activeBizId,
    id: newId,
    status: 'sent',
    created_at: now,
    updated_at: now,
  };

  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.request) {
        const currentList = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, []);
        setLocalItem(STORAGE_KEYS.REQUESTS, [data.request, ...currentList]);
        return data.request as ReviewRequest;
      }
    }
  } catch (e) {
    console.warn('API create request fallback to local:', e);
  }

  // Fallback to local storage
  const currentList = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, []);
  const updatedList = [newRecord, ...currentList];
  setLocalItem(STORAGE_KEYS.REQUESTS, updatedList);
  return newRecord;
}

export async function getReviewRequestById(id: string): Promise<ReviewRequest | null> {
  try {
    const res = await fetch(`/api/review/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.request) {
        return data.request as ReviewRequest;
      }
    }
  } catch (e) {
    console.warn('API get review request by id fallback:', e);
  }

  const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, []);
  const found = list.find((item) => item.id === id);
  if (found) return found;

  // If not found in list, create a virtual record for instant preview
  const virtualRecord: ReviewRequest = {
    id,
    business_id: 'biz_default',
    customer_name: 'Valued Customer',
    contact_method: 'direct',
    order_service_name: 'Customer Service',
    status: 'opened',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return virtualRecord;
}

export async function updateReviewRequest(
  id: string,
  updates: Partial<ReviewRequest>
): Promise<ReviewRequest | null> {
  const now = new Date().toISOString();

  try {
    const res = await fetch(`/api/review/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.request) {
        const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, []);
        const index = list.findIndex((item) => item.id === id);
        if (index !== -1) {
          list[index] = data.request;
          setLocalItem(STORAGE_KEYS.REQUESTS, list);
        }
        return data.request as ReviewRequest;
      }
    }
  } catch (e) {
    console.warn('API update review request fallback:', e);
  }

  const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, []);
  const index = list.findIndex((item) => item.id === id);

  if (index !== -1) {
    const updated = {
      ...list[index],
      ...updates,
      updated_at: now,
    };
    list[index] = updated;
    setLocalItem(STORAGE_KEYS.REQUESTS, list);
    return updated;
  }

  return null;
}

// -------------------------------------------------------------
// METRICS HELPER (Starts cleanly at 0.0 & 0% for new users)
// -------------------------------------------------------------
export async function getDashboardMetrics(businessId?: string) {
  const requests = await getReviewRequests(businessId);
  const total = requests.length;
  const opened = requests.filter((r) => r.status === 'opened' || r.status === 'completed').length;
  const completed = requests.filter((r) => r.status === 'completed').length;

  const completedReviews = requests.filter((r) => r.rating && r.rating > 0);
  const avgRating =
    completedReviews.length > 0
      ? (completedReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / completedReviews.length).toFixed(1)
      : '0.0';

  const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    totalRequests: total,
    openedRequests: opened,
    completedReviews: completed,
    avgRating,
    conversionRate,
    recentRequests: requests.slice(0, 6),
  };
}
