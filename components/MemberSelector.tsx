'use client';

import { useEffect, useState } from 'react';
import { User, UserPlus } from 'lucide-react';

export interface Member {
  id: string;
  name: string;
  expectedRole: string | null;
  growthTheme: string | null;
  createdAt: string;
}

interface MemberSelectorProps {
  selectedId: string | null;
  onSelect: (member: Member | null) => void;
}

export function MemberSelector({ selectedId, onSelect }: MemberSelectorProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetch('/api/members')
      .then((r) => r.json())
      .then((data: Member[]) => setMembers(data))
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const member: Member = await res.json();
        setMembers((prev) => [member, ...prev]);
        onSelect(member);
        setNewName('');
        setShowInput(false);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleSelectChange = (id: string) => {
    if (!id) {
      onSelect(null);
      return;
    }
    const member = members.find((m) => m.id === id) ?? null;
    onSelect(member);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <User className="w-5 h-5" />
          <h2 className="text-base font-semibold">メンバー選択</h2>
        </div>
        <p className="text-teal-100 text-xs mt-1">分析対象のメンバーを選択してください</p>
      </div>

      <div className="p-4 flex flex-wrap items-center gap-3">
        {/* Select */}
        <select
          value={selectedId ?? ''}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="flex-1 min-w-[180px] rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900
                     focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white"
        >
          <option value="">メンバーを選択…</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Add new member */}
        {showInput ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="メンバー名を入力"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none
                         focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-44"
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white
                         text-sm font-medium rounded-lg transition-colors"
            >
              追加
            </button>
            <button
              onClick={() => { setShowInput(false); setNewName(''); }}
              className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm rounded-lg"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-teal-300 text-teal-700
                       hover:bg-teal-50 text-sm font-medium rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            新規追加
          </button>
        )}
      </div>
    </div>
  );
}
