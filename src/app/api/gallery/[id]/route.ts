import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { galleryRepo } from "@/lib/db/repo";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

interface Params { params: Promise<{ id: string }> }

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
