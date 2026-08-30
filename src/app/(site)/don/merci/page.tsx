import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock3, XCircle } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import PlayConfirmSoundOnMount from "@/components/site/PlayConfirmSoundOnMount";
import { donationsRepo } from "@/lib/db/repo";
import { getGeniusPayPayment } from "@/lib/geniuspay";

export const metadata = { title: "Merci pour votre don" };

type DonationStatus = "success" | "pending" | "failed";

async function resolveStatus(ref: string | undefined): Promise<DonationStatus> {
  if (!ref) return "pending";

  // 1. Source de vérité principale : notre base, mise à jour par le webhook.
  const donation = await donationsRepo.findByReference(ref).catch(() => null);
  if (donation?.status === "success") return "success";
  if (donation?.status === "failed") return "failed";

  // 2. Si toujours "pending" en base (webhook pas encore arrivé), on
  //    interroge GeniusPay directement pour éviter d'afficher un faux succès.
  try {
    const remote = await getGeniusPayPayment(ref);
    if (remote.status === "completed") {
      await donationsRepo.updateStatus(ref, "success", { providerData: remote.raw });
      return "success";
    }
    if (["failed", "cancelled", "expired"].includes(remote.status)) {
      await donationsRepo.updateStatus(ref, "failed", { providerData: remote.raw });
      return "failed";
    }
  } catch {
    // GeniusPay injoignable : on reste prudent, on affiche "en attente"
    // plutôt qu'un faux succès.
  }

  return "pending";
}

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const status = await resolveStatus(ref);

  const content = {
    success: {
      icon: <CheckCircle2 size={48} />,
      iconBg: "bg-primary-100 text-primary-600 ring-primary-50",
      eyebrow: "Contribution confirmée",
      title: "Merci pour votre générosité !",
      body: `Votre don a été confirmé${ref ? ` (référence ${ref})` : ""}. Un email de confirmation vous sera envoyé sous peu.`,
      playSound: true,
    },
    pending: {
      icon: <Clock3 size={48} />,
      iconBg: "bg-amber-100 text-amber-600 ring-amber-50",
      eyebrow: "Paiement en cours de vérification",
      title: "Votre don est en cours de traitement",
      body: `Nous avons bien reçu votre demande${ref ? ` (référence ${ref})` : ""}. La confirmation finale peut prendre quelques minutes — vous recevrez un email dès que ce sera validé.`,
      playSound: false,
    },
    failed: {
      icon: <XCircle size={48} />,
      iconBg: "bg-red-100 text-red-600 ring-red-50",
      eyebrow: "Paiement non abouti",
      title: "Le paiement n'a pas pu être finalisé",
      body: `Votre don${ref ? ` (référence ${ref})` : ""} n'a pas été validé. Aucun montant n'a été prélevé si l'opération a échoué avant confirmation. Vous pouvez réessayer.`,
      playSound: false,
    },
  }[status];

  return (
    <div className="relative flex min-h-[68vh] items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-white px-5 py-16 text-center">
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold-100/40 blur-3xl" />
      {content.playSound && <PlayConfirmSoundOnMount />}
      <AnimatedSection className="relative max-w-xl rounded-3xl border border-primary-100 bg-white/90 p-8 shadow-xl shadow-navy-900/10 backdrop-blur-sm sm:p-12">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ring-8 ${content.iconBg}`}>
          {content.icon}
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-primary-600">{content.eyebrow}</p>
        <h1 className="font-display mt-3 text-3xl font-bold text-navy-900">{content.title}</h1>
        <p className="mt-4 leading-7 text-navy-500">{content.body}</p>
        <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-2 border-t border-navy-100 pt-5 text-xs text-navy-500">
          <ShieldCheck size={16} className="text-primary-600" />
          Votre geste contribue directement à nos actions.
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {status === "failed" && (
            <Link
              href="/don"
              className="group inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Réessayer
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Retour à l&apos;accueil
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}