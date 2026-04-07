'use client';

import { useRef, useState } from 'react';
import { AlertCircle, ChevronDown, LogOut, Sparkles } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

import { InputForm } from '@/components/InputForm';
import { OutputDashboard } from '@/components/OutputDashboard';
import { MemberSelector, type Member } from '@/components/MemberSelector';
import { HistoryList } from '@/components/HistoryList';
import type { AnalysisResult, AnalyzeRequest, FormValues } from '@/lib/types';

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_FORM: FormValues = {
  expectedRole: '',
  growthTheme: '',
  selfScore: 7,
  goodPoints: '',
  mottoPoints: '',
  transcription: '',
  memoImageName: '',
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(values: FormValues): string | null {
  if (!values.expectedRole.trim())
    return '「期待役割」を入力してください。';
  if (!values.growthTheme.trim())
    return '「成長テーマ」を入力してください。';
  if (!values.transcription.trim())
    return '「1on1の文字起こしデータ」を入力してください。';
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { data: session } = useSession();
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // メンバー選択時：IDを保存し、保存済みの期待役割・成長テーマを自動入力
  const handleMemberSelect = (member: Member | null) => {
    setSelectedMemberId(member?.id ?? null);
    setFormValues((prev) => ({
      ...prev,
      expectedRole: member?.expectedRole ?? '',
      growthTheme: member?.growthTheme ?? '',
    }));
  };

  const handleAnalyze = async () => {
    const validationError = validate(formValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body: AnalyzeRequest = {
        expectedRole: formValues.expectedRole,
        growthTheme: formValues.growthTheme,
        selfScore: formValues.selfScore,
        goodPoints: formValues.goodPoints,
        mottoPoints: formValues.mottoPoints,
        transcription: formValues.transcription,
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? '分析に失敗しました。');
      }

      const data: AnalysisResult = await res.json();
      setResult(data);

      // ── 自動保存 + Memberの期待役割・成長テーマを最新値で更新 ──
      if (selectedMemberId) {
        fetch('/api/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: selectedMemberId,
            inputData: body,
            resultData: data,
          }),
        })
          .then(() => setHistoryRefreshKey((k) => k + 1))
          .catch((err) => console.error('[auto-save]', err));

        fetch(`/api/members/${selectedMemberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            expectedRole: formValues.expectedRole,
            growthTheme: formValues.growthTheme,
          }),
        }).catch((err) => console.error('[member-update]', err));
      }

      // Smooth-scroll to results
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        120,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '分析中にエラーが発生しました。もう一度お試しください。',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">1on1 Insight Hub</h1>
          </div>
          <p className="text-slate-300 text-sm ml-12 leading-relaxed">
            AI powered by Claude ─ 新入社員の育成サイクルを高速化・高精度化する
            <br className="hidden sm:block" />
            1on1 分析・ネクストアクション自動生成プラットフォーム
          </p>

          {/* User info + logout */}
          {session?.user && (
            <div className="mt-5 ml-12 flex items-center gap-3">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? ''}
                  className="w-7 h-7 rounded-full ring-2 ring-white/20"
                />
              )}
              <span className="text-xs text-slate-300">{session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                ログアウト
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Member selector */}
        <MemberSelector selectedId={selectedMemberId} onSelect={handleMemberSelect} />

        {/* Input form */}
        <InputForm values={formValues} onChange={setFormValues} />

        {/* Inline validation / API error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* CTA button */}
        <div className="flex justify-center py-2">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-semibold px-8 py-4 rounded-xl text-base
                       shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                分析中… しばらくお待ちください
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                AI 分析を実行する
                <ChevronDown className="w-4 h-4 opacity-60" />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="pt-2 animate-fade-slide-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Analysis Result
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <OutputDashboard result={result} />
          </div>
        )}

        {/* History */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Past Records
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <HistoryList memberId={selectedMemberId} refreshKey={historyRefreshKey} />
        </div>

      </div>
    </main>
  );
}
