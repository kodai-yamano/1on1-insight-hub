'use client';

import { useState } from 'react';
import { BarChart3, MessageSquare } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import { ViewA } from './ViewA';
import { ViewB } from './ViewB';

interface OutputDashboardProps {
  result: AnalysisResult;
}

type TabId = 'viewA' | 'viewB';

const TABS: { id: TabId; label: string; shortLabel: string; icon: React.ElementType }[] = [
  {
    id: 'viewA',
    label: 'フィードバック (View A)',
    shortLabel: '部下へ共有',
    icon: MessageSquare,
  },
  {
    id: 'viewB',
    label: 'マネジメントレポート (View B)',
    shortLabel: '上司向け分析',
    icon: BarChart3,
  },
];

export function OutputDashboard({ result }: OutputDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('viewA');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                active
                  ? 'text-blue-600 bg-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {/* Full label on ≥sm, short label on mobile */}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.shortLabel}</span>
              {/* Active indicator */}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'viewA' ? <ViewA data={result.viewA} /> : <ViewB data={result.viewB} />}
      </div>
    </div>
  );
}
