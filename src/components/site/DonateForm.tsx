"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, HeartHandshake, Loader2, Smartphone, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { donationSchema, type DonationFormValues } from "@/lib/validations";
import { formatGNF } from "@/lib/utils";

const SUGGESTED_AMOUNTS = [25000, 50000, 100000, 250000, 500000];

const PAYMENT_METHODS = [
  { value: "orange_money", label: "Orange Money", logo: "/orane-money.png" },
  { value: "mtn_money", label: "MTN MoMo", logo: "/mtn-money.png" },
  { value: "moov_money", label: "Moov Money", logo: "/moove-money.png" },
  { value: "wave", label: "Wave", logo: "/wave-money.png" },
  { value: "card", label: "Carte bancaire", logo: "/bank.png" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

type InitResponse =
  | { success: true; flow: "push"; reference: string; message?: string }
  | { success: true; flow: "redirect"; reference: string; redirectUrl: string; message?: string; warning?: string };

type PaymentPhase =
  | { step: "idle" }
  | { step: "awaiting_push"; reference: string; phone: string }
  | { step: "confirmed" }
  | { step: "declined"; message: string };

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

/**
 * Anime la valeur affichée d'un nombre vers sa nouvelle cible (façon compteur
 * "odomètre"), plutôt qu'un saut brut — donne au montant sélectionné une
 * sensation plus premium sans dépendance supplémentaire.
 */
function useCountUp(target: number, durationMs = 350) {
  const [displayed, setDisplayed] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return displayed;
}

export default function DonateForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
  const [customAmount, setCustomAmount] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("orange_money");
  const [phase, setPhase] = useState<PaymentPhase>({ step: "idle" });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: yupResolver(donationSchema),
    defaultValues: { amount: 100000, paymentMethod: "orange_money" },
  });

  const animatedAmount = useCountUp(customAmount);

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef<number>(0);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  // Retour d'une redirection carte/Wave : /don?status=success|error&ref=MTX-xxx
  // On ne fait jamais confiance au seul paramètre `status` de l'URL (il peut
  // être manipulé ou refléter un état transitoire) — on revérifie toujours
  // le vrai statut auprès de notre API avant d'afficher quoi que ce soit.
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("ref");
    const urlStatus = searchParams.get("status");
    if (!ref || !urlStatus) return;

    (async () => {
      try {
        const res = await fetch(`/api/donate/status/${encodeURIComponent(ref)}`);
        const data = await res.json();

        if (data.status === "success") {
          setPhase({ step: "confirmed" });
        } else if (data.status === "failed") {
          setPhase({
            step: "declined",
            message: "Le paiement n'a pas pu être finalisé. Aucun montant n'a été prélevé si l'opération a échoué avant confirmation.",
          });
        } else {
          // Toujours "pending" côté GeniusPay : le webhook peut arriver sous peu.
          setPhase({
            step: "declined",
            message:
              "Nous vérifions encore votre paiement. Si vous avez bien payé, la confirmation arrivera automatiquement par e-mail sous peu.",
          });
        }
      } catch {
        setPhase({
          step: "declined",
          message: "Impossible de vérifier le statut de votre paiement pour le moment. Contactez-nous si le prélèvement a eu lieu.",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const startPolling = useCallback(
    (reference: string, phone: string) => {
      pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
      pollTimer.current = setInterval(async () => {
        if (Date.now() > pollDeadline.current) {
          stopPolling();
          setPhase({
            step: "declined",
            message:
              "Pas de confirmation reçue à temps. Si vous avez validé sur votre téléphone, le don sera pris en compte dès réception.",
          });
          return;
        }

        try {
          const res = await fetch(`/api/donate/status/${encodeURIComponent(reference)}`);
          const data = await res.json();

          if (data.status === "success") {
            stopPolling();
            setPhase({ step: "confirmed" });
            toast.success("Votre don a été confirmé. Merci pour votre générosité.");
          } else if (data.status === "failed") {
            stopPolling();
            setPhase({ step: "declined", message: "Le paiement a échoué ou a été annulé." });
            toast.error("Le paiement n'a pas abouti.");
          }
          // sinon "pending" -> on continue le polling
        } catch {
          // erreur réseau ponctuelle, on retente au tick suivant
        }
      }, POLL_INTERVAL_MS);
      setPhase({ step: "awaiting_push", reference, phone });
    },
    [stopPolling]
  );

  const mutation = useMutation({
    mutationFn: async (values: DonationFormValues) => {
      const res = await fetch("/api/donate/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, paymentMethod }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Impossible d'initier le paiement.");
      }
      return res.json() as Promise<InitResponse>;
    },
    onSuccess: (data, values) => {
      if (data.flow === "push") {
        toast.message("Demande envoyée. Validez sur votre téléphone.");
        startPolling(data.reference, values.donorPhone);
      } else if (data.flow === "redirect") {
        if (data.warning) {
          toast.warning(data.warning, { duration: 7000 });
        } else {
          toast.message(data.message || "Redirection vers le paiement sécurisé...");
        }
        window.location.href = data.redirectUrl;
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const pickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
    setValue("amount", amount, { shouldValidate: true });
  };

  const onCustomAmountChange = (raw: string) => {
    setSelectedAmount(null);
    const value = Number(raw);
    if (Number.isFinite(value)) setCustomAmount(value);
  };

  const pickPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValue("paymentMethod", method, { shouldValidate: true });
  };

  const isMobileMoney = paymentMethod !== "card" && paymentMethod !== "wave";

  // --- États post-soumission (push en attente / confirmé / refusé) ---

  if (phase.step === "awaiting_push") {
    const activeMethod = PAYMENT_METHODS.find((m) => m.value === paymentMethod);
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-8 text-center shadow-sm">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white ring-4 ring-amber-100"
        >
          {activeMethod ? (
            <Image src={activeMethod.logo} alt={activeMethod.label} width={40} height={20} className="h-6 w-auto object-contain" />
          ) : (
            <Smartphone size={28} className="text-amber-600" />
          )}
        </motion.div>
        <p className="mt-5 font-display text-lg font-semibold text-navy-900">
          Confirmez le paiement sur votre téléphone
        </p>
        <p className="mt-2 text-sm text-navy-500">
          Une demande a été envoyée au <span className="font-medium">{phase.phone}</span>. Entrez votre
          code PIN mobile money pour finaliser votre don — merci pour votre confiance.
        </p>
        <button
          type="button"
          onClick={() => {
            stopPolling();
            setPhase({ step: "idle" });
          }}
          className="mt-5 text-xs font-medium text-navy-400 underline underline-offset-2"
        >
          Annuler et revenir au formulaire
        </button>
      </div>
    );
  }

  if (phase.step === "confirmed") {
    return (
      <div className="rounded-3xl border border-primary-200 bg-primary-50/80 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <CheckCircle2 size={28} />
        </div>
        <p className="mt-5 font-display text-lg font-semibold text-navy-900">Merci pour votre don !</p>
        <p className="mt-2 text-sm text-navy-500">Votre paiement a bien été confirmé.</p>
      </div>
    );
  }

  if (phase.step === "declined") {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50/80 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle size={28} />
        </div>
        <p className="mt-5 font-display text-lg font-semibold text-navy-900">Paiement non abouti</p>
        <p className="mt-2 text-sm text-navy-500">{phase.message}</p>
        <button
          type="button"
          onClick={() => setPhase({ step: "idle" })}
          className="mt-5 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // --- Formulaire ---

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_45px_-25px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:p-8"
    >
      <div className="mb-1 flex items-center gap-1.5 text-primary-600">
        <Sparkles size={15} />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Chaque don change une vie</span>
      </div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold text-navy-900">Choisissez un montant</h2>
        <motion.span
          key={animatedAmount}
          initial={{ opacity: 0.4, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-lg font-bold text-primary-600"
        >
          {formatGNF(animatedAmount)}
        </motion.span>
      </div>
      <p className="mt-1 text-sm text-navy-400">
        Votre générosité offre éducation et protection aux enfants qui en ont besoin.
      </p>

      <div className="relative mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SUGGESTED_AMOUNTS.map((amount) => {
          const isActive = selectedAmount === amount;
          return (
            <button
              type="button"
              key={amount}
              onClick={() => pickAmount(amount)}
              className={`relative overflow-hidden rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                isActive
                  ? "border-primary-600 text-white"
                  : "border-navy-200 text-navy-700 hover:border-primary-400"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="amount-highlight"
                  className="absolute inset-0 -z-10 bg-primary-600"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {formatGNF(amount)}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-navy-700">Ou montant personnalisé (GNF)</label>
        <input
          type="number"
          {...register("amount")}
          onChange={(e) => onCustomAmountChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none transition-shadow focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          placeholder="100000"
        />
        <AnimatePresence>
          {errors.amount && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-xs text-red-600"
            >
              {errors.amount.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Sélecteur de moyen de paiement */}
      <div className="mt-6">
        <label className="text-sm font-medium text-navy-700">Moyen de paiement</label>
        <div className="relative mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {PAYMENT_METHODS.map(({ value, label, logo }) => {
            const isActive = paymentMethod === value;
            return (
              <motion.button
                type="button"
                key={value}
                onClick={() => pickPaymentMethod(value)}
                whileTap={{ scale: 0.96 }}
                className={`relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border-2 p-2.5 transition-colors ${
                  isActive
                    ? "border-primary-600 bg-primary-50/60 shadow-sm shadow-primary-600/10"
                    : "border-navy-100 bg-white hover:border-primary-300"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="method-check"
                    className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-white"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  >
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </motion.span>
                )}
                <span className="flex h-9 w-full items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-navy-100">
                  <Image src={logo} alt={label} width={56} height={28} className="h-6 w-auto object-contain" />
                </span>
                <span className="text-[11px] font-medium leading-tight text-navy-600">{label}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-navy-400">
          <ShieldCheck size={13} className="shrink-0 text-primary-500" />
          {isMobileMoney
            ? "Vous recevrez une demande de confirmation directement sur votre téléphone."
            : "Vous serez redirigé vers une page de paiement sécurisée."}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-navy-700">Nom complet</label>
          <input
            {...register("donorName")}
            className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none transition-shadow focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="Votre nom"
          />
          <AnimatePresence>
            {errors.donorName && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-xs text-red-600"
              >
                {errors.donorName.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700">
            Téléphone {isMobileMoney ? "(Mobile Money)" : ""}
          </label>
          <input
            {...register("donorPhone")}
            className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none transition-shadow focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="+224 6XX XX XX XX"
          />
          <AnimatePresence>
            {errors.donorPhone && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-xs text-red-600"
              >
                {errors.donorPhone.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-navy-700">E-mail</label>
        <input
          type="email"
          {...register("donorEmail")}
          className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none transition-shadow focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          placeholder="vous@exemple.com"
        />
        <AnimatePresence>
          {errors.donorEmail && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-xs text-red-600"
            >
              {errors.donorEmail.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        disabled={mutation.isPending}
        whileHover={{ scale: mutation.isPending ? 1 : 1.015 }}
        whileTap={{ scale: mutation.isPending ? 1 : 0.985 }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:opacity-60"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mutation.isPending ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.18 }}
            >
              <Loader2 className="animate-spin" size={18} />
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.18 }}
            >
              <HeartHandshake size={18} />
            </motion.span>
          )}
        </AnimatePresence>
        {mutation.isPending ? "Traitement..." : "Faire un don maintenant"}
      </motion.button>

      <div className="mt-4 flex items-center justify-center gap-4 border-t border-navy-100 pt-4 text-[11px] text-navy-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-primary-500" />
          Paiement 100% sécurisé
        </span>
        <span className="flex items-center gap-1.5">
          <HeartHandshake size={14} className="text-primary-500" />
          Utilisé directement pour nos actions
        </span>
      </div>
    </form>
  );
}