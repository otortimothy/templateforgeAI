'use client';

import { useState, useRef } from 'react';
import { Download, FileText, Copy, Edit3, Check, Loader2, Save } from 'lucide-react';
import { GeneratedTemplate } from '@/lib/generate';
import { downloadAsPDF, downloadAsDocx, copyToClipboard } from '@/lib/download';
import { useDashboard } from '@/lib/dashboard-context';

interface TemplateOutputProps {
  template: GeneratedTemplate;
  onHtmlChange?: (html: string) => void;
}

export default function TemplateOutput({ template, onHtmlChange }: TemplateOutputProps) {
  const [html, setHtml] = useState(template.html);
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [saved, setSaved] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const { addGenerated } = useDashboard();

  const handleCopy = async () => {
    await copyToClipboard(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await downloadAsPDF('template-output-content', template.title);
    } catch {
      alert('PDF download failed. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = () => {
    downloadAsDocx(html, template.title);
  };

  const handleSave = () => {
    const updated = { ...template, html };
    addGenerated(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 p-4 bg-[#111118]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <FileText size={14} className="text-white" />
          </div>
          <span className="text-white text-base font-bold truncate tracking-tight">{template.title}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit hint */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mr-2">
            <Edit3 size={12} />
            <span>Click document to edit directly</span>
          </div>

          {/* Copy */}
          <button
            id="copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Save */}
          <button
            id="save-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
          >
            {saved ? <Check size={14} className="text-green-400" /> : <Save size={14} />}
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>

          <div className="w-px h-6 bg-white/[0.06] mx-1" />

          {/* Download PDF */}
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-60"
          >
            {downloadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Download size={14} className="text-red-400" />}
            PDF
          </button>

          {/* Download DOCX */}
          <button
            id="download-docx-btn"
            onClick={handleDownloadDocx}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all"
          >
            <Download size={14} className="text-blue-400" />
            DOCX
          </button>
        </div>
      </div>

      {/* Document output scrollable container */}
      <div className="flex-1 overflow-auto bg-[#0a0a0f] p-4 sm:p-8 lg:p-12" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div
          id="template-output-content"
          ref={outputRef}
          contentEditable
          suppressContentEditableWarning
          onInput={e => {
            const el = e.currentTarget;
            onHtmlChange?.(el.innerHTML);
          }}
          className="template-output min-h-[1056px] w-full max-w-[816px] mx-auto bg-white shadow-2xl p-8 sm:p-12 md:p-16 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 rounded-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
