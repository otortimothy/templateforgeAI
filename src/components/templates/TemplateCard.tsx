'use client';

import Link from 'next/link';
import { Star, Download, ShoppingCart } from 'lucide-react';
import { MarketplaceTemplate } from '@/lib/marketplace-data';
import clsx from 'clsx';

interface TemplateCardProps {
  template: MarketplaceTemplate;
  onPurchase?: (template: MarketplaceTemplate) => void;
  isPurchased?: boolean;
  compact?: boolean;
}

export default function TemplateCard({ template, onPurchase, isPurchased, compact }: TemplateCardProps) {
  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden border border-white/[0.06] group flex flex-col h-full">
      {/* Preview Banner */}
      <Link href={`/marketplace/${template.id}`}>
        <div className={clsx(
          'h-36 bg-gradient-to-br relative overflow-hidden cursor-pointer',
          template.previewColor
        )}>
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <span className="text-3xl">{getTypeEmoji(template.type)}</span>
              <p className="text-white/80 text-xs font-medium mt-1">{template.type.replace(/-/g, ' ')}</p>
            </div>
          </div>
          {template.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                ⭐ Featured
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full border border-white/10 capitalize">
              {template.category}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/marketplace/${template.id}`}>
          <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1">
            {template.title}
          </h3>
        </Link>

        {!compact && (
          <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">
            {template.description}
          </p>
        )}

        {/* Seller */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
            {template.seller.avatar}
          </div>
          <span className="text-slate-400 text-xs truncate">{template.seller.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4 mt-auto">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-white">{template.rating.toFixed(1)}</span>
            <span className="text-slate-500 text-xs">({template.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Download size={11} />
            <span className="text-xs">{formatNum(template.downloadCount)}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-white">${template.price}</span>
          <button
            id={`buy-btn-${template.id}`}
            onClick={() => onPurchase?.(template)}
            disabled={isPurchased}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              isPurchased
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                : 'btn-primary'
            )}
          >
            {isPurchased ? (
              '✓ Purchased'
            ) : (
              <>
                <ShoppingCart size={12} />
                Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function getTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    resume: '📄',
    'cover-letter': '✉️',
    'business-plan': '📊',
    proposal: '📝',
    invoice: '🧾',
    'budget-plan': '📉',
    'content-calendar': '📆',
    'social-media-kit': '📱',
    'press-release': '📰',
    'meeting-agenda': '📅',
  };
  return map[type] || '📋';
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
