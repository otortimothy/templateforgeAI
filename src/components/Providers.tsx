'use client';

import { AuthProvider } from '@/lib/auth-context';
import { DashboardProvider } from '@/lib/dashboard-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </DashboardProvider>
    </AuthProvider>
  );
}
