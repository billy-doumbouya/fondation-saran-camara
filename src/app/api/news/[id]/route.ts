import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE_CACHE_TAGS, revalidateHomepageData } from "@/lib/homepage-cache";
import { isAuthenticated } from "@/lib/auth";
import { newsRepo } from "@/lib/db/repo";
import { newsSchema } from "@/lib/validations";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const item = await newsRepo.getById(Number(id));
  if (!item) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await newsSchema.validate(body, { stripUnknown: true });
    const existing = await newsRepo.getById(Number(id));
    const publishedAt = data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null;
    const [updated] = await newsRepo.update(Number(id), { ...data, publishedAt });
    revalidateHomepageData(HOMEPAGE_CACHE_TAGS.news);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await newsRepo.remove(Number(id));
  revalidateHomepageData(HOMEPAGE_CACHE_TAGS.news);
  return NextResponse.json({ ok: true });
}
