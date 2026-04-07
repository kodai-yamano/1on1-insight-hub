'use client';

import { useState } from 'react';
import { Check, FileText, Image as ImageIcon, MessageSquare, Save, Star, Target, TrendingUp, User, Users } from 'lucide-react';
import type { FormValues } from '@/lib/types';

interface InputFormProps {
  values: FormValues;
  onChange: (values: FormValues) => void;
  selectedMemberId?: string | null;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionCard({
  color,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  color: 'blue' | 'violet' | 'slate';
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const gradients = {
    blue:   'from-blue-600 to-blue-700',
    violet: 'from-violet-600 to-violet-700',
    slate:  'from-slate-600 to-slate-700',
  };
  const subtitleColors = {
    blue:   'text-blue-100',
    violet: 'text-violet-100',
    slate:  'text-slate-300',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`bg-gradient-to-r ${gradients[color]} px-6 py-4`}>
        <div className="flex items-center gap-2 text-white">
          <Icon className="w-5 h-5" />
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <p className={`${subtitleColors[color]} text-xs mt-1`}>{subtitle}</p>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function FieldLabel({
  icon: Icon,
  color,
  label,
  required,
}: {
  icon: React.ElementType;
  color: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
      <Icon className={`w-4 h-4 ${color}`} />
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const textareaClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors resize-none';

// ─── Main component ───────────────────────────────────────────────────────────

export function InputForm({ values, onChange, selectedMemberId }: InputFormProps) {
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    onChange({ ...values, [key]: value });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = async () => {
    if (!selectedMemberId) return;
    setSaving(true);
    try {
      await fetch(`/api/members/${selectedMemberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedRole: values.expectedRole,
          growthTheme: values.growthTheme,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Manager section ── */}
      <SectionCard
        color="blue"
        icon={Users}
        title="マネージャー入力エリア"
        subtitle="メンバーへの期待と成長テーマを入力してください"
      >
        <div>
          <FieldLabel icon={Target} color="text-blue-500" label="期待役割" required />
          <textarea
            value={values.expectedRole}
            onChange={(e) => set('expectedRole', e.target.value)}
            rows={4}
            className={`${textareaClass} focus:border-blue-500 focus:ring-blue-500/20`}
            placeholder={
              '例: 短期財務回復の責任者として、今四半期は既存顧客の解約防止と\n' +
              'アップセル推進を最優先に動いてほしい。\n' +
              '数字にコミットしながら、チームを巻き込む調整力も期待している。'
            }
          />
        </div>
        <div>
          <FieldLabel icon={Star} color="text-blue-500" label="成長テーマ" required />
          <textarea
            value={values.growthTheme}
            onChange={(e) => set('growthTheme', e.target.value)}
            rows={5}
            className={`${textareaClass} focus:border-blue-500 focus:ring-blue-500/20`}
            placeholder={
              '例:\n' +
              '① 課題設定力（現象ではなく本質的な問題を特定して言語化できる）\n' +
              '② 数値コミット力（目標と進捗を数字で語り、自ら差異を分析できる）\n' +
              '③ 他者を動かす力（上司・同僚・顧客を巻き込み推進できる）'
            }
          />
        </div>

        {/* Save settings button */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" />
              保存しました
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving || !selectedMemberId}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed
                       bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 disabled:hover:bg-blue-50"
            title={!selectedMemberId ? 'メンバーを選択してください' : undefined}
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            このメンバーの設定を保存
          </button>
        </div>
      </SectionCard>

      {/* ── Member section ── */}
      <SectionCard
        color="violet"
        icon={User}
        title="メンバー入力エリア"
        subtitle="部下の自己評価と振り返りを入力してください"
      >
        {/* Score slider */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">先週の自己評価</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min={1}
                max={10}
                value={values.selfScore}
                onChange={(e) => set('selfScore', parseInt(e.target.value, 10))}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 px-0.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <span key={n} className={values.selfScore === n ? 'text-violet-600 font-bold' : ''}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-violet-50 border border-violet-200 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-violet-600">{values.selfScore}</span>
              <span className="text-xs text-violet-400">/ 10</span>
            </div>
          </div>
        </div>

        <div>
          <FieldLabel icon={TrendingUp} color="text-violet-500" label="先週のGood（良かった点）" />
          <textarea
            value={values.goodPoints}
            onChange={(e) => set('goodPoints', e.target.value)}
            rows={4}
            className={`${textareaClass} focus:border-violet-500 focus:ring-violet-500/20`}
            placeholder={'・顧客Aとの打ち合わせで事前に課題仮説を3つ作って臨めた\n・データを使って提案の根拠を示せた'}
          />
        </div>

        <div>
          <FieldLabel icon={MessageSquare} color="text-violet-500" label="先週のMotto（もっと良くできる点）" />
          <textarea
            value={values.mottoPoints}
            onChange={(e) => set('mottoPoints', e.target.value)}
            rows={4}
            className={`${textareaClass} focus:border-violet-500 focus:ring-violet-500/20`}
            placeholder={'・数字を使って話す場面がまだ少ない\n・優先順位の付け方が曖昧'}
          />
        </div>
      </SectionCard>

      {/* ── Common section ── */}
      <SectionCard
        color="slate"
        icon={FileText}
        title="共通入力エリア"
        subtitle="1on1のデータを入力してください"
      >
        <div>
          <FieldLabel icon={MessageSquare} color="text-slate-500" label="1on1の文字起こしデータ" required />
          <textarea
            value={values.transcription}
            onChange={(e) => set('transcription', e.target.value)}
            rows={10}
            className={`${textareaClass} resize-y focus:border-slate-500 focus:ring-slate-500/20`}
            placeholder={'上司: 先週どうだった？\n部下: 顧客Aとの打ち合わせがうまくいきました。事前に仮説を立てて臨んだので…\n上司: それは良かったね。何が良かったと思う？\n部下: …'}
          />
        </div>

        <div>
          <FieldLabel icon={ImageIcon} color="text-slate-500" label="1on1のメモ画像（任意）" />
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors">
              <ImageIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-500 truncate">
                {values.memoImageName || 'クリックして画像を選択（JPG / PNG）'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) set('memoImageName', file.name);
                }}
              />
            </label>
            {values.memoImageName && (
              <button
                type="button"
                onClick={() => set('memoImageName', '')}
                className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
                aria-label="画像を削除"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
