'use client';

import { AlertCircle, BarChart3, Lightbulb, MessageCircle, TrendingUp, Users } from 'lucide-react';
import type { ViewBData } from '@/lib/types';

interface ViewBProps {
  data: ViewBData;
}

// ── Coaching score visual bar ────────────────────────────────────────────────

function CoachingScore({ score }: { score: number }) {
  const pct = Math.min(Math.max(score / 10, 0), 1) * 100;
  const barColor =
    score >= 8 ? 'bg-emerald-500' :
    score >= 6 ? 'bg-blue-500' :
    score >= 4 ? 'bg-amber-500' : 'bg-red-500';
  const labelColor =
    score >= 8 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
    score >= 6 ? 'text-blue-700 bg-blue-50 border-blue-200' :
    score >= 4 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                 'text-red-700 bg-red-50 border-red-200';

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-500">コーチング品質スコア</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${labelColor}`}>
          {score} / 10
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>ティーチング寄り</span>
        <span>コーチング寄り</span>
      </div>
    </div>
  );
}

// ── Block wrapper ────────────────────────────────────────────────────────────

function ReportBlock({
  icon: Icon,
  iconColor,
  title,
  children,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function ViewB({ data }: ViewBProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-800">上司向けマネジメントレポート</h3>
        <p className="text-xs text-slate-500 mt-0.5">このレポートは上司専用の分析です</p>
      </div>

      {/* Gap analysis */}
      <ReportBlock icon={BarChart3} iconColor="text-slate-600" title="育成観点のギャップ分析">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 leading-relaxed">{data.gapAnalysis}</p>
        </div>
      </ReportBlock>

      {/* Facilitation analysis */}
      <ReportBlock icon={Users} iconColor="text-slate-600" title="ファシリテーション分析">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-600">発話比率</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-blue-50 rounded-lg p-3 border border-blue-100">
              {data.facilitationAnalysis.speakingRatio}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-slate-600">問いかけの質</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-violet-50 rounded-lg p-3 border border-violet-100">
              {data.facilitationAnalysis.questionQuality}
            </p>
          </div>
          <CoachingScore score={data.facilitationAnalysis.coachingScore} />
        </div>
      </ReportBlock>

      {/* Key questions */}
      <ReportBlock icon={Lightbulb} iconColor="text-amber-500" title="次回 1on1 のキークエスチョン">
        <div className="space-y-4">
          {data.keyQuestions.map((question, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                Q{i + 1}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{question}</p>
            </div>
          ))}
        </div>
      </ReportBlock>
    </div>
  );
}
