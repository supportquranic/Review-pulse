'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { GoogleLogo } from '@/components/GoogleLogo';
import { saveBusinessProfile, setCurrentUser, logoutUser } from '@/lib/data-service';

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          business_name: businessName || 'My Business',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Reset previous user cache
      logoutUser();

      if (data.user) {
        setCurrentUser({
          id: data.user.id,
          email: data.user.email,
          business_name: businessName || 'My Business',
        });
      }

      if (data.profile) {
        await saveBusinessProfile(data.profile);
      } else {
        await saveBusinessProfile({
          user_id: data.user?.id || 'usr_new',
          business_name: businessName || 'My Business',
        });
      }

      // Route to setup
      router.push('/setup');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating account';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e1e3e1] shadow-xl p-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-2">
            <span className="font-extrabold text-2xl tracking-tight text-[#1f1f1f]">
              Review<span className="text-[#0b57d0]">Pulse</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#1f1f1f]">Create Business Account</h1>
          <p className="text-xs text-[#747775] mt-1">
            Start collecting 5-star genuine Google reviews in minutes
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#fce8e6] border border-[#fad2cf] text-[#c5221f] text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1">
              <Building2 size={13} />
              <span>Business Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Dental Clinic"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1">
              <Mail size={13} />
              <span>Work Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="owner@apexclinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1">
              <Lock size={13} />
              <span>Password (6+ characters)</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Setup'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#747775]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#0b57d0] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
