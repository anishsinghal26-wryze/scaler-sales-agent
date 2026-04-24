import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ScalerPDF } from "@/lib/pdf-template";
import { put } from "@vercel/blob";
import type { PDFContent } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pdfContent: PDFContent = body.pdfContent;

    if (!pdfContent) {
      return NextResponse.json(
        { success: false, error: "No pdfContent provided" },
        { status: 400 }
      );
    }

    // Generate PDF buffer server-side
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(ScalerPDF, { content: pdfContent }) as any;
    const pdfBuffer = Buffer.from(await renderToBuffer(element));

    const safeName = pdfContent.leadName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `Scaler_${safeName}_${Date.now()}.pdf`;

    // Upload to Vercel Blob — persistent, publicly accessible across all instances
    const blob = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    });

    // Also return base64 for in-browser preview/download
    const base64 = pdfBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      pdfUrl: blob.url,
      filename,
      base64,
    });
  } catch (error) {
    console.error("generate-pdf error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
