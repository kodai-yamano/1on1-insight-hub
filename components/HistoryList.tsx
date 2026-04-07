'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Clock, RefreshCw } from 'lucide-react';
import type { AnalysisResult, FormValues } from '@/lib/types';
import { OutputDashboard } from './OutputDashboard';
import { ScoreChart } from './ScoreChart';

interface RecordItem {
  id: string;
  memberId: string;
  date: string;
  inputData: string;
  resultData: string;
  createdAt: string;
  member: { id: string; name: string };
}

interface HistoryListProps {
  memberId: string | null;
  refreshKey: number;
}

export function HistoryList({ memberId, refreshKey }: HistoryListProps) {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const url = memberId ? `/api/records?memberId=${memberId}` : '/api/records';
    fetch(url)
      .then((r) => r.json())
      .then((data: RecordItem[]) => setRecords(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [memberId, refreshKey]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-sm text-slate-400">
        履歴がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trend chart: show when 2 or more records exist */}
      {records.length >= 2 && <ScoreChart records={records} />}

      {/* Record list */}
      <div className="space-y-3">
        {records.map((record) => {
          const isOpen = expandedId === record.id;
          const date = new Date(record.createdAt).toLocaleString('ja-JP', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
          });
          const input = JSON.parse(record.inputData) as Partial<FormValues>;
          const result = JSON.parse(record.resultData) as AnalysisResult;

          return (
            <div key={record.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Row header */}
              <button
                onClick={() => setExpandedId(isOpen ? null : record.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{record.member.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{date}</p>
                  </div>
                  {input.expectedRole && (
                    <p className="hidden sm:block text-xs text-slate-400 truncate max-w-[260px]">
                      {input.expectedRole.slice(0, 60)}{input.expectedRole.length > 60 ? '…' : ''}
                    </p>
                  )}
                </div>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                }
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-slate-100 px-5 py-5">
                  <OutputDashboard result={result} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
