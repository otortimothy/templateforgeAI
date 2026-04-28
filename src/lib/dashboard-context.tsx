'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { GeneratedTemplate } from '@/lib/generate';
import { MarketplaceTemplate } from './marketplace-data';

export type { GeneratedTemplate };

export interface PurchasedTemplate extends MarketplaceTemplate {
  purchasedAt: string;
}

interface DashboardContextType {
  generatedTemplates: GeneratedTemplate[];
  purchasedTemplates: PurchasedTemplate[];
  isLoadingTemplates: boolean;
  addGenerated: (tpl: GeneratedTemplate) => void;
  addPurchased: (tpl: MarketplaceTemplate) => void;
  removeGenerated: (id: string) => Promise<void>;
  isPurchased: (id: string) => boolean;
  refetchGenerated: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [generatedTemplates, setGeneratedTemplates] = useState<GeneratedTemplate[]>([]);
  const [purchasedTemplates, setPurchasedTemplates] = useState<PurchasedTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  // ── Fetch generated templates from DB ──────────────────────────────────
  const fetchGenerated = async () => {
    if (!user) {
      setGeneratedTemplates([]);
      return;
    }
    setIsLoadingTemplates(true);
    const { data, error } = await supabase
      .from('generated_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setGeneratedTemplates(
        data.map(row => ({
          id: row.id,
          type: row.type,
          title: row.title,
          html: row.html_content,
          createdAt: row.created_at,
          formData: row.form_data || {},
        }))
      );
    }
    setIsLoadingTemplates(false);
  };

  // ── Fetch purchased templates from DB ───────────────────────────────────
  const fetchPurchased = async () => {
    if (!user) {
      setPurchasedTemplates([]);
      return;
    }
    const { data, error } = await supabase
      .from('purchased_templates')
      .select('*, marketplace_templates(*)')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (!error && data) {
      setPurchasedTemplates(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((row: any) => ({
          ...row.marketplace_templates,
          purchasedAt: row.purchased_at,
        }))
      );
    }
  };

  // Re-fetch whenever the user changes (login/logout)
  useEffect(() => {
    fetchGenerated();
    fetchPurchased();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── addGenerated: optimistic update — API route handles the DB insert ──
  const addGenerated = (tpl: GeneratedTemplate) => {
    setGeneratedTemplates(prev => [tpl, ...prev].slice(0, 50));
  };

  // ── addPurchased ──────────────────────────────────────────────────────
  const addPurchased = (tpl: MarketplaceTemplate) => {
    const purchased: PurchasedTemplate = { ...tpl, purchasedAt: new Date().toISOString() };
    setPurchasedTemplates(prev => {
      if (prev.find(p => p.id === tpl.id)) return prev;
      return [purchased, ...prev];
    });
  };

  // ── removeGenerated ───────────────────────────────────────────────────
  const removeGenerated = async (id: string) => {
    // Optimistic
    setGeneratedTemplates(prev => prev.filter(t => t.id !== id));

    if (user) {
      await supabase
        .from('generated_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // RLS safety
    }
  };

  const isPurchased = (id: string) => purchasedTemplates.some(t => t.id === id);

  return (
    <DashboardContext.Provider value={{
      generatedTemplates,
      purchasedTemplates,
      isLoadingTemplates,
      addGenerated,
      addPurchased,
      removeGenerated,
      isPurchased,
      refetchGenerated: fetchGenerated,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}
