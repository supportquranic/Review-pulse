import { supabase, isSupabaseConfigured } from './supabase';
import { BusinessProfile, ReviewRequest } from './types';

const STORAGE_KEYS = {
  PROFILE: 'g_review_business_profile',
  REQUESTS: 'g_review_requests_list',
  CURRENT_USER: 'g_review_current_user',
};

// Default seed business for instant live testing
const DEFAULT_PROFILE: BusinessProfile = {
  id: 'biz-default-01',
  user_id: 'user-default-01',
  business_name: 'Apex Dental Care & Implant Clinic',
  business_category: 'Healthcare & Dental',
  city: 'New York / Lahore',
  google_review_link: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  preferred_language: 'en',
  discount_percentage: 10,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_REQUESTS: ReviewRequest[] = [
  {
    id: 'req-101',
    business_id: 'biz-default-01',
    customer_name: 'Sarah Johnson',
    contact_method: 'whatsapp',
    order_service_name: 'Teeth Whitening & Cleaning',
    status: 'completed',
    rating: 5,
    customer_original_text: 'doctor was very gentle and friendly clinic is clean and on time',
    customer_improved_text: 'The doctor was extremely gentle and professional throughout the procedure. The clinic was immaculately clean and everything ran right on schedule. Highly recommended!',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 47).toISOString(),
  },
  {
    id: 'req-102',
    business_id: 'biz-default-01',
    customer_name: 'Ali Raza',
    contact_method: 'sms',
    order_service_name: 'Root Canal Treatment',
    status: 'completed',
    rating: 5,
    customer_original_text: 'bohat zabardast experience tha dard bilkul nahi hua',
    customer_improved_text: 'Bohat zabardast aur comfortable experience raha. Doctor ne bohat ehtiyat se treatment kiya aur pain bilkul mehsoos nahi hua. Bohat shukriya!',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 23).toISOString(),
  },
  {
    id: 'req-103',
    business_id: 'biz-default-01',
    customer_name: 'Michael Davis',
    contact_method: 'whatsapp',
    order_service_name: 'Dental Checkup',
    status: 'opened',
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'req-104',
    business_id: 'biz-default-01',
    customer_name: 'Farhan Tariq',
    contact_method: 'direct',
    order_service_name: 'Braces Consultation',
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
];

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
// BUSINESS PROFILE SERVICES
// -------------------------------------------------------------
export async function getBusinessProfile(userId?: string): Promise<BusinessProfile | null> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('profiles').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.limit(1).maybeSingle();
      if (error) {
        console.warn('Supabase profile fetch error, fallback to local:', error.message);
      } else if (data) {
        return data as BusinessProfile;
      }
    } catch (e) {
      console.warn('Supabase fetch exception:', e);
    }
  }

  // Fallback to local storage
  const local = getLocalItem<BusinessProfile | null>(STORAGE_KEYS.PROFILE, null);
  if (local) return local;

  // Initialize with default
  setLocalItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

export async function saveBusinessProfile(profile: Partial<BusinessProfile>): Promise<BusinessProfile> {
  const current = (await getBusinessProfile(profile.user_id)) || DEFAULT_PROFILE;
  const updated: BusinessProfile = {
    ...current,
    ...profile,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updated)
        .select()
        .single();

      if (!error && data) {
        setLocalItem(STORAGE_KEYS.PROFILE, data);
        return data as BusinessProfile;
      }
      console.warn('Supabase upsert profile warning:', error?.message);
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }

  setLocalItem(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

// -------------------------------------------------------------
// REVIEW REQUESTS SERVICES
// -------------------------------------------------------------
export async function getReviewRequests(businessId?: string): Promise<ReviewRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('review_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as ReviewRequest[];
      }
    } catch (e) {
      console.warn('Supabase get requests error:', e);
    }
  }

  // Local storage fallback
  const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
  return list;
}

export async function createReviewRequest(
  requestData: Omit<ReviewRequest, 'id' | 'created_at' | 'updated_at'>
): Promise<ReviewRequest> {
  const newId = 'req-' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const newRecord: ReviewRequest = {
    ...requestData,
    id: newId,
    status: 'sent',
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('review_requests')
        .insert(newRecord)
        .select()
        .single();

      if (!error && data) {
        const currentList = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
        setLocalItem(STORAGE_KEYS.REQUESTS, [data, ...currentList]);
        return data as ReviewRequest;
      }
      console.warn('Supabase insert request warning:', error?.message);
    } catch (e) {
      console.warn('Supabase create request error:', e);
    }
  }

  // Fallback to local storage
  const currentList = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
  const updatedList = [newRecord, ...currentList];
  setLocalItem(STORAGE_KEYS.REQUESTS, updatedList);
  return newRecord;
}

export async function getReviewRequestById(id: string): Promise<ReviewRequest | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('review_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return data as ReviewRequest;
      }
    } catch (e) {
      console.warn('Supabase get by id error:', e);
    }
  }

  const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
  const found = list.find((item) => item.id === id);
  if (found) return found;

  // If not found in default list, create a virtual record for instant preview
  const virtualRecord: ReviewRequest = {
    id,
    business_id: 'biz-default-01',
    customer_name: 'Valued Customer',
    contact_method: 'direct',
    order_service_name: 'Customer Visit',
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

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('review_requests')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as ReviewRequest;
      }
    } catch (e) {
      console.warn('Supabase update request error:', e);
    }
  }

  const list = getLocalItem<ReviewRequest[]>(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
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
// METRICS HELPER
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
      : '5.0';

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
