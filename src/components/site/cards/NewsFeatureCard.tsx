import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight, Calendar, Sparkles } from "lucide-react";
import type { News } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";

export default function NewsFeatureCard({ item }: { item: News }) {
  return (
    <Link
      href={`/actualites/${item.slug}`}
      className="group relative grid overflow-hidden rounded-lg hairline bg-white transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5 md:grid-cols-12 shadow-sm hover:shadow-md"
    >
      <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gold-500" aria-hidden />

      {/* Image container */}
      <div className="relative min-h-[16rem] w-full overflow-hidden bg-navy-50 sm:min-h-[20rem] md:col-span-7 md:h-full">
        {item.coverImageUrl ? (
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-50 to-primary-50/50">
            <Newspaper size={56} className="text-navy-300" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5 lg:p-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm bg-primary-50 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-primary-700 border border-primary-200/60">
              <Sparkles size={11} strokeWidth={2.5} />
              À la une
            </span>
            {item.publishedAt && (
              <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-wider text-navy-400">
                <Calendar size={12} strokeWidth={1.75} />
                {formatDate(item.publishedAt)}
              </span>
            )}
          </div>

          <h3 className="font-display mt-4 text-xl font-bold leading-tight text-navy-900 sm:text-2xl transition-colors duration-200 group-hover:text-primary-700">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-navy-600 sm:text-base line-clamp-4">
            {item.excerpt}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 font-display text-sm font-semibold text-primary-700 hairline-t pt-4">
          <span>Lire l&apos;article complet</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1.5"
          />
        </div>
      </div>
    </Link>
  );
}
