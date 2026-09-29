export default function DonateFormSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement du formulaire de don"
      className="relative overflow-hidden hairline-strong bg-white rounded-lg p-6 sm:p-8"
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500/50" aria-hidden />

      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <div className="h-px w-6 animate-pulse bg-navy-200" />
        <div className="h-3 w-32 animate-pulse rounded bg-navy-100" />
      </div>

      {/* Title + amount */}
      <div className="mt-3 flex items-baseline justify-between">
        <div className="h-5 w-44 animate-pulse rounded bg-navy-100" />
        <div className="h-5 w-24 animate-pulse rounded bg-primary-100" />
      </div>
      <div className="mt-2 h-3 w-64 max-w-full animate-pulse rounded bg-navy-100" />

      {/* Amounts grid */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse hairline bg-navy-50 rounded-md"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      {/* Custom amount */}
      <div className="mt-4">
        <div className="h-3 w-48 animate-pulse rounded bg-navy-100" />
        <div className="mt-2 h-10 w-full animate-pulse hairline bg-navy-50 rounded-md" />
      </div>

      {/* Payment methods */}
      <div className="mt-6">
        <div className="h-3 w-40 animate-pulse rounded bg-navy-100" />
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 hairline bg-white p-2.5 rounded-md"
            >
              <div
                className="h-8 w-full animate-pulse rounded bg-navy-100"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <div className="h-2.5 w-10 animate-pulse rounded bg-navy-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Name / phone */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-navy-100" />
          <div className="mt-2 h-10 w-full animate-pulse hairline bg-navy-50 rounded-md" />
        </div>
        <div>
          <div className="h-3 w-32 animate-pulse rounded bg-navy-100" />
          <div className="mt-2 h-10 w-full animate-pulse hairline bg-navy-50 rounded-md" />
        </div>
      </div>

      {/* Email */}
      <div className="mt-4">
        <div className="h-3 w-16 animate-pulse rounded bg-navy-100" />
        <div className="mt-2 h-10 w-full animate-pulse hairline bg-navy-50 rounded-md" />
      </div>

      {/* Button */}
      <div className="mt-6 h-12 w-full animate-pulse rounded-md bg-primary-100" />

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4 hairline-t pt-4">
        <div className="h-3 w-28 animate-pulse rounded bg-navy-100" />
        <div className="h-3 w-36 animate-pulse rounded bg-navy-100" />
      </div>

      <span className="sr-only">Chargement du formulaire de don…</span>
    </div>
  );
}
