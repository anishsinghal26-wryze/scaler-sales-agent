"use client";

import React, { useState, useRef, useCallback } from "react";
import type {
  LeadProfile,
  NudgeContent,
  PDFContent,
  AppScreen,
  SendResult,
} from "@/lib/types";

// ── Default empty lead ──────────────────────────────────────────────────────
const emptyLead: LeadProfile = {
  name: "",
  role: "",
  company: "",
  yoe: "",
  education: "",
  currentCTC: "",
  goal: "",
  notes: "",
  phone: "",
};

// ── Tiny helpers ────────────────────────────────────────────────────────────
function StepBadge({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-orange-500 text-white ring-4 ring-orange-500/20"
            : "bg-slate-700 text-slate-400"
        }`}
      >
        {done ? "✓" : n}
      </div>
      <span className={`text-xs hidden sm:block ${active ? "text-orange-400 font-medium" : done ? "text-emerald-400" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}

function StepConnector({ done }: { done: boolean }) {
  return (
    <div className={`flex-1 h-0.5 mx-1 mt-4 rounded ${done ? "bg-emerald-500" : "bg-slate-700"}`} />
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{children}</label>;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition resize-none"
    />
  );
}

function Btn({
  onClick,
  children,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-400 text-white focus:ring-orange-500 shadow-lg shadow-orange-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500",
    ghost: "text-slate-400 hover:text-slate-200 hover:bg-slate-700 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── SCREEN 1: Onboarding ────────────────────────────────────────────────────
function OnboardingScreen({ onContinue }: { onContinue: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) onContinue(phone.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 fade-in-up">
      {/* Logo area */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg">S</div>
        <span className="text-white font-bold text-xl tracking-tight">Scaler Sales AI</span>
      </div>

      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome, BDA</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your AI co-pilot for every call. Get personalised nudges before you dial and deliver custom PDFs your leads will actually read.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Your Name</Label>
              <Input value={name} onChange={setName} placeholder="e.g. Arjun Mehta" />
            </div>
            <div>
              <Label>Your WhatsApp Number (BDA) *</Label>
              <Input
                value={phone}
                onChange={setPhone}
                placeholder="+91 98765 43210"
                type="tel"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Pre-call nudges will be sent here via WhatsApp
              </p>
            </div>
            <Btn type="submit" disabled={!phone.trim()} className="w-full mt-2">
              Get Started →
            </Btn>
          </form>
        </Card>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: "⚡", label: "Pre-call nudge", desc: "Talking angles + objection handles" },
            { icon: "📄", label: "Custom PDF", desc: "Answers their exact questions" },
            { icon: "🎯", label: "Confidence signal", desc: "🟢🟡🔴 before every call" },
          ].map((f) => (
            <div key={f.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs font-semibold text-slate-300 mb-0.5">{f.label}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 2: Lead Input ────────────────────────────────────────────────────
function LeadInputScreen({
  onGenerate,
  initialLead,
  initialTranscript,
  error,
}: {
  onGenerate: (lead: LeadProfile, transcript: string) => void;
  initialLead?: LeadProfile;
  initialTranscript?: string;
  error?: string;
}) {
  const [tab, setTab] = useState<"structured" | "audio">("structured");
  const [lead, setLead] = useState<LeadProfile>(initialLead ? { ...initialLead } : { ...emptyLead });
  const [transcript, setTranscript] = useState(initialTranscript ?? "");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof LeadProfile) => (value: string) =>
    setLead((prev) => ({ ...prev, [field]: value }));

  const handleTranscribe = async () => {
    if (!audioFile) return;
    setTranscribing(true);
    setTranscribeError("");
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setTranscript(data.transcript);
      } else {
        setTranscribeError(data.error ?? "Transcription failed");
      }
    } catch (err) {
      setTranscribeError(String(err));
    } finally {
      setTranscribing(false);
    }
  };

  const canGenerate =
    lead.name.trim() &&
    lead.role.trim() &&
    (tab === "audio" ? transcript.trim() || audioFile : true);

  const profileFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label>Lead Name *</Label>
        <Input value={lead.name} onChange={setField("name")} placeholder="e.g. Rohan Sharma" required />
      </div>
      <div>
        <Label>Lead Phone (WhatsApp) *</Label>
        <Input value={lead.phone} onChange={setField("phone")} placeholder="+91 98765 43210" type="tel" />
      </div>
      <div>
        <Label>Current Role *</Label>
        <Input value={lead.role} onChange={setField("role")} placeholder="e.g. Software Engineer" required />
      </div>
      <div>
        <Label>Company</Label>
        <Input value={lead.company} onChange={setField("company")} placeholder="e.g. TCS" />
      </div>
      <div>
        <Label>Years of Experience</Label>
        <Input value={lead.yoe} onChange={setField("yoe")} placeholder="e.g. 4" />
      </div>
      <div>
        <Label>Current CTC</Label>
        <Input value={lead.currentCTC} onChange={setField("currentCTC")} placeholder="e.g. 14 LPA" />
      </div>
      <div>
        <Label>Education</Label>
        <Input value={lead.education} onChange={setField("education")} placeholder="e.g. B.Tech CSE, VIT 2020" />
      </div>
      <div>
        <Label>Goal / Aspiration</Label>
        <Input value={lead.goal} onChange={setField("goal")} placeholder="e.g. Move to AI/ML roles" />
      </div>
      <div className="sm:col-span-2">
        <Label>Additional Notes</Label>
        <Input value={lead.notes} onChange={setField("notes")} placeholder="e.g. Has AWS cert, interested in RAG & agents" />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-6 pb-16 fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">New Lead</h2>
        <p className="text-slate-400 text-sm mt-1">Fill in the lead profile, then generate your BDA nudge + personalized PDF</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 text-sm">
          ⚠️ Generation failed: {error}. Your data is preserved — please try again.
        </div>
      )}

      <Card>
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 rounded-xl p-1 mb-6">
          {(["structured", "audio"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-orange-500 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "structured" ? "📝 Structured Input" : "🎙️ Audio Upload"}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Lead Profile</h3>
          {profileFields}
        </div>

        {tab === "structured" ? (
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Call Transcript</h3>
            <Textarea
              value={transcript}
              onChange={setTranscript}
              rows={8}
              placeholder="Paste the call transcript here. Include the lead's exact questions and concerns — the AI will extract them to build the personalized PDF.&#10;&#10;Example:&#10;BDA: Hi Rohan, how's it going...&#10;Lead: I'm curious about the program but I'm not sure why I'd pay ₹3.5L when..."
            />
            <p className="text-xs text-slate-500 mt-1">No transcript yet? Leave blank — AI will infer likely questions from the profile.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Call Recording</h3>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 hover:border-orange-500/50 rounded-xl p-8 text-center cursor-pointer transition-all group"
            >
              <div className="text-4xl mb-3">🎙️</div>
              {audioFile ? (
                <div>
                  <p className="text-emerald-400 font-semibold text-sm">{audioFile.name}</p>
                  <p className="text-slate-500 text-xs mt-1">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-300 font-semibold text-sm group-hover:text-white transition">Click to upload audio</p>
                  <p className="text-slate-500 text-xs mt-1">MP3, MP4, M4A, WAV, WEBM, OGG (max 25MB)</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setAudioFile(f); setTranscript(""); setTranscribeError(""); }
              }}
            />

            {/* Transcribe button */}
            {audioFile && !transcript && (
              <Btn
                onClick={handleTranscribe}
                disabled={transcribing}
                variant="secondary"
                className="mt-3 w-full"
              >
                {transcribing ? (
                  <><span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Transcribing...</>
                ) : (
                  "🔄 Transcribe with Whisper"
                )}
              </Btn>
            )}

            {transcribeError && (
              <p className="text-red-400 text-xs mt-2">⚠️ {transcribeError}</p>
            )}

            {transcript && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✓ Transcript Ready</span>
                  <button onClick={() => { setTranscript(""); setAudioFile(null); }} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{transcript}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-700">
          <Btn
            onClick={() => onGenerate(lead, transcript)}
            disabled={!canGenerate}
            className="w-full text-base py-3"
          >
            ⚡ Generate BDA Nudge + PDF Content
          </Btn>
          {!canGenerate && (
            <p className="text-xs text-slate-500 text-center mt-2">Fill in at least Lead Name and Role to continue</p>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── SCREEN 3: Generating ────────────────────────────────────────────────────
function GeneratingScreen({ step }: { step: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center pulse-glow">
          <span className="text-4xl">🤖</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white text-center">{step}</h2>
          <p className="text-slate-400 text-sm text-center mt-1">Claude is personalising everything for this lead...</p>
        </div>
        {/* Bouncing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full dot-bounce"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 4: Nudge Preview ─────────────────────────────────────────────────
function NudgePreviewScreen({
  nudge,
  bdaPhone,
  leadName,
  onSendNudge,
  onContinue,
  sending,
  sent,
  sendError,
}: {
  nudge: NudgeContent;
  bdaPhone: string;
  leadName: string;
  onSendNudge: () => void;
  onContinue: () => void;
  sending: boolean;
  sent: boolean;
  sendError: string;
}) {
  const confColor =
    nudge.confidence === "🟢"
      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
      : nudge.confidence === "🟡"
      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
      : "bg-red-500/10 border-red-500/30 text-red-400";

  return (
    <div className="w-full max-w-2xl mx-auto p-6 pb-16 fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">BDA Pre-Call Nudge</h2>
        <p className="text-slate-400 text-sm mt-1">
          Review the nudge for <span className="text-orange-400 font-semibold">{leadName}</span> before sending to your WhatsApp
        </p>
      </div>

      {/* Confidence badge */}
      <div className={`border rounded-xl p-4 mb-4 flex items-start gap-3 ${confColor}`}>
        <span className="text-2xl">{nudge.confidence}</span>
        <div>
          <p className="font-bold text-sm">Confidence Signal</p>
          <p className="text-sm opacity-80 mt-0.5">{nudge.confidenceReason}</p>
        </div>
      </div>

      {/* Details cards */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Card className="p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lead Summary</p>
          <p className="text-slate-200 text-sm leading-relaxed">{nudge.summary}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">💡 Talking Angles</p>
          <ul className="space-y-2">
            {nudge.talkingAngles.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                <span className="text-orange-400 mt-0.5">•</span>
                {a}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">⚠️ Objections & Handles</p>
          <div className="space-y-3">
            {nudge.objections.map((o, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-3">
                <p className="text-amber-400 text-sm font-semibold mb-1">"{o.objection}"</p>
                <p className="text-slate-300 text-sm">↳ {o.handle}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🎯 Opening Hook</p>
          <p className="text-slate-100 text-sm italic leading-relaxed">"{nudge.openingHook}"</p>
        </Card>
      </div>

      {/* WhatsApp message preview */}
      <Card className="mb-4 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold">W</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Message Preview</p>
          <span className="text-xs text-slate-500">→ {bdaPhone}</span>
        </div>
        <div className="wa-bubble">{nudge.rawMessage}</div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {sendError && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm">
            ⚠️ {sendError}
          </div>
        )}
        {sent ? (
          <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-3 text-emerald-400 text-sm text-center">
            ✅ Nudge sent to {bdaPhone}
          </div>
        ) : (
          <Btn onClick={onSendNudge} disabled={sending} className="w-full">
            {sending ? (
              <><span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Sending...</>
            ) : (
              "📲 Send Nudge to My WhatsApp"
            )}
          </Btn>
        )}
        <Btn onClick={onContinue} variant="secondary" className="w-full">
          Continue to PDF Approval →
        </Btn>
      </div>
    </div>
  );
}

// ── SCREEN 5: PDF Approval ──────────────────────────────────────────────────
function PDFApprovalScreen({
  pdfContent,
  onApprove,
  onSkip,
  generating,
  sending,
  sent,
  sendError,
  pdfBase64,
}: {
  pdfContent: PDFContent;
  onApprove: (editedMessage?: string) => void;
  onSkip: () => void;
  generating: boolean;
  sending: boolean;
  sent: boolean;
  sendError: string;
  pdfBase64: string | null;
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState(pdfContent.whatsappMessage);

  const sourceColor = (s: "curriculum" | "call") =>
    s === "curriculum" ? "text-emerald-400" : "text-amber-400";
  const sourceDot = (s: "curriculum" | "call") =>
    s === "curriculum" ? "bg-emerald-400" : "bg-amber-400";
  const sourceLabel = (s: "curriculum" | "call") =>
    s === "curriculum"
      ? "Based on Scaler's published curriculum"
      : `Based on what ${pdfContent.leadName} shared during the call`;

  const themeAccent =
    pdfContent.theme === "senior"
      ? "border-blue-500/30 bg-blue-500/5"
      : pdfContent.theme === "junior"
      ? "border-orange-500/30 bg-orange-500/5"
      : "border-purple-500/30 bg-purple-500/5";

  return (
    <div className="w-full max-w-2xl mx-auto p-6 pb-16 fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">PDF Review & Approval</h2>
        <p className="text-slate-400 text-sm mt-1">
          Personalised for <span className="text-orange-400 font-semibold">{pdfContent.leadName}</span> · {pdfContent.program}
        </p>
      </div>

      {/* PDF preview */}
      <Card className={`mb-4 border ${themeAccent}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-xl">📄</div>
          <div>
            <p className="font-bold text-white text-sm">{pdfContent.leadName} — {pdfContent.program}</p>
            <p className="text-xs text-slate-400">{pdfContent.leadRole} · {pdfContent.leadCompany}</p>
          </div>
          {pdfBase64 && (
            <a
              href={`data:application/pdf;base64,${pdfBase64}`}
              download={`Scaler_${pdfContent.leadName.replace(/\s+/g, "_")}.pdf`}
              className="ml-auto text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 shrink-0"
            >
              ↓ Preview PDF
            </a>
          )}
        </div>

        {/* Opening */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opening Note</p>
          <p className="text-slate-200 text-sm leading-relaxed italic">"{pdfContent.opening}"</p>
        </div>

        {/* Program reason */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Why {pdfContent.program}</p>
          <p className="text-slate-300 text-sm leading-relaxed">{pdfContent.programReason}</p>
        </div>

        {/* Q&A sections */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Questions Answered ({pdfContent.sections.length})</p>
          <div className="space-y-3">
            {pdfContent.sections.map((s, i) => (
              <div key={i} className="bg-slate-900 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700">
                  <p className="text-sm font-semibold text-white leading-snug">Q: {s.question}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">{s.answer}</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${sourceDot(s.source)}`} />
                    <span className={`text-xs ${sourceColor(s.source)}`}>{sourceLabel(s.source)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Next Steps</p>
          <ol className="space-y-1.5">
            {pdfContent.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </Card>

      {/* Send timing */}
      <Card className="mb-4 p-4">
        <div className="flex items-start gap-2">
          <span className="text-lg">⏰</span>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Send Timing Recommendation</p>
            <p className="text-slate-200 text-sm">{pdfContent.sendTimingRecommendation}</p>
          </div>
        </div>
      </Card>

      {/* WhatsApp message */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold">W</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Covering WhatsApp Message</p>
          <button
            onClick={() => setEditMode(!editMode)}
            className="ml-auto text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2"
          >
            {editMode ? "Cancel edit" : "Edit"}
          </button>
        </div>
        {editMode ? (
          <Textarea value={editedMessage} onChange={setEditedMessage} rows={4} />
        ) : (
          <div className="wa-bubble">{editedMessage}</div>
        )}
      </Card>

      {/* Errors */}
      {sendError && (
        <div className="mb-4 bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm">
          ⚠️ {sendError}
        </div>
      )}

      {/* Action buttons */}
      {sent ? (
        <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4 text-center">
          <p className="text-emerald-400 font-bold text-lg mb-1">✅ PDF Sent!</p>
          <p className="text-emerald-300/70 text-sm">WhatsApp message + PDF delivered to {pdfContent.leadName}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Btn
            onClick={() => onApprove(editMode ? editedMessage : undefined)}
            disabled={generating || sending}
            className="w-full text-base py-3"
          >
            {generating ? (
              <><span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Generating PDF...</>
            ) : sending ? (
              <><span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Sending via WhatsApp...</>
            ) : (
              "✅ Approve & Send PDF to Lead"
            )}
          </Btn>
          <Btn onClick={onSkip} variant="ghost" className="w-full">
            Skip (don't send PDF)
          </Btn>
        </div>
      )}
    </div>
  );
}

// ── SCREEN 6: Confirmation ──────────────────────────────────────────────────
function ConfirmationScreen({
  leadName,
  result,
  onReset,
}: {
  leadName: string;
  result: SendResult;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 fade-in-up">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-5xl">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-white">All Done!</h2>
          <p className="text-slate-400 text-sm mt-2">
            Outreach complete for <span className="text-orange-400 font-semibold">{leadName}</span>
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {/* Nudge status */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.nudgeSent ? "bg-emerald-900/20 border-emerald-700" : "bg-slate-800 border-slate-700"}`}>
            <span className="text-xl">{result.nudgeSent ? "✅" : "⏭️"}</span>
            <div>
              <p className="text-sm font-semibold text-white">BDA Pre-Call Nudge</p>
              <p className="text-xs text-slate-400">{result.nudgeSent ? `Sent · SID: ${result.nudgeSid?.slice(-8)}` : "Not sent"}</p>
            </div>
          </div>

          {/* PDF status */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${
            result.pdfSent
              ? "bg-emerald-900/20 border-emerald-700"
              : result.pdfSkipped
              ? "bg-slate-800 border-slate-700"
              : "bg-red-900/20 border-red-700"
          }`}>
            <span className="text-xl">{result.pdfSent ? "✅" : result.pdfSkipped ? "⏭️" : "❌"}</span>
            <div>
              <p className="text-sm font-semibold text-white">Personalised PDF to Lead</p>
              <p className="text-xs text-slate-400">
                {result.pdfSent
                  ? `Delivered via WhatsApp · SID: ${result.pdfSid?.slice(-8)}`
                  : result.pdfSkipped
                  ? "Skipped by BDA"
                  : result.error
                  ? `Error: ${result.error}`
                  : "Not sent"}
              </p>
            </div>
          </div>
        </div>

        <Btn onClick={onReset} className="w-full">
          ➕ Start Next Lead
        </Btn>
      </div>
    </div>
  );
}

// ── MAIN APP ────────────────────────────────────────────────────────────────
const STEPS: { label: string; screens: AppScreen[] }[] = [
  { label: "Setup", screens: ["onboarding"] },
  { label: "Lead", screens: ["lead-input"] },
  { label: "Generate", screens: ["generating"] },
  { label: "Nudge", screens: ["nudge-preview"] },
  { label: "PDF", screens: ["pdf-approval"] },
  { label: "Done", screens: ["confirmation"] },
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [bdaPhone, setBdaPhone] = useState("");
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({ ...emptyLead });
  const [transcript, setTranscript] = useState("");
  const [nudge, setNudge] = useState<NudgeContent | null>(null);
  const [pdfContent, setPdfContent] = useState<PDFContent | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [generatingStep, setGeneratingStep] = useState("Generating...");
  const [sendError, setSendError] = useState("");
  const [nudgeSending, setNudgeSending] = useState(false);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfSending, setPdfSending] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult>({
    nudgeSent: false,
    pdfSent: false,
    pdfSkipped: false,
  });

  // Current step index
  const currentStepIndex = STEPS.findIndex((s) => s.screens.includes(screen));

  const handleOnboarding = useCallback((phone: string) => {
    setBdaPhone(phone);
    setScreen("lead-input");
  }, []);

  const handleGenerate = useCallback(
    async (lead: LeadProfile, txn: string) => {
      setLeadProfile(lead);
      setTranscript(txn);
      setScreen("generating");
      setSendError("");
      setNudgeSent(false);
      setPdfSent(false);
      setPdfBase64(null);
      setPdfId(null);
      setPdfUrl(null);

      try {
        // Step 1: Generate nudge
        setGeneratingStep("✨ Generating BDA nudge...");
        const nudgeRes = await fetch("/api/generate-nudge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadProfile: lead, transcript: txn }),
        });
        const nudgeData = await nudgeRes.json();
        if (!nudgeData.success) throw new Error(nudgeData.error);
        setNudge(nudgeData.nudge);

        // Step 2: Generate PDF content
        setGeneratingStep("📄 Creating personalised PDF content...");
        const pdfRes = await fetch("/api/generate-pdf-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadProfile: lead, transcript: txn }),
        });
        const pdfData = await pdfRes.json();
        if (!pdfData.success) throw new Error(pdfData.error);
        setPdfContent(pdfData.pdfContent);

        setScreen("nudge-preview");
      } catch (err) {
        setSendError(String(err));
        setScreen("lead-input");
      }
    },
    []
  );

  const handleSendNudge = useCallback(async () => {
    if (!nudge) return;
    setNudgeSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: bdaPhone,
          message: nudge.rawMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNudgeSent(true);
        setSendResult((prev) => ({ ...prev, nudgeSent: true, nudgeSid: data.messageSid }));
      } else {
        setSendError(data.error ?? "Failed to send nudge");
      }
    } catch (err) {
      setSendError(String(err));
    } finally {
      setNudgeSending(false);
    }
  }, [nudge, bdaPhone]);

  const handleApprovePDF = useCallback(
    async (editedMessage?: string) => {
      if (!pdfContent) return;
      setSendError("");
      setPdfGenerating(true);

      try {
        // Generate PDF binary
        const genRes = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfContent }),
        });
        const genData = await genRes.json();
        if (!genData.success) throw new Error(genData.error);

        setPdfId(genData.pdfUrl ?? null); // blob URL used as ID
        setPdfUrl(genData.pdfUrl);
        setPdfBase64(genData.base64);
        setPdfGenerating(false);
        setPdfSending(true);

        // Send via WhatsApp
        const message = editedMessage ?? pdfContent.whatsappMessage;
        const sendRes = await fetch("/api/send-whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: leadProfile.phone,
            message,
            pdfUrl: genData.pdfUrl,
          }),
        });
        const sendData = await sendRes.json();
        if (sendData.success) {
          setPdfSent(true);
          setSendResult((prev) => ({
            ...prev,
            pdfSent: true,
            pdfSid: sendData.messageSid,
          }));
          // Auto-advance after short delay
          setTimeout(() => setScreen("confirmation"), 1500);
        } else {
          setSendError(sendData.error ?? "Failed to send PDF");
        }
      } catch (err) {
        setSendError(String(err));
      } finally {
        setPdfGenerating(false);
        setPdfSending(false);
      }
    },
    [pdfContent, leadProfile.phone]
  );

  const handleSkipPDF = useCallback(() => {
    setSendResult((prev) => ({ ...prev, pdfSkipped: true }));
    setScreen("confirmation");
  }, []);

  const handleReset = useCallback(() => {
    setLeadProfile({ ...emptyLead });
    setTranscript("");
    setNudge(null);
    setPdfContent(null);
    setPdfId(null);
    setPdfUrl(null);
    setPdfBase64(null);
    setSendError("");
    setNudgeSent(false);
    setPdfSent(false);
    setSendResult({ nudgeSent: false, pdfSent: false, pdfSkipped: false });
    setScreen("lead-input");
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      {screen !== "onboarding" && (
        <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-sm">S</div>
              <span className="text-white font-bold text-sm">Scaler Sales AI</span>
            </div>
            {/* Step indicator */}
            <div className="flex items-center">
              {STEPS.filter((s) => s.label !== "Generate").map((s, i, arr) => {
                const filteredIndex = STEPS.filter((x) => x.label !== "Generate").indexOf(s);
                const originalIndex = STEPS.indexOf(s);
                const isActive = s.screens.includes(screen);
                const isDone = originalIndex < currentStepIndex && !s.screens.includes(screen);
                return (
                  <React.Fragment key={s.label}>
                    <StepBadge
                      n={filteredIndex + 1}
                      label={s.label}
                      active={isActive}
                      done={isDone}
                    />
                    {filteredIndex < arr.length - 1 && (
                      <StepConnector done={isDone} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* BDA phone */}
            {bdaPhone && (
              <span className="text-xs text-slate-500 hidden sm:block">{bdaPhone}</span>
            )}
          </div>
        </header>
      )}

      {/* Screen content */}
      <main className="flex-1 flex flex-col">
        {screen === "onboarding" && (
          <OnboardingScreen onContinue={handleOnboarding} />
        )}
        {screen === "lead-input" && (
          <LeadInputScreen
            onGenerate={handleGenerate}
            initialLead={leadProfile.name ? leadProfile : undefined}
            initialTranscript={transcript}
            error={sendError || undefined}
          />
        )}
        {screen === "generating" && (
          <GeneratingScreen step={generatingStep} />
        )}
        {screen === "nudge-preview" && nudge && (
          <NudgePreviewScreen
            nudge={nudge}
            bdaPhone={bdaPhone}
            leadName={leadProfile.name}
            onSendNudge={handleSendNudge}
            onContinue={() => setScreen("pdf-approval")}
            sending={nudgeSending}
            sent={nudgeSent}
            sendError={sendError}
          />
        )}
        {screen === "pdf-approval" && pdfContent && (
          <PDFApprovalScreen
            pdfContent={pdfContent}
            onApprove={handleApprovePDF}
            onSkip={handleSkipPDF}
            generating={pdfGenerating}
            sending={pdfSending}
            sent={pdfSent}
            sendError={sendError}
            pdfBase64={pdfBase64}
          />
        )}
        {screen === "confirmation" && (
          <ConfirmationScreen
            leadName={leadProfile.name}
            result={sendResult}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
