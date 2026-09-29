import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE_CACHE_TAGS, revalidateHomepageData } from "@/lib/homepage-cache";
import { isAuthenticated } from "@/lib/auth";
import { newsRepo } from "@/lib/db/repo";
import { newsSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const authed = await isAuthenticated();
  const list = authed ? await newsRepo.listAll() : await newsRepo.listPublished();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await newsSchema.validate(body, { stripUnknown: true });
    const publishedAt = data.published ? new Date() : null;
    const [created] = await newsRepo.create({ ...data, publishedAt });
    revalidateHomepageData(HOMEPAGE_CACHE_TAGS.news);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
