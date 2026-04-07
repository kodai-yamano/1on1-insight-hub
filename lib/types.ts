// ─── Input ───────────────────────────────────────────────────────────────────

export interface FormValues {
  // Manager inputs
  expectedRole: string;
  growthTheme: string;
  // Member inputs
  selfScore: number;
  goodPoints: string;
  mottoPoints: string;
  // Common inputs
  transcription: string;
  memoImageName: string;
}

/** Shape sent to /api/analyze (no File object) */
export interface AnalyzeRequest {
  expectedRole: string;
  growthTheme: string;
  selfScore: number;
  goodPoints: string;
  mottoPoints: string;
  transcription: string;
}

// ─── Output ──────────────────────────────────────────────────────────────────

export interface NextAction {
  what: string;
  how: string;
}

export interface ViewAData {
  summary: {
    topics: string[];
    decisions: string[];
  };
  positiveChanges: string[];
  nextActions: NextAction[];
}

export interface FacilitationAnalysis {
  speakingRatio: string;
  questionQuality: string;
  /** Coaching quality score 1–10 */
  coachingScore: number;
}

export interface ViewBData {
  gapAnalysis: string;
  facilitationAnalysis: FacilitationAnalysis;
  keyQuestions: string[];
}

export interface AnalysisResult {
  viewA: ViewAData;
  viewB: ViewBData;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}
