import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      to,          // e.g. "whatsapp:+919876543210" or "+919876543210"
      message,     // WhatsApp message body
      pdfUrl,      // optional: public PDF URL for media attachment
    }: {
      to: string;
      message: string;
      pdfUrl?: string;
    } = body;

    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: to, message" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_NUMBER ?? "whatsapp:+14155238886";

    if (!accountSid || !authToken) {
      return NextResponse.json(
        { success: false, error: "Twilio credentials not configured" },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Normalise 'to' number:
    // 1. Strip any existing whatsapp: prefix
    // 2. Add +91 for 10-digit Indian numbers missing country code
    // 3. Re-add whatsapp: prefix
    let rawNumber = to.replace(/^whatsapp:/, "").trim();
    if (/^\d{10}$/.test(rawNumber)) {
      rawNumber = `+91${rawNumber}`;
    } else if (/^91\d{10}$/.test(rawNumber)) {
      rawNumber = `+${rawNumber}`;
    }
    const toNumber = `whatsapp:${rawNumber}`;

    // Strategy: embed PDF link directly in message text (guaranteed delivery).
    // Avoid mediaUrl — Twilio fetches it async and silently drops the message
    // if the URL is unreachable, even returning 200 with no actual delivery.
    let msgBody = message;
    if (pdfUrl) {
      msgBody = `${message}\n\n📄 *Your personalised brief:*\n${pdfUrl}`;
    }

    // Enforce 1600-char limit
    if (msgBody.length > 1590) {
      msgBody = msgBody.slice(0, 1587) + "...";
    }

    const sent = await client.messages.create({ from, to: toNumber, body: msgBody });

    return NextResponse.json({
      success: true,
      messageSid: sent.sid,
      status: sent.status,
    });
  } catch (error) {
    console.error("send-whatsapp error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
