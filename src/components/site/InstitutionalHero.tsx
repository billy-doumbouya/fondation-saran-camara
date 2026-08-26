import type { ReactNode } from "react";
import AnimatedSection from "@/components/site/AnimatedSection";
import ImageBackdrop from "@/components/site/ImageBackdrop";

interface InstitutionalHeroProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  badge?: ReactNode;
}

export default function InstitutionalHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  children,
  badge,
}: InstitutionalHeroProps) {
  return (
    <section className="relative isolate min-h-[25rem] overflow-hidden bg-navy-900 text-white sm:min-h-[29rem]">
      <ImageBackdrop src={image} alt={imageAlt} imageClassName="scale-105 object-center" className="z-[-2]">
        <div className="absolute inset-0 bg-navy-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/70 to-primary-900/35" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-navy-950/60 to-transparent" />
        {children}
      </ImageBackdrop>

      <div className="container-app relative flex min-h-[25rem] items-end pb-14 pt-28 sm:min-h-[29rem] sm:pb-16">
        <AnimatedSection>
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">
              <span className="h-px w-10 bg-primary-300" />
              {eyebrow}
            </div>
            <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              {description}
            </p>
          </div>
        </AnimatedSection>
      </div>

      {badge && (
        <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/15 bg-white/10 px-6 py-4 backdrop-blur-md sm:block">
          {badge}
        </div>
      )}
    </section>
  );
}