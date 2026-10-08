'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode, MessageCircle, Phone, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { ContactMethod, ReviewRequest, BusinessProfile } from '@/lib/types';
import { createReviewRequest } from '@/lib/data-service';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newReq: ReviewRequest) => void;
  profile?: BusinessProfile | null;
}

export function CreateRequestModal({
  isOpen,
  onClose,
  onCreated,
  profile,
}: CreateRequestModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('whatsapp');
  const [orderServiceName, setOrderServiceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<ReviewRequest | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newReq = await createReviewRequest({
        business_id: profile?.id || 'biz-default-01',
        customer_name: customerName.trim() || undefined,
        contact_method: contactMethod,
        order_service_name: orderServiceName.trim() || undefined,
        status: 'sent',
      });
      setCreatedRequest(newReq);
      onCreated(newReq);
    } catch (err) {
      console.error('Error generating review request:', err);
    } finally {
      setLoading(false);
    }
  };

  const getReviewUrl = (reqId: string) => {
    if (typeof window === 'undefined') return `/review/${reqId}`;
    return `${window.location.origin}/review/${reqId}`;
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCustomerName('');
    setOrderServiceName('');
    setCreatedRequest(null);
    setShowQR(false);
  };

  const currentUrl = createdRequest ? getReviewUrl(createdRequest.id) : '';
  const discount = profile?.discount_percentage ?? 0;
  const customerGreeting = customerName ? `Hi ${customerName}, ` : 'Hi, ';
  const businessTitle = profile?.business_name || 'our business';

  const rawInviteText =
    discount > 0
      ? `${customerGreeting}thank you for visiting ${businessTitle}! 🌟 Write a review on Google with this link: ${currentUrl} and get ${discount}% OFF on your next order!`
      : `${customerGreeting}thank you for choosing ${businessTitle}! 🌟 Please share your experience and write a quick review on Google: ${currentUrl}`;

  const shareMessage = encodeURIComponent(rawInviteText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-xl border border-[#e1e3e1] overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#f0f4f9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1f1f1f] text-sm sm:text-base">
                {createdRequest ? 'Review Request Ready' : 'Create Review Request'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#747775]">
                {createdRequest ? 'Share this genuine link with your customer' : 'Generate a unique mobile review link'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 rounded-full text-[#747775] hover:bg-[#f0f4f9] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!createdRequest ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-[#444746] mb-1.5">
                  Customer Name <span className="text-[#747775] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Johnson"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
                />
              </div>

              {/* Service / Order Name */}
              <div>
                <label className="block text-xs font-semibold text-[#444746] mb-1.5">
                  Order / Service Name <span className="text-[#747775] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Teeth Whitening, Table #4, Order #108"
                  value={orderServiceName}
                  onChange={(e) => setOrderServiceName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
                />
              </div>

              {/* Contact Method */}
              <div>
                <label className="block text-xs font-semibold text-[#444746] mb-2">
                  Sending Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                    { id: 'sms', label: 'SMS', icon: Phone },
                    { id: 'direct', label: 'QR / Direct', icon: QrCode },
                    { id: 'email', label: 'Email', icon: SendIconSmall },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = contactMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setContactMethod(method.id as ContactMethod)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0]'
                            : 'border-[#dadce0] bg-white text-[#444746] hover:bg-[#f8fafd]'
                        }`}
                      >
                        <Icon size={18} className="mb-1" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-medium text-sm transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {loading ? 'Generating Unique Link...' : 'Generate Customer Review Link'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Success Banner */}
              <div className="p-4 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">
                    Unique Link Generated for {createdRequest.customer_name || 'Customer'}
                  </p>
                  {discount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#137333] border border-[#ceead6]">
                      🎁 {discount}% OFF Included
                    </span>
                  )}
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">
                  The link directs the customer to the mobile-first genuine review page.
                </p>
              </div>

              {/* Link Box */}
              <div>
                <label className="block text-xs font-semibold text-[#444746] mb-1.5">
                  Unique Customer Review Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dadce0] bg-[#f8fafd] text-xs font-mono text-[#1f1f1f] select-all truncate"
                  />
                  <button
                    onClick={() => handleCopy(currentUrl)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      copied
                        ? 'bg-[#137333] text-white'
                        : 'bg-[#0b57d0] text-white hover:bg-[#0842a0]'
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Ready-to-send Message Preview */}
              <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#dadce0] space-y-1">
                <span className="text-[10px] font-bold text-[#747775] uppercase tracking-wider">
                  Invite Message Preview
                </span>
                <p className="text-xs text-[#1f1f1f] leading-relaxed italic">
                  &ldquo;{rawInviteText}&rdquo;
                </p>
              </div>

              {/* Direct Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/?text=${shareMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-[#25D366]/10 text-[#075E54] border border-[#25D366]/30 rounded-2xl text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>Send via WhatsApp</span>
                </a>

                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center justify-center gap-2 p-3 bg-[#f0f4f9] text-[#1f1f1f] border border-[#dadce0] rounded-2xl text-xs font-semibold hover:bg-[#e1e3e1] transition-colors cursor-pointer"
                >
                  <QrCode size={16} />
                  <span>{showQR ? 'Hide QR Code' : 'Display QR Code'}</span>
                </button>
              </div>

              {/* QR Code view */}
              {showQR && (
                <div className="p-4 bg-[#f8fafd] border border-[#dadce0] rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-[#e1e3e1]">
                    {/* Generates high-res QR via free Google Charts / QR Server API */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        currentUrl
                      )}`}
                      alt="Customer Review QR Code"
                      className="w-40 h-40"
                    />
                  </div>
                  <p className="text-xs font-medium text-[#1f1f1f] mt-2">Scan with any phone camera</p>
                  <p className="text-[11px] text-[#747775]">Perfect for reception desks & dining tables</p>
                </div>
              )}

              {/* Bottom Nav Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f9]">
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-[#0b57d0] hover:underline"
                >
                  + Create Another Link
                </button>

                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#444746] hover:text-[#0b57d0] font-medium"
                >
                  <span>Preview Customer View</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SendIconSmall({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
