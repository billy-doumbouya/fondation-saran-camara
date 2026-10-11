import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export const runtime = "nodejs";

function getCloudinaryPublicConfig() {
  return {
    cloudName:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME ||
      "t5ryi38g",
    apiKey:
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY ||
      "631927657828482",
  };
}

/**
 * Fournit les clés publiques pour le widget Cloudinary aux administrateurs.
 */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  return NextResponse.json(getCloudinaryPublicConfig());
}

/**
 * Fournit une signature d'upload Cloudinary pour permettre au widget Cloudinary
 * et au navigateur d'uploader directement (upload signé) sans exposer la clé secrète.
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Configuration manquante sur le serveur : CLOUDINARY_API_SECRET." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { cloudName, apiKey } = getCloudinaryPublicConfig();

  try {
    // Support officiel du widget Cloudinary (paramsToSign transmis par le widget)
    if (body.paramsToSign && typeof body.paramsToSign === "object") {
      const signature = generateUploadSignature(body.paramsToSign);
      return NextResponse.json({ signature, apiKey, cloudName });
    }

    // Support direct ou personnalisé (timestamp + folder)
    const folder = typeof body.folder === "string" ? body.folder : "fscpe";
    const timestamp = Math.round(Date.now() / 1000);
    const signature = generateUploadSignature({ timestamp, folder });

    return NextResponse.json({ signature, timestamp, folder, apiKey, cloudName });
  } catch (error) {
    console.error("Cloudinary signature generation failed", error);
    return NextResponse.json(
      { error: "Impossible de signer l'upload. Vérifiez la configuration Cloudinary du serveur." },
      { status: 500 }
    );
  }
}
