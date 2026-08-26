import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import AnimatedSection from "@/components/site/AnimatedSection";
import { newsRepo } from "@/lib/db/repo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await newsRepo.getBySlug(slug).catch(() => null);
  return { title: item?.title ?? "Actualité" };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await newsRepo.getBySlug(slug).catch(() => null);
  if (!item || !item.published) notFound();

  return (
    <div className="container-app max-w-3xl py-16">
      <AnimatedSection>
        {item.publishedAt && (
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
            {formatDate(item.publishedAt)}
          </p>
        )}
        <h1 className="font-display mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">{item.title}</h1>
        {item.coverImageUrl && (
          <div className="relative my-8 h-72 w-full overflow-hidden rounded-3xl">
            <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover" />
          </div>
        )}
        <div className="prose prose-navy max-w-none whitespace-pre-line text-navy-600">{item.content}</div>
      </AnimatedSection>
    </div>
  );
}
