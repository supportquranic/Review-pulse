'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { CreateRequestModal } from '@/components/CreateRequestModal';
import { BusinessProfile, LanguageOption } from '@/lib/types';
import { getBusinessProfile, saveBusinessProfile } from '@/lib/data-service';
import { GoogleLogo } from '@/components/GoogleLogo';
import {
  Building2,
  MapPin,
  Globe,
  Link2,
  Sparkles,
  Save,
  Check,
  ExternalLink,
  Database,
  Info,
} from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [city, setCity] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageOption>('en');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBusinessProfile();
        if (data) {
          setProfile(data);
          setBusinessName(data.business_name || '');
          setBusinessCategory(data.business_category || 'Healthcare & Dental');
          setCity(data.city || '');
          setGoogleReviewLink(data.google_review_link || '');
          setPreferredLanguage(data.preferred_language || 'en');
          setDiscountPercentage(data.discount_percentage ?? 0);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await saveBusinessProfile({
        id: profile?.id,
        business_name: businessName,
        business_category: businessCategory,
        city,
        google_review_link: googleReviewLink,
        preferred_language: preferredLanguage,
        discount_percentage: Number(discountPercentage) || 0,
      });
      setProfile(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sampleInviteMessage =
    discountPercentage > 0
      ? `Hi Sarah, thank you for visiting ${businessName || 'our business'}! 🌟 Write a review on Google with this link: https://reviewpulse.app/review/sample and get ${discountPercentage}% OFF on your next order/visit!`
      : `Hi Sarah, thank you for visiting ${businessName || 'our business'}! 🌟 Please share your experience and write a quick review on Google: https://reviewpulse.app/review/sample`;

  return (
    <div className="min-h-screen bg-[#f8fafd] flex">
      <Sidebar profile={profile} onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#e1e3e1] px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-[#1f1f1f]">Business Settings</h1>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333] flex items-center gap-2 text-xs font-semibold animate-in fade-in">
              <Check size={16} />
              <span>Business settings saved successfully!</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-[#e1e3e1] shadow-2xs p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1f1f1f] mb-1">
                  Business Details
                </h2>
                <p className="text-xs text-[#747775]">
                  These details are displayed to customers on their review page and in invite messages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1.5">
                    <Building2 size={14} className="text-[#0b57d0]" />
                    <span>Business Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
                  />
                </div>

                {/* Category */}
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
              </div>

              {/* City */}
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#444746] flex items-center gap-1.5">
                    <Link2 size={14} className="text-[#0b57d0]" />
                    <span>Google Review Direct URL</span>
                  </label>
                  {googleReviewLink && (
                    <a
                      href={googleReviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#0b57d0] hover:underline flex items-center gap-1"
                    >
                      <span>Test Link</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  value={googleReviewLink}
                  onChange={(e) => setGoogleReviewLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
                />
                <p className="text-[11px] text-[#747775] mt-1">
                  Customers will be redirected here after polishing their genuine review text.
                </p>
              </div>

              {/* Review Reward Discount Incentive (0% = No discount, >0% = With % Off) */}
              <div className="pt-2 border-t border-[#f0f4f9] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#1f1f1f] mb-0.5 flex items-center gap-1.5">
                      <span className="text-base">🎁</span>
                      <span>Review Reward / % Discount Offer</span>
                    </label>
                    <p className="text-[11px] text-[#747775]">
                      Offer a discount percentage on their next visit/order when customers write a Google review. Set to <strong className="text-[#1f1f1f]">0%</strong> for standard review invites without discount text.
                    </p>
                  </div>
                  {discountPercentage > 0 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                      {discountPercentage}% OFF Active
                    </span>
                  )}
                </div>

                {/* Preset Pills + Custom Input */}
                <div className="flex flex-wrap items-center gap-2">
                  {[0, 5, 10, 15, 20, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDiscountPercentage(preset)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        discountPercentage === preset
                          ? 'bg-[#0b57d0] text-white border-[#0b57d0] shadow-2xs'
                          : 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                      }`}
                    >
                      {preset === 0 ? '0% (No Discount)' : `${preset}% OFF`}
                    </button>
                  ))}

                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-xs font-semibold text-[#747775]">Custom:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                      className="w-20 px-3 py-1.5 rounded-xl border border-[#dadce0] bg-white text-xs text-center font-bold text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0]"
                    />
                    <span className="text-xs font-bold text-[#444746]">%</span>
                  </div>
                </div>

                {/* Live Message Preview Box */}
                <div className="p-3.5 rounded-2xl bg-[#f8fafd] border border-[#e1e3e1] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#747775] uppercase tracking-wider">
                      Live Customer Invite Message Preview
                    </span>
                    <span className="text-[10px] font-semibold text-[#0b57d0]">WhatsApp & SMS</span>
                  </div>
                  <p className="text-xs text-[#1f1f1f] bg-white p-3 rounded-xl border border-[#dadce0] leading-relaxed">
                    {sampleInviteMessage}
                  </p>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#444746] mb-2 flex items-center gap-1.5">
                  <Globe size={14} className="text-[#0b57d0]" />
                  <span>Default Customer Language</span>
                </label>
                <div className="grid grid-cols-3 gap-2 max-w-md">
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

              {/* Submit */}
              <div className="pt-4 border-t border-[#f0f4f9] flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Database Integration Info Card */}
          <div className="bg-white rounded-3xl border border-[#e1e3e1] p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-[#0b57d0]" />
                <h3 className="font-bold text-xs text-[#1f1f1f]">
                  MongoDB Database Status
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">
                Ready & Configured
              </span>
            </div>

            <p className="text-xs text-[#747775] leading-relaxed">
              ReviewPulse is powered by MongoDB for fast document storage. To connect your remote cluster, add <code className="bg-[#f0f4f9] px-1.5 py-0.5 rounded text-[#0b57d0] font-mono text-[11px]">MONGODB_URI</code> to your <code className="bg-[#f0f4f9] px-1.5 py-0.5 rounded text-[#1f1f1f] font-mono text-[11px]">.env.local</code> file or Vercel environment variables.
            </p>
          </div>
        </div>
      </main>

      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {}}
        profile={profile}
      />
    </div>
  );
}
