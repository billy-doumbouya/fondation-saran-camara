import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE_CACHE_TAGS, revalidateHomepageData } from "@/lib/homepage-cache";
import { isAuthenticated } from "@/lib/auth";
import { testimonialsRepo } from "@/lib/db/repo";
import { testimonialSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const authed = await isAuthenticated();
  const list = authed ? await testimonialsRepo.listAll() : await testimonialsRepo.listPublished();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await testimonialSchema.validate(body, { stripUnknown: true });
    const [created] = await testimonialsRepo.create(data);
    revalidateHomepageData(HOMEPAGE_CACHE_TAGS.testimonials);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
