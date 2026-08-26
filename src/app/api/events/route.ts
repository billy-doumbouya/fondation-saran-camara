import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { eventsRepo } from "@/lib/db/repo";
import { eventSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const authed = await isAuthenticated();
  const list = authed ? await eventsRepo.listAll() : await eventsRepo.listPublished();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await eventSchema.validate(body, { stripUnknown: true });
    const [created] = await eventsRepo.create({
      ...data,
      startAt: new Date(data.startAt),
      endAt: data.endAt ? new Date(data.endAt) : null,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
