"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-900 px-6 text-center text-white">
      <AlertTriangle size={48} className="text-gold-400" />
      <h1 className="font-display text-2xl font-bold">Une erreur inattendue est survenue</h1>
      <p className="max-w-md text-navy-300">
        Nos équipes techniques ont été notifiées. Vous pouvez réessayer ou revenir à l&apos;accueil.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold hover:bg-primary-700"
        >
          Réessayer
        </button>
        <Link href="/" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
          Accueil
        </Link>
      </div>
    </div>
  );
}
