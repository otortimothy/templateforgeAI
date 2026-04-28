'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, ShoppingBag, Upload,
  Zap, TrendingUp, Clock, Trash2, Eye, Download,
  CreditCard, Plus, Loader2
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';
import { downloadAsDocx } from '@/lib/download';
import clsx from 'clsx';

type Tab = 'overview' | 'generated' | 'purchased' | 'sell' | 'credits';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'generated', label: 'Generated', icon: <FileText size={16} /> },
  { id: 'purchased', label: 'Purchased', icon: <ShoppingBag size={16} /> },
  { id: 'sell', label: 'Sell Templates', icon: <Upload size={16} /> },
  { id: 'credits', label: 'Credits', icon: <Zap size={16} /> },
];

const CREDIT_PACKS = [
  { id: 'p1', amount: 100, price: 5, bonus: '', popular: false },
  { id: 'p2', amount: 300, price: 12, bonus: '+50 bonus', popular: true },
  { id: 'p3', amount: 700, price: 25, bonus: '+150 bonus', popular: false },
  { id: 'p4', amount: 2000, price: 59, bonus: '+500 bonus', popular: false },
];

function DashboardInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'overview';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [viewingTemplate, setViewingTemplate] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', price: '', category: '', type: '' });

  const { generatedTemplates, purchasedTemplates, removeGenerated } = useDashboard();
  const { user, updateCredits } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-3">Sign in to access your dashboard</h2>
          <p className="text-slate-400 mb-6">Your generated and purchased templates will appear here.</p>
          <Link href="/auth" className="btn-primary px-8 py-3 rounded-xl inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleCreditPurchase = (pack: typeof CREDIT_PACKS[0]) => {
    alert(`💳 Payment simulation: ${pack.amount} credits for $${pack.price}\n\nIn Phase 2, this would open Stripe checkout.\n\nFor now, we'll add the credits to your account!`);
    const bonusAmount = pack.id === 'p2' ? 50 : pack.id === 'p3' ? 150 : pack.id === 'p4' ? 500 : 0;
    updateCredits(pack.amount + bonusAmount);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Dashboard</h1>
          <p className="text-slate-400">
            Welcome back, <span className="text-indigo-400 font-semibold">{user.name.split(' ')[0]}</span> 👋
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Zap size={16} className="text-amber-400" />
          <span className="text-amber-400 font-bold">{user.credits}</span>
          <span className="text-amber-400/60 text-sm">credits</span>
          <button onClick={() => setTab('credits')} className="ml-1 text-xs text-amber-400 underline hover:text-amber-300">Add more</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass rounded-2xl border border-white/[0.06] p-2 flex lg:flex-col gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={clsx(
                  'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {t.icon}
                <span className="hidden sm:block lg:block">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="animate-fade-in space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Generated', value: generatedTemplates.length, icon: <FileText size={18} />, color: 'text-indigo-400' },
                  { label: 'Purchased', value: purchasedTemplates.length, icon: <ShoppingBag size={18} />, color: 'text-purple-400' },
                  { label: 'Credits', value: user.credits, icon: <Zap size={18} />, color: 'text-amber-400' },
                  { label: 'Plan', value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1), icon: <TrendingUp size={18} />, color: 'text-green-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass border border-white/[0.06] rounded-2xl p-5">
                    <div className={clsx('mb-2', stat.color)}>{stat.icon}</div>
                    <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="glass border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link href="/generate" className="flex items-center gap-3 p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all">
                    <Zap size={18} className="text-indigo-400" />
                    <span className="text-sm font-medium text-white">Generate Template</span>
                  </Link>
                  <Link href="/marketplace" className="flex items-center gap-3 p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all">
                    <ShoppingBag size={18} className="text-purple-400" />
                    <span className="text-sm font-medium text-white">Browse Marketplace</span>
                  </Link>
                  <button onClick={() => setTab('credits')} className="flex items-center gap-3 p-4 rounded-xl bg-amber-600/10 border border-amber-500/20 hover:bg-amber-600/20 transition-all text-left">
                    <CreditCard size={18} className="text-amber-400" />
                    <span className="text-sm font-medium text-white">Buy Credits</span>
                  </button>
                </div>
              </div>

              {/* Recent generated */}
              {generatedTemplates.length > 0 && (
                <div className="glass border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">Recent Generated</h3>
                    <button onClick={() => setTab('generated')} className="text-xs text-indigo-400 hover:underline">View all</button>
                  </div>
                  <div className="space-y-3">
                    {generatedTemplates.slice(0, 3).map(tpl => (
                      <div key={tpl.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/[0.04]">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs">📄</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{tpl.title}</p>
                          <p className="text-slate-500 text-xs flex items-center gap-1"><Clock size={10} /> {new Date(tpl.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => downloadAsDocx(tpl.html, tpl.title)} className="text-slate-400 hover:text-white transition-colors">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Generated Templates ── */}
          {tab === 'generated' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Generated Templates ({generatedTemplates.length})</h2>
                <Link href="/generate" className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
                  <Plus size={14} /> New Template
                </Link>
              </div>

              {generatedTemplates.length === 0 ? (
                <EmptyState
                  icon="📄"
                  title="No templates generated yet"
                  desc="Start generating professional templates with AI — it only takes seconds!"
                  cta="Generate Template"
                  href="/generate"
                />
              ) : (
                <div className="space-y-3">
                  {generatedTemplates.map(tpl => (
                    <div key={tpl.id} className="glass border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{tpl.title}</p>
                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {new Date(tpl.createdAt).toLocaleDateString()}
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] capitalize">{tpl.type.replace(/-/g, ' ')}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => downloadAsDocx(tpl.html, tpl.title)} title="Download" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                          <Download size={14} />
                        </button>
                        <Link href={`/generate?view=${tpl.id}`} title="View" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                          <Eye size={14} />
                        </Link>
                        <button onClick={() => removeGenerated(tpl.id)} title="Delete" className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Purchased Templates ── */}
          {tab === 'purchased' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6">Purchased Templates ({purchasedTemplates.length})</h2>

              {purchasedTemplates.length === 0 ? (
                <EmptyState
                  icon="🛒"
                  title="No purchased templates yet"
                  desc="Browse the marketplace and buy premium templates from expert creators."
                  cta="Browse Marketplace"
                  href="/marketplace"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {purchasedTemplates.map(tpl => (
                    <div key={tpl.id} className="glass border border-white/[0.06] rounded-xl overflow-hidden">
                      <div className={`h-24 bg-gradient-to-br ${tpl.previewColor} relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl">{getTypeEmoji(tpl.type)}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-white font-semibold text-sm truncate mb-1">{tpl.title}</p>
                        <p className="text-slate-500 text-xs mb-3">Purchased {new Date(tpl.purchasedAt).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <Link href={`/marketplace/${tpl.id}`} className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all">
                            View Details
                          </Link>
                          <button className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg btn-primary">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Sell Templates ── */}
          {tab === 'sell' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">Sell Your Templates</h2>
              <p className="text-slate-400 mb-6">Upload your templates and earn on every sale. We take 15% commission.</p>

              <div className="glass border border-white/[0.06] rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Template Title *</label>
                    <input id="sell-title" className="input-field" placeholder="e.g., Premium Executive Resume" value={uploadForm.title} onChange={e => setUploadForm(p => ({...p, title: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Price (USD) *</label>
                    <input id="sell-price" type="number" className="input-field" placeholder="e.g., 25" value={uploadForm.price} onChange={e => setUploadForm(p => ({...p, price: e.target.value}))} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description *</label>
                  <textarea id="sell-description" rows={3} className="input-field resize-none" placeholder="Describe what's included in your template..." value={uploadForm.description} onChange={e => setUploadForm(p => ({...p, description: e.target.value}))} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category</label>
                    <select id="sell-category" className="input-field" style={{background:'rgba(255,255,255,0.04)'}} value={uploadForm.category} onChange={e => setUploadForm(p => ({...p, category: e.target.value}))}>
                      <option value="">Select category...</option>
                      <option>business</option><option>career</option><option>content</option><option>finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Upload File</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-indigo-500/40 transition-colors cursor-pointer">
                      <Upload size={20} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-slate-400 text-xs">PDF, DOCX up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    className="btn-primary px-6 py-3 rounded-xl font-bold"
                    onClick={() => alert('✅ Submission received!\n\nIn Phase 2, your template would be reviewed and listed on the marketplace within 24 hours.')}
                  >
                    Submit for Review
                  </button>
                  <p className="text-slate-500 text-xs mt-2">Templates are reviewed within 24–48 hours</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Credits ── */}
          {tab === 'credits' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Credits & Billing</h2>
                  <p className="text-slate-400 text-sm mt-1">Current balance: <span className="text-amber-400 font-bold">{user.credits} credits</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {CREDIT_PACKS.map(pack => (
                  <div key={pack.id} className={clsx(
                    'relative rounded-2xl p-5 border transition-all',
                    pack.popular ? 'bg-gradient-to-b from-indigo-600/20 to-purple-600/10 border-indigo-500/50 shadow-xl shadow-indigo-500/20' : 'glass border-white/[0.06]'
                  )}>
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">Popular</span>
                      </div>
                    )}
                    <p className="text-2xl font-extrabold text-white mb-0.5">{pack.amount}</p>
                    <p className="text-indigo-400 text-sm font-medium mb-1">credits</p>
                    {pack.bonus && <p className="text-green-400 text-xs font-semibold mb-3">{pack.bonus}</p>}
                    <p className="text-3xl font-extrabold text-white mb-4">${pack.price}</p>
                    <button
                      id={`buy-credits-${pack.id}`}
                      onClick={() => handleCreditPurchase(pack)}
                      className={clsx('w-full py-2.5 rounded-xl text-sm font-bold transition-all', pack.popular ? 'btn-primary' : 'btn-secondary')}
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="glass border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Credit Usage</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  {[
                    ['Resume / CV', '3 credits'],
                    ['Cover Letter', '3 credits'],
                    ['Business Plan', '8 credits'],
                    ['Invoice', '5 credits'],
                    ['Content Calendar', '7 credits'],
                    ['AI Modification', '2 credits'],
                  ].map(([item, cost]) => (
                    <div key={item} className="flex justify-between py-2 border-b border-white/[0.04]">
                      <span>{item}</span>
                      <span className="text-amber-400 font-semibold">{cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc, cta, href }: { icon: string; title: string; desc: string; cta: string; href: string }) {
  return (
    <div className="text-center py-20 glass border border-white/[0.06] rounded-2xl">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-sm mx-auto">{desc}</p>
      <Link href={href} className="btn-primary px-6 py-3 rounded-xl inline-block">{cta}</Link>
    </div>
  );
}

function getTypeEmoji(type: string): string {
  const map: Record<string, string> = { resume: '📄', 'cover-letter': '✉️', 'business-plan': '📊', proposal: '📝', invoice: '🧾', 'budget-plan': '📉', 'content-calendar': '📆', 'social-media-kit': '📱', 'press-release': '📰', 'meeting-agenda': '📅' };
  return map[type] || '📋';
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}>
      <DashboardInner />
    </Suspense>
  );
}
