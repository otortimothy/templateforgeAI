import Link from 'next/link';
import { Check, Zap, ArrowRight, Star, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: '',
    description: 'Perfect for trying out TemplateForge',
    credits: '25 credits one-time',
    highlight: false,
    badge: '',
    features: [
      { text: '25 generation credits', included: true },
      { text: '5 template types', included: true },
      { text: 'PDF downloads', included: true },
      { text: 'DOCX downloads', included: false },
      { text: 'AI customization', included: false },
      { text: 'Marketplace browsing', included: true },
      { text: 'Template purchasing', included: true },
      { text: 'Priority support', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Get Started Free',
    href: '/auth?tab=signup',
  },
  {
    name: 'Pro',
    price: 19,
    period: '/month',
    description: 'For professionals who generate frequently',
    credits: '300 credits / month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: '300 credits per month', included: true },
      { text: 'All 30+ template types', included: true },
      { text: 'PDF downloads', included: true },
      { text: 'DOCX downloads', included: true },
      { text: 'AI customization', included: true },
      { text: 'Marketplace browsing', included: true },
      { text: 'Template purchasing', included: true },
      { text: 'Priority support', included: true },
      { text: 'API access', included: false },
    ],
    cta: 'Start Pro Plan',
    href: '/auth?tab=signup',
  },
  {
    name: 'Business',
    price: 49,
    period: '/month',
    description: 'For teams and power users',
    credits: 'Unlimited credits',
    highlight: false,
    badge: '',
    features: [
      { text: 'Unlimited credits', included: true },
      { text: 'All 30+ template types', included: true },
      { text: 'PDF downloads', included: true },
      { text: 'DOCX downloads', included: true },
      { text: 'AI customization', included: true },
      { text: 'Marketplace browsing', included: true },
      { text: 'Template purchasing', included: true },
      { text: 'Priority support', included: true },
      { text: 'API access (Q2 2025)', included: true },
    ],
    cta: 'Start Business Plan',
    href: '/auth?tab=signup',
  },
];

const FAQS = [
  { q: 'What are credits?', a: 'Credits are used to generate templates. Each template type costs a different number of credits based on complexity. Resumes cost 8, Business Plans cost 10, Invoices cost 5, etc.' },
  { q: 'Do unused credits roll over?', a: 'On the Pro and Business plans, unused credits roll over for up to 3 months. Free credits never expire.' },
  { q: 'Can I cancel anytime?', a: 'Yes, absolutely. Cancel your subscription anytime from your dashboard. You\'ll keep access until the end of your billing period.' },
  { q: 'Is there a free trial?', a: 'Yes! Sign up for free and get 25 credits immediately — no credit card required. Generate your first templates completely free.' },
  { q: 'Can I sell templates on the marketplace?', a: 'Yes! On Pro and Business plans, you can submit templates to our marketplace and earn 85% of each sale.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers via Stripe. (Payment processing will be live in Phase 2.)' },
];

const CREDIT_TOPUPS = [
  { credits: 100, price: 5 },
  { credits: 300, price: 12, bonus: 50 },
  { credits: 700, price: 25, bonus: 150 },
  { credits: 2000, price: 59, bonus: 500 },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6">
          <Zap size={14} />
          Simple, Transparent Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Start free,{' '}
          <span className="gradient-text glow-text">scale as you grow</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-xl mx-auto">
          No hidden fees. No commitments. Generate your first 5 templates completely free.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-fade-in-up">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={clsx(
              'relative rounded-2xl p-6 border transition-all duration-300',
              plan.highlight
                ? 'bg-gradient-to-b from-indigo-600/20 to-purple-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-105'
                : 'glass border-white/[0.06]'
            )}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-max whitespace-nowrap">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  ⭐ {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">${plan.price}</span>
                {plan.period && <span className="text-slate-400">{plan.period}</span>}
              </div>
              <p className="text-indigo-400 text-sm font-medium mt-1">{plan.credits}</p>
            </div>

            <ul className="space-y-3 mb-7">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-2.5 text-sm">
                  {f.included ? (
                    <Check size={15} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center text-slate-600">✕</span>
                  )}
                  <span className={f.included ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              id={`plan-cta-${plan.name.toLowerCase()}`}
              className={clsx(
                'block text-center py-3.5 rounded-xl font-bold transition-all',
                plan.highlight ? 'btn-primary' : 'btn-secondary'
              )}
            >
              {plan.cta}
              {plan.price === 0 && ' →'}
            </Link>
          </div>
        ))}
      </div>

      {/* Credit Top-up */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">Just need more credits?</h2>
          <p className="text-slate-400">Buy credits anytime without changing your plan.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {CREDIT_TOPUPS.map(pack => (
            <div key={pack.credits} className="glass border border-white/[0.06] rounded-2xl p-5 text-center hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl font-extrabold text-white">{pack.credits}</p>
              <p className="text-indigo-400 text-sm mb-1">credits</p>
              {pack.bonus && <p className="text-green-400 text-xs font-semibold mb-2">+{pack.bonus} bonus</p>}
              <p className="text-xl font-bold text-white mb-4">${pack.price}</p>
              <button className="btn-secondary w-full py-2 rounded-lg text-sm font-semibold group-hover:border-indigo-500/40 group-hover:text-indigo-400 transition-all">
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature comparison table */}
      <div className="mb-16 overflow-x-auto">
        <h2 className="text-2xl font-extrabold text-white mb-6 text-center">Full Feature Comparison</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-4 text-slate-400 font-semibold">Feature</th>
              {PLANS.map(p => (
                <th key={p.name} className={clsx('p-4 font-bold text-center', p.highlight ? 'text-indigo-400' : 'text-white')}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Monthly Credits', '25 (once)', '300', 'Unlimited'],
              ['Template Types', '5', '30+', '30+'],
              ['PDF Downloads', '✓', '✓', '✓'],
              ['DOCX Downloads', '–', '✓', '✓'],
              ['AI Customization', '–', '✓', '✓'],
              ['Marketplace Access', '✓', '✓', '✓'],
              ['Sell Templates', '–', '✓', '✓'],
              ['Priority Support', '–', '✓', '✓'],
              ['API Access', '–', '–', 'Q2 2025'],
              ['Team Members', '1', '1', 'Up to 10'],
            ].map(([feature, free, pro, biz], i) => (
              <tr key={i} className={clsx('border-t border-white/[0.06]', i % 2 === 0 ? 'bg-white/[0.02]' : '')}>
                <td className="p-4 text-slate-300 font-medium">{feature}</td>
                <td className="p-4 text-center text-slate-400">{free}</td>
                <td className="p-4 text-center text-indigo-300 font-medium">{pro}</td>
                <td className="p-4 text-center text-slate-300">{biz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQs */}
      <div className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <HelpCircle size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-2">{faq.q}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center py-12 glass border border-white/[0.06] rounded-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to get started?</h2>
        <p className="text-slate-400 mb-6">Join thousands of professionals generating better documents faster.</p>
        <Link href="/auth?tab=signup" id="pricing-cta" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl">
          <Zap size={18} />
          Get 25 Free Credits
          <ArrowRight size={16} />
        </Link>
        <p className="text-slate-500 text-sm mt-3">No credit card required</p>
      </div>
    </div>
  );
}
