'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { CreateRequestModal } from '@/components/CreateRequestModal';
import { GoogleLogo, GoogleGReviewBadge } from '@/components/GoogleLogo';
import { BusinessProfile, ReviewRequest } from '@/lib/types';
import { getBusinessProfile, getReviewRequests } from '@/lib/data-service';
import { Star, MessageSquareCheck, Sparkles, ExternalLink, Calendar, UserCheck } from 'lucide-react';

export default function ReviewsPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewRequest[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [profData, reqsData] = await Promise.all([
        getBusinessProfile(),
        getReviewRequests(),
      ]);
      setProfile(profData);
      setReviews(reqsData.filter((r) => r.status === 'completed'));
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafd] flex">
      <Sidebar profile={profile} onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#e1e3e1] px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#1f1f1f]">Completed Customer Reviews</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-semibold border border-[#ceead6]">
              {reviews.length} Genuine Reviews
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Summary Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#e1e3e1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f] flex items-center gap-2">
                <MessageSquareCheck size={18} className="text-[#0b57d0]" />
                <span>Authentic Review Stream</span>
              </h2>
              <p className="text-xs text-[#747775] mt-0.5">
                Every review originates from genuine customer experiences without fabricated claims.
              </p>
            </div>

            {profile?.google_review_link && (
              <a
                href={profile.google_review_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f0f4f9] hover:bg-[#e8f0fe] text-[#0b57d0] rounded-full text-xs font-semibold border border-[#dadce0] transition-colors"
              >
                <span>Check Live Google Profile</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* Reviews Grid */}
          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#e1e3e1] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f0f4f9] text-[#747775] mx-auto flex items-center justify-center">
                <Star size={20} className="text-[#dadce0]" />
              </div>
              <p className="text-sm font-semibold text-[#1f1f1f]">No completed reviews yet</p>
              <p className="text-xs text-[#747775] max-w-md mx-auto">
                Send review links to your customers. Once they complete the rating on their phone, their verified response will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-[#e1e3e1] shadow-2xs space-y-4 hover:border-[#0b57d0]/30 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1f1f1f]">
                          {rev.customer_name || 'Anonymous Customer'}
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#e6f4ea] text-[#137333] text-[10px] font-semibold">
                          <UserCheck size={10} />
                          <span>Genuine Customer</span>
                        </span>
                      </div>
                      {rev.order_service_name && (
                        <p className="text-[11px] text-[#747775] mt-0.5">
                          {rev.order_service_name}
                        </p>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} className="fill-[#fbbc04] text-[#fbbc04]" />
                      ))}
                    </div>
                  </div>

                  {/* Polished Review Text */}
                  <div className="space-y-2">
                    <p className="text-xs text-[#1f1f1f] leading-relaxed bg-[#f8fafd] p-3.5 rounded-2xl border border-[#e1e3e1]">
                      {rev.customer_improved_text || rev.customer_original_text || 'No written text provided.'}
                    </p>

                    {rev.customer_original_text && rev.customer_improved_text && rev.customer_original_text !== rev.customer_improved_text && (
                      <div className="px-2">
                        <span className="text-[10px] font-bold text-[#747775] uppercase tracking-wider block mb-1">
                          Original customer draft:
                        </span>
                        <p className="text-[11px] text-[#747775] italic">
                          &quot;{rev.customer_original_text}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer info */}
                  <div className="pt-2 border-t border-[#f0f4f9] flex items-center justify-between text-[11px] text-[#747775]">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>
                        {new Date(rev.updated_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <span className="capitalize font-medium text-[#444746]">
                      Sent via {rev.contact_method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => loadData()}
        profile={profile}
      />
    </div>
  );
}
