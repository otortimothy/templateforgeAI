import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { buildPrompt, buildTitle, SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { TemplateType, TEMPLATE_TYPES } from '@/lib/templates';

export async function POST(req: NextRequest) {
  try {
    // ── Parse request ─────────────────────────────────────────────────────
    const body = await req.json();
    const { type, formData, model } = body as {
      type: TemplateType;
      formData: Record<string, string>;
      model?: string;
    };

    if (!type || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields: type and formData' },
        { status: 400 }
      );
    }

    let cost = 5; // fallback
    for (const category of Object.values(TEMPLATE_TYPES)) {
      const templateDef = category.find(t => t.id === type);
      if (templateDef) {
        cost = templateDef.credits;
        break;
      }
    }

    // ── Check API key ─────────────────────────────────────────────────────
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to .env.local' },
        { status: 503 }
      );
    }

    // Instantiate client here so it only runs at request time
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // ── Auth + Credit check (optional — works for guests too) ─────────────
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    let profile: { id: string; credits: number } | null = null;

    if (supabaseUser) {
      const { data } = await supabase
        .from('profiles')
        .select('id, credits')
        .eq('id', supabaseUser.id)
        .single();

      profile = data;

      // Require at least `cost` credits for logged-in users
      if (profile && profile.credits < cost) {
        return NextResponse.json(
          { error: 'Insufficient credits. Please purchase more credits to continue.' },
          { status: 402 }
        );
      }
    }

    // ── Call OpenAI ───────────────────────────────────────────────────────
    const userPrompt = buildPrompt(type, formData);

    // Map legacy/unavailable models to the latest Gemma 4 model
    const selectedModel = (!model || model === 'google/gemma-3-27b-it:free')
      ? 'google/gemma-4-31b-it:free'
      : model;

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const html = completion.choices[0]?.message?.content?.trim() || '';

    if (!html) {
      return NextResponse.json(
        { error: 'AI returned empty response. Please try again.' },
        { status: 502 }
      );
    }

    // ── Clean output (strip markdown code fences if model adds them) ───────
    const cleanedHtml = html
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const title = buildTitle(type, formData);
    const createdAt = new Date().toISOString();
    let templateId = `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // ── Persist to DB + deduct credits (logged-in users only) ─────────────
    if (supabaseUser && profile) {
      // Insert generated template
      const { data: inserted } = await supabase
        .from('generated_templates')
        .insert({
          user_id: supabaseUser.id,
          type,
          title,
          html_content: cleanedHtml,
          form_data: formData,
        })
        .select('id')
        .single();

      if (inserted?.id) {
        templateId = inserted.id;
      }

      // Deduct correct amount of credits
      await supabase
        .from('profiles')
        .update({ credits: Math.max(0, profile.credits - cost) })
        .eq('id', supabaseUser.id);
    }

    return NextResponse.json({
      id: templateId,
      type,
      title,
      html: cleanedHtml,
      createdAt,
      formData,
    });
  } catch (error: unknown) {
    console.error('[/api/generate] Error:', error);

    // Surface OpenAI-specific errors clearly
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in .env.local' },
          { status: 401 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'OpenRouter rate limit reached. Please try again in a moment.' },
          { status: 429 }
        );
      }
      if (error.status === 402) {
        return NextResponse.json(
          { error: 'OpenRouter account quota exceeded. Please check your billing.' },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: `Generation failed. Details: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
