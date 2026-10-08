'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { CreateRequestModal } from '@/components/CreateRequestModal';
import { BusinessProfile, ReviewRequest, RequestStatus } from '@/lib/types';
import { getBusinessProfile, getReviewRequests } from '@/lib/data-service';
import {
  Send,
  Eye,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Search,
  MessageCircle,
  QrCode,
  Star,
  Sparkles,
} from 'lucide-react';

export default function RequestsPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [filter, setFilter] = useState<'all' | RequestStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [profData, reqsData] = await Promise.all([
        getBusinessProfile(),
        getReviewRequests(),
      ]);
      setProfile(profData);
      setRequests(reqsData);
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = (reqId: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/review/${reqId}` : `/review/${reqId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(reqId);
    setTimeout(() => setCopiedId(null), 2000);
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

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch =
      !searchQuery ||
      (req.customer_name && req.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.order_service_name && req.order_service_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar profile={profile} onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-16 bg-white border-b border-[#e1e3e1] px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#1f1f1f]">Review Requests</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f0f4f9] text-[#444746] font-semibold border border-[#e1e3e1]">
              {filteredRequests.length} Total
            </span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Request</span>
          </button>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            {/* Pill Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Requests' },
                { id: 'sent', label: 'Sent' },
                { id: 'opened', label: 'Opened' },
                { id: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as 'all' | RequestStatus)}
                  className={`pill-tab cursor-pointer text-xs shrink-0 ${
                    filter === tab.id ? 'pill-tab-active' : 'pill-tab-inactive'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747775]" />
              <input
                type="text"
                placeholder="Search customer or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[#dadce0] bg-white text-xs text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0]"
              />
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-3xl border border-[#e1e3e1] shadow-2xs overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <p className="text-sm font-semibold text-[#1f1f1f]">No requests found</p>
                <p className="text-xs text-[#747775]">
                  Try adjusting your filter or search query, or create a new request.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f8fafd] border-b border-[#e1e3e1] text-[#444746] font-semibold">
                      <th className="py-3 px-6">Customer</th>
                      <th className="py-3 px-4">Service / Note</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f9]">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#f8fafd]/80 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-[#1f1f1f]">
                            {req.customer_name || 'Anonymous Customer'}
                          </p>
                          <span className="font-mono text-[10px] text-[#747775]">
                            ID: {req.id}
                          </span>
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
                        <td className="py-4 px-4 text-[#747775]">
                          {new Date(req.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Copy Link */}
                            <button
                              onClick={() => handleCopyLink(req.id)}
                              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                copiedId === req.id
                                  ? 'bg-[#137333] text-white border-[#137333]'
                                  : 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                              }`}
                              title="Copy Customer Link"
                            >
                              {copiedId === req.id ? <Check size={13} /> : <Copy size={13} />}
                            </button>

                            {/* Open Customer Review Page */}
                            <a
                              href={`/review/${req.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc] font-medium text-xs inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Open Review Page</span>
                              <ExternalLink size={12} />
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

      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => loadData()}
        profile={profile}
      />
    </div>
  );
}
