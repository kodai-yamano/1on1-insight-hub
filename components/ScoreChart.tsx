'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AnalysisResult, FormValues } from '@/lib/types';

interface RecordItem {
  id: string;
  inputData: string;
  resultData: string;
  createdAt: string;
}

interface ChartPoint {
  date: string;
  selfScore: number;
  coachingScore: number;
}

function buildChartData(records: RecordItem[]): ChartPoint[] {
  return [...records]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((r) => {
      const input = JSON.parse(r.inputData) as Partial<FormValues>;
      const result = JSON.parse(r.resultData) as AnalysisResult;
      return {
        date: new Date(r.createdAt).toLocaleDateString('ja-JP', {
          month: '2-digit',
          day: '2-digit',
        }),
        selfScore: input.selfScore ?? 0,
        coachingScore: result.viewB.facilitationAnalysis.coachingScore,
      };
    });
}

interface ScoreChartProps {
  records: RecordItem[];
}

export function ScoreChart({ records }: ScoreChartProps) {
  const data = buildChartData(records);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-700">スコアトレンド</p>
        <p className="text-xs text-slate-400 mt-0.5">自己評価 / コーチングスコアの推移</p>
      </div>
      <div className="px-4 py-5">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={(value) =>
                value === 'selfScore' ? '自己評価' : 'コーチングスコア'
              }
            />
            <Line
              type="monotone"
              dataKey="selfScore"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#8b5cf6' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="coachingScore"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
