import Link from 'next/link';
import { Zap, Mail, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Generate Templates', href: '/generate' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                Template<span className="gradient-text">Forge</span>{' '}
                <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Generate, customize, and sell professional templates powered by AI. Save hours of work and level up your output quality.
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field flex-1 text-sm py-2.5"
                  id="footer-email"
                />
                <button className="btn-primary px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TemplateForge AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium" aria-label="Twitter">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium" aria-label="GitHub">GitHub</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
