import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export const runtime = "nodejs";

/**
 * Fournit une signature d'upload Cloudinary pour permettre au navigateur
 * d'uploader directement (upload signé) sans exposer la clé secrète.
 * Réservé à l'administration.
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const folder = typeof body.folder === "string" ? body.folder : "fscpe";
  const timestamp = Math.round(Date.now() / 1000);

  const signature = generateUploadSignature({ timestamp, folder });

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
