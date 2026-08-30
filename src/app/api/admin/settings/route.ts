import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { siteSettingsSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const data = await siteSettingsSchema.validate(body, { stripUnknown: true });
    const saved = await saveSiteSettings(data);
    return NextResponse.json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
