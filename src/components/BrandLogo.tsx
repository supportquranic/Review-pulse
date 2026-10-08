import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({ size = 'md', className = '', showSubtitle = false }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <span className={`font-extrabold tracking-tight text-[#1f1f1f] ${sizeClasses} leading-none`}>
        Review<span className="text-[#0b57d0]">Pulse</span>
      </span>
      {showSubtitle && (
        <span className="text-[10px] text-[#747775] font-medium mt-0.5 tracking-normal">
          Genuine Customer Reviews
        </span>
      )}
    </div>
  );
}

// Backward compatibility alias without icon
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
