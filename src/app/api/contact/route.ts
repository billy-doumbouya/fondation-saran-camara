import { NextRequest, NextResponse } from "next/server";
import { contactRepo } from "@/lib/db/repo";
import { contactSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await contactSchema.validate(body, { stripUnknown: true });
    await contactRepo.create(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    if (err && typeof err === "object" && "name" in err && err.name === "ValidationError") {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Données invalides." },
        { status: 400 }
      );
    }

    console.error("Contact submission failed", err);
    return NextResponse.json({ error: "Une erreur est survenue. Merci de réessayer." }, { status: 500 });
  }
}
