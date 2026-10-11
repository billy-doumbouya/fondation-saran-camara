import { revalidateTag, unstable_cache } from "next/cache";
import { eventsRepo } from "@/lib/db/repo";

const EVENTS_CACHE_TAG = "events-list";

export const getCachedPublishedEvents = unstable_cache(
  () => eventsRepo.listPublished(),
  ["events-published-v1"],
  { revalidate: 60, tags: [EVENTS_CACHE_TAG] }
);

export const getCachedAllEvents = unstable_cache(
  () => eventsRepo.listAll(),
  ["events-all-v1"],
  { revalidate: 60, tags: [EVENTS_CACHE_TAG] }
);

export function invalidateEventsCache() {
  revalidateTag(EVENTS_CACHE_TAG, { expire: 0 });
}