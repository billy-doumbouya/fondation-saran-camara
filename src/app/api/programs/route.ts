import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE_CACHE_TAGS, revalidateHomepageData } from "@/lib/homepage-cache";
import { isAuthenticated } from "@/lib/auth";
import { programsRepo } from "@/lib/db/repo";
import { programSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const authed = await isAuthenticated();
  const list = authed ? await programsRepo.listAll() : await programsRepo.listPublished();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await programSchema.validate(body, { stripUnknown: true });
    const [created] = await programsRepo.create(data);
    revalidateHomepageData(HOMEPAGE_CACHE_TAGS.programs);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
