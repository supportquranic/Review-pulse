'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  Settings,
  Plus,
  ExternalLink,
  Building2,
  Menu,
  X,
  LogOut,
  Star,
} from 'lucide-react';
import { BusinessProfile } from '@/lib/types';
import { logoutUser } from '@/lib/data-service';

interface SidebarProps {
  profile?: BusinessProfile | null;
  onOpenCreateModal?: () => void;
}

export function Sidebar({ profile, onOpenCreateModal }: SidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dbActive = typeof window !== 'undefined' && Boolean(profile?.id);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Review Requests', href: '/requests', icon: Send },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* MOBILE TOP BAR (Visible only on < 768px screens) */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-[#e1e3e1] px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-xl text-[#444746] hover:bg-[#f0f4f9] active:bg-[#e1e3e1] cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-[#1f1f1f]">
              Review<span className="text-[#0b57d0]">Pulse</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f0f4f9] text-[#444746] border border-[#e1e3e1] max-w-[120px] truncate">
            {profile?.business_name || 'My Business'}
          </span>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-medium text-xs shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE SLIDE-OVER DRAWER (Visible when hamburger clicked) */}
      {/* ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col justify-between p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f9]">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <span className="font-extrabold text-lg tracking-tight text-[#1f1f1f]">
                    Review<span className="text-[#0b57d0]">Pulse</span>
                  </span>
                  <p className="text-[11px] text-[#747775]">Genuine Google Reviews</p>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#f0f4f9] text-[#747775]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCreateModal?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0b57d0] text-white rounded-full font-medium text-sm shadow-xs cursor-pointer"
                >
                  <Plus size={18} />
                  <span>Create Request</span>
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                          : 'text-[#444746] hover:bg-[#f0f4f9]'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#001d35]' : 'text-[#5f6368]'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-4 border-t border-[#f0f4f9]">
              <div className="bg-[#f8fafd] p-3 rounded-2xl border border-[#e1e3e1] mb-3">
                <p className="text-xs font-semibold text-[#1f1f1f] truncate">
                  {profile?.business_name || 'My Business'}
                </p>
                <p className="text-[11px] text-[#747775] truncate">
                  {profile?.city || 'Location not set'}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-[#c5221f] hover:bg-[#fce8e6] rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP FIXED LEFT SIDEBAR (Visible only on md: screens >= 768px) */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-[#e1e3e1] flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
        <div>
          <div className="p-5 flex items-center justify-between border-b border-[#f0f4f9]">
            <Link href="/dashboard" className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#1f1f1f]">
                Review<span className="text-[#0b57d0]">Pulse</span>
              </span>
              <p className="text-[11px] text-[#747775]">Genuine Google Reviews</p>
            </Link>
          </div>

          {/* Desktop Quick Action Button */}
          <div className="p-4">
            <button
              onClick={onOpenCreateModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] active:scale-[0.98] text-white rounded-full font-medium text-sm shadow-xs transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Create Request</span>
            </button>
          </div>

          {/* Desktop Nav Links */}
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

        {/* Desktop Bottom Business Info & Status */}
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
                className="mt-2 text-[11px] text-[#0b57d0] hover:underline flex items-center gap-1 truncate"
              >
                <span>Google Review Link</span>
                <ExternalLink size={11} className="shrink-0" />
              </a>
            )}
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-[#747775]">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  dbActive ? 'bg-[#137333]' : 'bg-[#f9ab00]'
                }`}
              />
              <span>{dbActive ? 'MongoDB Live' : 'Local Storage'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[11px] font-semibold text-[#c5221f] hover:underline cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Sticky 1-thumb switcher on phones) */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e1e3e1] py-1.5 px-3 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                isActive ? 'text-[#0b57d0] font-bold' : 'text-[#747775]'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#0b57d0] font-semibold cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#0b57d0] text-white flex items-center justify-center">
            <Plus size={14} />
          </div>
          <span className="text-[10px]">Invite</span>
        </button>
      </div>
    </>
  );
}
