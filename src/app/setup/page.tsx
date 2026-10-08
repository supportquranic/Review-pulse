'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Globe, Sparkles, ArrowRight, CheckCircle2, Link2 } from 'lucide-react';
import { GoogleLogo } from '@/components/GoogleLogo';
import { LanguageOption } from '@/lib/types';
import { saveBusinessProfile, getBusinessProfile } from '@/lib/data-service';

export default function BusinessSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Healthcare & Dental');
  const [city, setCity] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageOption>('en');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  useEffect(() => {
    async function loadCurrent() {
      const current = await getBusinessProfile();
      if (current) {
        setBusinessName(current.business_name || '');
        setBusinessCategory(current.business_category || 'Healthcare & Dental');
        setCity(current.city || '');
        setGoogleReviewLink(current.google_review_link || '');
        setPreferredLanguage(current.preferred_language || 'en');
        setDiscountPercentage(current.discount_percentage ?? 0);
      }
    }
    loadCurrent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !googleReviewLink) {
      alert('Please fill in both Business Name and Google Review Link');
      return;
    }

    setLoading(true);
    try {
      await saveBusinessProfile({
        business_name: businessName,
        business_category: businessCategory,
        city,
        google_review_link: googleReviewLink,
        preferred_language: preferredLanguage,
        discount_percentage: Number(discountPercentage) || 0,
      });
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#e1e3e1] shadow-lg p-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex flex-col mb-6 pb-6 border-b border-[#f0f4f9]">
          <div className="mb-2">
            <span className="font-extrabold text-2xl tracking-tight text-[#1f1f1f]">
              Review<span className="text-[#0b57d0]">Pulse</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#1f1f1f]">Set Up Your Business Profile</h1>
          <p className="text-xs text-[#747775]">
            Configure your business details to start collecting genuine customer Google reviews
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1.5">
              <Building2 size={14} className="text-[#0b57d0]" />
              <span>Business Name *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Dental Care & Implant Clinic"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>

          {/* Business Category */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#0b57d0]" />
              <span>Business Category</span>
            </label>
            <select
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            >
              <option value="Healthcare & Dental">Healthcare & Dental</option>
              <option value="Restaurant & Cafe">Restaurant & Cafe</option>
              <option value="Salon & Spa">Salon & Spa</option>
              <option value="Automotive & Repair">Automotive & Repair</option>
              <option value="Real Estate & Property">Real Estate & Property</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Retail & Boutique">Retail & Boutique</option>
              <option value="General Local Business">General Local Business</option>
            </select>
          </div>

          {/* City / Location */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#0b57d0]" />
              <span>City / Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. New York, NY / Lahore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>

          {/* Google Review Link */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1.5">
              <Link2 size={14} className="text-[#0b57d0]" />
              <span>Google Review Direct Link *</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://search.google.com/local/writereview?placeid=..."
              value={googleReviewLink}
              onChange={(e) => setGoogleReviewLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
            <p className="text-[11px] text-[#747775] mt-1">
              Find this in your Google Business Profile &gt; &quot;Ask for reviews&quot; link.
            </p>
          </div>

          {/* Review Reward / % Discount Offer */}
          <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e1e3e1] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1f1f1f] flex items-center gap-1.5">
                <span>🎁</span>
                <span>Review Reward / % Discount</span>
              </label>
              {discountPercentage > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">
                  {discountPercentage}% OFF Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#747775]">
              Offer customers a discount on their next order for reviewing you. Set to <strong className="text-[#1f1f1f]">0%</strong> for standard invites without discount text.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[0, 5, 10, 15, 20].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDiscountPercentage(preset)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    discountPercentage === preset
                      ? 'bg-[#0b57d0] text-white border-[#0b57d0]'
                      : 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                  }`}
                >
                  {preset === 0 ? '0% (None)' : `${preset}% OFF`}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1.5">
              <Globe size={14} className="text-[#0b57d0]" />
              <span>Default Customer Language</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en', label: 'English' },
                { id: 'ur-roman', label: 'Roman Urdu' },
                { id: 'ur', label: 'اردو (Urdu)' },
              ].map((lang) => {
                const isSelected = preferredLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setPreferredLanguage(lang.id as LanguageOption)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0] font-semibold'
                        : 'border-[#dadce0] bg-white text-[#444746] hover:bg-[#f8fafd]'
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f0f4f9]">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Saving Profile...' : 'Save & Open Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
