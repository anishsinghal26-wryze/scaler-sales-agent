import { NextRequest, NextResponse } from "next/server";
import { getPDF } from "@/lib/pdf-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = getPDF(id);

  if (!result) {
    return NextResponse.json(
      { error: "PDF not found or expired" },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(result.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${result.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
