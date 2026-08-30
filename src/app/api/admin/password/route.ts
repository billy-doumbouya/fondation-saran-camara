import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, verifyAdminPassword, setAdminPasswordHash } from "@/lib/auth";
import { adminPasswordUpdateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = await adminPasswordUpdateSchema.validate(body, { stripUnknown: true });

    const validCurrent = await verifyAdminPassword(currentPassword);
    if (!validCurrent) {
      return NextResponse.json({ error: "Le mot de passe actuel est incorrect." }, { status: 400 });
    }

    await setAdminPasswordHash(newPassword);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
