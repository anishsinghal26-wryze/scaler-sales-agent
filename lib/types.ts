export interface LeadProfile {
  name: string;
  role: string;
  company: string;
  yoe: string;
  education: string;
  currentCTC: string;
  goal: string;
  notes: string;
  phone: string; // lead's WhatsApp phone number e.g. +919876543210
}

export interface Objection {
  objection: string;
  handle: string;
}

export interface NudgeContent {
  summary: string;
  talkingAngles: string[];
  objections: Objection[];
  openingHook: string;
  confidence: "🟢" | "🟡" | "🔴";
  confidenceReason: string;
  rawMessage: string; // full formatted WhatsApp message for BDA
}

export interface PDFSection {
  question: string;
  answer: string;
  source: "curriculum" | "call";
}

export interface PDFContent {
  leadName: string;
  leadRole: string;
  leadCompany: string;
  program: string;
  programReason: string;
  opening: string;
  sections: PDFSection[];
  nextSteps: string[];
  whatsappMessage: string; // personalized WhatsApp message to send with PDF
  sendTimingRecommendation: string;
  theme: "senior" | "mid" | "junior"; // drives visual differentiation in PDF
}

export type AppScreen =
  | "onboarding"
  | "lead-input"
  | "generating"
  | "nudge-preview"
  | "pdf-approval"
  | "confirmation";

export interface SendResult {
  nudgeSent: boolean;
  nudgeSid?: string;
  pdfSent: boolean;
  pdfSid?: string;
  pdfSkipped: boolean;
  error?: string;
}
