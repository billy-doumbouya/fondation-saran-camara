"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { CheckCircle2, HeartHandshake, Loader2, ShieldCheck, XCircle, ArrowRight } from "lucide-react";
import { ValidationError } from "yup";
import { donationSchema, type DonationFormValues } from "@/lib/validations";
import { formatGNF, cn } from "@/lib/utils";

const SUGGESTED_AMOUNTS = [25000, 50000, 100000, 250000, 500000] as const;

const PAYMENT_METHODS = [
  { value: "orange_money", label: "Orange Money", logo: "/orange-money.png" },
  { value: "mtn_money", label: "MTN MoMo", logo: "/mtn-money.png" },
  { value: "moov_money", label: "Moov Money", logo: "/moov-money.png" },
  { value: "wave", label: "Wave", logo: "/wave-money.png" },
  { value: "card", label: "Carte bancaire", logo: "/bank.png" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];
type Phase =
  | { step: "idle" }
  | { step: "awaiting_push"; reference: string; phone: string; method: PaymentMethod }
  | { step: "confirmed" }
  | { step: "declined"; message: string };

type InitResponse =
  | { success: true; flow: "push"; reference: string; message?: string }
  | { success: true; flow: "redirect"; reference: string; redirectUrl: string; message?: string; warning?: string };

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

// ——— Count-up hook (pure RAF, no lib) ———
function useCountUp(target: number, durationMs = 350) {
  const reduce = useReducedMotion() ?? false;
  const [displayed, setDisplayed] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) {
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, durationMs, reduce]);

  return reduce ? target : displayed;
}

export default function DonateForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
  const [customAmount, setCustomAmount] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("orange_money");
  const [phase, setPhase] = useState<Phase>({ step: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DonationFormValues, string>>>({});
  const [values, setValues] = useState<DonationFormValues>({
    amount: 100000,
    paymentMethod: "orange_money",
    donorName: "",
    donorPhone: "",
    donorEmail: "",
  });

  const animatedAmount = useCountUp(customAmount);
  const reduce = useReducedMotion() ?? false;

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef<number>(0);
  const searchParams = useSearchParams();

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  // ——— Redirect return: verify status server-side ———
  useEffect(() => {
    const ref = searchParams.get("ref");
    const urlStatus = searchParams.get("status");
    if (!ref || !urlStatus) return;

    (async () => {
      try {
        const res = await fetch(`/api/donate/status/${encodeURIComponent(ref)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "success") {
          setPhase({ step: "confirmed" });
        } else if (data.status === "failed") {
          setPhase({
            step: "declined",
            message: "Le paiement n'a pas pu être finalisé. Aucun montant n'a été prélevé.",
          });
        } else {
          setPhase({
            step: "declined",
            message: "Nous vérifions encore votre paiement. La confirmation arrivera par e-mail sous peu.",
          });
        }
      } catch {
        setPhase({
          step: "declined",
          message: "Impossible de vérifier le statut. Contactez-nous si le prélèvement a eu lieu.",
        });
      }
    })();
  }, [searchParams]);

  const startPolling = useCallback(
    (reference: string, phone: string, method: PaymentMethod) => {
      pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
      pollTimer.current = setInterval(async () => {
        if (Date.now() > pollDeadline.current) {
          stopPolling();
          setPhase({
            step: "declined",
            message: "Pas de confirmation reçue à temps. Si vous avez validé, le don sera pris en compte dès réception.",
          });
          return;
        }
        try {
          const res = await fetch(`/api/donate/status/${encodeURIComponent(reference)}`);
          if (!res.ok) return;
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
        } catch {
          /* retry next tick */
        }
      }, POLL_INTERVAL_MS);
      setPhase({ step: "awaiting_push", reference, phone, method });
    },
    [stopPolling],
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: DonationFormValues = { ...values, amount: customAmount, paymentMethod };
    try {
      donationSchema.validateSync(payload, { abortEarly: false });
    } catch (err) {
      const newErrors: Partial<Record<keyof DonationFormValues, string>> = {};
      if (err instanceof ValidationError) {
        for (const ve of err.inner) {
          if (ve.path) newErrors[ve.path as keyof DonationFormValues] = ve.message;
        }
      }
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/donate/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await res.json().catch(() => null) : null;
      if (!res.ok) {
        throw new Error(data?.error || `Erreur (${res.status}). Impossible d'initier le paiement.`);
      }
      if (!data) {
        throw new Error("Réponse inattendue du serveur de paiement.");
      }

      const init = data as InitResponse;
      if (init.flow === "push") {
        toast.message("Demande envoyée. Validez sur votre téléphone.");
        startPolling(init.reference, payload.donorPhone, payload.paymentMethod);
      } else if (init.flow === "redirect") {
        if (init.warning) toast.warning(init.warning, { duration: 7000 });
        else toast.message(init.message || "Redirection vers le paiement sécurisé…");
        window.location.href = init.redirectUrl;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSubmitting(false);
    }
  };

  const pickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
    setValues((v) => ({ ...v, amount }));
    if (errors.amount) setErrors((e) => ({ ...e, amount: undefined }));
  };

  const onCustomAmountChange = (raw: string) => {
    setSelectedAmount(null);
    const value = Number(raw);
    if (Number.isFinite(value)) {
      setCustomAmount(value);
      setValues((v) => ({ ...v, amount: value }));
    }
  };

  const pickPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValues((v) => ({ ...v, paymentMethod: method }));
  };

  const update = (field: keyof DonationFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const isMobileMoney = paymentMethod !== "card" && paymentMethod !== "wave";

  // ——— Phase: awaiting push ———
  if (phase.step === "awaiting_push") {
    const activeMethod = PAYMENT_METHODS.find((m) => m.value === phase.method);
    return (
      <PhaseCard
        tone="amber"
        icon={
          activeMethod ? (
            <Image src={activeMethod.logo} alt={activeMethod.label} width={40} height={20} className="h-6 w-auto object-contain" />
          ) : null
        }
        title="Confirmez le paiement sur votre téléphone"
      >
        <p className="text-sm text-navy-600">
          Une demande a été envoyée au <span className="font-medium text-navy-900">{phase.phone}</span>.
          Entrez votre code PIN Mobile Money pour finaliser votre don.
        </p>
        <button
          type="button"
          onClick={() => { stopPolling(); setPhase({ step: "idle" }); }}
          className="mt-5 font-mono text-[0.6875rem] uppercase tracking-widest text-navy-400 hover:text-navy-700 underline underline-offset-2"
        >
          Annuler et revenir au formulaire
        </button>
      </PhaseCard>
    );
  }

  // ——— Phase: confirmed ———
  if (phase.step === "confirmed") {
    return (
      <PhaseCard
        tone="primary"
        icon={<CheckCircle2 size={28} strokeWidth={1.75} />}
        title="Merci pour votre don !"
      >
        <p className="text-sm text-navy-600">Votre paiement a bien été confirmé.</p>
        <button
          type="button"
          onClick={() => setPhase({ step: "idle" })}
          className="btn-primary mt-5"
        >
          Faire un autre don
        </button>
      </PhaseCard>
    );
  }

  // ——— Phase: declined ———
  if (phase.step === "declined") {
    return (
      <PhaseCard
        tone="red"
        icon={<XCircle size={28} strokeWidth={1.75} />}
        title="Paiement non abouti"
      >
        <p className="text-sm text-navy-600">{phase.message}</p>
        <button
          type="button"
          onClick={() => setPhase({ step: "idle" })}
          className="btn-primary mt-5"
        >
          Réessayer
        </button>
      </PhaseCard>
    );
  }

  // ——— Form ———
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative overflow-hidden hairline-strong bg-white rounded-lg p-6 sm:p-8"
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-gold-500/60" aria-hidden />
        <span className="eyebrow">Chaque don change une vie</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-navy-900">Choisissez un montant</h2>
        <motion.span
          key={animatedAmount}
          initial={reduce ? false : { opacity: 0.4, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-lg font-bold text-primary-700 shrink-0"
        >
          {formatGNF(animatedAmount)}
        </motion.span>
      </div>
      <p className="mt-1 text-sm text-navy-500">
        Votre générosité offre éducation et protection aux enfants qui en ont besoin.
      </p>

      {/* Amounts */}
      <div className="relative mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SUGGESTED_AMOUNTS.map((amount) => {
          const isActive = selectedAmount === amount;
          return (
            <button
              type="button"
              key={amount}
              onClick={() => pickAmount(amount)}
              className={cn(
                "relative overflow-hidden rounded-md px-2 py-2.5 font-display text-xs font-semibold transition-colors sm:text-sm",
                isActive ? "text-white" : "hairline text-navy-700 hover:hairline-strong",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="amount-highlight"
                  className="absolute inset-0 -z-10 bg-primary-600"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {formatGNF(amount)}
            </button>
          );
        })}
      </div>

      {/* Custom amount */}
      <div className="mt-4">
        <FieldLabel label="Ou montant personnalisé" hint="GNF" />
        <input
          type="number"
          value={customAmount || ""}
          onChange={(e) => onCustomAmountChange(e.target.value)}
          className={inputCls(!!errors.amount)}
          placeholder="100000"
          min={1000}
        />
        {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
      </div>

      {/* Payment methods */}
      <div className="mt-6">
        <FieldLabel label="Moyen de paiement" />
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PAYMENT_METHODS.map(({ value, label, logo }) => {
            const isActive = paymentMethod === value;
            return (
              <motion.button
                type="button"
                key={value}
                onClick={() => pickPaymentMethod(value)}
                whileTap={reduce ? undefined : { scale: 0.96 }}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 overflow-hidden rounded-md p-2.5 transition-colors",
                  isActive ? "hairline-strong bg-primary-50/60" : "hairline bg-white hover:hairline-strong",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="method-check"
                    className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-white"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  >
                    <CheckCircle2 size={10} strokeWidth={3} />
                  </motion.span>
                )}
                <span className="flex h-9 w-full items-center justify-center rounded-sm bg-white hairline">
                  <Image src={logo} alt={label} width={56} height={28} className="h-6 w-auto object-contain" />
                </span>
                <span className="text-[0.6875rem] font-medium leading-tight text-navy-600">{label}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-navy-400">
          <ShieldCheck size={13} className="shrink-0 text-primary-500" strokeWidth={1.75} />
          {isMobileMoney
            ? "Vous recevrez une demande de confirmation directement sur votre téléphone."
            : "Vous serez redirigé vers une page de paiement sécurisée."}
        </p>
      </div>

      {/* Donor info */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel label="Nom complet" required />
          <input
            value={values.donorName}
            onChange={update("donorName")}
            className={inputCls(!!errors.donorName)}
            placeholder="Votre nom"
            autoComplete="name"
          />
          {errors.donorName && <ErrorText>{errors.donorName}</ErrorText>}
        </div>
        <div>
          <FieldLabel label={`Téléphone ${isMobileMoney ? "(Mobile Money)" : ""}`} required />
          <input
            value={values.donorPhone}
            onChange={update("donorPhone")}
            className={inputCls(!!errors.donorPhone)}
            placeholder="+224 6XX XX XX XX"
            autoComplete="tel"
          />
          {errors.donorPhone && <ErrorText>{errors.donorPhone}</ErrorText>}
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel label="E-mail" required />
        <input
          type="email"
          value={values.donorEmail}
          onChange={update("donorEmail")}
          className={inputCls(!!errors.donorEmail)}
          placeholder="vous@exemple.com"
          autoComplete="email"
        />
        {errors.donorEmail && <ErrorText>{errors.donorEmail}</ErrorText>}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={reduce || submitting ? undefined : { scale: 1.01 }}
        whileTap={reduce || submitting ? undefined : { scale: 0.99 }}
        className="btn-primary mt-6 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <AnimatePresence mode="wait" initial={false}>
          {submitting ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.18 }}
            >
              <Loader2 size={18} className="animate-spin" />
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
        {submitting ? "Traitement…" : "Faire un don maintenant"}
        {!submitting && <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />}
      </motion.button>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4 hairline-t pt-4 text-[0.6875rem] text-navy-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-primary-500" strokeWidth={1.75} />
          Paiement 100% sécurisé
        </span>
        <span className="h-3 w-px bg-navy-200" aria-hidden />
        <span className="flex items-center gap-1.5">
          <HeartHandshake size={13} className="text-primary-500" strokeWidth={1.75} />
          Utilisé directement pour nos actions
        </span>
      </div>
    </form>
  );
}

// ——— Sub-components ———

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-md px-3 py-2.5 text-sm text-navy-900 placeholder:text-navy-300",
    "bg-background outline-none transition-all duration-150",
    hasError
      ? "hairline-strong border-red-400 focus:border-red-500"
      : "hairline focus:border-primary-500 focus:hairline-strong",
  ].join(" ");
}

function FieldLabel({ label, hint, required }: { label: string; hint?: string; required?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label className="eyebrow eyebrow-muted">
        {label}
        {required && <span className="text-primary-600 ml-1">*</span>}
      </label>
      {hint && (
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-400">{hint}</span>
      )}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 font-mono text-[0.6875rem] text-red-600">{children}</p>;
}

function PhaseCard({
  tone,
  icon,
  title,
  children,
}: {
  tone: "primary" | "amber" | "red";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const toneCls = {
    primary: "border-primary-200 bg-primary-50/60",
    amber: "border-gold-300 bg-gold-50/60",
    red: "border-red-300 bg-red-50/60",
  }[tone];
  const iconBg = {
    primary: "bg-primary-100 text-primary-700",
    amber: "bg-white text-gold-700 ring-4 ring-gold-100",
    red: "bg-red-100 text-red-700",
  }[tone];

  return (
    <div className={cn("relative overflow-hidden rounded-lg hairline-strong p-8 text-center", toneCls)}>
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
      <motion.div
        animate={useReducedMotion() ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full", iconBg)}
      >
        {icon}
      </motion.div>
      <p className="mt-5 font-display text-lg font-bold text-navy-900">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}