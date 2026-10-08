'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Send, MessageSquareCheck, Settings, Plus, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { GoogleLogo } from './GoogleLogo';
import { BusinessProfile } from '@/lib/types';

interface SidebarProps {
  profile?: BusinessProfile | null;
  onOpenCreateModal?: () => void;
}

export function Sidebar({ profile, onOpenCreateModal }: SidebarProps) {
  const pathname = usePathname();
  const dbActive = typeof window !== 'undefined' && Boolean(profile?.id);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Review Requests', href: '/requests', icon: Send },
    { label: 'Reviews', href: '/reviews', icon: MessageSquareCheck },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e1e3e1] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Top Branding */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-[#f0f4f9]">
          <Link href="/dashboard" className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#1f1f1f]">
              Review<span className="text-[#0b57d0]">Pulse</span>
            </span>
            <p className="text-[11px] text-[#747775]">Genuine Google Reviews</p>
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={onOpenCreateModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] active:scale-[0.98] text-white rounded-full font-medium text-sm shadow-xs transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Request</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                    : 'text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f]'
                }`}
              >
                <Icon size={19} className={isActive ? 'text-[#001d35]' : 'text-[#5f6368]'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Business Info & Supabase Status */}
      <div className="p-4 border-t border-[#f0f4f9] bg-[#fafbfc]">
        <div className="bg-white p-3 rounded-2xl border border-[#e1e3e1] shadow-2xs mb-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center shrink-0">
              <Building2 size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1f1f1f] truncate">
                {profile?.business_name || 'My Business'}
              </p>
              <p className="text-[11px] text-[#747775] truncate">
                {profile?.city || 'Location not set'}
              </p>
            </div>
          </div>

          {profile?.google_review_link && (
            <a
              href={profile.google_review_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-[11px] text-[#0b57d0] hover:underline flex items-center gap-1"
            >
              <span>View Google Link</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Backend status pill */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#747775]">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                dbActive ? 'bg-[#137333]' : 'bg-[#f9ab00]'
              }`}
            />
            <span>{dbActive ? 'MongoDB Connected' : 'Local Storage Engine'}</span>
          </div>
          <Link href="/settings" className="hover:underline text-[10px]">
            {dbActive ? 'Live' : 'Config'}
          </Link>
        </div>
      </div>
    </aside>
  );
}
