import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import AnimatedSection from "@/components/site/AnimatedSection";
import { programsRepo } from "@/lib/db/repo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await programsRepo.getBySlug(slug).catch(() => null);
  return { title: program?.title ?? "Programme" };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await programsRepo.getBySlug(slug).catch(() => null);
  if (!program || !program.published) notFound();

  return (
    <div className="container-app max-w-3xl py-16">
      <AnimatedSection>
        {program.coverImageUrl && (
          <div className="relative mb-8 h-72 w-full overflow-hidden rounded-3xl">
            <Image src={program.coverImageUrl} alt={program.title} fill className="object-cover" />
          </div>
        )}
        <h1 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">{program.title}</h1>
        <p className="mt-3 text-lg text-navy-500">{program.summary}</p>
        <div className="prose prose-navy mt-8 max-w-none whitespace-pre-line text-navy-600">
          {program.content}
        </div>
      </AnimatedSection>
    </div>
  );
}
