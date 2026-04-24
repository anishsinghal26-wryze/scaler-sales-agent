import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { LeadProfile, NudgeContent } from "@/lib/types";

export async function POST(request: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const body = await request.json();
    const lead: LeadProfile = body.leadProfile;
    const transcript: string = body.transcript ?? "";

    const prompt = `You are a sales coaching AI for Scaler, an Indian edtech company selling a ₹3.5L tech education program.
A Business Development Associate (BDA) is about to call this lead. Generate a pre-call WhatsApp nudge message for the BDA.

## Lead Profile
Name: ${lead.name}
Current Role: ${lead.role} at ${lead.company}
Years of Experience: ${lead.yoe}
Education: ${lead.education}
Current CTC: ${lead.currentCTC}
Goal: ${lead.goal}
Additional Notes: ${lead.notes}

${transcript ? `## Call Transcript (if any previous interaction):\n${transcript}` : ""}

## Scaler Programs (use ONLY these facts):
- Scaler Academy — 12-month software engineering, 0-7 YoE, ~₹3.5L, job guarantee
- Scaler Data Science & ML — 12+ months, ML/AI focus
- Scaler DevOps & Cloud — 9 months
- Instructors include ex-Google, ex-Amazon engineers who have shipped production systems
- Average salary increase: 2-3x for eligible candidates
- Alumni at companies like Google, Microsoft, Amazon, Flipkart, Swiggy

## Instructions
Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "summary": "1-2 sentence profile summary for BDA",
  "talkingAngles": ["angle 1", "angle 2", "angle 3"],
  "objections": [
    { "objection": "likely objection 1", "handle": "one-line response" },
    { "objection": "likely objection 2", "handle": "one-line response" },
    { "objection": "likely objection 3", "handle": "one-line response" }
  ],
  "openingHook": "personalized opening line for the call that references something specific about this lead",
  "confidence": "🟢 or 🟡 or 🔴",
  "confidenceReason": "one sentence explaining the signal",
  "rawMessage": "the complete formatted WhatsApp message to send the BDA — include all the above in a clean, scannable format with emojis"
}

Confidence guide:
🟢 = strong profile match, clear motivation, right YoE bracket
🟡 = some gaps or hesitations likely (financial, timing, competing priorities)
🔴 = major objection likely (already very senior, cost concern very high, unclear goal)

For rawMessage, use this EXACT compact format (MUST be under 1500 characters total):
*📋 [Name]*
[1-line summary]

*💡 Angles*
• [angle 1 — max 10 words]
• [angle 2 — max 10 words]
• [angle 3 — max 10 words]

*⚠️ Objections*
• [short objection]: [short handle]
• [short objection]: [short handle]

*🎯 Hook*
"[hook — max 20 words]"

*[confidence] [one-line reason]*

Keep every bullet under 15 words. Total message MUST be under 1500 characters.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Claude response");
    }

    const nudgeContent: NudgeContent = JSON.parse(jsonMatch[0]);

    // Safety: truncate rawMessage to Twilio's 1600-char WhatsApp limit
    if (nudgeContent.rawMessage && nudgeContent.rawMessage.length > 1550) {
      nudgeContent.rawMessage = nudgeContent.rawMessage.slice(0, 1547) + "...";
    }

    return NextResponse.json({ success: true, nudge: nudgeContent });
  } catch (error) {
    console.error("generate-nudge error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
