'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Check, ChevronRight, Star } from 'lucide-react';
import { CATEGORIES } from '@/lib/templates';
import { getFeaturedTemplates } from '@/lib/marketplace-data';
import TemplateCard from '@/components/templates/TemplateCard';



const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose a Category',
    description: 'Select from Business, Career, Content, or Finance. Pick the exact template type you need.',
    icon: '🗂️',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    step: '02',
    title: 'Fill the Smart Form',
    description: 'Answer guided questions tailored to your template. No blank pages — just smart fields.',
    icon: '✍️',
    gradient: 'from-cyan-600 to-blue-600',
  },
  {
    step: '03',
    title: 'Get Your Template',
    description: 'AI generates a polished, professional document in seconds. Edit, customize, and download.',
    icon: '🚀',
    gradient: 'from-emerald-500 to-teal-600',
  },
];



const PRICING_PREVIEW = [
  {
    name: 'Free', price: '$0', credits: '25 credits',
    features: ['5 template types', 'Basic downloads', 'Community support'],
    cta: 'Get Started', href: '/auth?tab=signup', highlight: false,
  },
  {
    name: 'Pro', price: '$19', credits: '300 credits/mo',
    features: ['All 30+ template types', 'PDF + DOCX downloads', 'AI customization', 'Priority support'],
    cta: 'Start Pro', href: '/pricing', highlight: true,
  },
  {
    name: 'Business', price: '$49', credits: 'Unlimited',
    features: ['Everything in Pro', 'Marketplace selling', 'API access (Q2)', 'Team collaboration'],
    cta: 'Go Business', href: '/pricing', highlight: false,
  },
];

export default function HomePage() {
  const featuredTemplates = getFeaturedTemplates().slice(0, 6);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-12 hero-grid">
        {/* Ambient blobs */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[80px] animate-blob pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[80px] animate-blob animation-delay-2000 pointer-events-none" />

        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm">
              <Zap size={14} className="text-indigo-400" />
              AI-powered template generation
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white tracking mb-6">
              Generate{' '}
              <span className="gradient-text glow-text">Professional</span>
              <br />
              Templates in{' '}
              <span className="gradient-text">Seconds</span>
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Stop starting from scratch. TemplateForge AI generates polished resumes, business plans, invoices, and 30+ more templates — instantly, with your details built in.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/generate"
                id="hero-generate-btn"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-2xl shadow-lg shadow-indigo-500/30 group"
              >
                <Zap size={18} className="group-hover:scale-110 transition-transform" />
                Generate for Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/marketplace"
                id="hero-marketplace-btn"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-2xl"
              >
                <Star size={16} />
                Browse Marketplace
              </Link>
            </div>


          </div>

          {/* Right: Real template preview */}
          <div className="relative hidden lg:flex lg:col-span-5 items-center h-full animate-fade-in animation-delay-400">
            <div className="relative animate-float z-10 w-full">

              {/* Live preview label */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/90 border border-indigo-400/40 shadow-xl backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white text-xs font-bold tracking-wide">Live Template Preview</span>
              </div>

              {/* Iframe document preview */}
              <div className="rounded-2xl overflow-hidden shadow-2xl glow-primary border border-white/10 mx-auto" style={{ height: '340px', width: '340px' }}>
                <div style={{ width: '850px', height: '900px', transform: 'scale(0.40)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                  <iframe
                    srcDoc={`<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;">
<div style="display:flex;width:850px;min-height:900px;background:#ffffff;overflow:hidden;">
  <div style="width:32%;background:#1e3a5f;color:#ffffff;padding:32px 24px;">
    <div style="margin-bottom:28px;">
      <h1 style="font-size:22px;font-weight:800;margin:0 0 4px;letter-spacing:-0.3px;">Alexandra Chen</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.75);margin:0 0 20px;">Senior Product Manager</p>
      <div style="font-size:11.5px;color:rgba(255,255,255,0.7);line-height:2;">
        <div>alex.chen@email.com</div>
        <div>+1 (415) 555-0192</div>
        <div>San Francisco, CA</div>
        <div>linkedin.com/in/alexchen</div>
      </div>
    </div>
    <div style="margin-bottom:24px;">
      <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:6px;margin-bottom:12px;">Skills</h2>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${['Product Strategy','Agile / Scrum','Data Analysis','Stakeholder Mgmt','User Research','SQL & Tableau','Roadmapping','Go-to-Market'].map(s=>`<span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);padding:4px 10px;border-radius:4px;font-size:11px;">${s}</span>`).join('')}
      </div>
    </div>
    <div>
      <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:6px;margin-bottom:12px;">Education</h2>
      <p style="font-size:12px;font-weight:700;margin:0 0 2px;">MBA, Stanford GSB</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.65);margin:0;">Class of 2018</p>
      <p style="font-size:12px;font-weight:700;margin:12px 0 2px;">B.Sc. Computer Science</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.65);margin:0;">UC Berkeley, 2015</p>
    </div>
  </div>
  <div style="width:68%;padding:32px 28px;">
    <div style="margin-bottom:24px;">
      <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1e3a5f;margin-bottom:10px;">Professional Summary</h2>
      <p style="font-size:12.5px;line-height:1.75;color:#374151;margin:0;">Results-driven Product Manager with 7+ years leading cross-functional teams at high-growth tech companies. Launched 4 flagship products generating over $18M in ARR. Expert at balancing user needs with business strategy to ship impactful, data-informed solutions.</p>
    </div>
    <div>
      <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1e3a5f;margin-bottom:16px;">Work Experience</h2>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="border-left:3px solid #1e3a5f;padding-left:14px;">
          <h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 2px;">Senior Product Manager</h3>
          <p style="font-size:12px;font-weight:600;color:#1e3a5f;margin:0 0 8px;">Stripe · 2021 – Present</p>
          <p style="font-size:12px;line-height:1.65;color:#4b5563;margin:0;">Led payments infrastructure roadmap serving 4M+ merchants. Reduced onboarding friction by 40%, increasing activation rate from 62% to 87% within two quarters.</p>
        </div>
        <div style="border-left:3px solid #1e3a5f;padding-left:14px;">
          <h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 2px;">Product Manager II</h3>
          <p style="font-size:12px;font-weight:600;color:#1e3a5f;margin:0 0 8px;">Airbnb · 2018 – 2021</p>
          <p style="font-size:12px;line-height:1.65;color:#4b5563;margin:0;">Owned host tools product line generating $6M ARR. Defined and shipped 12 features in 18 months with a team of 8 engineers and 2 designers.</p>
        </div>
        <div style="border-left:3px solid #1e3a5f;padding-left:14px;">
          <h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 2px;">Associate Product Manager</h3>
          <p style="font-size:12px;font-weight:600;color:#1e3a5f;margin:0 0 8px;">Google · 2015 – 2018</p>
          <p style="font-size:12px;line-height:1.65;color:#4b5563;margin:0;">Contributed to Google Maps local discovery features, improving daily active user engagement by 22% through personalized recommendation algorithms.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</body></html>`}
                    style={{ width: '850px', height: '900px', border: 'none', display: 'block', background: 'white' }}
                    title="Resume template preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>

              {/* Bottom badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 shadow-xl">
                <Zap size={12} className="text-amber-400" />
                <span className="text-slate-300 text-xs font-semibold">Classic 2-Column · Navy Theme</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── Categories ────────────────────────────────── */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Template Categories</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Every template you need
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Four powerful categories covering every professional document you'll ever need to launch and grow.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/generate?category=${cat.id}`}
              id={`category-${cat.id}`}
              className="glass glass-hover rounded-3xl p-8 group overflow-hidden relative"
            >
              <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-[0.03] group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{cat.label}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">{cat.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors">{cat.count} templates</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#0d0d15] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">Ready in 3 simple steps</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">From idea to polished document — completely formatted and ready for the real world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[4.5rem] left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-emerald-500/30" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-3xl mx-auto mb-8 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 relative z-10`}>
                  {step.icon}
                </div>
                <span className={`absolute top-0 right-[calc(50%-4rem)] text-xs font-bold text-white bg-[#0a0a0f] border border-white/10 rounded-full w-8 h-8 flex items-center justify-center z-20`}>
                  {step.step}
                </span>
                <h3 className="text-white font-bold text-2xl mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-base">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link
              href="/generate"
              className="btn-primary inline-flex items-center gap-2 px-10 py-5 text-lg font-bold rounded-2xl group"
            >
              Start Generating Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Marketplace ──────────────────────── */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 text-center sm:text-left">
          <div>
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Marketplace</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Featured Templates</h2>
            <p className="text-slate-400 text-lg">Premium templates crafted by expert creators</p>
          </div>
          <Link href="/marketplace" className="btn-secondary px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 group">
            View All Templates
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTemplates.slice(0, 3).map(template => (
            <TemplateCard key={template.id} template={template} compact />
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden my-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8 glass border-indigo-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute inset-0 hero-grid opacity-30" />

        <div className="relative max-w-4xl mx-auto text-center z-10 px-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            Your next template is{' '}
            <span className="gradient-text">30 seconds away</span>
          </h2>
          <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join professionals who save hours every week using TemplateForge AI to build perfect documents instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/generate"
              className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold rounded-2xl shadow-2xl shadow-indigo-500/40 group"
            >
              <Zap size={20} className="group-hover:scale-110 transition-transform" />
              Generate Free Template
            </Link>
            <Link
              href="/marketplace"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold rounded-2xl"
            >
              Explore Marketplace
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-8 font-medium">No credit card required · 25 free credits on signup</p>
        </div>
      </section>
    </div>
  );
}
