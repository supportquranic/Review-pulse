import React from 'react';

export function GoogleLogo({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight text-[#1f1f1f] leading-none ${className}`}>
      Review<span className="text-[#0b57d0]">Pulse</span>
    </span>
  );
}

export function GoogleGReviewBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center px-3 py-1 bg-white border border-[#dadce0] rounded-full shadow-2xs text-xs font-semibold text-[#1f1f1f] ${className}`}>
      <span>Google Reviews</span>
    </div>
  );
}
