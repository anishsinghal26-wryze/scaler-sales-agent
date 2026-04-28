import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { WryzePDF } from "@/lib/pdf-template";
import { put } from "@vercel/blob";
import type { PostCallOutput, PostCallInput } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const output: PostCallOutput = body.output;
    const input: PostCallInput = body.input;

    if (!output || !input) {
      return NextResponse.json({ success: false, error: "Missing output or input" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(WryzePDF, { output, input }) as any;
    const pdfBuffer = Buffer.from(await renderToBuffer(element));

    const safeName = (input.studentName || "student").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `Wryze_Roadmap_${safeName}_${Date.now()}.pdf`;

    const blob = await put(filename, pdfBuffer, { access: "public", contentType: "application/pdf" });

    return NextResponse.json({
      success: true,
      pdfUrl: blob.url,
      filename,
      base64: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("generate-pdf error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
