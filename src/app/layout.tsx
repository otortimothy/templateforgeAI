import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "TemplateForge AI — Generate & Sell Professional Templates",
  description: "AI-powered template generator and marketplace. Generate resumes, business plans, invoices, cover letters, and more in seconds. Browse and purchase premium templates from expert creators.",
  keywords: "AI templates, resume generator, business plan, template marketplace, document generator",
  openGraph: {
    title: "TemplateForge AI",
    description: "Generate professional templates with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-slate-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
