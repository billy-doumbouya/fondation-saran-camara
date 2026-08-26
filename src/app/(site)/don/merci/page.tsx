import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import PlayConfirmSoundOnMount from "@/components/site/PlayConfirmSoundOnMount";

export const metadata = { title: "Merci pour votre don" };

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <div className="relative flex min-h-[68vh] items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-white px-5 py-16 text-center">
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold-100/40 blur-3xl" />
      <PlayConfirmSoundOnMount />
      <AnimatedSection className="relative max-w-xl rounded-3xl border border-primary-100 bg-white/90 p-8 shadow-xl shadow-navy-900/10 backdrop-blur-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600 ring-8 ring-primary-50">
          <CheckCircle2 size={48} />
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Contribution confirmée</p>
        <h1 className="font-display mt-3 text-3xl font-bold text-navy-900">Merci pour votre générosité !</h1>
        <p className="mt-4 leading-7 text-navy-500">
          Votre don a été enregistré{ref ? ` (référence ${ref})` : ""}. Un email de confirmation vous sera
          envoyé une fois le paiement validé par notre partenaire de paiement.
        </p>
        <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-2 border-t border-navy-100 pt-5 text-xs text-navy-500">
          <ShieldCheck size={16} className="text-primary-600" />
          Votre geste contribue directement à nos actions.
        </div>
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Retour à l&apos;accueil
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </AnimatedSection>
    </div>
  );
}
