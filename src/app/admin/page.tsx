'use client';

import { useState } from 'react';
import { Users, FileText, CreditCard, ShieldCheck, TrendingUp, Eye, Trash2, Check, X, Search } from 'lucide-react';
import { MARKETPLACE_TEMPLATES } from '@/lib/marketplace-data';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import clsx from 'clsx';

type AdminTab = 'overview' | 'users' | 'templates' | 'transactions';

const MOCK_USERS_DATA = [
  { id: 'u1', name: 'Alexandra Chen', email: 'alex@example.com', plan: 'pro', templates: 47, joined: '2024-10-01', status: 'active' },
  { id: 'u2', name: 'Marcus Williams', email: 'marcus@example.com', plan: 'business', templates: 120, joined: '2024-08-15', status: 'active' },
  { id: 'u3', name: 'Priya Patel', email: 'priya@example.com', plan: 'free', templates: 3, joined: '2024-11-20', status: 'active' },
  { id: 'u4', name: 'Jordan Lee', email: 'jordan@example.com', plan: 'pro', templates: 22, joined: '2024-09-05', status: 'suspended' },
  { id: 'u5', name: 'Sofia Rodriguez', email: 'sofia@example.com', plan: 'pro', templates: 88, joined: '2024-07-12', status: 'active' },
  { id: 'u6', name: 'David Kim', email: 'david@example.com', plan: 'free', templates: 1, joined: '2024-11-28', status: 'active' },
  { id: 'u7', name: 'Amara Osei', email: 'amara@example.com', plan: 'business', templates: 203, joined: '2024-06-01', status: 'active' },
];

const MOCK_TRANSACTIONS = [
  { id: 't1', user: 'Alexandra Chen', type: 'credit_purchase', amount: 12, credits: 350, date: '2024-11-28', status: 'completed' },
  { id: 't2', user: 'Marcus Williams', type: 'marketplace_sale', amount: 49, credits: 0, date: '2024-11-27', status: 'completed' },
  { id: 't3', user: 'Sofia Rodriguez', type: 'subscription', amount: 19, credits: 0, date: '2024-11-26', status: 'completed' },
  { id: 't4', user: 'Priya Patel', type: 'template_purchase', amount: 29, credits: 0, date: '2024-11-25', status: 'completed' },
  { id: 't5', user: 'Jordan Lee', type: 'credit_purchase', amount: 5, credits: 100, date: '2024-11-24', status: 'refunded' },
  { id: 't6', user: 'Amara Osei', type: 'subscription', amount: 49, credits: 0, date: '2024-11-23', status: 'completed' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [search, setSearch] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-3">Access Restricted</h2>
          <p className="text-slate-400 mb-6">This page requires admin privileges.</p>
          <p className="text-slate-500 text-sm mb-6">Login with: <span className="text-indigo-400 font-mono">admin@templateforge.ai</span> / <span className="text-indigo-400 font-mono">admin1234</span></p>
          <Link href="/auth" className="btn-primary px-6 py-3 rounded-xl inline-block">Sign In as Admin</Link>
        </div>
      </div>
    );
  }

  const STATS = [
    { label: 'Total Users', value: '2,413', change: '+12%', icon: <Users size={18} />, color: 'text-indigo-400' },
    { label: 'Templates Generated', value: '51,204', change: '+8%', icon: <FileText size={18} />, color: 'text-purple-400' },
    { label: 'Revenue (MTD)', value: '$8,420', change: '+23%', icon: <TrendingUp size={18} />, color: 'text-green-400' },
    { label: 'Pending Reviews', value: '14', change: '-3', icon: <ShieldCheck size={18} />, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm">TemplateForge AI — Management Console</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/[0.06] pb-2 overflow-x-auto">
        {([
          { id: 'overview', label: 'Overview', icon: <TrendingUp size={15} /> },
          { id: 'users', label: 'Users', icon: <Users size={15} /> },
          { id: 'templates', label: 'Templates', icon: <FileText size={15} /> },
          { id: 'transactions', label: 'Transactions', icon: <CreditCard size={15} /> },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="glass border border-white/[0.06] rounded-2xl p-5">
                <div className={clsx('mb-2', s.color)}>{s.icon}</div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
                <p className="text-green-400 text-xs font-semibold mt-1">{s.change} this month</p>
              </div>
            ))}
          </div>

          <div className="glass border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Platform Health</h3>
            <div className="space-y-3">
              {[
                { label: 'Template Generation Success Rate', value: 99.2, color: '#6366f1' },
                { label: 'Marketplace Fulfillment Rate', value: 100, color: '#10b981' },
                { label: 'User Satisfaction Score', value: 94, color: '#f59e0b' },
                { label: 'Template Approval Rate (Last 30d)', value: 87, color: '#8b5cf6' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pl-9 text-sm" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="glass border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left p-4 text-slate-400 font-semibold">User</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Plan</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Templates</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Joined</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Status</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS_DATA.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                    <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-slate-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={clsx('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', u.plan === 'business' ? 'bg-amber-500/20 text-amber-300' : u.plan === 'pro' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/10 text-slate-400')}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{u.templates}</td>
                      <td className="p-4 text-slate-400 text-xs">{u.joined}</td>
                      <td className="p-4">
                        <span className={clsx('flex items-center gap-1 text-xs font-semibold w-fit', u.status === 'active' ? 'text-green-400' : 'text-red-400')}>
                          {u.status === 'active' ? <Check size={11} /> : <X size={11} />}
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Eye size={13} /></button>
                          <button className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      {tab === 'templates' && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-white mb-5">Marketplace Templates ({MARKETPLACE_TEMPLATES.length})</h2>
          <div className="glass border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left p-4 text-slate-400 font-semibold">Template</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Category</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Price</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Downloads</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Rating</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKETPLACE_TEMPLATES.slice(0, 15).map(t => (
                    <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="text-white font-medium text-sm truncate max-w-[200px]">{t.title}</p>
                        <p className="text-slate-500 text-xs">{t.seller.name}</p>
                      </td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 capitalize">{t.category}</span></td>
                      <td className="p-4 text-slate-300">${t.price}</td>
                      <td className="p-4 text-slate-300">{t.downloadCount.toLocaleString()}</td>
                      <td className="p-4 text-amber-400 font-semibold">★ {t.rating}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/marketplace/${t.id}`} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"><Eye size={13} /></Link>
                          <button className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-white mb-5">Recent Transactions</h2>
          <div className="glass border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left p-4 text-slate-400 font-semibold">User</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Type</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Amount</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Credits</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Date</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TRANSACTIONS.map(t => (
                    <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="p-4 text-slate-300">{t.user}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300 capitalize">{t.type.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="p-4 text-green-400 font-semibold">${t.amount}</td>
                      <td className="p-4 text-amber-400">{t.credits || '—'}</td>
                      <td className="p-4 text-slate-400 text-xs">{t.date}</td>
                      <td className="p-4">
                        <span className={clsx('text-xs font-semibold', t.status === 'completed' ? 'text-green-400' : 'text-red-400')}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
