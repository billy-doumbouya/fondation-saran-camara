import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { galleryRepo } from "@/lib/db/repo";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { galleryImageSchema } from "@/lib/validations";

export const runtime = "nodejs";

interface Params { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const item = await galleryRepo.getById(Number(id));
  if (!item) return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await galleryImageSchema.validate(body, { stripUnknown: true });
    const [updated] = await galleryRepo.update(Number(id), data);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const [existing] = await db.select().from(galleryImages).where(eq(galleryImages.id, Number(id))).limit(1);
  if (existing?.imagePublicId) {
    await deleteCloudinaryAsset(existing.imagePublicId).catch(() => null);
  }
  await galleryRepo.remove(Number(id));
  return NextResponse.json({ ok: true });
}

