'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import clsx from 'clsx';

const BENEFITS = [
  '25 free credits on signup',
  'Access to 30+ template types',
  'Unlimited marketplace browsing',
  'Save & download your templates',
];

function AuthPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, signup } = useAuth();

  const [tab, setTab] = useState<'login' | 'signup'>(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { success, error: err } = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (success) {
      router.push('/dashboard');
    } else {
      setError(err || 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { success, error: err } = await signup(signupForm.name, signupForm.email, signupForm.password);
    setLoading(false);
    if (success) {
      setToast('Account created successfully! Logging you in...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setError(err || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl font-bold animate-fade-in flex items-center gap-3">
          <div className="bg-white/20 p-1 rounded-full"><Check size={16} className="text-white" /></div>
          {toast}
        </div>
      )}

      {/* Left: Brand panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center w-2/5 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-[#0a0a0f] px-12 py-20 border-r border-white/[0.06] relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl">
              Template<span className="gradient-text">Forge</span>{' '}
              <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
            </span>
          </Link>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Generate professional templates in seconds
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join 2,400+ professionals saving hours every week with AI-powered document generation.
          </p>

          <ul className="space-y-4">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-green-400" />
                </div>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-slate-500 mb-3">Demo credentials to explore</p>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">Email: <span className="text-indigo-300 font-mono">demo@templateforge.ai</span></p>
              <p className="text-slate-400">Password: <span className="text-indigo-300 font-mono">demo1234</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-16">
        <div className="w-full max-w-sm">
          {/* Logo (mobile) */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white">Template<span className="gradient-text">Forge</span> AI</span>
          </Link>

          {/* Tabs */}
          <div className="flex p-1 glass border border-white/10 rounded-xl mb-8">
            <button
              id="tab-login"
              onClick={() => { setTab('login'); setError(''); }}
              className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-all', tab === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              onClick={() => { setTab('signup'); setError(''); }}
              className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-all', tab === 'signup' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}
            >
              Sign Up
            </button>
          </div>

          <div className="animate-fade-in">
            {tab === 'login' ? (
              <>
                <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
                <p className="text-slate-400 text-sm mb-6">Sign in to access your templates</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPass ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="••••••••"
                        className="input-field pr-10"
                        required
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <button
                    id="login-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Signing In...</> : <>Sign In <ArrowRight size={16} /></>}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold text-white mb-1">Create your account</h1>
                <p className="text-slate-400 text-sm mb-6">Start free — 25 credits included</p>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input id="signup-name" type="text" value={signupForm.name} onChange={e => setSignupForm(p => ({...p, name: e.target.value}))} placeholder="Alexandra Johnson" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
                    <input id="signup-email" type="email" value={signupForm.email} onChange={e => setSignupForm(p => ({...p, email: e.target.value}))} placeholder="you@example.com" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPass ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={e => setSignupForm(p => ({...p, password: e.target.value}))}
                        placeholder="Min. 6 characters"
                        className="input-field pr-10"
                        required
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Confirm Password</label>
                    <input id="signup-confirm" type="password" value={signupForm.confirmPassword} onChange={e => setSignupForm(p => ({...p, confirmPassword: e.target.value}))} placeholder="••••••••" className="input-field" required />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <button
                    id="signup-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : <>Create Free Account <ArrowRight size={16} /></>}
                  </button>

                  <p className="text-slate-500 text-xs text-center">
                    By signing up, you agree to our{' '}
                    <Link href="#" className="text-indigo-400 hover:underline">Terms</Link> and{' '}
                    <Link href="#" className="text-indigo-400 hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}>
      <AuthPageInner />
    </Suspense>
  );
}
