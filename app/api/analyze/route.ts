import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

import type { AnalyzeRequest, AnalysisResult } from '@/lib/types';
import { MOCK_ANALYSIS_RESULT } from '@/lib/mock-data';
import { buildSystemPrompt, buildUserMessage } from '@/lib/prompts';

// ─── POST /api/analyze ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    // ── Input validation ──
    if (!body.expectedRole?.trim() || !body.growthTheme?.trim() || !body.transcription?.trim()) {
      return NextResponse.json({ error: '必須フィールドが不足しています。' }, { status: 400 });
    }

    // ── Mock mode: return sample data when API key is absent ──
    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise((resolve) => setTimeout(resolve, 1800)); // realistic delay
      return NextResponse.json(MOCK_ANALYSIS_RESULT);
    }

    // ── Real Claude call via Vercel AI SDK ──
    const { text } = await generateText({
      model: anthropic('claude-opus-4-6'),
      system: buildSystemPrompt(body.expectedRole, body.growthTheme),
      prompt: buildUserMessage(body),
      maxTokens: 4096,
    });

    // Extract JSON – handle optional markdown code-fence wrapping
    const jsonStr = extractJson(text);
    const result = JSON.parse(jsonStr) as AnalysisResult;

    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/analyze]', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'AIの応答の解析に失敗しました。もう一度お試しください。' },
        { status: 500 },
      );
    }

    const message =
      error instanceof Error ? error.message : '分析中にエラーが発生しました。もう一度お試しください。';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extracts raw JSON string from Claude's response.
 * Handles both bare JSON and ```json ... ``` wrapped output.
 */
function extractJson(text: string): string {
  // Try ```json ... ``` or ``` ... ```
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) return fenced[1];

  // Fallback: first {...} block
  const bare = text.match(/(\{[\s\S]*\})/);
  if (bare) return bare[1];

  throw new SyntaxError('No JSON object found in AI response.');
}
