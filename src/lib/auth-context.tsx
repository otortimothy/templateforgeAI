'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ── User shape (keep identical to Phase 1 so all UI components work unchanged) ──
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;       // initials e.g. "DU"
  credits: number;
  plan: 'free' | 'pro' | 'business';
  role: 'user' | 'seller' | 'admin';
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredits: (amount: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Convert Supabase user + profile row → our User shape ──────────────────
function buildUser(supabaseUser: SupabaseUser, profile: Record<string, unknown> | null): User {
  const name =
    (profile?.full_name as string) ||
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.email?.split('@')[0] ||
    'User';

  const avatar = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    id: supabaseUser.id,
    name,
    email: supabaseUser.email || '',
    avatar,
    credits: (profile?.credits as number) ?? 3,
    plan: (profile?.plan as User['plan']) ?? 'free',
    role: (profile?.role as User['role']) ?? 'user',
    joinedAt:
      (profile?.created_at as string)?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // ── Fetch profile from DB and merge with auth user ─────────────────────
  const fetchAndSetUser = async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    setUser(buildUser(supabaseUser, profile));
  };

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      await fetchAndSetUser(supabaseUser);
    }
  };

  // ── Initialize session on mount and listen for auth changes ──────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        await fetchAndSetUser(session.user);
      }
      setIsLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchAndSetUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Profile is auto-created by the DB trigger (handle_new_user).
    // The onAuthStateChange listener will pick up the new session.
    return { success: true };
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ── Update credits (optimistic UI + DB sync) ──────────────────────────────
  const updateCredits = async (amount: number) => {
    if (!user) return;

    // Optimistic update
    const newCredits = Math.max(0, user.credits + amount);
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);

    // Persist to DB
    await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateCredits, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
