import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { galleryRepo } from "@/lib/db/repo";
import { galleryImageSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const list = await galleryRepo.listAll();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await galleryImageSchema.validate(body, { stripUnknown: true });
    const [created] = await galleryRepo.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
