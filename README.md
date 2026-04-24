# Scaler Sales AI Agent

**Live:** https://scaler-sales-agent.vercel.app

---

## What you built

A two-part AI agent that supercharges Scaler BDAs at the two highest-dropout moments in the sales funnel. Before the call, the agent generates a scannable WhatsApp nudge sent to the BDA — confidence signal (🟢🟡🔴), lead summary, two to three talking angles tied to the lead's specific profile, objection handles with one-line responses, and a personalised opening hook. After the call, it generates a 2–3 page PDF that addresses each question the lead raised on the call, framed through their goals and backed by Scaler's program specifics — then delivers it to the lead's WhatsApp after the BDA reviews and approves. Both paths accept either a typed transcript or an uploaded call recording (transcribed via OpenAI Whisper). Built with Next.js, Claude Sonnet on the Anthropic API, Whisper for STT, @react-pdf/renderer for PDF generation, Twilio for WhatsApp delivery, and Vercel Blob for persistent PDF hosting.

---

## One failure I found

**Input:** Karthik Iyer (9 YoE, Google, IIT Madras) with his transcript.

**What went wrong:** The PDF addressed his three stated questions correctly but still opened with generic Scaler credibility framing — alumni outcomes, program structure — before getting to what he actually asked: *what can I learn here that Google's internal training doesn't cover?* For a senior engineer at a top company, leading with social proof is the wrong frame. The PDF should have opened by acknowledging his skepticism directly and earning credibility through specificity, not volume. The agent optimises for completeness over tone-matching, and for a high-signal skeptic that's the wrong tradeoff.

---

## Scale plan

The first thing to break at 100,000 leads per month is **Claude API throughput combined with Vercel's serverless cold-start pattern.** Each lead generation makes two sequential Claude calls (nudge + PDF content), each taking 5–15 seconds. At peak hours when hundreds of BDAs dial simultaneously, concurrent requests will hit Anthropic's rate limits and Vercel's function timeout ceiling. The fix is a job queue (Redis + BullMQ) that accepts the generation request immediately, processes it async, and pushes a webhook to the UI when ready — decoupling the BDA's wait time from actual LLM latency. Second constraint: Vercel Blob storage accumulates indefinitely. At ~100KB per PDF, 100k leads/month is 10GB/month; a nightly TTL cleanup job or S3 lifecycle policy is needed before costs compound.

---

## Running locally

```bash
cp .env.example .env.local   # fill in your keys
npm install
npm run dev
```

**Required env vars:**

| Key | Purpose |
|-----|---------|
| `ANTHROPIC_API_KEY` | Claude Sonnet — nudge + PDF content generation |
| `OPENAI_API_KEY` | Whisper — audio transcription |
| `TWILIO_ACCOUNT_SID` | WhatsApp delivery |
| `TWILIO_AUTH_TOKEN` | WhatsApp delivery |
| `TWILIO_WHATSAPP_NUMBER` | Sender number (sandbox: `whatsapp:+14155238886`) |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob — persistent PDF hosting |

## Architecture

```
app/
  page.tsx                    # All UI screens (onboarding → nudge → PDF approval → done)
  api/
    generate-nudge/           # Claude → BDA WhatsApp nudge
    generate-pdf-content/     # Claude → structured PDF content
    generate-pdf/             # @react-pdf/renderer → Vercel Blob upload
    transcribe/               # OpenAI Whisper → transcript text
    send-whatsapp/            # Twilio → WhatsApp delivery
lib/
  pdf-template.tsx            # Themed PDF layout (senior/mid/junior)
  types.ts                    # Shared TypeScript types
```
