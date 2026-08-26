import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { testimonialsRepo } from "@/lib/db/repo";
import { testimonialSchema } from "@/lib/validations";

export const runtime = "nodejs";

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await testimonialSchema.validate(body, { stripUnknown: true });
    const [updated] = await testimonialsRepo.update(Number(id), data);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await testimonialsRepo.remove(Number(id));
  return NextResponse.json({ ok: true });
}
