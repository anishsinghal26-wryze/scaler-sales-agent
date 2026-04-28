import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { PostCallInput, PostCallOutput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const body = await request.json();
    const input: PostCallInput = body;

    const scoreGap =
      input.currentScore && input.targetScore
        ? parseInt(input.targetScore) - parseInt(input.currentScore)
        : null;

    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    const prompt = `You are the Wryze.ai Sales Intelligence Agent — POST-CALL MODE.
You have just received call context. Generate a complete post-call sales output.
You do NOT ask questions. You produce complete output immediately.

Wryze.ai context:
- SAT prep platform that identifies where a student's thinking breaks
- NOT just another practice platform — it's a thinking debugger
- Finds repeated mistake patterns and fixes the root cause, not symptoms
- Target: students stuck between 1100–1400 despite consistent practice
- Core positioning: Practice tells students WHAT went wrong. Wryze shows WHY it keeps happening.

## CALL DATA
Student Name: ${input.studentName || "the student"}
Current SAT Score: ${input.currentScore || "unknown"}
Target SAT Score: ${input.targetScore || "unknown"}
Score Gap: ${scoreGap !== null ? `${scoreGap} points` : "unknown"}
Exam Date: ${input.examDate || "not specified"}
Dream Colleges: ${input.dreamColleges || "not specified"}
Parent Concern: ${input.parentConcern || "not specified"}
Weaknesses Discussed on Call: ${input.weaknessesDiscussed || "not specified"}
Objections Raised: ${input.objectionsRaised || "none noted"}

## CALL TRANSCRIPT / NOTES
${input.transcript || "(No transcript provided — infer from profile data above)"}

## RULES
- WhatsApp follow-up: 3–5 lines, natural, warm, references something specific from the call
- PDF roadmap: realistic, specific, month-by-month plan based on actual score gap
- Monthly plan: 3–4 milestones depending on time to exam date
- Blockers: be specific (e.g. "decisions slow under time pressure" not "weak in math")
- What Wryze tracks: list 3–5 specific things it monitors (e.g. "time per question type", "re-read frequency on RC")
- Follow-up sequence: ready-to-send messages, human tone, 24h / 3-day / reactivation
- Never sound like a chatbot or generic CRM
- Current time of day: ${timeOfDay} — factor into send timing where relevant

Return ONLY valid JSON (no markdown, no code blocks):
{
  "student_summary": "2-line sharp summary of student + parent situation after the call",
  "perceived_problem": "what the student/parent thinks is the issue",
  "real_problem": "what the actual root problem likely is — be specific and insightful",
  "score_gap_analysis": "2-3 sentences: what this gap means, what typically causes it at this level, what needs to change",
  "wryze_pitch_angle": "the specific Wryze positioning angle for this student — one sharp paragraph",
  "whatsapp_followup": "personalised WhatsApp message to send after the call — reference something specific, warm but not generic, 3-5 lines",
  "pdf_roadmap": {
    "current_score": "${input.currentScore || 'unknown'}",
    "target_score": "${input.targetScore || 'unknown'}",
    "score_gap": "${scoreGap !== null ? scoreGap + ' points' : 'unknown'}",
    "blockers": ["specific blocker 1", "specific blocker 2", "specific blocker 3"],
    "monthly_plan": [
      { "month": "Month 1", "focus": "specific focus area", "milestone": "expected score or outcome" },
      { "month": "Month 2–3", "focus": "next area", "milestone": "expected score or outcome" },
      { "month": "Month 4–5", "focus": "final prep", "milestone": "target score" }
    ],
    "what_wryze_tracks": ["tracking item 1", "tracking item 2", "tracking item 3", "tracking item 4"],
    "why_realistic": "2-3 sentences explaining why this plan is achievable for this specific student",
    "guarantee_note": "1-2 sentences on the Wryze guarantee for this student's score range"
  },
  "follow_up_sequence": {
    "h24": "message to send 24 hours after the call — warm, references a specific point from the call",
    "day3": "message to send 3 days later if no response — creates mild urgency without being pushy",
    "reactivation": "final reactivation message if still no response after a week — opens a new angle"
  }
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in Claude response");

    const output: PostCallOutput = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, output });
  } catch (error) {
    console.error("post-call error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
