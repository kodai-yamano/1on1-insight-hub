import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '1on1 Insight Hub | AI-Powered 育成分析プラットフォーム',
  description:
    '新入社員の育成サイクルを高速化・高精度化する1on1分析・ネクストアクション自動生成ツール',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
