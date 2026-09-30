import { MapPin, ArrowRight, CalendarClock } from "lucide-react";
import Image from "next/image";
import type { EventItem } from "@/lib/db/schema";
import { formatDateTime, getEventDay, isUpcoming } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function EventCard({ event }: { event: EventItem }) {
  const upcoming = isUpcoming(event.startAt);
  const { day, month, year } = getEventDay(event.startAt);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden hairline bg-white rounded-lg sm:flex-row",
        "transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5",
        !upcoming && "opacity-75",
      )}
    >
      {/* Accent top */}
      <span
        className={cn("absolute inset-x-0 top-0 h-0.5", upcoming ? "bg-gold-500" : "bg-navy-200")}
        aria-hidden
      />

      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-navy-50 sm:aspect-auto sm:min-h-40 sm:w-44 md:w-52">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={`Illustration de ${event.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 176px, 208px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-gold-50">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary-200/70 bg-white/80 text-primary-600 shadow-sm">
              <CalendarClock size={25} strokeWidth={1.5} />
            </div>
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/20 via-transparent to-transparent"
        />
      </div>

      <div className="flex min-w-0 flex-1 gap-3 p-4 sm:gap-4 sm:p-5">
        {/* Date block géométrique */}
        <div className="flex w-14 shrink-0 flex-col items-center justify-center self-start rounded-md hairline bg-navy-50 p-2 text-center sm:w-16">
          <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-400">
            {month}
          </span>
          <span className="font-display text-2xl font-bold leading-none text-navy-900">{day}</span>
          <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-navy-400">{year}</span>
        </div>

        {/* Body */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-display min-w-0 flex-1 text-base font-semibold leading-tight text-navy-900 sm:text-lg">
              {event.title}
            </h3>
            <span
              className={cn(
                "shrink-0 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-widest",
                upcoming
                  ? "bg-primary-50 text-primary-700 hairline"
                  : "bg-navy-50 text-navy-500 hairline",
              )}
            >
              <span
                className={cn("h-1 w-1 rounded-full", upcoming ? "bg-primary-500" : "bg-navy-400")}
                aria-hidden
              />
              {upcoming ? "À venir" : "Passé"}
            </span>
          </div>

          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-primary-600">
            {formatDateTime(event.startAt)}
          </p>

          {event.location && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-navy-500">
              <MapPin size={12} strokeWidth={1.75} className="shrink-0" />
              {event.location}
            </p>
          )}

          {event.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-500">
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Arrow hint au hover */}
      <span
        aria-hidden
        className="absolute bottom-3 right-3 text-navy-300 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5"
      >
        <ArrowRight size={14} />
      </span>
    </article>
  );
}