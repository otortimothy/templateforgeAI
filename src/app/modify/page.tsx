'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Zap, Wand2, ArrowRight, Loader2, Check, Sparkles, FileEdit,
  Upload, ImageIcon, X, FileText
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDashboard } from '@/lib/dashboard-context';
import TemplateOutput from '@/components/templates/TemplateOutput';
import Link from 'next/link';
import type { TemplateType } from '@/lib/templates';
import type { GeneratedTemplate } from '@/lib/generate';

const MODIFY_COST = 2;

const EXAMPLE_INSTRUCTIONS = [
  'Make the design more modern with a dark navy color scheme',
  'Change the font style to something more elegant and formal',
  'Add a professional sidebar layout with skills on the left',
  'Rewrite using a minimalist style with more whitespace',
  'Convert this to a two-column layout with a colored header',
];

type InputMode = 'paste' | 'upload';

interface UploadedFile {
  name: string;
  type: string;
  base64: string;       // base64 data URL (images) or raw text (text files)
  isImage: boolean;
  preview?: string;     // data URL for <img> preview
}

export default function ModifyPage() {
  const { user, updateCredits } = useAuth();
  const { addGenerated } = useDashboard();

  const [inputMode, setInputMode] = useState<InputMode>('paste');
  const [templateContent, setTemplateContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedTemplate | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File handling ─────────────────────────────────────── */
  const processFile = useCallback((file: File) => {
    setError('');
    const isImage = file.type.startsWith('image/');
    const isText = file.type === 'text/plain' || file.type === 'text/html'
      || file.name.endsWith('.html') || file.name.endsWith('.txt')
      || file.name.endsWith('.htm');

    if (!isImage && !isText) {
      setError('Unsupported file type. Please upload an image (PNG, JPG, WEBP) or a text/HTML file.');
      return;
    }

    const reader = new FileReader();

    if (isImage) {
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedFile({
          name: file.name,
          type: file.type,
          base64: dataUrl,
          isImage: true,
          preview: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedFile({
          name: file.name,
          type: file.type,
          base64: text,
          isImage: false,
        });
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  /* ── Submit ────────────────────────────────────────────── */
  const handleModify = async () => {
    setError('');

    const hasContent = inputMode === 'paste'
      ? templateContent.trim().length > 0
      : uploadedFile !== null;

    if (!hasContent) {
      setError(inputMode === 'paste'
        ? 'Please paste your existing template content first.'
        : 'Please upload a file first.');
      return;
    }
    if (!instructions.trim()) {
      setError('Please provide modification instructions.');
      return;
    }
    if (user && user.credits < MODIFY_COST) {
      setError(`You need at least ${MODIFY_COST} credits. You currently have ${user.credits}.`);
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, string> = { instructions };

      if (inputMode === 'paste') {
        body.templateContent = templateContent;
      } else if (uploadedFile) {
        if (uploadedFile.isImage) {
          body.imageBase64 = uploadedFile.base64;   // full data URL
          body.imageType = uploadedFile.type;
        } else {
          body.templateContent = uploadedFile.base64; // already text
        }
      }

      const res = await fetch('/api/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Modification failed.');

      const generated: GeneratedTemplate = {
        ...data,
        type: data.type as TemplateType,
        formData: { instructions },
      };
      setResult(generated);
      addGenerated(generated);
      if (user) updateCredits(-MODIFY_COST);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Wand2 size={20} className="text-white" />
          </div>
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            ⚡ {MODIFY_COST} credits per modification
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
          AI Modification
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Upload a photo or file of your existing template, or paste the content — then tell the AI what to change.
        </p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Input panel */}
          <div className="space-y-6">

            {/* Input mode toggle */}
            <div className="flex p-1 glass border border-white/10 rounded-xl">
              <button
                onClick={() => { setInputMode('paste'); setUploadedFile(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputMode === 'paste' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <FileEdit size={15} /> Paste Content
              </button>
              <button
                onClick={() => { setInputMode('upload'); setTemplateContent(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputMode === 'upload' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Upload size={15} /> Upload File
              </button>
            </div>

            {/* Template content area */}
            <div className="glass border border-white/[0.06] rounded-2xl p-6">
              {inputMode === 'paste' ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <FileEdit size={18} className="text-violet-400" />
                    <h2 className="text-white font-bold">Paste Your Template</h2>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Paste the content of your existing template. Supports plain text or HTML code.
                  </p>
                  <textarea
                    id="template-content-input"
                    value={templateContent}
                    onChange={e => setTemplateContent(e.target.value)}
                    placeholder={`Paste your existing resume, cover letter, business plan...\n\nExample:\nJohn Doe\nSoftware Engineer\njohn@example.com\n\nExperience:\n- Google | Senior Engineer | Built scalable APIs...`}
                    rows={14}
                    className="input-field resize-none w-full font-mono text-sm leading-relaxed"
                  />
                  <p className="text-slate-500 text-xs mt-2">{templateContent.length} characters pasted</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Upload size={18} className="text-violet-400" />
                    <h2 className="text-white font-bold">Upload Your Template File</h2>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Upload a photo of your template (PNG, JPG, WEBP) or a text/HTML file. The AI will read it and apply your modifications.
                  </p>

                  {/* Drop zone */}
                  {!uploadedFile ? (
                    <div
                      id="file-dropzone"
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                        ${isDragging
                          ? 'border-violet-400 bg-violet-500/10'
                          : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'}`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                          <ImageIcon size={24} className="text-violet-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">Drop your file here or click to browse</p>
                          <p className="text-slate-500 text-sm">PNG, JPG, WEBP, TXT, HTML — max 10MB</p>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-center">
                          {['📸 Photo', '📄 HTML', '📝 TXT'].map(tag => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        id="file-upload-input"
                        type="file"
                        accept="image/*,.txt,.html,.htm"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  ) : (
                    /* File preview */
                    <div className="relative rounded-xl overflow-hidden border border-violet-500/30 bg-violet-500/5">
                      <button
                        onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                      >
                        <X size={14} />
                      </button>

                      {uploadedFile.isImage ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={uploadedFile.preview}
                            alt="Uploaded template"
                            className="w-full max-h-64 object-contain bg-black/20"
                          />
                          <div className="p-3 flex items-center gap-2">
                            <ImageIcon size={14} className="text-violet-400" />
                            <span className="text-slate-300 text-sm truncate">{uploadedFile.name}</span>
                            <span className="ml-auto text-xs text-green-400 font-semibold flex items-center gap-1">
                              <Check size={12} /> Ready
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <FileText size={20} className="text-violet-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{uploadedFile.name}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{uploadedFile.base64.length.toLocaleString()} characters extracted</p>
                          </div>
                          <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                            <Check size={12} /> Ready
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Re-upload button when file loaded */}
                  {uploadedFile && (
                    <button
                      onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="mt-3 text-xs text-violet-400 hover:text-violet-300 underline"
                    >
                      Upload a different file
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Modification instructions */}
            <div className="glass border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-violet-400" />
                <h2 className="text-white font-bold">Modification Instructions</h2>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Tell the AI exactly what you want changed. Be as specific as possible.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {EXAMPLE_INSTRUCTIONS.map(ex => (
                  <button
                    key={ex}
                    onClick={() => setInstructions(ex)}
                    className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              <textarea
                id="modification-instructions-input"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Describe what you want the AI to change or improve..."
                rows={5}
                className="input-field resize-none w-full"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {!user && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Zap size={16} className="text-amber-400 flex-shrink-0" />
                <p className="text-amber-300 text-sm">
                  <Link href="/auth" className="font-bold underline">Sign in</Link> to save your modifications and track credit usage.
                </p>
              </div>
            )}

            <button
              id="modify-btn"
              onClick={handleModify}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Modifying Your Template...</>
              ) : (
                <><Wand2 size={20} /> Modify Template <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          {/* Right — How it works */}
          <div className="space-y-6">
            <div className="glass border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-5">How AI Modification Works</h3>
              <div className="space-y-5">
                {[
                  { title: 'Upload or Paste', desc: 'Take a photo of your printed template from your gallery, or paste the raw text/HTML directly.', icon: '📂' },
                  { title: 'Give Instructions', desc: 'Tell the AI what to change — colors, layout, tone, fonts, or entire sections.', icon: '✍️' },
                  { title: 'AI Transforms It', desc: 'Our AI reads your document (even from an image) and applies your changes while keeping all your data.', icon: '🤖' },
                  { title: 'Download & Use', desc: 'Get a beautifully modified document you can download or save to your dashboard.', icon: '⬇️' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Supported File Types</h3>
              <div className="space-y-2">
                {[
                  { icon: '🖼️', type: 'Image (PNG, JPG, WEBP)', desc: 'Photo of a printed or on-screen template. AI reads it visually.' },
                  { icon: '📄', type: 'HTML File (.html)', desc: 'Export from a browser or document editor.' },
                  { icon: '📝', type: 'Text File (.txt)', desc: 'Plain text version of any document.' },
                ].map(item => (
                  <div key={item.type} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{item.type}</p>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">What You Can Modify</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '🎨 Color schemes', '📐 Layouts', '🔤 Typography',
                  '✍️ Tone & voice', '📦 Sections', '⚡ Content',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-300 bg-white/[0.03] rounded-lg px-3 py-2">
                    <Check size={12} className="text-violet-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← Modify Another
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Check size={14} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold">Modification Complete!</span>
            </div>
            <p className="text-slate-500 text-xs ml-auto">Saved to your dashboard automatically</p>
          </div>
          <div className="h-[80vh] flex flex-col">
            <TemplateOutput template={result} />
          </div>
        </div>
      )}
    </div>
  );
}
