import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletionContentPart, ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { createClient } from '@/lib/supabase/server';

const MODIFY_COST = 2;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateContent, instructions, imageBase64, imageType, model } = body as {
      templateContent?: string;
      instructions: string;
      imageBase64?: string;   // full data URL: "data:image/png;base64,..."
      imageType?: string;
      model?: string;
    };

    if (!instructions) {
      return NextResponse.json(
        { error: 'Modification instructions are required.' },
        { status: 400 }
      );
    }
    if (!templateContent && !imageBase64) {
      return NextResponse.json(
        { error: 'Please provide either template content or an uploaded image.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured.' },
        { status: 503 }
      );
    }

    // Instantiate client here so it only runs at request time
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // ── Auth + Credit check ─────────────────────────────────────────────
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

      if (profile && profile.credits < MODIFY_COST) {
        return NextResponse.json(
          { error: `You need at least ${MODIFY_COST} credits for AI Modification. Please top up your credits.` },
          { status: 402 }
        );
      }
    }

    // ── Call OpenRouter AI ──────────────────────────────────────────────
    const systemPrompt = `You are an expert document designer and editor. Your job is to take an existing document or template (which may be plain text, HTML, or an image of a document) provided by the user and modify it according to their instructions.

RULES:
- Always output a COMPLETE, self-contained HTML document with rich, professional inline CSS styling.
- Apply the user's requested modifications faithfully.
- Preserve all the original data/content that wasn't explicitly asked to change.
- If given an image, extract all visible text and content from it, then rebuild it as HTML with the requested modifications.
- Do NOT include markdown fences (\`\`\`html). Output raw HTML only.
- Make the result visually impressive and professional.`;

    // Build the messages array — supports both text and image vision
    const userContent: ChatCompletionContentPart[] = [];

    if (imageBase64) {
      userContent.push({
        type: 'image_url',
        image_url: { url: imageBase64 },
      });
      userContent.push({
        type: 'text',
        text: `Here is an image of an existing template/document. Please extract all the content from it and apply these modifications:\n${instructions}\n\nReturn the complete modified HTML document.`,
      });
    } else {
      userContent.push({
        type: 'text',
        text: `Here is the existing template content:\n\n<TEMPLATE>\n${templateContent}\n</TEMPLATE>\n\nHere are my modification instructions:\n${instructions}\n\nPlease apply the modifications and return the complete updated HTML document.`,
      });
    }

    const userMessage: ChatCompletionMessageParam = { role: 'user', content: userContent };

    const selectedModel = (!model || model === 'google/gemma-3-27b-it:free')
      ? 'google/gemma-4-31b-it:free'
      : model;

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        userMessage,
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const rawHtml = completion.choices[0]?.message?.content?.trim() || '';

    if (!rawHtml) {
      return NextResponse.json(
        { error: 'AI returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    const cleanedHtml = rawHtml
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const title = `AI Modified — ${new Date().toLocaleDateString()}`;
    const createdAt = new Date().toISOString();
    let templateId = `mod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // ── Persist to DB + deduct credits ──────────────────────────────────
    if (supabaseUser && profile) {
      const { data: inserted } = await supabase
        .from('generated_templates')
        .insert({
          user_id: supabaseUser.id,
          type: 'ai-modification',
          title,
          html_content: cleanedHtml,
          form_data: { instructions },
        })
        .select('id')
        .single();

      if (inserted?.id) templateId = inserted.id;

      await supabase
        .from('profiles')
        .update({ credits: Math.max(0, profile.credits - MODIFY_COST) })
        .eq('id', supabaseUser.id);
    }

    return NextResponse.json({
      id: templateId,
      type: 'ai-modification',
      title,
      html: cleanedHtml,
      createdAt,
    });
  } catch (error: unknown) {
    console.error('[/api/modify] Error:', error);
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json({ error: 'Invalid OpenRouter API key.' }, { status: 401 });
      }
      if (error.status === 429) {
        return NextResponse.json({ error: 'OpenRouter rate limit reached. Please try again shortly.' }, { status: 429 });
      }
    }
    return NextResponse.json(
      { error: `Modification failed: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
