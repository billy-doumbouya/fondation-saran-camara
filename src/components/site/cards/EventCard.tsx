import { CalendarDays, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <CalendarDays size={22} />
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-navy-900">{event.title}</h3>
        <p className="mt-1 text-xs font-medium text-primary-600">{formatDateTime(event.startAt)}</p>
        {event.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-navy-500">
            <MapPin size={12} />
            {event.location}
          </p>
        )}
        {event.description && <p className="mt-2 line-clamp-2 text-sm text-navy-500">{event.description}</p>}
      </div>
    </div>
  );
}
