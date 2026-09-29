import { MapPin, ArrowRight } from "lucide-react";
import type { EventItem } from "@/lib/db/schema";
import { formatDateTime, getEventDay, isUpcoming } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function EventCard({ event }: { event: EventItem }) {
  const upcoming = isUpcoming(event.startAt);
  const { day, month, year } = getEventDay(event.startAt);

  return (
    <article
      className={cn(
        "group relative flex gap-4 overflow-hidden hairline bg-white rounded-lg p-5",
        "transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5",
        !upcoming && "opacity-60",
      )}
    >
      {/* Accent top */}
      <span
        className={cn("absolute inset-x-0 top-0 h-0.5", upcoming ? "bg-gold-500" : "bg-navy-200")}
        aria-hidden
      />

      {/* Date block géométrique */}
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-md hairline bg-navy-50 p-2 text-center">
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-400">
          {month}
        </span>
        <span className="font-display text-2xl font-bold leading-none text-navy-900">{day}</span>
        <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-navy-400">{year}</span>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-tight text-navy-900">
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