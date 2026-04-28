'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Zap, Check } from 'lucide-react';
import clsx from 'clsx';
import {
  CATEGORIES,
  TEMPLATE_TYPES,
  TEMPLATE_FORMS,
  TemplateCategory,
  TemplateType,
  FormField,
} from '@/lib/templates';
import { generateTemplate, GeneratedTemplate } from '@/lib/generate';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';
import TemplateOutput from '@/components/templates/TemplateOutput';

type Step = 'category' | 'type' | 'form' | 'loading' | 'output';

const STEPS: { id: Step; label: string }[] = [
  { id: 'category', label: 'Category' },
  { id: 'type', label: 'Template' },
  { id: 'form', label: 'Details' },
  { id: 'output', label: 'Result' },
];

function GeneratePageInner() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as TemplateCategory | null;

  const [step, setStep] = useState<Step>(initialCategory ? 'type' : 'category');
  const [category, setCategory] = useState<TemplateCategory | null>(initialCategory);
  const [templateType, setTemplateType] = useState<TemplateType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [multiSelects, setMultiSelects] = useState<Record<string, string[]>>({});
  const [generated, setGenerated] = useState<GeneratedTemplate | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addGenerated } = useDashboard();
  const { user, updateCredits } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to signup
  useEffect(() => {
    if (user === null) {
      router.replace('/auth?tab=signup');
    }
  }, [user, router]);

  // Show spinner while auth state is loading or redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400" size={36} />
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === (step === 'loading' ? 'output' : step));

  const handleCategorySelect = (cat: TemplateCategory) => {
    setCategory(cat);
    setTemplateType(null);
    setFormData({});
    setStep('type');
  };

  const handleTypeSelect = (type: TemplateType) => {
    setTemplateType(type);
    setFormData({});
    setMultiSelects({});
    setErrors({});
    setStep('form');
  };

  const handleFieldChange = (id: string, value: string, fieldType?: string) => {
    if (fieldType === 'multi-select') {
      setMultiSelects(prev => {
        const current = prev[id] || [];
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        setFormData(fd => ({ ...fd, [id]: updated.join(', ') }));
        return { ...prev, [id]: updated };
      });
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
      if (errors[id]) setErrors(prev => { const e = { ...prev }; delete e[id]; return e; });
    }
  };

  const validateForm = (): boolean => {
    if (!templateType) return false;
    const schema = TEMPLATE_FORMS[templateType];
    const newErrors: Record<string, string> = {};
    schema.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm() || !templateType) return;

    // Deduct credits
    const typeDef = category ? TEMPLATE_TYPES[category].find(t => t.id === templateType) : null;
    const cost = typeDef?.credits || 5;

    if (user && user.credits < cost) {
      alert(`You need ${cost} credits for this template. You have ${user.credits}. Please top up first.`);
      return;
    }

    setStep('loading');
    try {
      const result = await generateTemplate(templateType, formData);
      addGenerated(result);
      if (user) updateCredits(-cost);
      setGenerated(result);
      setStep('output');
    } catch (err: unknown) {
      setStep('form');
      alert(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
          AI Template Generator
        </h1>
        <p className="text-slate-400">Generate a professional, editable document in seconds.</p>
      </div>

      {/* Step indicator */}
      {step !== 'loading' && step !== 'output' && (
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {STEPS.filter(s => s.id !== 'output').map((s, i) => {
            const idx = STEPS.findIndex(x => x.id === s.id);
            const isActive = idx === currentStepIndex;
            const isDone = idx < currentStepIndex;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap',
                  isActive ? 'bg-indigo-600 text-white' : isDone ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-slate-500'
                )}>
                  {isDone ? <Check size={14} /> : <span className="text-xs opacity-70">{i + 1}</span>}
                  {s.label}
                </div>
                {i < STEPS.length - 2 && (
                  <div className={clsx('hidden sm:block w-12 h-0.5 rounded', isDone ? 'bg-indigo-500/60' : 'bg-white/10')} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Step: Category ── */}
      {step === 'category' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-2">What type of document do you need?</h2>
          <p className="text-slate-400 mb-8">Choose a category to get started</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                id={`select-cat-${cat.id}`}
                onClick={() => handleCategorySelect(cat.id)}
                className="glass glass-hover rounded-2xl p-6 text-left border border-white/[0.06] group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{cat.label}</h3>
                <p className="text-slate-400 text-sm mb-3">{cat.description}</p>
                <span className="text-xs text-slate-500">{cat.count} templates</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step: Type ── */}
      {step === 'type' && category && (
        <div className="animate-fade-in">
          <button onClick={() => setStep('category')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to categories
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">
            {CATEGORIES.find(c => c.id === category)?.label} Templates
          </h2>
          <p className="text-slate-400 mb-8">Choose the template type you want to generate</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_TYPES[category].map(type => (
              <button
                key={type.id}
                id={`select-type-${type.id}`}
                onClick={() => handleTypeSelect(type.id)}
                className="glass glass-hover rounded-2xl p-6 text-left border border-white/[0.06] group"
              >
                <span className="text-3xl block mb-4">{type.icon}</span>
                <h3 className="text-white font-bold text-base mb-1">{type.label}</h3>
                <p className="text-slate-400 text-sm mb-4">{type.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    ⚡ {type.credits} credits
                  </span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step: Form ── */}
      {step === 'form' && templateType && (
        <div className="animate-fade-in max-w-2xl">
          <button onClick={() => setStep('type')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to template types
          </button>

          <div className="glass rounded-2xl border border-white/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-1">{TEMPLATE_FORMS[templateType].title}</h2>
            <p className="text-slate-400 text-sm mb-6">{TEMPLATE_FORMS[templateType].description}</p>

            <div className="space-y-5">
              {TEMPLATE_FORMS[templateType].fields.map(field => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id] || ''}
                  multiValue={multiSelects[field.id] || []}
                  error={errors[field.id]}
                  onChange={handleFieldChange}
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
              <p className="text-slate-500 text-xs">
                {user ? `${user.credits} credits remaining` : 'Sign in to track credits'}
              </p>
              <button
                id="generate-btn"
                onClick={handleGenerate}
                className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl font-bold"
              >
                <Zap size={16} />
                Generate Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step: Loading ── */}
      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
              <Zap size={32} className="text-white" />
            </div>
            <div className="absolute inset-0 border-2 border-indigo-500/40 rounded-2xl animate-spin-slow" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Generating your template...</h3>
          <p className="text-slate-400 text-center max-w-sm">
            Our AI is crafting a professional, customized document just for you. This takes 2–4 seconds.
          </p>
          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full bg-indigo-500 animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Step: Output ── */}
      {step === 'output' && generated && (
        <div className="animate-fade-in h-[80vh] flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => { setStep('category'); setGenerated(null); setFormData({}); }}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} /> New Template
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Check size={14} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold">Template Generated!</span>
            </div>
          </div>
          <TemplateOutput template={generated} />
        </div>
      )}
    </div>
  );
}

function FormFieldRenderer({
  field,
  value,
  multiValue,
  error,
  onChange,
}: {
  field: FormField;
  value: string;
  multiValue: string[];
  error?: string;
  onChange: (id: string, value: string, type?: string) => void;
}) {
  return (
    <div>
      <label htmlFor={field.id} className="block text-sm font-semibold text-slate-300 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {field.hint && (
        <p className="text-xs text-slate-500 mb-2">{field.hint}</p>
      )}

      {field.type === 'textarea' ? (
        <textarea
          id={field.id}
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={clsx('input-field resize-none', error && 'border-red-500/50 bg-red-500/5')}
        />
      ) : field.type === 'select' ? (
        <select
          id={field.id}
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          className={clsx('input-field', error && 'border-red-500/50 bg-red-500/5')}
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <option value="" className="bg-slate-900">Select an option...</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
          ))}
        </select>
      ) : field.type === 'multi-select' ? (
        <div className="flex flex-wrap gap-2">
          {field.options?.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(field.id, opt, 'multi-select')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                multiValue.includes(opt)
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <input
          id={field.id}
          type={field.type}
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className={clsx('input-field', error && 'border-red-500/50 bg-red-500/5')}
        />
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}>
      <GeneratePageInner />
    </Suspense>
  );
}
