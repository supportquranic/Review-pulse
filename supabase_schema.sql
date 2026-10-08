-- =========================================================
-- Google Review Flow MVP - Supabase SQL Schema
-- Run this in your Supabase SQL Editor
-- =========================================================

-- 1. Create Business Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_category TEXT DEFAULT 'General',
  city TEXT DEFAULT '',
  google_review_link TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Review Requests Table
CREATE TABLE IF NOT EXISTS public.review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_name TEXT,
  contact_method TEXT DEFAULT 'whatsapp',
  order_service_name TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'opened', 'completed')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  customer_original_text TEXT,
  customer_improved_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own business profile
CREATE POLICY "Users can manage their own business profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = user_id);

-- Allow public read access to business profile for customer review page
CREATE POLICY "Public can view business name & link for review flow"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow businesses to manage their own review requests
CREATE POLICY "Businesses can manage their own review requests"
  ON public.review_requests
  FOR ALL
  USING (
    business_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Allow public customers to read and update their assigned review request
CREATE POLICY "Public can view and update their review request"
  ON public.review_requests
  FOR SELECT
  USING (true);

CREATE POLICY "Public can submit their review completion"
  ON public.review_requests
  FOR UPDATE
  USING (true);
