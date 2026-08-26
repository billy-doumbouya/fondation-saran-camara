import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { eventsRepo } from "@/lib/db/repo";
import { eventSchema } from "@/lib/validations";

export const runtime = "nodejs";

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await eventSchema.validate(body, { stripUnknown: true });
    const [updated] = await eventsRepo.update(Number(id), {
      ...data,
      startAt: new Date(data.startAt),
      endAt: data.endAt ? new Date(data.endAt) : null,
    });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await eventsRepo.remove(Number(id));
  return NextResponse.json({ ok: true });
}
