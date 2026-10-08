export type ContactMethod = 'whatsapp' | 'sms' | 'email' | 'direct';
export type RequestStatus = 'sent' | 'opened' | 'completed';
export type LanguageOption = 'en' | 'ur' | 'ur-roman';

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string;
  city: string;
  google_review_link: string;
  preferred_language: LanguageOption;
  discount_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewRequest {
  id: string;
  business_id: string;
  customer_name?: string;
  contact_method: ContactMethod;
  order_service_name?: string;
  status: RequestStatus;
  rating?: number;
  customer_original_text?: string;
  customer_improved_text?: string;
  created_at: string;
  updated_at: string;
}

export interface ImproveWordingRequest {
  text: string;
  language: LanguageOption;
  rating?: number;
  businessName?: string;
  category?: string;
}

export interface ImproveWordingResponse {
  originalText: string;
  improvedText: string;
  tone: string;
  improvementsApplied: string[];
}
