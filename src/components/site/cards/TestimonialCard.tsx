import Image from "next/image";
import { Quote, Star, UserRound } from "lucide-react";
import type { Testimonial } from "@/lib/db/schema";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      <Quote className="text-primary-300" size={28} />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary-100">
          {testimonial.photoUrl ? (
            <Image src={testimonial.photoUrl} alt={testimonial.authorName} fill className="object-cover" />
          ) : (
            <UserRound className="m-auto mt-2.5 text-primary-500" size={20} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900">{testimonial.authorName}</p>
          {testimonial.authorRole && <p className="text-xs text-navy-500">{testimonial.authorRole}</p>}
        </div>
      </div>
      {testimonial.rating ? (
        <div className="mt-3 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < (testimonial.rating ?? 0) ? "fill-gold-400 text-gold-400" : "text-navy-200"}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
