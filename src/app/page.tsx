'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  Sparkles,
  MessageCircle,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  Lock,
  Globe2,
  Plus,
  LayoutDashboard,
  Send,
  MessageSquareCheck,
  Settings,
} from 'lucide-react';

// Testimonials for the auto-scrolling bar
const TESTIMONIALS = [
  {
    name: 'Dr. Harris Vance',
    role: 'Apex Dental Care',
    rating: 5,
    review:
      'We went from getting 2 Google reviews a month to over 45 five-star reviews in just 30 days. The WhatsApp link makes it effortless for patients.',
    tag: 'Dental Clinic',
  },
  {
    name: 'Sophia Sterling',
    role: 'Luxe Salon & Spa',
    rating: 5,
    review:
      'Our clients love how easy it is to polish their thoughts. It removes all the hesitation and our Google Maps ranking jumped to #1 in our district.',
    tag: 'Beauty & Wellness',
  },
  {
    name: 'Marcus Chen',
    role: 'Urban Bites Bistro',
    rating: 5,
    review:
      'The direct Google redirection is pure gold. Customers actually finish their reviews right after dinner. Zero fake bots, 100% genuine.',
    tag: 'Restaurant',
  },
  {
    name: 'Tariq Mehmood',
    role: 'Precision Auto Works',
    rating: 5,
    review:
      'Urdu and Roman Urdu support helped our local Pakistani clientele express their gratitude perfectly. Unbelievable response rate!',
    tag: 'Automotive',
  },
  {
    name: 'Elena Rostova',
    role: 'Vanguard Legal Associates',
    rating: 5,
    review:
      'Professional, compliant, and extremely effective. Helped us build an unbeatable online reputation in corporate litigation.',
    tag: 'Legal Firm',
  },
  {
    name: 'David Miller',
    role: 'Prime Physio & Fitness',
    rating: 5,
    review:
      'Our clinic conversion rate jumped to 82%. Staff generates links in 5 seconds and patients submit reviews before leaving the lobby.',
    tag: 'Physical Therapy',
  },
];

// Verified Client Real Brand Logos (Pure Typographic Marks - No Emojis)
const CLIENT_LOGOS = [
  {
    name: 'Apex Dental Care',
    category: 'Healthcare & Dental',
    initials: 'AD',
    logoBrand: 'APEX',
    logoSub: 'DENTAL CARE',
    badgeColor: 'bg-[#e8f0fe] text-[#0b57d0]',
    accentColor: '#0b57d0',
    rating: '4.9',
    reviewsCount: '210+ reviews',
  },
  {
    name: 'Grand Oak Bistro',
    category: 'Dining & Hospitality',
    initials: 'GO',
    logoBrand: 'GRAND OAK',
    logoSub: 'BISTRO & BAR',
    badgeColor: 'bg-[#fef7e0] text-[#b06000]',
    accentColor: '#b06000',
    rating: '5.0',
    reviewsCount: '185+ reviews',
  },
  {
    name: 'Metro Auto Garage',
    category: 'Automotive Precision',
    initials: 'MA',
    logoBrand: 'METRO AUTO',
    logoSub: 'PRECISION REPAIR',
    badgeColor: 'bg-[#fce8e6] text-[#c5221f]',
    accentColor: '#c5221f',
    rating: '4.9',
    reviewsCount: '340+ reviews',
  },
  {
    name: 'Luxe Hair & Spa',
    category: 'Salon & Wellness',
    initials: 'LX',
    logoBrand: 'LUXE',
    logoSub: 'HAIR & SPA',
    badgeColor: 'bg-[#f3e8fd] text-[#7e22ce]',
    accentColor: '#7e22ce',
    rating: '5.0',
    reviewsCount: '190+ reviews',
  },
  {
    name: 'Prime Physio Care',
    category: 'Physical Therapy',
    initials: 'PP',
    logoBrand: 'PRIME',
    logoSub: 'PHYSIOTHERAPY',
    badgeColor: 'bg-[#e6f4ea] text-[#137333]',
    accentColor: '#137333',
    rating: '4.9',
    reviewsCount: '165+ reviews',
  },
  {
    name: 'Vanguard Law Firm',
    category: 'Legal & Advisory',
    initials: 'VG',
    logoBrand: 'VANGUARD',
    logoSub: 'ATTORNEYS AT LAW',
    badgeColor: 'bg-[#f0f4f9] text-[#1f1f1f]',
    accentColor: '#1f1f1f',
    rating: '5.0',
    reviewsCount: '95+ reviews',
  },
  {
    name: 'Urban Living Realty',
    category: 'Real Estate Group',
    initials: 'UL',
    logoBrand: 'URBAN',
    logoSub: 'LIVING REALTY',
    badgeColor: 'bg-[#e8f0fe] text-[#0b57d0]',
    accentColor: '#0b57d0',
    rating: '4.9',
    reviewsCount: '280+ reviews',
  },
  {
    name: 'Horizon Fitness Hub',
    category: 'Gym & Athletics',
    initials: 'HF',
    logoBrand: 'HORIZON',
    logoSub: 'FITNESS HUB',
    badgeColor: 'bg-[#e6f4ea] text-[#137333]',
    accentColor: '#137333',
    rating: '5.0',
    reviewsCount: '310+ reviews',
  },
];

// FAQs Data
const FAQS = [
  {
    question: 'How does ReviewPulse help my business get more Google reviews?',
    answer:
      'ReviewPulse removes the two biggest bottlenecks stopping customers from reviewing you: link friction and writer\'s block. It generates a direct 1-tap personalized link you can send via WhatsApp or SMS. Customers can rate you in seconds and use our AI phrasing assistant to polish their thoughts before 1-click posting directly to your official Google Business Profile.',
  },
  {
    question: 'Are the reviews compliant with Google policies?',
    answer:
      'Yes, 100%. ReviewPulse does not fabricate reviews, use bots, or perform illegal review gating. The actual customer submits their own genuine thoughts directly from their own authenticated Google account. Our AI only assists in fixing grammar, spelling, and sentence flow without inventing facts.',
  },
  {
    question: 'How does the AI wording assistant work?',
    answer:
      'When a customer writes a short or rough sentence (e.g. "dr was nice clinic clean"), they can click "Improve Wording". The assistant refines it into a clear, professional review in English, Urdu, or Roman Urdu, maintaining their authentic feedback without changing the meaning.',
  },
  {
    question: 'Can I send review requests via WhatsApp and SMS?',
    answer:
      'Yes! Every review request generates a pre-formatted WhatsApp message and short link ready for 1-click dispatch. You can also print customized tabletop QR codes for your checkout counter or reception desk.',
  },
  {
    question: 'Do customers need to create an account or download an app?',
    answer:
      'Never. Customers simply tap the link on their smartphone browser, give their rating, and post directly to Google. No login, password, or app installation is required.',
  },
  {
    question: 'How fast can I set up ReviewPulse for my business?',
    answer:
      'Setup takes under 2 minutes. Just enter your business name, select your category, and paste your Google Review link or Place ID. You can start sending requests immediately.',
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col justify-between selection:bg-[#e8f0fe] selection:text-[#0b57d0]">
      {/* Top Navbar */}
      <header className="h-20 bg-white/90 backdrop-blur-md border-b border-[#e1e3e1] px-6 lg:px-16 flex items-center justify-between sticky top-0 z-50">
        {/* Pure text typographic logo - No icon */}
        <Link href="/" className="flex flex-col select-none">
          <span className="font-extrabold text-2xl tracking-tight text-[#1f1f1f]">
            Review<span className="text-[#0b57d0]">Pulse</span>
          </span>
          <span className="text-[10px] text-[#747775] font-medium -mt-1 tracking-wide">
            Automated Google Reviews
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#444746]">
          <a href="#features" className="hover:text-[#0b57d0] transition-colors">
            Features
          </a>
          <a href="#testimonials" className="hover:text-[#0b57d0] transition-colors">
            Testimonials
          </a>
          <a href="#clients" className="hover:text-[#0b57d0] transition-colors">
            Businesses
          </a>
          <a href="#faq" className="hover:text-[#0b57d0] transition-colors">
            FAQ
          </a>
          <Link href="/dashboard" className="hover:text-[#0b57d0] transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-xs font-semibold text-[#444746] hover:text-[#1f1f1f] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-semibold text-xs shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main className="flex-1 space-y-20 pb-16">
        {/* 1. Full-Screen Hero Headline & Value Pitch */}
        <section className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6 py-12 max-w-5xl mx-auto space-y-8 select-none">
          <div className="space-y-5 flex flex-col items-center">
            {/* Main Headline - Short & Balanced 2 Lines */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-[#1f1f1f] tracking-tight leading-[1.12] max-w-4xl">
              Turn Happy Customers into <br />
              <span className="text-[#0b57d0]">5-Star Google Reviews</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-[#444746] max-w-2xl leading-relaxed">
              Send instant 1-tap WhatsApp review requests, polish customer thoughts with AI, and dominate local Google search without awkward asking.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-8 py-4 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Start Collecting Reviews</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-7 py-4 bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] border border-[#dadce0] rounded-full font-semibold text-sm shadow-2xs transition-all"
            >
              <span>Create Free Account</span>
            </Link>
          </div>

          {/* Reassurance pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#747775]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#137333]" />
              <span>100% Google Policy Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#137333]" />
              <span>No Customer Login Needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#137333]" />
              <span>Ready in 2 Minutes</span>
            </div>
          </div>
        </section>

        {/* 2. Visual Device Showcase: Authentic Black iPad Pro + Black iPhone 17 Pro */}
        <section id="demo" className="w-full max-w-6xl xl:max-w-7xl mx-auto px-6 py-10 select-none">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 xl:gap-14">
            {/* 1. FRONT-FACING IPAD PRO (Business Dashboard with Left Drawer) */}
              <div className="w-full lg:w-[73%] max-w-[850px] flex flex-col items-center">
                {/* iPad Pro Slim Black Chassis with 100% Uniform All-Around Bezels */}
                <div className="relative w-full">
                  {/* Top Minimal Power Button */}
                  <div className="absolute top-0 right-14 w-10 h-[3px] bg-[#22242a] rounded-t-sm -translate-y-full" />

                  {/* Outer Black Bezel with exact uniform padding on all 4 sides */}
                  <div className="w-full bg-[#121316] p-[8px] sm:p-[10px] rounded-[38px] border border-[#2a2c34] relative">
                    {/* Top FaceTime Camera centered inside the top bezel */}
                    <div className="absolute top-[3px] sm:top-[4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#050508] border border-[#252730] flex items-center justify-center pointer-events-none">
                      <div className="w-0.5 h-0.5 rounded-full bg-[#11131a]" />
                    </div>

                    {/* iPad Screen Surface: Complete Business Dashboard with Drawer Navigation */}
                    <div className="bg-[#f8fafd] rounded-[30px] border border-[#e1e3e1] overflow-hidden min-h-[510px] sm:min-h-[530px] flex flex-row">
                      {/* LEFT DRAWER / SIDEBAR NAVIGATION */}
                      <div className="w-48 sm:w-52 bg-white border-r border-[#e1e3e1] p-3.5 sm:p-4 flex flex-col justify-between shrink-0 select-none text-left">
                        <div className="space-y-4">
                          {/* Brand Header */}
                          <div className="pb-2 border-b border-[#f0f4f9]">
                            <span className="font-extrabold text-base tracking-tight text-[#1f1f1f]">
                              Review<span className="text-[#0b57d0]">Pulse</span>
                            </span>
                            <p className="text-[10px] text-[#747775]">Business Suite</p>
                          </div>

                          {/* Quick Create Action Button */}
                          <button className="w-full py-2 px-3 bg-[#0b57d0] text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                            <Plus size={14} />
                            <span>New Request</span>
                          </button>

                          {/* Navigation Links */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#c2e7ff] text-[#001d35] font-bold text-xs">
                              <LayoutDashboard size={15} className="text-[#001d35]" />
                              <span>Dashboard</span>
                            </div>

                            <div className="flex items-center justify-between px-3 py-2 rounded-full text-[#444746] font-medium text-xs hover:bg-[#f0f4f9]">
                              <div className="flex items-center gap-2.5">
                                <Send size={15} className="text-[#5f6368]" />
                                <span>Requests</span>
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#e8f0fe] text-[#0b57d0]">
                                148
                              </span>
                            </div>

                            <div className="flex items-center justify-between px-3 py-2 rounded-full text-[#444746] font-medium text-xs hover:bg-[#f0f4f9]">
                              <div className="flex items-center gap-2.5">
                                <MessageSquareCheck size={15} className="text-[#5f6368]" />
                                <span>Reviews</span>
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#e6f4ea] text-[#137333]">
                                116
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 px-3 py-2 rounded-full text-[#444746] font-medium text-xs hover:bg-[#f0f4f9]">
                              <Settings size={15} className="text-[#5f6368]" />
                              <span>Settings & AI</span>
                            </div>
                          </div>
                        </div>

                        {/* Drawer Bottom Profile */}
                        <div className="p-2.5 rounded-xl bg-[#f8fafd] border border-[#e1e3e1] space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-[#e8f0fe] text-[#0b57d0] font-bold text-[10px] flex items-center justify-center">
                              🦷
                            </div>
                            <span className="font-bold text-[11px] text-[#1f1f1f] truncate">Apex Dental</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-[#137333] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse" />
                            <span>Google Connected</span>
                          </div>
                        </div>
                      </div>

                      {/* MAIN DASHBOARD CANVAS */}
                      <div className="flex-1 p-5 sm:p-6 text-left space-y-4 overflow-hidden flex flex-col justify-between">
                        {/* Top Canvas Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#e1e3e1]">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#1f1f1f] tracking-tight">
                              Hey Apex Dental<span className="text-[#0b57d0]">.</span>
                            </h3>
                            <p className="text-[11px] text-[#747775] font-medium">Thursday, 20 August 2026</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse" />
                              Live Syncing
                            </span>
                          </div>
                        </div>

                        {/* 3-Step Simple Visual Workflow Banner */}
                        <div className="bg-white rounded-xl p-2.5 border border-[#e1e3e1] grid grid-cols-3 gap-2 text-center shadow-2xs">
                          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[#f8fafd] border border-[#e8eaed]">
                            <span className="text-[10px] font-bold text-[#0b57d0]">1. Instant Send</span>
                            <span className="text-[9px] text-[#747775]">WhatsApp link</span>
                          </div>
                          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[#f3e8fd] border border-[#e9d5ff]">
                            <span className="text-[10px] font-bold text-[#7e22ce]">2. AI Polish</span>
                            <span className="text-[9px] text-[#747775]">Fixes in 1 tap</span>
                          </div>
                          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[#e6f4ea] border border-[#ceead6]">
                            <span className="text-[10px] font-bold text-[#137333]">3. Google Maps</span>
                            <span className="text-[9px] text-[#747775]">5★ published</span>
                          </div>
                        </div>

                        {/* Stat Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                          <div className="bg-white p-3 rounded-xl border border-[#e1e3e1] shadow-2xs">
                            <span className="text-[9px] font-bold text-[#747775] uppercase tracking-wider">REQUESTS</span>
                            <p className="text-xl font-extrabold text-[#1f1f1f] mt-0.5">148</p>
                            <p className="text-[10px] text-[#137333] font-bold mt-0.5 flex items-center gap-0.5">
                              <TrendingUp size={10} /> +28%
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-[#e1e3e1] shadow-2xs">
                            <span className="text-[9px] font-bold text-[#747775] uppercase tracking-wider">PUBLISHED</span>
                            <p className="text-xl font-extrabold text-[#0b57d0] mt-0.5">116</p>
                            <p className="text-[10px] text-[#747775] mt-0.5">78.4% Conv.</p>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-[#e1e3e1] shadow-2xs">
                            <span className="text-[9px] font-bold text-[#747775] uppercase tracking-wider">RATING</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xl font-extrabold text-[#1f1f1f]">4.9</span>
                              <div className="flex text-[#f9ab00]">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={11} className="fill-[#f9ab00]" />
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] text-[#747775] mt-0.5">210 Reviews</p>
                          </div>
                        </div>

                        {/* Live Customer Activity Stream */}
                        <div className="bg-white rounded-xl border border-[#e1e3e1] p-3 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between pb-1 border-b border-[#f0f4f9]">
                            <span className="text-[11px] font-bold text-[#1f1f1f]">Live Patient Review Activity</span>
                            <span className="text-[10px] font-bold text-[#0b57d0]">Auto-Sync Enabled</span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafd] border border-[#e1e3e1]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#e8f0fe] text-[#0b57d0] font-bold text-[10px] flex items-center justify-center">
                                  SJ
                                </div>
                                <div>
                                  <p className="font-bold text-[#1f1f1f] text-xs">Sarah Johnson</p>
                                  <p className="text-[9px] text-[#747775]">Teeth Whitening</p>
                                </div>
                              </div>
                              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">
                                5⭐ Published on Google
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafd] border border-[#e1e3e1]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#f3e8fd] text-[#7e22ce] font-bold text-[10px] flex items-center justify-center">
                                  UK
                                </div>
                                <div>
                                  <p className="font-bold text-[#1f1f1f] text-xs">Muhammad Usman Khan</p>
                                  <p className="text-[9px] text-[#747775]">Dental Implant Checkup</p>
                                </div>
                              </div>
                              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#f3e8fd] text-[#7e22ce]">
                                AI Review Polished
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. FRONT-FACING IPHONE 17 PRO (Customer Review Flow) */}
              <div className="w-full lg:w-[30%] max-w-[280px] sm:max-w-[290px] flex flex-col items-center">
                {/* Phone Device with Slim Black Chassis & Hardware Side Buttons */}
                <div className="relative w-full">
                  {/* Left Hardware Buttons */}
                  <div className="absolute -left-[2.5px] top-20 w-[2.5px] h-5 bg-[#22242a] rounded-l-sm" />
                  <div className="absolute -left-[2.5px] top-28 w-[2.5px] h-8 bg-[#22242a] rounded-l-sm" />
                  <div className="absolute -left-[2.5px] top-40 w-[2.5px] h-8 bg-[#22242a] rounded-l-sm" />

                  {/* Right Hardware Button */}
                  <div className="absolute -right-[2.5px] top-28 w-[2.5px] h-12 bg-[#22242a] rounded-r-sm" />

                  {/* Slim Black Outer Frame */}
                  <div className="w-full min-h-[570px] bg-[#121316] p-[6px] rounded-[42px] border border-[#2a2c34] relative flex flex-col justify-between">
                    {/* Ultra-thin Uniform Inner Bezel */}
                    <div className="bg-black p-[2px] rounded-[36px] flex-1 flex flex-col">
                      {/* iPhone Screen Surface */}
                      <div className="bg-[#f8fafd] rounded-[34px] p-3.5 text-left flex-1 flex flex-col justify-between overflow-hidden">
                        {/* Top Status Bar (9:41, Centered Dynamic Island, Signal, Wi-Fi, Battery) */}
                        <div className="relative flex items-center justify-between text-black px-1.5 pt-0.5 select-none h-6">
                          <span className="font-bold text-xs tracking-tight">9:41</span>

                          {/* 100% Dead-Center Aligned Dynamic Island Capsule */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[82px] h-[19px] bg-black rounded-full flex items-center justify-between px-2.5 z-10 shadow-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#121318] border border-[#20232c] flex items-center justify-center">
                              <div className="w-0.5 h-0.5 rounded-full bg-[#08080c]" />
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#151720] flex items-center justify-center">
                              <div className="w-0.5 h-0.5 rounded-full bg-[#0a0d14]" />
                            </div>
                          </div>

                          {/* Right Status Icons */}
                          <div className="flex items-center gap-1 text-black">
                            <div className="flex items-end gap-[1px] h-[9px]">
                              <div className="w-[2px] h-[2.5px] bg-black rounded-[0.5px]" />
                              <div className="w-[2px] h-[4.5px] bg-black rounded-[0.5px]" />
                              <div className="w-[2px] h-[6.5px] bg-black rounded-[0.5px]" />
                              <div className="w-[2px] h-[8.5px] bg-black rounded-[0.5px]" />
                            </div>

                            <svg width="11" height="9" viewBox="0 0 16 12" fill="currentColor">
                              <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                              <path d="M4.5 7.5a5 5 0 017 0 .75.75 0 001.06-1.06 6.5 6.5 0 00-9.12 0 .75.75 0 101.06 1.06z" />
                              <path d="M2 4.5a8.5 8.5 0 0112 0 .75.75 0 001.06-1.06 10 10 0 00-14.12 0 .75.75 0 001.06 1.06z" />
                            </svg>

                            <div className="flex items-center">
                              <div className="w-[16px] h-[8.5px] border-[1.2px] border-black rounded-[3px] p-[1px] flex items-center">
                                <div className="w-full h-full bg-black rounded-[0.5px]" />
                              </div>
                              <div className="w-[1px] h-[2.5px] bg-black rounded-r-[0.5px]" />
                            </div>
                          </div>
                        </div>

                        {/* Header Greeting */}
                        <div className="space-y-0.5 pt-1.5">
                          <p className="text-[9px] text-[#747775] font-semibold">Official Review Request</p>
                          <h4 className="text-lg font-black text-[#1f1f1f] tracking-tight">
                            Hey Usman<span className="text-[#0b57d0]">.</span>
                          </h4>
                        </div>

                        {/* Business Card with Star Rating */}
                        <div className="bg-white rounded-xl p-2.5 border border-[#e1e3e1] space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#e8f0fe] text-[#0b57d0] font-extrabold text-xs flex items-center justify-center">
                              🦷
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#1f1f1f]">Apex Dental Care</p>
                              <p className="text-[9px] text-[#747775]">Dental Implant & Cleaning</p>
                            </div>
                          </div>

                          {/* 5-Star Rating Selector */}
                          <div className="flex items-center justify-center gap-1.5 py-1.5 bg-[#fef7e0]/80 rounded-lg border border-[#feefc3]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={15} className="fill-[#f9ab00] text-[#f9ab00]" />
                            ))}
                          </div>
                        </div>

                        {/* Customer Draft Thoughts */}
                        <div className="bg-white rounded-xl p-2.5 border border-[#e1e3e1] space-y-1">
                          <span className="text-[9px] font-bold text-[#747775]">Your Experience:</span>
                          <p className="text-[10px] text-[#1f1f1f] italic bg-[#f8fafd] p-2 rounded-lg border border-[#e1e3e1]/60 leading-relaxed">
                            &ldquo;doctor was very gentle and friendly clinic is clean and on time&rdquo;
                          </p>
                        </div>

                        {/* AI Polished Suggestion Card */}
                        <div className="bg-[#f3e8fd] rounded-xl p-2.5 border border-[#e9d5ff] space-y-1">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-[#7e22ce]">
                            <Sparkles size={11} />
                            <span>AI Polished Review:</span>
                          </div>
                          <p className="text-[10px] text-[#1f1f1f] font-medium leading-relaxed">
                            &ldquo;The doctor was extremely gentle and professional throughout the procedure. Impeccably clean clinic and on time!&rdquo;
                          </p>
                        </div>

                        {/* 1-Tap Google Button & iOS Home Indicator Bar */}
                        <div className="space-y-2 pt-0.5">
                          <button className="w-full py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all">
                            <span>Post on Google Reviews</span>
                            <ArrowRight size={12} />
                          </button>

                          {/* iOS Home Indicator Bar */}
                          <div className="w-24 h-1 bg-black/30 rounded-full mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* 2. Auto-scrolling Testimonials Bar */}
        <section id="testimonials" className="relative overflow-hidden py-10 select-none">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              Real Business Stories
            </span>
            <h2 className="text-xl font-bold text-[#1f1f1f] mt-1">
              Loved by Hundreds of Service Leaders & Practice Owners
            </h2>
          </div>

          {/* Marquee Wrapper */}
          <div className="flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee gap-6 py-2">
              {/* Double array for seamless loop */}
              {[...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
                <div
                  key={idx}
                  className="w-80 sm:w-96 shrink-0 bg-white border border-[#e1e3e1] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#f9ab00]">
                        {[...Array(item.rating)].map((_, rIdx) => (
                          <Star key={rIdx} size={14} className="fill-[#f9ab00]" />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#0b57d0]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#3c4043] leading-relaxed italic">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#f0f4f9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1f1f1f]">{item.name}</p>
                      <p className="text-[11px] text-[#747775]">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Client Logos / Industries */}
        <section id="clients" className="max-w-7xl mx-auto px-6 text-center space-y-10">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              Trusted Nationwide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f1f1f] tracking-tight">
              Powering Reputation for Leading Local Businesses
            </h2>
            <p className="text-xs sm:text-sm text-[#747775]">
              Real practices, clinics, and service providers growing their Google footprint with ReviewPulse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {CLIENT_LOGOS.map((client, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e1e3e1] rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#dadce0] transition-all flex flex-col justify-between space-y-4 text-left group"
              >
                {/* Top Row: Initials Monogram Badge + Rating */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm tracking-wider shadow-2xs ${client.badgeColor}`}>
                    {client.initials}
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-xs font-bold">
                    <Star size={12} className="fill-[#f9ab00] text-[#f9ab00]" />
                    <span>{client.rating}</span>
                  </div>
                </div>

                {/* Brand Name Typography Logo (No Emojis) */}
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1f1f1f] tracking-tight group-hover:text-[#0b57d0] transition-colors">
                    {client.logoBrand}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#747775]">
                    {client.logoSub}
                  </p>
                </div>

                {/* Bottom Row: Category & Review Count */}
                <div className="pt-3 border-t border-[#f0f4f9] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-[#444746] bg-[#f8fafd] px-2.5 py-1 rounded-lg border border-[#e1e3e1]">
                    {client.category}
                  </span>
                  <span className="text-[11px] font-bold text-[#137333]">
                    {client.reviewsCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Core Value Propositions */}
        <section id="features" className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              Built for Growth
            </span>
            <h2 className="text-3xl font-extrabold text-[#1f1f1f] tracking-tight">
              Why ReviewPulse Outperforms Traditional Review Methods
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-7 border border-[#e1e3e1] shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#1f1f1f]">1-Tap WhatsApp Automation</h3>
              <p className="text-xs text-[#444746] leading-relaxed">
                Dispatch personalized review invites directly into WhatsApp or SMS with pre-filled customer greetings. Experience up to 75% response rates.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#e1e3e1] shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f3e8fd] text-[#7e22ce] flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#1f1f1f]">AI Wording Enhancement</h3>
              <p className="text-xs text-[#444746] leading-relaxed">
                Helps hesitant customers articulate their genuine experience in clear English, Urdu, or Roman Urdu without fabricating claims.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#e1e3e1] shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#1f1f1f]">Real-Time ROI Analytics</h3>
              <p className="text-xs text-[#444746] leading-relaxed">
                Track your review pipeline from Sent to Opened to Completed. Monitor staff performance and customer satisfaction trends effortlessly.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQs Section */}
        <section id="faq" className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-[#1f1f1f] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-[#747775]">
              Everything you need to know about collecting reviews with ReviewPulse
            </p>
          </div>

          <div
            className="space-y-3"
            onMouseLeave={() => setOpenFaq(null)}
          >
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setOpenFaq(idx)}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                  openFaq === idx
                    ? 'border-[#0b57d0]/40 shadow-xs ring-1 ring-[#0b57d0]/10'
                    : 'border-[#e1e3e1] shadow-2xs hover:border-[#dadce0]'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFaq(idx);
                  }}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-hidden cursor-pointer"
                >
                  <span className={`font-semibold text-sm transition-colors ${openFaq === idx ? 'text-[#0b57d0]' : 'text-[#1f1f1f]'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-[#0b57d0]' : 'text-[#747775]'
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 border-t border-[#f0f4f9] text-xs text-[#444746] leading-relaxed animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6. High-Converting Bottom Banner */}
        <section className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#0b57d0] to-[#0842a0] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-lg">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
              Ready to Skyrocket Your Google Reviews & Local Reputation?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Join hundreds of high-growth local businesses using ReviewPulse to collect authentic, 5-star reviews on complete autopilot.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-white text-[#0b57d0] hover:bg-[#f8fafd] rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Launch Dashboard Now
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-semibold text-xs transition-all"
              >
                Create Business Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-[#e1e3e1] bg-white py-10 text-xs text-[#747775]">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#f0f4f9]">
            {/* Pure text typographic logo */}
            <div>
              <Link href="/" className="inline-block select-none">
                <span className="font-extrabold text-2xl tracking-tight text-[#1f1f1f]">
                  Review<span className="text-[#0b57d0]">Pulse</span>
                </span>
              </Link>
              <p className="text-[11px] text-[#747775] mt-1">
                The frictionless Google review platform for local businesses.
              </p>
            </div>

            {/* Footer Nav Links */}
            <div className="flex flex-wrap items-center gap-6 font-medium text-xs">
              <a href="#features" className="hover:text-[#0b57d0] transition-colors">
                Features
              </a>
              <a href="#testimonials" className="hover:text-[#0b57d0] transition-colors">
                Testimonials
              </a>
              <a href="#clients" className="hover:text-[#0b57d0] transition-colors">
                Businesses
              </a>
              <a href="#faq" className="hover:text-[#0b57d0] transition-colors">
                FAQ
              </a>
              <Link href="/dashboard" className="hover:text-[#0b57d0] transition-colors">
                Dashboard
              </Link>
              <Link href="/settings" className="hover:text-[#0b57d0] transition-colors">
                Settings
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#747775]">
            <p>© {new Date().getFullYear()} ReviewPulse. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Google Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
