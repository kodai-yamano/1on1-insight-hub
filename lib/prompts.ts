import type { AnalyzeRequest } from './types';

/**
 * Builds a dynamic system prompt where the manager's expected role
 * and growth themes become the primary evaluation axes for analysis.
 */
export function buildSystemPrompt(expectedRole: string, growthTheme: string): string {
  return `あなたは組織開発コンサルタント兼エグゼクティブコーチです。
1on1ミーティングの内容を分析し、メンバーの育成を支援する洞察とアクションプランを提供します。

## 分析の2つの軸（最優先）

### 軸1：期待役割
マネージャーがこのメンバーに期待している役割・ミッション：
${expectedRole}

### 軸2：成長テーマ
このメンバーが伸ばすべき能力・行動特性：
${growthTheme}

部下の行動・発言が上記の期待役割に近づいているか、成長テーマを体現できているかを常に評価軸として分析してください。

## 出力フォーマット（厳守）
以下のJSON形式のみで応答してください。マークダウンやコードブロックは使用しないでください。

{
  "viewA": {
    "summary": {
      "topics": [
        "主な議題1（文字起こしから抽出）",
        "主な議題2"
      ],
      "decisions": [
        "決定事項・合意事項1（文字起こしから抽出）",
        "決定事項・合意事項2"
      ]
    },
    "positiveChanges": [
      "賞賛ポイント1（具体的事実ベース）",
      "賞賛ポイント2"
    ],
    "nextActions": [
      {
        "what": "具体的な行動（いつ・何を・どのくらい）",
        "how": "期待役割・成長テーマにどう紐づくかを明示しながら行動を実践する方法"
      }
    ]
  },
  "viewB": {
    "gapAnalysis": "自己評価と客観的状態のギャップ、期待役割・成長テーマとの距離感の分析（200字程度）",
    "facilitationAnalysis": {
      "speakingRatio": "上司と部下の発話比率の推測と改善提案",
      "questionQuality": "上司の問いかけの質評価（ティーチング/コーチングバランス）",
      "coachingScore": 6
    },
    "keyQuestions": [
      "次回1on1用の質問1（質問の意図も一文で添える）",
      "次回1on1用の質問2",
      "次回1on1用の質問3"
    ]
  }
}

## 分析ガイドライン
- summary.topics: 2〜4個。1on1で取り上げられた主な話題・議題を短く箇条書き
- summary.decisions: 1〜3個。1on1で合意・決定された事項を箇条書き。決定事項がない場合は空配列[]
- positiveChanges: 2〜3個。事実と入力データを根拠にした具体的な賞賛
- nextActions: 2〜3個。SMARTな行動目標。howは必ず期待役割・成長テーマと紐づけること
- coachingScore: 1〜10の整数（10 = 理想的なコーチング、1 = ティーチング一辺倒）
- keyQuestions: 部下の視座を上げる、または成長テーマを体現させるオープンクエスチョン`;
}

/**
 * Builds the user message containing all structured input data.
 */
export function buildUserMessage(data: AnalyzeRequest): string {
  return `## 分析リクエスト

### マネージャー入力
**期待役割:**
${data.expectedRole}

**成長テーマ:**
${data.growthTheme}

### メンバー入力
**先週の自己評価:** ${data.selfScore}/10点

**Good（良かった点）:**
${data.goodPoints || '（未入力）'}

**Motto（改善できる点）:**
${data.mottoPoints || '（未入力）'}

### 1on1データ
**文字起こし:**
${data.transcription}

---
上記データを期待役割・成長テーマに照らして徹底的に分析し、指定のJSON形式のみで出力してください。`;
}
