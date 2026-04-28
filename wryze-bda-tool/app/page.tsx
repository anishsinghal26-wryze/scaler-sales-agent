"use client";

import React, { useState, useRef, useCallback } from "react";
import type { PreCallInput, PreCallOutput, PostCallInput, PostCallOutput } from "@/lib/types";

// ── Tiny copy hook ───────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  }, []);
  return { copy, copied };
}

// ── Shared UI atoms ──────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{children}</label>;
}

function Field({ value, onChange, placeholder, rows }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const base = "w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition";
  return rows
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${base} resize-none`} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />;
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition">
      {children}
    </select>
  );
}

function Btn({ onClick, children, disabled, variant = "primary", className = "" }: {
  onClick: () => void; children: React.ReactNode; disabled?: boolean; variant?: "primary" | "ghost"; className?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        variant === "primary"
          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
          : "bg-slate-700 hover:bg-slate-600 text-slate-200"
      } ${className}`}>
      {children}
    </button>
  );
}

function WADisabledBtn() {
  return (
    <div>
      <button
        disabled
        className="inline-flex items-center justify-center gap-2 w-full rounded-xl font-semibold text-sm px-5 py-2.5 bg-emerald-700/30 text-emerald-600 border border-emerald-800 cursor-not-allowed opacity-60"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.122 1.526 5.847L.057 23.882l6.198-1.624A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.657-.523-5.167-1.427l-.371-.22-3.679.965.981-3.585-.241-.378A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Send on WhatsApp
      </button>
      <p className="text-xs text-slate-600 text-center mt-1.5">
        WhatsApp delivery will be enabled after Twilio integration.
      </p>
    </div>
  );
}

function CopyBtn({ text, id, copy, copied }: { text: string; id: string; copy: (t: string, id: string) => void; copied: string | null }) {
  const isCopied = copied === id;
  return (
    <button onClick={() => copy(text, id)}
      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
        isCopied ? "bg-emerald-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"
      }`}>
      {isCopied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-slate-800/60 border border-slate-700 rounded-xl p-5 ${className}`}>{children}</div>;
}

function CardHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}

function WABubble({ text, copyId, copy, copied }: { text: string; copyId: string; copy: (t: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-1">
      <div className="wa-bubble">{text}</div>
      <div className="flex justify-end">
        <CopyBtn text={text} id={copyId} copy={copy} copied={copied} />
      </div>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-emerald-500" : score >= 45 ? "bg-amber-500" : "bg-red-500";
  const label = score >= 70 ? "High" : score >= 45 ? "Medium" : "Low";
  const labelColor = score >= 70 ? "text-emerald-400" : score >= 45 ? "text-amber-400" : "text-red-400";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">Conversion Confidence</span>
        <span className={`text-sm font-bold ${labelColor}`}>{score}/100 · {label}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />;
}

// ── PRE-CALL defaults ─────────────────────────────────────────────────────────
const emptyPreCall: PreCallInput = {
  studentName: "", currentScore: "", targetScore: "", painPoint: "",
  platformsUsed: "", concern: "", objection: "", selfReportedWeakArea: "",
  actualWeakArea: "", notes: "",
};

// ── POST-CALL defaults ────────────────────────────────────────────────────────
const emptyPostCall: PostCallInput = {
  studentName: "", currentScore: "", targetScore: "", transcript: "",
  parentConcern: "", weaknessesDiscussed: "", objectionsRaised: "",
  examDate: "", dreamColleges: "",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRE-CALL PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function PreCallPanel() {
  const [input, setInput] = useState<PreCallInput>({ ...emptyPreCall });
  const [output, setOutput] = useState<PreCallOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { copy, copied } = useCopy();
  const outputRef = useRef<HTMLDivElement>(null);

  const setF = (field: keyof PreCallInput) => (v: string) => setInput(p => ({ ...p, [field]: v }));

  const generate = async () => {
    setLoading(true); setError(""); setOutput(null);
    try {
      const res = await fetch("/api/pre-call", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Generation failed");
      setOutput(data.output);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = input.studentName.trim() || input.currentScore.trim();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── INPUT FORM ── */}
      <div className="space-y-5">
        <Card>
          <h3 className="text-sm font-bold text-slate-200 mb-4">Student Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Student Name</Label>
              <Field value={input.studentName} onChange={setF("studentName")} placeholder="e.g. Rahul Mehta" />
            </div>
            <div>
              <Label>Current SAT Score</Label>
              <Field value={input.currentScore} onChange={setF("currentScore")} placeholder="e.g. 1200" />
            </div>
            <div>
              <Label>Target Score</Label>
              <Field value={input.targetScore} onChange={setF("targetScore")} placeholder="e.g. 1400" />
            </div>
            <div>
              <Label>Self-Reported Weak Area</Label>
              <Select value={input.selfReportedWeakArea} onChange={setF("selfReportedWeakArea")}>
                <option value="">Not specified</option>
                <option value="Math">Math</option>
                <option value="Reading/Writing">Reading / Writing</option>
                <option value="Both">Both</option>
              </Select>
            </div>
            <div>
              <Label>Actual Weak Area (scorecard)</Label>
              <Select value={input.actualWeakArea} onChange={setF("actualWeakArea")}>
                <option value="">Not available</option>
                <option value="Math">Math</option>
                <option value="Reading/Writing">Reading / Writing</option>
                <option value="Both">Both</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-slate-200 mb-4">Lead Context</h3>
          <div className="space-y-3">
            <div>
              <Label>Pain Point</Label>
              <Field value={input.painPoint} onChange={setF("painPoint")} placeholder="e.g. practicing daily but score not moving" />
            </div>
            <div>
              <Label>Platforms Currently Using</Label>
              <Field value={input.platformsUsed} onChange={setF("platformsUsed")} placeholder="e.g. Khan Academy, Bluebook" />
            </div>
            <div>
              <Label>Parent / Student Concern</Label>
              <Field value={input.concern} onChange={setF("concern")} placeholder="e.g. parent worried about wasted effort" />
            </div>
            <div>
              <Label>Known Objection</Label>
              <Field value={input.objection} onChange={setF("objection")} placeholder='e.g. "I already use Khan Academy"' />
            </div>
            <div>
              <Label>Notes / Interaction History</Label>
              <Field value={input.notes} onChange={setF("notes")} placeholder="e.g. had one short call, seemed interested but unsure" rows={3} />
            </div>
          </div>
        </Card>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm">⚠️ {error}</div>
        )}

        <Btn onClick={generate} disabled={!canGenerate || loading} className="w-full py-3 text-base">
          {loading ? <><Spinner /> Generating Nudge...</> : "⚡ Generate Pre-Call Nudge"}
        </Btn>
      </div>

      {/* ── OUTPUT ── */}
      <div ref={outputRef} className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <div className="flex gap-2 mb-4">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500 dot" />)}
            </div>
            <p className="text-sm">Analysing lead and building nudge...</p>
          </div>
        )}

        {output && !loading && (
          <div className="space-y-4 fade-up">
            {/* Summary + Confidence */}
            <Card>
              <CardHeader label="Lead Snapshot" />
              <p className="text-sm text-slate-200 leading-relaxed mb-4">{output.lead_summary}</p>
              <ConfidenceBar score={output.conversion_confidence} />
            </Card>

            {/* Core Pain + Angle */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader label="Core Pain Detected" />
                <p className="text-sm text-slate-300 leading-relaxed">{output.detected_problem}</p>
              </Card>
              <Card>
                <CardHeader label="Primary Sales Angle" />
                <p className="text-sm text-blue-300 leading-relaxed font-medium">{output.primary_angle}</p>
              </Card>
            </div>

            {/* WhatsApp Nudge */}
            <Card>
              <CardHeader label="WhatsApp Nudge — 3 Messages">
                <CopyBtn
                  text={output.whatsapp_nudge.join("\n\n")}
                  id="nudge-all"
                  copy={copy}
                  copied={copied}
                />
              </CardHeader>
              <div className="space-y-3">
                {output.whatsapp_nudge.map((msg, i) => (
                  <WABubble key={i} text={msg} copyId={`nudge-${i}`} copy={copy} copied={copied} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <WADisabledBtn />
              </div>
            </Card>

            {/* Talking Points */}
            <Card>
              <CardHeader label="Call Talking Points" />
              <ol className="space-y-3">
                {output.call_talking_points.map((pt, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                    {pt}
                  </li>
                ))}
              </ol>
            </Card>

            {/* Objection */}
            <Card>
              <CardHeader label="Objection Handling" />
              <div className="bg-slate-900 rounded-lg p-3 mb-2">
                <p className="text-xs text-amber-400 font-semibold mb-1">Likely Objection</p>
                <p className="text-sm text-slate-200">&quot;{output.objection_handling.objection}&quot;</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-emerald-400 font-semibold mb-1">Best Response</p>
                <p className="text-sm text-slate-200 leading-relaxed">{output.objection_handling.response}</p>
                <div className="flex justify-end mt-2">
                  <CopyBtn text={output.objection_handling.response} id="objection-resp" copy={copy} copied={copied} />
                </div>
              </div>
            </Card>

            {/* Closing + Follow-up */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader label="Closing Line">
                  <CopyBtn text={output.closing_line} id="closing" copy={copy} copied={copied} />
                </CardHeader>
                <p className="text-sm text-white font-medium">{output.closing_line}</p>
              </Card>
              <Card>
                <CardHeader label="Follow-up Message (no reply)">
                  <CopyBtn text={output.follow_up_message} id="followup" copy={copy} copied={copied} />
                </CardHeader>
                <div className="wa-bubble">{output.follow_up_message}</div>
                <div className="mt-3">
                  <WADisabledBtn />
                </div>
              </Card>
            </div>
          </div>
        )}

        {!output && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 text-center">
            <div className="text-4xl mb-3 opacity-30">⚡</div>
            <p className="text-sm">Fill in lead details and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST-CALL PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function PostCallPanel() {
  const [input, setInput] = useState<PostCallInput>({ ...emptyPostCall });
  const [output, setOutput] = useState<PostCallOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfBase64, setPdfBase64] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { copy, copied } = useCopy();

  const setF = (field: keyof PostCallInput) => (v: string) => setInput(p => ({ ...p, [field]: v }));

  const handleTranscribe = async () => {
    if (!audioFile) return;
    setTranscribing(true);
    try {
      const fd = new FormData();
      fd.append("audio", audioFile);
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setInput(p => ({ ...p, transcript: data.transcript }));
    } finally {
      setTranscribing(false);
    }
  };

  const generate = async () => {
    setLoading(true); setError(""); setOutput(null); setPdfUrl(""); setPdfBase64("");
    try {
      const res = await fetch("/api/post-call", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Generation failed");
      setOutput(data.output);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!output) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ output, input }),
      });
      const data = await res.json();
      if (data.success) { setPdfUrl(data.pdfUrl); setPdfBase64(data.base64); }
    } finally {
      setPdfLoading(false);
    }
  };

  const canGenerate = input.studentName.trim() || input.transcript.trim();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── INPUT ── */}
      <div className="space-y-5">
        <Card>
          <h3 className="text-sm font-bold text-slate-200 mb-4">Student Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Student Name</Label>
              <Field value={input.studentName} onChange={setF("studentName")} placeholder="e.g. Aisha Khan" />
            </div>
            <div>
              <Label>Current Score</Label>
              <Field value={input.currentScore} onChange={setF("currentScore")} placeholder="e.g. 1280" />
            </div>
            <div>
              <Label>Target Score</Label>
              <Field value={input.targetScore} onChange={setF("targetScore")} placeholder="e.g. 1500" />
            </div>
            <div>
              <Label>Exam Date</Label>
              <Field value={input.examDate} onChange={setF("examDate")} placeholder="e.g. May 2026" />
            </div>
            <div>
              <Label>Dream Colleges</Label>
              <Field value={input.dreamColleges} onChange={setF("dreamColleges")} placeholder="e.g. NYU, UCLA" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-slate-200 mb-4">Call Context</h3>
          <div className="space-y-3">
            <div>
              <Label>Parent Concern</Label>
              <Field value={input.parentConcern} onChange={setF("parentConcern")} placeholder="e.g. worried about wasted money on tutoring" />
            </div>
            <div>
              <Label>Weaknesses Discussed</Label>
              <Field value={input.weaknessesDiscussed} onChange={setF("weaknessesDiscussed")} placeholder="e.g. time pressure on Math, inference questions in Reading" />
            </div>
            <div>
              <Label>Objections Raised</Label>
              <Field value={input.objectionsRaised} onChange={setF("objectionsRaised")} placeholder='e.g. "I already tried a tutor and it didn&apos;t help"' />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-200">Call Transcript</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg font-medium transition">
              🎙️ Upload Audio
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) { setAudioFile(f); } }} />
          {audioFile && !input.transcript && (
            <div className="mb-3 flex items-center gap-3 bg-slate-900 rounded-lg p-2.5">
              <span className="text-sm text-emerald-400 flex-1">{audioFile.name}</span>
              <button onClick={handleTranscribe} disabled={transcribing}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50 transition">
                {transcribing ? <><Spinner /> Transcribing...</> : "Transcribe"}
              </button>
            </div>
          )}
          <Field
            value={input.transcript}
            onChange={setF("transcript")}
            placeholder={"Paste call transcript or notes here...\n\nIf no transcript, leave blank — the AI will infer from student data above."}
            rows={8}
          />
        </Card>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm">⚠️ {error}</div>
        )}

        <Btn onClick={generate} disabled={!canGenerate || loading} className="w-full py-3 text-base">
          {loading ? <><Spinner /> Generating Roadmap...</> : "📋 Generate Post-Call Roadmap"}
        </Btn>
      </div>

      {/* ── OUTPUT ── */}
      <div ref={outputRef} className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <div className="flex gap-2 mb-4">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500 dot" />)}
            </div>
            <p className="text-sm">Building personalised score roadmap...</p>
          </div>
        )}

        {output && !loading && (
          <div className="space-y-4 fade-up">
            {/* Summary */}
            <Card>
              <CardHeader label="Student / Parent Summary" />
              <p className="text-sm text-slate-200 leading-relaxed">{output.student_summary}</p>
            </Card>

            {/* Diagnosis */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader label="What They Think the Problem Is" />
                <p className="text-sm text-amber-300 leading-relaxed">{output.perceived_problem}</p>
              </Card>
              <Card>
                <CardHeader label="What the Real Problem Is" />
                <p className="text-sm text-blue-300 leading-relaxed font-medium">{output.real_problem}</p>
              </Card>
            </div>

            {/* Score Gap + Pitch */}
            <Card>
              <CardHeader label="Score Gap Analysis" />
              <p className="text-sm text-slate-300 leading-relaxed">{output.score_gap_analysis}</p>
            </Card>
            <Card>
              <CardHeader label="Wryze Pitch Angle" />
              <p className="text-sm text-slate-200 leading-relaxed">{output.wryze_pitch_angle}</p>
            </Card>

            {/* WhatsApp follow-up */}
            <Card>
              <CardHeader label="WhatsApp Follow-up (post-call)">
                <CopyBtn text={output.whatsapp_followup} id="wa-followup" copy={copy} copied={copied} />
              </CardHeader>
              <div className="wa-bubble">{output.whatsapp_followup}</div>
              <div className="mt-3">
                <WADisabledBtn />
              </div>
            </Card>

            {/* PDF Roadmap Preview */}
            <Card>
              <CardHeader label="PDF Roadmap Content">
                <Btn onClick={generatePDF} disabled={pdfLoading} variant="ghost" className="!py-1 !px-3 text-xs">
                  {pdfLoading ? <><Spinner /> Generating PDF...</> : "📄 Generate PDF"}
                </Btn>
              </CardHeader>

              <div className="space-y-4">
                {/* Scores */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-slate-900 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">CURRENT</p>
                    <p className="text-xl font-bold text-white">{output.pdf_roadmap.current_score}</p>
                  </div>
                  <div className="flex-1 bg-blue-900/40 border border-blue-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">GAP</p>
                    <p className="text-xl font-bold text-blue-400">{output.pdf_roadmap.score_gap}</p>
                  </div>
                  <div className="flex-1 bg-emerald-900/30 border border-emerald-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">TARGET</p>
                    <p className="text-xl font-bold text-emerald-400">{output.pdf_roadmap.target_score}</p>
                  </div>
                </div>

                {/* Blockers */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Blockers</p>
                  <ul className="space-y-1.5">
                    {output.pdf_roadmap.blockers.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-red-400 flex-shrink-0">•</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Monthly Plan */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Month-by-Month Plan</p>
                  <div className="space-y-2">
                    {output.pdf_roadmap.monthly_plan.map((m, i) => (
                      <div key={i} className="flex gap-3 bg-slate-900 rounded-lg p-3">
                        <div className="flex-shrink-0 w-20">
                          <p className="text-xs text-blue-400 font-bold">{m.month}</p>
                          <p className="text-sm font-bold text-white">{m.milestone}</p>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{m.focus}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What Wryze Tracks */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What Wryze Will Track</p>
                  <ul className="space-y-1.5">
                    {output.pdf_roadmap.what_wryze_tracks.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 flex-shrink-0">→</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guarantee */}
                <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg p-3">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Guarantee</p>
                  <p className="text-sm text-emerald-300 leading-relaxed">{output.pdf_roadmap.guarantee_note}</p>
                </div>

                {/* PDF download */}
                {pdfBase64 && (
                  <a
                    href={`data:application/pdf;base64,${pdfBase64}`}
                    download={`Wryze_Roadmap_${input.studentName || "student"}.pdf`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                    ⬇️ Download PDF
                  </a>
                )}
              </div>
            </Card>

            {/* Follow-up Sequence */}
            <Card>
              <CardHeader label="Follow-up Sequence" />
              <div className="space-y-5">
                {[
                  { label: "24-Hour Follow-up", text: output.follow_up_sequence.h24, id: "fu-24h" },
                  { label: "3-Day Follow-up", text: output.follow_up_sequence.day3, id: "fu-3d" },
                  { label: "Reactivation Message", text: output.follow_up_sequence.reactivation, id: "fu-react" },
                ].map(({ label, text, id }) => (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">{label}</span>
                      <CopyBtn text={text} id={id} copy={copy} copied={copied} />
                    </div>
                    <div className="wa-bubble">{text}</div>
                    <div className="mt-2">
                      <WADisabledBtn />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!output && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 text-center">
            <div className="text-4xl mb-3 opacity-30">📋</div>
            <p className="text-sm">Paste transcript or fill details, then click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState<"pre" | "post">("pre");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-bold tracking-widest text-white uppercase">Wryze</span>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">BDA Tool</span>
          </div>
          <span className="text-xs text-slate-600">Internal Sales Assistant</span>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-6 pb-0">
          <div className="flex">
            {([
              { key: "pre", label: "⚡ Pre-Call Nudge", desc: "Before the call" },
              { key: "post", label: "📋 Post-Call Roadmap", desc: "After the call" },
            ] as const).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  tab === t.key
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}>
                {t.label}
                <span className={`ml-2 text-xs ${tab === t.key ? "text-slate-400" : "text-slate-600"}`}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {tab === "pre" ? <PreCallPanel /> : <PostCallPanel />}
      </main>
    </div>
  );
}
