import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { PreCallInput, PreCallOutput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const body = await request.json();
    const input: PreCallInput = body;

    const scoreGap =
      input.currentScore && input.targetScore
        ? parseInt(input.targetScore) - parseInt(input.currentScore)
        : null;

    const mismatch =
      input.selfReportedWeakArea &&
      input.actualWeakArea &&
      input.selfReportedWeakArea.toLowerCase() !== input.actualWeakArea.toLowerCase();

    const prompt = `You are the Wryze.ai Sales Intelligence Agent — an internal AI sales assistant for Wryze BDAs.
You are NOT a chatbot. You do NOT ask questions. You generate sales-ready output only.

Wryze.ai is an SAT prep platform that identifies exactly where a student's thinking breaks.
It is NOT another practice platform. It does not just explain wrong answers.
It identifies repeated mistake patterns, wrong reasoning steps, and weak decision processes.
Core positioning: Practice tells students what they got wrong. Wryze shows WHY they keep getting it wrong.
Target: students stuck between 1100–1400 despite consistent practice.

## LEAD DATA
Student Name: ${input.studentName || "the student"}
Current SAT Score: ${input.currentScore || "unknown"}
Target SAT Score: ${input.targetScore || "unknown"}
Score Gap: ${scoreGap !== null ? `${scoreGap} points` : "unknown"}
Pain Point: ${input.painPoint || "not specified"}
Platforms Currently Used: ${input.platformsUsed || "not specified"}
Primary Concern: ${input.concern || "not specified"}
Known Objection: ${input.objection || "none stated"}
Self-Reported Weak Area: ${input.selfReportedWeakArea || "not specified"}
Actual Weak Area (from scorecard): ${input.actualWeakArea || "not available"}
Additional Notes / Interaction History: ${input.notes || "none"}

${mismatch ? `IMPORTANT — WEAK AREA MISMATCH DETECTED: Student says "${input.selfReportedWeakArea}" is weak, but scorecard shows "${input.actualWeakArea}" is where marks are actually lost. Use this contradiction as a curiosity hook — subtle, non-accusatory, tutor-style insight.` : ""}

${scoreGap !== null && scoreGap > 150 ? "Score gap is large (>150 points) — focus on fundamentals and thinking patterns, not just strategy." : ""}
${scoreGap !== null && scoreGap >= 50 && scoreGap <= 150 ? "Score gap is medium (50–150 points) — focus on accuracy and decision-making under pressure." : ""}
${scoreGap !== null && scoreGap < 50 ? "Score gap is small (<50 points) — focus on test strategy and time optimization." : ""}

## RULES
- Messages must be short, human, and natural
- No generic lines like "improve your score" or "our platform is great"
- Focus on repeated mistake patterns, not more practice
- Create curiosity, not pressure
- Never sound like a chatbot
- Missing data: infer reasonably, never leave blanks
- WhatsApp nudge must be 3 separate messages — each standalone, 2–4 lines max
- Call talking points must be sharp and BDA-ready
- Closing line must feel like a real tutor, not a salesperson

Return ONLY valid JSON (no markdown, no code blocks):
{
  "lead_summary": "1-2 line sharp summary of student situation",
  "detected_problem": "core issue in preparation — be specific, not generic",
  "conversion_confidence": <number 0-100>,
  "primary_angle": "main angle to pitch Wryze — one sharp sentence",
  "whatsapp_nudge": [
    "message 1 — personalized hook using score data or mismatch",
    "message 2 — the insight that creates the 'aha' moment",
    "message 3 — soft CTA, reply-triggering, not pushy"
  ],
  "call_talking_points": [
    "point 1 — open by validating effort, pivot to diagnosis",
    "point 2 — explain mistake pattern vs knowledge gap",
    "point 3 — position Wryze as a debugger, not a tutor"
  ],
  "objection_handling": {
    "objection": "the likely objection based on their context",
    "response": "sharp, human, non-generic response"
  },
  "closing_line": "final line to book demo or continue conversation",
  "follow_up_message": "message to send after 24–48h if no reply"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in Claude response");

    const output: PreCallOutput = JSON.parse(jsonMatch[0]);

    // Clamp confidence score
    if (typeof output.conversion_confidence === "number") {
      output.conversion_confidence = Math.min(100, Math.max(0, Math.round(output.conversion_confidence)));
    }

    return NextResponse.json({ success: true, output });
  } catch (error) {
    console.error("pre-call error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
