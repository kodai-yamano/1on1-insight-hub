'use client';

import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Copy } from 'lucide-react';
import type { ViewAData } from '@/lib/types';
import { generateCopyText } from '@/lib/utils';

interface ViewAProps {
  data: ViewAData;
}

export function ViewA({ data }: ViewAProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = generateCopyText(data);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older/restricted environments
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">部下へ共有するフィードバック</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            メッセージや Slack にそのままコピーして使えます
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all flex-shrink-0 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              コピー済み
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              全文コピー
            </>
          )}
        </button>
      </div>

      {/* Positive changes */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
        <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          今週のポジティブな変化
        </h4>
        <div className="space-y-3">
          {data.positiveChanges.map((change, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-emerald-900 leading-relaxed">{change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next actions */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-blue-500" />
          来週のネクストアクション候補
        </h4>
        {data.nextActions.map((action, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Action header */}
            <div className="flex items-center gap-3 bg-blue-50 border-b border-blue-100 px-5 py-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Action {i + 1}
              </span>
            </div>

            {/* What / How */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    What
                  </span>
                  <span className="text-xs text-slate-400">具体的な行動</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{action.what}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    How
                  </span>
                  <span className="text-xs text-slate-400">育成観点の活かし方</span>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed bg-blue-50 rounded-lg p-3 border border-blue-100">
                  {action.how}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
