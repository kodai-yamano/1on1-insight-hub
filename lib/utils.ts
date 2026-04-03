import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ViewAData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateJP(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate plain-text version of View A for clipboard copy.
 */
export function generateCopyText(viewA: ViewAData): string {
  const lines: string[] = [];
  const today = formatDateJP(new Date());

  lines.push(`=== 1on1 フィードバック (${today}) ===`);
  lines.push('');
  lines.push('【今週のポジティブな変化】');
  viewA.positiveChanges.forEach((change, i) => {
    lines.push(`${i + 1}. ${change}`);
  });
  lines.push('');
  lines.push('【来週のネクストアクション】');
  viewA.nextActions.forEach((action, i) => {
    lines.push('');
    lines.push(`◆ アクション ${i + 1}`);
    lines.push(`  What: ${action.what}`);
    lines.push(`  How:  ${action.how}`);
  });

  return lines.join('\n');
}
