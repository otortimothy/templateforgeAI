'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Download, ShoppingCart, Check, Shield, Clock, Zap } from 'lucide-react';
import { getTemplateById, getRelatedTemplates } from '@/lib/marketplace-data';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import TemplateCard from '@/components/templates/TemplateCard';
import clsx from 'clsx';

interface Props {
  params: Promise<{ id: string }>;
}

export default function TemplateDetailPage({ params }: Props) {
  const { id } = use(params);
  const template = getTemplateById(id);

  if (!template) notFound();

  const related = getRelatedTemplates(template);
  const { addPurchased, isPurchased } = useDashboard();
  const { user } = useAuth();
  const router = useRouter();
  const purchased = isPurchased(template.id);

  const handlePurchase = () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    addPurchased(template);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back */}
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left: Details (2 cols) */}
        <div className="lg:col-span-2">
          {/* Preview banner */}
          <div className={`h-64 rounded-2xl bg-gradient-to-br ${template.previewColor} relative overflow-hidden mb-8`}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 30px)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <span className="text-6xl">{getTypeEmoji(template.type)}</span>
                <p className="text-white/80 text-sm font-medium mt-2">{template.title}</p>
              </div>
            </div>
            {template.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">⭐ Featured Template</span>
              </div>
            )}
          </div>

          {/* Title & meta */}
          <div className="mb-6">
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                {template.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-400 border border-white/10">
                {template.type.replace(/-/g, ' ')}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3">{template.title}</h1>
            <p className="text-slate-400 leading-relaxed text-base">{template.description}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center border border-white/[0.06]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-xl font-bold text-white">{template.rating.toFixed(1)}</span>
              </div>
              <p className="text-slate-400 text-xs">{template.reviewCount} reviews</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/[0.06]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Download size={16} className="text-indigo-400" />
                <span className="text-xl font-bold text-white">{formatNum(template.downloadCount)}</span>
              </div>
              <p className="text-slate-400 text-xs">downloads</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/[0.06]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield size={16} className="text-green-400" />
                <span className="text-xl font-bold text-white">100%</span>
              </div>
              <p className="text-slate-400 text-xs">satisfaction</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {template.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-400">
                #{tag}
              </span>
            ))}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-white mb-5">
              Customer Reviews
              <span className="text-base font-normal text-slate-400 ml-2">({template.reviewCount})</span>
            </h2>

            {/* Rating breakdown */}
            <div className="glass border border-white/[0.06] rounded-xl p-5 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-white">{template.rating.toFixed(1)}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={clsx(i < Math.round(template.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600')} />
                    ))}
                  </div>
                  <p className="text-slate-400 text-xs mt-1">out of 5</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const pct = star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : 2;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-4 text-right">{star}</span>
                        <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review cards */}
            <div className="space-y-4">
              {template.reviews.map(review => (
                <div key={review.id} className="glass border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{review.author}</p>
                        <p className="text-slate-500 text-xs">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Purchase sidebar */}
        <div className="lg:col-span-1">
          <div className="glass border border-white/[0.06] rounded-2xl p-6 sticky top-24">
            {/* Price */}
            <div className="text-center mb-6">
              <p className="text-5xl font-extrabold text-white mb-1">${template.price}</p>
              <p className="text-slate-400 text-sm">One-time purchase · Lifetime access</p>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                {template.seller.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{template.seller.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  {template.seller.rating} · {formatNum(template.seller.totalSales)} sales
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              id={`purchase-btn-${template.id}`}
              onClick={handlePurchase}
              disabled={purchased}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base mb-4 transition-all',
                purchased
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default'
                  : 'btn-primary'
              )}
            >
              {purchased ? (
                <><Check size={18} /> Already Purchased</>
              ) : (
                <><ShoppingCart size={18} /> Purchase Template</>
              )}
            </button>

            {purchased && (
              <Link href="/dashboard?tab=purchased" className="block text-center text-indigo-400 text-sm hover:underline mb-4">
                View in Dashboard →
              </Link>
            )}

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: <Download size={14} />, text: 'Instant download after purchase' },
                { icon: <Zap size={14} />, text: 'Fully customizable with AI' },
                { icon: <Shield size={14} />, text: 'Commercial use license included' },
                { icon: <Clock size={14} />, text: 'Lifetime access to updates' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="text-indigo-400">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <Link href="/generate" className="block text-center text-sm text-slate-400 hover:text-white transition-colors">
                Or generate a similar template for free →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related templates */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Related Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onPurchase={(tpl) => {
                  if (!user) { router.push('/auth'); return; }
                  addPurchased(tpl);
                }}
                isPurchased={isPurchased(t.id)}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    resume: '📄', 'cover-letter': '✉️', 'business-plan': '📊',
    proposal: '📝', invoice: '🧾', 'budget-plan': '📉',
    'content-calendar': '📆', 'social-media-kit': '📱',
    'press-release': '📰', 'meeting-agenda': '📅',
  };
  return map[type] || '📋';
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
