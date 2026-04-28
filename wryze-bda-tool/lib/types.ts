// ── PRE-CALL ─────────────────────────────────────────────────────────────────

export interface PreCallInput {
  studentName: string;
  currentScore: string;
  targetScore: string;
  painPoint: string;
  platformsUsed: string;
  concern: string; // parent or student concern
  objection: string;
  selfReportedWeakArea: string;
  actualWeakArea: string; // from scorecard if available
  notes: string; // extra context / previous interaction
}

export interface ObjectionHandle {
  objection: string;
  response: string;
}

export interface PreCallOutput {
  lead_summary: string;
  detected_problem: string;
  conversion_confidence: number; // 0–100
  primary_angle: string;
  whatsapp_nudge: string[]; // 3 messages
  call_talking_points: string[];
  objection_handling: ObjectionHandle;
  closing_line: string;
  follow_up_message: string;
}

// ── POST-CALL ────────────────────────────────────────────────────────────────

export interface PostCallInput {
  studentName: string;
  currentScore: string;
  targetScore: string;
  transcript: string;
  parentConcern: string;
  weaknessesDiscussed: string;
  objectionsRaised: string;
  examDate: string;
  dreamColleges: string;
}

export interface MonthlyMilestone {
  month: string;
  focus: string;
  milestone: string;
}

export interface PDFRoadmap {
  current_score: string;
  target_score: string;
  score_gap: string;
  blockers: string[];
  monthly_plan: MonthlyMilestone[];
  what_wryze_tracks: string[];
  why_realistic: string;
  guarantee_note: string;
}

export interface FollowUpSequence {
  h24: string;
  day3: string;
  reactivation: string;
}

export interface PostCallOutput {
  student_summary: string;
  perceived_problem: string;
  real_problem: string;
  score_gap_analysis: string;
  wryze_pitch_angle: string;
  whatsapp_followup: string;
  pdf_roadmap: PDFRoadmap;
  follow_up_sequence: FollowUpSequence;
}
