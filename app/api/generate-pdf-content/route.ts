import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { LeadProfile, PDFContent } from "@/lib/types";

export async function POST(request: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const body = await request.json();
    const lead: LeadProfile = body.leadProfile;
    const transcript: string = body.transcript ?? "";

    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17) timeOfDay = "evening";

    const prompt = `You are a sales enablement AI for Scaler, an Indian edtech company.
After a sales call, generate a highly personalized 2-3 page PDF brief for the lead.
The PDF answers their specific questions from the call and must feel written for THEM, not generic.

## Lead Profile
Name: ${lead.name}
Role: ${lead.role} at ${lead.company}
Years of Experience: ${lead.yoe}
Education: ${lead.education}
Current CTC: ${lead.currentCTC}
Goal: ${lead.goal}
Notes: ${lead.notes}

## Call Transcript
${transcript || "(No transcript provided — infer likely questions from the lead profile and context)"}

## Scaler Facts (use ONLY these — do NOT hallucinate programs or outcomes)
Programs:
- Scaler Academy: 12-month, software engineering, target 0-7 YoE, ~₹3.5L, placement support
- Scaler Data Science & ML: 12+ months, ML/AI/Data focus
- Scaler DevOps & Cloud: 9 months
Instructors: practicing engineers from Google, Amazon, Flipkart, Microsoft (not academics)
Curriculum: project-based, includes system design, DSA, real-world capstone projects
Financing: EMI options available, income share agreement for eligible candidates
Placement: dedicated placement team, mock interviews, company referrals
Cohort: ~500 students per batch, screened via entrance test
Avg salary jump: widely reported 2-3x for candidates from similar backgrounds (cite as "commonly reported by alumni")

## Instructions
Return ONLY valid JSON (no markdown code blocks). Use this exact structure:
{
  "leadName": "${lead.name}",
  "leadRole": "${lead.role}",
  "leadCompany": "${lead.company}",
  "program": "recommended Scaler program name",
  "programReason": "2-3 sentences why this specific program fits this specific person",
  "opening": "warm 2-3 sentence personalised opening that references something specific from their call",
  "sections": [
    {
      "question": "exact question from the transcript (or likely question)",
      "answer": "thorough 3-5 sentence answer addressing their specific context",
      "source": "curriculum (if answer is based on Scaler's published info) or call (if based on what they shared)"
    }
  ],
  "nextSteps": [
    "Step 1 — specific action for this lead",
    "Step 2",
    "Step 3"
  ],
  "whatsappMessage": "short personalised WhatsApp message to send WITH the PDF — must reference something specific from the call, NOT generic 'please find attached'. 2-3 sentences.",
  "sendTimingRecommendation": "specific recommendation on best time to send (based on current time ${timeOfDay}, lead's work schedule, and urgency)",
  "theme": "senior (for 8+ YoE or IIT/NIT background) or mid (for 3-8 YoE) or junior (for 0-3 YoE or students)"
}

Rules:
- Extract ALL questions from the transcript and answer each one specifically
- "source: curriculum" = based on Scaler's published program info
- "source: call" = inferred from what the lead said/shared
- Make the opening and whatsappMessage reference SPECIFIC details from the lead's profile or transcript
- The sections must look visually DIFFERENT for each lead type
- Do NOT make up salary numbers, company names, or specific stats you're not sure about`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Claude response");
    }

    const pdfContent: PDFContent = JSON.parse(jsonMatch[0]);

    // Ensure theme is valid
    if (!["senior", "mid", "junior"].includes(pdfContent.theme)) {
      pdfContent.theme = "mid";
    }

    // Safety: truncate whatsappMessage to Twilio's 1600-char limit
    if (pdfContent.whatsappMessage && pdfContent.whatsappMessage.length > 1550) {
      pdfContent.whatsappMessage = pdfContent.whatsappMessage.slice(0, 1547) + "...";
    }

    return NextResponse.json({ success: true, pdfContent });
  } catch (error) {
    console.error("generate-pdf-content error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
