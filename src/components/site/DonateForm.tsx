"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, HeartHandshake, Loader2 } from "lucide-react";
import { donationSchema, type DonationFormValues } from "@/lib/validations";
import { formatGNF } from "@/lib/utils";

const SUGGESTED_AMOUNTS = [25000, 50000, 100000, 250000, 500000];

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: yupResolver(donationSchema),
    defaultValues: { amount: 100000 },
  });

  const animatedAmount = useCountUp(customAmount);

  const mutation = useMutation({
    mutationFn: async (values: DonationFormValues) => {
      const res = await fetch("/api/donate/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Impossible d'initier le paiement.");
      }
      return res.json() as Promise<{ success: boolean; payment: { status?: string }; reference: string }>;
    },
    onSuccess: (data) => {
      toast.success(
        data.payment.status === "success"
          ? "Votre don a été confirmé. Merci pour votre générosité."
          : "Validez la demande de paiement sur votre téléphone."
      );
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

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_45px_-25px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:p-8"
    >
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
          <label className="text-sm font-medium text-navy-700">Téléphone (Mobile Money)</label>
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
          ) : mutation.isSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <CheckCircle2 size={18} />
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
        {mutation.isPending
          ? "Traitement..."
          : mutation.isSuccess
          ? "Don envoyé"
          : "Faire un don maintenant"}
      </motion.button>

      <p className="mt-3 text-center text-xs text-navy-400">
        Paiement sécurisé via GeniusPay (Mobile Money, carte bancaire).
      </p>
    </form>
  );
}