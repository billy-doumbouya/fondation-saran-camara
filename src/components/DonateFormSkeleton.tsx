export default function DonateFormSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement du formulaire de don"
      className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_45px_-25px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:p-8"
    >
      {/* Bandeau émotionnel */}
      <div className="mb-1 h-3 w-40 animate-pulse rounded-full bg-primary-100" />

      {/* En-tête montant */}
      <div className="flex items-baseline justify-between">
        <div className="h-6 w-44 animate-pulse rounded-md bg-navy-100" />
        <div className="h-6 w-24 animate-pulse rounded-md bg-primary-100" />
      </div>
      <div className="mt-2 h-3.5 w-64 max-w-full animate-pulse rounded-full bg-navy-100" />

      {/* Montants suggérés */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-xl border border-navy-100 bg-navy-50"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      {/* Montant personnalisé */}
      <div className="mt-4">
        <div className="h-3.5 w-48 animate-pulse rounded-full bg-navy-100" />
        <div className="mt-2 h-11 w-full animate-pulse rounded-xl border border-navy-100 bg-navy-50" />
      </div>

      {/* Moyens de paiement (chips avec zone logo) */}
      <div className="mt-6">
        <div className="h-3.5 w-40 animate-pulse rounded-full bg-navy-100" />
        <div className="mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-navy-100 p-2.5"
            >
              <div
                className="h-9 w-full animate-pulse rounded-lg bg-navy-100"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <div className="h-2.5 w-10 animate-pulse rounded-full bg-navy-100" />
            </div>
          ))}
        </div>
        <div className="mt-2.5 h-3 w-72 max-w-full animate-pulse rounded-full bg-navy-100" />
      </div>

      {/* Nom / téléphone */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="h-3.5 w-24 animate-pulse rounded-full bg-navy-100" />
          <div className="mt-2 h-11 w-full animate-pulse rounded-xl border border-navy-100 bg-navy-50" />
        </div>
        <div>
          <div className="h-3.5 w-32 animate-pulse rounded-full bg-navy-100" />
          <div className="mt-2 h-11 w-full animate-pulse rounded-xl border border-navy-100 bg-navy-50" />
        </div>
      </div>

      {/* Email */}
      <div className="mt-4">
        <div className="h-3.5 w-16 animate-pulse rounded-full bg-navy-100" />
        <div className="mt-2 h-11 w-full animate-pulse rounded-xl border border-navy-100 bg-navy-50" />
      </div>

      {/* Bouton */}
      <div className="mt-6 h-[52px] w-full animate-pulse rounded-full bg-primary-100" />

      {/* Badges de confiance */}
      <div className="mt-4 flex items-center justify-center gap-4 border-t border-navy-100 pt-4">
        <div className="h-3 w-28 animate-pulse rounded-full bg-navy-100" />
        <div className="h-3 w-36 animate-pulse rounded-full bg-navy-100" />
      </div>

      <span className="sr-only">Chargement du formulaire de don…</span>
    </div>
  );
}