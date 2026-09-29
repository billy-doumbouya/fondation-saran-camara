import Image from "next/image";
import { Quote, Star, UserRound } from "lucide-react";
import type { Testimonial } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Pour fond sombre (section navy), passe `light`. */
  tone?: "dark" | "light";
}

export default function TestimonialCard({
  testimonial,
  tone = "dark",
}: TestimonialCardProps) {
  const isLight = tone === "light";
  return (
    <figure
      className={cn(
        "flex h-full flex-col p-6 rounded-lg",
        isLight
          ? "bg-white/[0.04] backdrop-blur-sm hairline border-white/10"
          : "hairline bg-white shadow-sm",
      )}
    >
      <Quote
        size={28}
        className={cn("shrink-0", isLight ? "text-gold-400" : "text-primary-300")}
        strokeWidth={1.5}
      />

      <blockquote
        className={cn(
          "mt-3 flex-1 text-sm leading-relaxed",
          isLight ? "text-navy-100" : "text-navy-600",
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {testimonial.rating ? (
        <div className="mt-4 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={cn(
                i < (testimonial.rating ?? 0)
                  ? "fill-gold-400 text-gold-400"
                  : isLight
                  ? "text-white/15"
                  : "text-navy-200",
              )}
            />
          ))}
        </div>
      ) : null}

      <figcaption className="mt-5 flex items-center gap-3 hairline-t pt-4">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary-100 hairline">
          {testimonial.photoUrl ? (
            <Image
              src={testimonial.photoUrl}
              alt={testimonial.authorName}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <UserRound size={18} className="m-auto mt-2.5 text-primary-500" />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-semibold",
              isLight ? "text-white" : "text-navy-900",
            )}
          >
            {testimonial.authorName}
          </p>
          {testimonial.authorRole && (
            <p
              className={cn(
                "truncate text-xs",
                isLight ? "text-navy-300" : "text-navy-500",
              )}
            >
              {testimonial.authorRole}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
