import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const SaveExportSchema = z.object({
  presetId: z.enum([
    "iphone-16-pro",
    "android-flagship",
    "desktop-fhd",
    "desktop-qhd",
  ]),
  dataUrl: z.string().startsWith("data:image/png;base64,"),
  width: z.number().int().positive().max(6000),
  height: z.number().int().positive().max(6000),
});

const ARTIFACT_EXPORT_DIR =
  "C:\\Users\\Dixit\\.gemini\\antigravity\\brain\\35356471-f165-423a-ac11-da5010468d34";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SaveExportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid export payload" }, { status: 400 });
    }

    const { presetId, dataUrl, width, height } = parsed.data;
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    await mkdir(ARTIFACT_EXPORT_DIR, { recursive: true });
    const outPath = path.join(ARTIFACT_EXPORT_DIR, `export-${presetId}.png`);
    await writeFile(outPath, buffer);

    return NextResponse.json({
      ok: true,
      filename: `export-${presetId}.png`,
      width,
      height,
      bytes: buffer.length,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
