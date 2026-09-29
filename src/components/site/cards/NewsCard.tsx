import Link from "next/link";
import Image from "next/image";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";
import type { News } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";

export default function NewsCard({ item }: { item: News }) {
  return (
    <Link
      href={`/actualites/${item.slug}`}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/90 shadow-[0_20px_55px_rgba(16,26,46,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/70 hover:shadow-[0_28px_80px_rgba(16,26,46,0.12)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(47,153,80,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(212,160,23,0.12),transparent_35%)] opacity-100 transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-700" aria-hidden />

      <div className="relative h-48 w-full overflow-hidden bg-navy-50">
        {item.coverImageUrl ? (
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-50 via-primary-50 to-gold-50/60">
            <Newspaper size={40} className="text-navy-300" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {item.publishedAt && (
          <div className="flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary-700">
            <Calendar size={12} strokeWidth={2} />
            <span>{formatDate(item.publishedAt)}</span>
          </div>
        )}

        <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-primary-700">
          {item.title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-700">
          {item.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[#efe7da] pt-4 text-xs font-semibold text-primary-700">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 font-display text-[0.68rem] uppercase tracking-[0.16em]">
            Lire l&apos;article
          </span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
