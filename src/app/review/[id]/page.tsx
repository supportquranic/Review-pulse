'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, Sparkles, Check, ArrowRight, ExternalLink, RefreshCw, AlertCircle, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleLogo, GoogleGReviewBadge } from '@/components/GoogleLogo';
import { LanguageOption, ReviewRequest, BusinessProfile } from '@/lib/types';
import { getReviewRequestById, updateReviewRequest, getBusinessProfile } from '@/lib/data-service';

export default function CustomerReviewPage() {
  const urlParams = useParams();
  const requestId = Array.isArray(urlParams?.id) ? urlParams.id[0] : (urlParams?.id as string) || 'req-101';

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<ReviewRequest | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<LanguageOption>('en');

  // Improvement state
  const [improving, setImproving] = useState(false);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [improvementApplied, setImprovementApplied] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [reqData, bizData] = await Promise.all([
          getReviewRequestById(requestId),
          getBusinessProfile(),
        ]);

        if (reqData) {
          setRequest(reqData);
          if (reqData.rating) setRating(reqData.rating);
          if (reqData.customer_original_text) setReviewText(reqData.customer_original_text);
          if (reqData.customer_improved_text) setImprovedText(reqData.customer_improved_text);

          // Mark as opened if sent
          if (reqData.status === 'sent') {
            await updateReviewRequest(requestId, { status: 'opened' });
          }
        }
        if (bizData) {
          setBusiness(bizData);
          if (bizData.preferred_language) {
            setSelectedLang(bizData.preferred_language);
          }
        }
      } catch (err) {
        console.error('Error loading review request:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [requestId]);

  const handleImproveWording = async () => {
    if (!reviewText.trim()) {
      setErrorNotice('Please write a few words about your experience first.');
      setTimeout(() => setErrorNotice(null), 3000);
      return;
    }

    setImproving(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/improve-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reviewText,
          language: selectedLang,
          rating: rating,
          category: business?.business_category || 'Business',
          businessName: business?.business_name || '',
        }),
      });

      const data = await res.json();
      if (res.ok && data.improvedText) {
        setImprovedText(data.improvedText);
        setImprovementApplied(true);
      } else {
        setErrorNotice(data.error || 'Could not polish text right now.');
      }
    } catch (err) {
      console.error('Improve wording error:', err);
      setErrorNotice('Connection error. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  const handleContinueToGoogle = async () => {
    const finalText = (improvementApplied && improvedText ? improvedText : reviewText).trim();

    // 1. Copy text to clipboard
    if (finalText) {
      try {
        await navigator.clipboard.writeText(finalText);
        setToastMessage('Review copied to clipboard! Paste it on Google Reviews.');
      } catch {
        const temp = document.createElement('textarea');
        temp.value = finalText;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        setToastMessage('Review copied! Paste it on Google Reviews.');
      }
    }

    // 2. Trigger Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
      });
    } catch {
      // ignore
    }

    // 3. Mark request as completed in DB
    await updateReviewRequest(requestId, {
      status: 'completed',
      rating,
      customer_original_text: reviewText,
      customer_improved_text: improvedText || undefined,
    });

    setIsCompleted(true);

    // 4. Redirect / open Google Review link
    const googleLink =
      business?.google_review_link ||
      'https://search.google.com/local/writereview';

    setTimeout(() => {
      window.open(googleLink, '_blank', 'noopener,noreferrer');
    }, 1200);
  };

  const ratingDescriptions: { [key: number]: string } = {
    1: 'Disappointing',
    2: 'Could be better',
    3: 'Average / Decent',
    4: 'Great experience',
    5: 'Exceptional! ⭐',
  };

  const placeholderByLang: { [key in LanguageOption]: string } = {
    en: 'Write about the service, staff, or what stood out to you...',
    ur: 'اپنے تجربے، سروس اور عملے کے بارے میں چند جملے لکھیں...',
    'ur-roman': 'Service kaisi rahi, staff ka rawaiya kaisa tha, apne alfaz me likhein...',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#0b57d0]/20 border-t-[#0b57d0] animate-spin" />
          <p className="text-xs font-medium text-[#444746]">Loading review request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1f1f1f] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-[#34a853]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Mobile Screen Container (360-430px optimal target) */}
      <main className="w-full max-w-md mx-auto px-4 py-6 flex-1 flex flex-col justify-start">
        {/* Top Header: Business identity */}
        <header className="flex flex-col items-center text-center mb-5">
          <span className="text-xs font-bold text-[#0b57d0] tracking-wider uppercase mb-1">
            Official Review Request
          </span>
          <h1 className="text-2xl font-extrabold text-[#1f1f1f] tracking-tight leading-snug">
            {business?.business_name || 'Business Review'}
          </h1>

          {request?.order_service_name && (
            <span className="inline-block mt-1.5 text-xs px-3 py-1 rounded-full bg-[#e8f0fe] text-[#0b57d0] font-semibold">
              {request.order_service_name}
            </span>
          )}
        </header>

        {/* Conditional Review Reward Discount Banner (Only shown if discount_percentage > 0) */}
        {business?.discount_percentage && business.discount_percentage > 0 ? (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333] flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-white text-[#137333] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              🎁
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">
                Get {business.discount_percentage}% OFF On Your Next Visit!
              </p>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                Share your quick Google review below to unlock your special discount.
              </p>
            </div>
          </div>
        ) : null}

        {isCompleted ? (
          /* Thank You & Redirect State */
          <div className="bg-white rounded-3xl p-6 border border-[#e1e3e1] shadow-xs text-center space-y-4 my-auto animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#137333] mx-auto flex items-center justify-center">
              <Check size={24} />
            </div>
            <h2 className="text-lg font-bold text-[#1f1f1f]">Thank you for your review!</h2>
            <p className="text-xs text-[#444746] leading-relaxed">
              Your genuine review text has been copied to your clipboard. If Google Reviews didn&apos;t open automatically, click the button below:
            </p>

            {/* If discount > 0, show unlocked reward coupon */}
            {business?.discount_percentage && business.discount_percentage > 0 ? (
              <div className="p-4 rounded-2xl bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-center space-y-1 my-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Your Special Reward</span>
                <p className="text-xl font-black text-[#1f1f1f]">{business.discount_percentage}% OFF Voucher</p>
                <p className="text-[11px] text-[#747775]">
                  Show this screen or use code <strong className="font-mono text-[#1f1f1f]">THANKYOU{business.discount_percentage}</strong> on your next visit!
                </p>
              </div>
            ) : null}

            <a
              href={business?.google_review_link || 'https://search.google.com/local/writereview'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#0b57d0] text-white rounded-full font-semibold text-sm shadow-xs"
            >
              <span>Open Google Reviews</span>
              <ExternalLink size={16} />
            </a>
          </div>
        ) : (
          /* Active Review Form */
          <div className="bg-white rounded-3xl p-5 border border-[#e1e3e1] shadow-xs space-y-5">
            {/* 1. Rating Selector */}
            <div className="text-center pt-1">
              <label className="block text-sm font-semibold text-[#1f1f1f] mb-2">
                How was your experience?
              </label>

              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 focus:outline-hidden transition-transform active:scale-125 cursor-pointer"
                      aria-label={`${star} star`}
                    >
                      <Star
                        size={34}
                        className={`transition-colors ${
                          isActive
                            ? 'fill-[#fbbc04] text-[#fbbc04]'
                            : 'fill-transparent text-[#dadce0]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-medium text-[#0b57d0] mt-1 h-4">
                {ratingDescriptions[hoverRating || rating]}
              </p>
            </div>

            {/* 2. Language Selector Pills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#444746]">Language Style</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'ur-roman', label: 'Roman Urdu' },
                  { id: 'ur', label: 'اردو' },
                ].map((lang) => {
                  const isSelected = selectedLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang.id as LanguageOption)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center ${
                        isSelected
                          ? 'bg-[#0b57d0] text-white font-semibold'
                          : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e1e3e1]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Text Area for Genuine Thoughts */}
            <div>
              <label className="block text-xs font-semibold text-[#444746] mb-1.5">
                What did you like about your experience?
              </label>
              <textarea
                rows={4}
                dir={selectedLang === 'ur' ? 'rtl' : 'ltr'}
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  setImprovementApplied(false);
                }}
                placeholder={placeholderByLang[selectedLang]}
                className="w-full p-3 rounded-2xl border border-[#dadce0] bg-[#fafbfc] text-sm text-[#1f1f1f] focus:bg-white focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all resize-none leading-relaxed"
              />

              {errorNotice && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#c5221f] mt-1">
                  <AlertCircle size={13} />
                  <span>{errorNotice}</span>
                </div>
              )}
            </div>

            {/* 4. Improve My Wording Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleImproveWording}
                disabled={improving || !reviewText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#f0f4f9] hover:bg-[#e8f0fe] active:bg-[#d2e3fc] text-[#0b57d0] rounded-2xl font-semibold text-xs transition-colors border border-[#d2e3fc] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {improving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Polishing grammar & clarity...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} className="text-[#0b57d0]" />
                    <span>Improve my wording</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-[#747775] text-center mt-1">
                Polishes only grammar and natural tone. Never invents claims.
              </p>
            </div>

            {/* 5. Improved Text Preview Card */}
            {improvedText && (
              <div className="p-3.5 rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc] space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0b57d0] flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Polished Version</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setImprovementApplied(!improvementApplied)}
                    className="text-[11px] font-semibold text-[#0b57d0] hover:underline cursor-pointer"
                  >
                    {improvementApplied ? '✓ Selected' : 'Use this'}
                  </button>
                </div>
                <p className="text-xs text-[#1f1f1f] leading-relaxed bg-white p-2.5 rounded-xl border border-[#d2e3fc]/60">
                  {improvedText}
                </p>
              </div>
            )}

            {/* 6. Continue to Google Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinueToGoogle}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0b57d0] hover:bg-[#0842a0] active:scale-[0.99] text-white rounded-full font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Google</span>
                <ArrowRight size={18} />
              </button>
              <p className="text-[11px] text-[#747775] text-center mt-2">
                Copies your review & opens the Google Review dialog
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center pb-2">
          <div className="inline-flex items-center gap-1 text-[11px] text-[#747775]">
            <HeartHandshake size={13} />
            <span>Thank you for supporting authentic local businesses</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
