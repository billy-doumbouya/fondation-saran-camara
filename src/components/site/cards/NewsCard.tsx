import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import type { News } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";

export default function NewsCard({ item }: { item: News }) {
  return (
    <Link
      href={`/actualites/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-navy-50">
        {item.coverImageUrl ? (
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Newspaper size={36} className="text-navy-300" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {item.publishedAt && (
          <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
            {formatDate(item.publishedAt)}
          </span>
        )}
        <h3 className="font-display mt-2 text-lg font-semibold text-navy-900">{item.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-500">{item.excerpt}</p>
      </div>
    </Link>
  );
}
