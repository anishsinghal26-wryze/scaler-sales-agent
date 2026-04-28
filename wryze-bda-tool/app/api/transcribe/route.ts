import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    if (!audioFile) return NextResponse.json({ success: false, error: "No audio file" }, { status: 400 });

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const file = await toFile(buffer, audioFile.name || "audio.webm", { type: audioFile.type || "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({ file, model: "whisper-1", language: "en" });

    return NextResponse.json({ success: true, transcript: transcription.text });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
