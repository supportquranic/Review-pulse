'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { CreateRequestModal } from '@/components/CreateRequestModal';
import { GoogleLogo, GoogleGReviewBadge } from '@/components/GoogleLogo';
import { BusinessProfile, ReviewRequest } from '@/lib/types';
import { getBusinessProfile, getReviewRequests, getDashboardMetrics } from '@/lib/data-service';
import {
  Send,
  Eye,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Plus,
  ArrowUpRight,
  Star,
  QrCode,
  MessageCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    openedRequests: 0,
    completedReviews: 0,
    avgRating: '5.0',
    conversionRate: 0,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [profData, reqsData, metricsData] = await Promise.all([
        getBusinessProfile(),
        getReviewRequests(),
        getDashboardMetrics(),
      ]);
      setProfile(profData);
      setRequests(reqsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCopyGoogleLink = () => {
    if (profile?.google_review_link) {
      navigator.clipboard.writeText(profile.google_review_link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
            <CheckCircle2 size={12} />
            <span>Completed</span>
          </span>
        );
      case 'opened':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#0b57d0] border border-[#d2e3fc]">
            <Eye size={12} />
            <span>Opened</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fef7e0] text-[#b06000] border border-[#fce8b2]">
            <Send size={12} />
            <span>Sent</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Desktop & Mobile Responsive Sidebar */}
      <Sidebar profile={profile} onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Bar Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#e1e3e1] px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#1f1f1f] tracking-tight">
              Dashboard
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-[#f0f4f9] text-[#444746] font-medium border border-[#e1e3e1]">
              {profile?.business_name || 'My Business'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Review Request</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
          {/* Welcome Banner with Google Review Link Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#e1e3e1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GoogleLogo size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-[#1f1f1f] truncate">
                  {profile?.business_name || 'My Business'}
                </h2>
              </div>
              <p className="text-xs text-[#747775]">
                {profile?.business_category || 'Services'} • {profile?.city || 'Location not set'} • Customer Wording Engine Active
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCopyGoogleLink}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#f0f4f9] hover:bg-[#e8f0fe] text-[#0b57d0] rounded-full text-xs font-semibold border border-[#dadce0] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-[#137333]" /> : <Copy size={14} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Review Link'}</span>
              </button>

              {profile?.google_review_link && (
                <a
                  href={profile.google_review_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#444746] hover:text-[#0b57d0] rounded-full text-xs font-medium border border-[#dadce0] transition-colors"
                >
                  <span>Test Dialog</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          {/* KPI Metric Cards (2x2 on Mobile, 4x1 on Desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {/* Total Requests Card (Mint Pastel) */}
            <div className="card-pastel-green rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold text-[#137333] tracking-wider uppercase truncate">
                  Requests
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center text-[#137333] shrink-0">
                  <Send size={13} className="sm:w-[15px] sm:h-[15px]" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1f1f1f]">
                  {metrics.totalRequests}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#444746] mt-0.5 sm:mt-1 truncate">
                  Sent invites
                </p>
              </div>
            </div>

            {/* Opened Requests Card (Ice Blue Pastel) */}
            <div className="card-pastel-blue rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold text-[#0b57d0] tracking-wider uppercase truncate">
                  Opened
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center text-[#0b57d0] shrink-0">
                  <Eye size={13} className="sm:w-[15px] sm:h-[15px]" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1f1f1f]">
                  {metrics.openedRequests}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#444746] mt-0.5 sm:mt-1 truncate">
                  Customer opens
                </p>
              </div>
            </div>

            {/* Completed Reviews Card (Lavender Pastel) */}
            <div className="card-pastel-purple rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold text-[#7e22ce] tracking-wider uppercase truncate">
                  Completed
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center text-[#7e22ce] shrink-0">
                  <CheckCircle2 size={13} className="sm:w-[15px] sm:h-[15px]" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1f1f1f]">
                  {metrics.completedReviews}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#444746] mt-0.5 sm:mt-1 truncate">
                  {metrics.conversionRate}% conversion
                </p>
              </div>
            </div>

            {/* Google Rating Card (Warm Sand Pastel) */}
            <div className="card-pastel-yellow rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold text-[#b06000] tracking-wider uppercase truncate">
                  Rating
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center text-[#fbbc04] shrink-0">
                  <Star size={13} className="fill-[#fbbc04] sm:w-[15px] sm:h-[15px]" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-4">
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1f1f1f]">
                    {metrics.avgRating}
                  </p>
                  <span className="text-[10px] sm:text-xs text-[#747775] font-semibold">/ 5.0</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#444746] mt-0.5 sm:mt-1 truncate">
                  Google avg score
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity Table Card */}
          <div className="bg-white rounded-3xl border border-[#e1e3e1] shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-[#f0f4f9] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#1f1f1f] text-base">
                  Recent Review Requests
                </h3>
                <p className="text-xs text-[#747775]">
                  Track sent links, customer opens, and completed Google reviews
                </p>
              </div>

              <Link
                href="/requests"
                className="text-xs font-semibold text-[#0b57d0] hover:underline flex items-center gap-1"
              >
                <span>View All Requests</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#f0f4f9] text-[#747775] mx-auto flex items-center justify-center">
                  <Send size={20} />
                </div>
                <p className="text-sm font-semibold text-[#1f1f1f]">No review requests yet</p>
                <p className="text-xs text-[#747775] max-w-sm mx-auto">
                  Click &quot;Create Review Request&quot; to generate your first link and share it with your customer.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 px-5 py-2 bg-[#0b57d0] text-white rounded-full text-xs font-semibold hover:bg-[#0842a0] cursor-pointer"
                >
                  Create First Request
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f8fafd] border-b border-[#e1e3e1] text-[#444746] font-semibold">
                      <th className="py-3 px-6">Customer</th>
                      <th className="py-3 px-4">Service / Order</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Rating & Feedback</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f9]">
                    {requests.slice(0, 5).map((req) => (
                      <tr key={req.id} className="hover:bg-[#f8fafd]/80 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-[#1f1f1f]">
                            {req.customer_name || 'Customer'}
                          </p>
                          <p className="text-[11px] text-[#747775]">
                            {new Date(req.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-[#444746]">
                          {req.order_service_name || '—'}
                        </td>
                        <td className="py-4 px-4 capitalize text-[#444746]">
                          <span className="px-2 py-0.5 rounded-md bg-[#f0f4f9] text-[11px] font-medium">
                            {req.contact_method}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="py-4 px-4">
                          {req.rating ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(req.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className="fill-[#fbbc04] text-[#fbbc04]"
                                  />
                                ))}
                              </div>
                              {req.customer_improved_text && (
                                <p className="text-[11px] text-[#444746] line-clamp-1 max-w-xs italic">
                                  &quot;{req.customer_improved_text}&quot;
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#747775]">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={`/review/${req.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-full bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc] font-medium text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Customer Link</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Create Modal */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          loadAll();
        }}
        profile={profile}
      />
    </div>
  );
}
