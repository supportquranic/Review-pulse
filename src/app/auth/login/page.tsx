'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { GoogleLogo } from '@/components/GoogleLogo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      }
      // Success
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    router.push('/dashboard');
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
          <h1 className="text-xl font-bold text-[#1f1f1f]">Sign in to your Account</h1>
          <p className="text-xs text-[#747775] mt-1">
            Collect authentic Google reviews from your real customers
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#fce8e6] border border-[#fad2cf] text-[#c5221f] text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1">
              <Mail size={13} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="business@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm text-[#1f1f1f] focus:outline-hidden focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] mb-1.5 flex items-center gap-1">
              <Lock size={13} />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
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
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Fast Track Button */}
        <div className="mt-4 pt-4 border-t border-[#f0f4f9]">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc] rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Instant Demo Access (Skip Login)</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-[#747775]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#0b57d0] font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
