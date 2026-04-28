'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Zap, Menu, X, ChevronDown, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import clsx from 'clsx';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/generate', label: 'Generate' },
  { href: '/modify', label: 'AI Modify' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/85 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-white text-lg md:text-xl tracking-tight">
              Template<span className="gradient-text">Forge</span>
            </span>
            <span className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                  pathname === link.href 
                    ? 'text-indigo-300 bg-indigo-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/pricing" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                  <span className="text-amber-400 text-xs font-bold">⚡ {user.credits}</span>
                  <span className="text-amber-500/70 text-xs font-medium">credits</span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all outline-none"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {user.avatar}
                    </div>
                    <span className="text-sm font-semibold text-white ml-1">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={clsx("text-slate-400 transition-transform duration-200", userMenuOpen && "rotate-180")} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 bg-[#111118]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                      <div className="p-4 border-b border-white/[0.06] bg-white/[0.02]">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                        <div className="mt-2 inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                          {user.plan} PLAN
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        {[
                          { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                          { href: '/dashboard?tab=settings', icon: Settings, label: 'Settings' },
                        ].map(item => (
                          <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <item.icon size={16} /> {item.label}
                          </Link>
                        ))}
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-400/10 rounded-xl transition-colors mt-1">
                            <Settings size={16} /> Admin Panel
                          </Link>
                        )}
                        <div className="h-px bg-white/[0.06] my-2" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-xl transition-colors text-left">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth" className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/auth?tab=signup" className="btn-primary px-6 py-2.5 rounded-xl text-sm shadow-indigo-500/20">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a0f]/98 backdrop-blur-xl animate-fade-in h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'p-4 rounded-xl text-base font-bold transition-all',
                  pathname === link.href 
                    ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20' 
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-3">
              {user ? (
                <>
                  <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl mb-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-base font-bold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">{user.plan}</span>
                      <span className="text-sm font-bold text-amber-400">⚡ {user.credits} credits</span>
                    </div>
                  </div>
                  
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl text-slate-200 font-semibold text-base">
                    <LayoutDashboard size={20} className="text-indigo-400" /> Dashboard
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-xl text-amber-400 font-semibold text-base">
                      <Settings size={20} /> Admin Panel
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 bg-red-500/10 rounded-xl text-red-400 font-semibold text-base text-left mt-2">
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="p-4 text-center text-slate-300 font-semibold text-base rounded-xl border border-white/10">
                    Sign In
                  </Link>
                  <Link href="/auth?tab=signup" onClick={() => setMobileOpen(false)} className="btn-primary p-4 text-center rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20">
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for desktop dropdown */}
      {userMenuOpen && <div className="fixed inset-0 z-40 hidden md:block" onClick={() => setUserMenuOpen(false)} />}
    </nav>
  );
}
