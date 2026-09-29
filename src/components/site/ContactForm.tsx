"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Send,
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
  GraduationCap,
  HeartHandshake,
  HandHeart,
  Building2,
  Newspaper,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";

const SUBJECT_OPTIONS = [
  {
    id: "Informations générales",
    label: "Information générale",
    icon: HelpCircle,
    color: "from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200",
  },
  {
    id: "Faire un don / Parrainage",
    label: "Don & Parrainage",
    icon: HandHeart,
    color: "from-gold-500/10 to-gold-500/5 text-gold-700 border-gold-300",
  },
  {
    id: "Devenir bénévole / Volontariat",
    label: "Volontariat & Bénévolat",
    icon: HeartHandshake,
    color: "from-primary-500/10 to-primary-500/5 text-primary-700 border-primary-200",
  },
  {
    id: "Proposition de partenariat",
    label: "Partenariat Institutionnel",
    icon: Building2,
    color: "from-navy-500/10 to-navy-500/5 text-navy-700 border-navy-200",
  },
  {
    id: "Presse & Médias",
    label: "Presse & Communication",
    icon: Newspaper,
    color: "from-purple-500/10 to-purple-500/5 text-purple-700 border-purple-200",
  },
  {
    id: "Autre demande",
    label: "Autre demande",
    icon: GraduationCap,
    color: "from-neutral-500/10 to-neutral-500/5 text-neutral-700 border-neutral-200",
  },
] as const;

interface ContactReceipt {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [receipt, setReceipt] = useState<ContactReceipt | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    shouldFocusError: false,
    defaultValues: {
      subject: SUBJECT_OPTIONS[0].id,
      consent: false,
      website: "",
    },
  });

  const selectedSubject = watch("subject");
  const messageValue = watch("message") || "";

  const handleInvalidSubmit = (formErrors: FieldErrors<ContactFormValues>) => {
    const firstError = Object.values(formErrors).find(
      (error) => typeof error?.message === "string"
    );
    toast.error(firstError?.message ?? "Vérifiez les champs obligatoires du formulaire.");
  };

  useEffect(() => {
    if (!receipt) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReceipt(null);
        requestAnimationFrame(() => submitButtonRef.current?.focus({ preventScroll: true }));
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [receipt]);

  const mutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Échec de l'envoi du message.");
      return data;
    },
    onSuccess: (_data, values) => {
      setReceipt({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      reset({
        name: "",
        email: "",
        phone: "",
        subject: SUBJECT_OPTIONS[0].id,
        message: "",
        consent: false,
        website: "",
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v), handleInvalidSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Honeypot anti-spam */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* Titre & Sous-titre éditorial */}
      <div>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold-500/70" aria-hidden />
          <span className="eyebrow text-primary-700">Formulaire officiel FSCPE</span>
        </div>
        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
          Transmettez-nous votre message
        </h2>
        <p className="mt-1.5 text-sm text-navy-500">
          Remplissez ce formulaire sécurisé. Notre équipe à Conakry vous répondra dans un délai garanti de 24 à 48 heures.
        </p>
      </div>

      {/* Sélecteur de motif d'échange (Pills interactifs) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700">
          Sélectionnez le sujet de votre message <span className="text-primary-600">*</span>
        </label>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUBJECT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedSubject === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setValue("subject", opt.id, { shouldValidate: true })}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200",
                  isSelected
                    ? "border-primary-600 bg-primary-50/90 text-primary-900 shadow-sm ring-2 ring-primary-500/20"
                    : "border-navy-100 bg-white hover:border-gold-400 hover:bg-gold-50/30 text-navy-700"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-navy-50 text-navy-600 group-hover:bg-gold-100 group-hover:text-gold-800"
                  )}
                >
                  <Icon size={16} />
                </div>
                <span className="text-xs font-medium leading-tight">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.subject && (
          <p className="mt-1.5 text-xs text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Champs Nom et Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet" required error={errors.name?.message}>
          <div className="relative">
            <User
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400"
            />
            <input
              {...register("name")}
              placeholder="Ex : Saran Camara"
              autoComplete="name"
              className={cn(inputCls, "pl-10")}
            />
          </div>
        </Field>

        <Field label="Adresse e-mail" required error={errors.email?.message}>
          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400"
            />
            <input
              type="email"
              {...register("email")}
              placeholder="vous@organisation.org"
              autoComplete="email"
              className={cn(inputCls, "pl-10")}
            />
          </div>
        </Field>
      </div>

      {/* Champ Téléphone */}
      <Field
        label="Numéro de téléphone"
        hint="(Optionnel, recommandé pour WhatsApp)"
        error={errors.phone?.message}
      >
        <div className="relative">
          <Phone
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400"
          />
          <input
            {...register("phone")}
            placeholder="+224 620 00 00 00"
            autoComplete="tel"
            className={cn(inputCls, "pl-10")}
          />
        </div>
      </Field>

      {/* Zone de texte Message */}
      <Field label="Votre message" required error={errors.message?.message}>
        <div className="relative">
          <MessageSquare
            size={17}
            className="pointer-events-none absolute left-3.5 top-3.5 text-navy-400"
          />
          <textarea
            rows={5}
            {...register("message")}
            placeholder="Détaillez votre demande, vos questions ou votre projet de collaboration avec la FSCPE…"
            className={cn(inputCls, "resize-y pl-10 min-h-[130px]")}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[0.6875rem] text-navy-400">
          <span>Soyez le plus précis possible pour nous aider à vous orienter.</span>
          <span>{messageValue.length} caractères</span>
        </div>
      </Field>

      {/* Consentement RGPD / Confidentialité */}
      <div className={cn(
        "rounded-xl border border-navy-100 bg-navy-50/40 p-4",
        errors.consent && "border-red-300 bg-red-50/60"
      )}>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("consent")}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-300 text-primary-600 focus:ring-gold-500 focus:ring-offset-0"
          />
          <span className="text-xs leading-relaxed text-navy-600">
            J&apos;accepte que les informations saisies soient recueillies et
            traitées par l&apos;équipe de la FSCPE dans le strict cadre de ma
            demande, conformément à la{" "}
            <a
              href="/confidentialite"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary-700 underline hover:text-primary-800"
            >
              politique de confidentialité
            </a>
            . <span className="font-semibold text-primary-700">(requis)</span>
          </span>
        </label>
        {errors.consent && (
          <p id="contact-consent-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* Reassurance & Bouton d'envoi */}
      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-navy-500">
          <ShieldCheck size={16} className="text-primary-600" />
          <span>Données sécurisées & traitées sous 24h</span>
        </div>

        <button
          type="submit"
          ref={submitButtonRef}
          disabled={mutation.isPending}
          className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary-600 px-7 py-3.5 font-display text-sm font-semibold text-white shadow-lg shadow-primary-700/25 transition-all duration-300 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-700/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Shimmer light effect */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
          />

          {mutation.isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              <span>Transmission en cours…</span>
            </>
          ) : (
            <>
              <span>Envoyer le message</span>
              <Send
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {receipt && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setReceipt(null);
                requestAnimationFrame(() => submitButtonRef.current?.focus({ preventScroll: true }));
              }
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-receipt-title"
              aria-describedby="contact-receipt-description"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl shadow-navy-950/25"
            >
              <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-400 to-primary-500" />
              <div className="p-6 sm:p-8">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    requestAnimationFrame(() => submitButtonRef.current?.focus({ preventScroll: true }));
                  }}
                  aria-label="Fermer la confirmation"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-800"
                >
                  <X size={18} />
                </button>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                  <Check size={23} strokeWidth={2.5} />
                </div>
                <p className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-700">
                  <Sparkles size={13} /> Message transmis à la FSCPE
                </p>
                <h2 id="contact-receipt-title" className="font-display mt-2 text-2xl font-bold text-navy-950">
                  Merci, {receipt.name}
                </h2>
                <p id="contact-receipt-description" className="mt-2 text-sm leading-relaxed text-navy-600">
                  Votre demande a bien été reçue. Notre équipe vous répondra sous 24 à 48 heures à{" "}
                  <span className="font-semibold text-navy-800">{receipt.email}</span>.
                </p>

                <div className="mt-6 border-y border-navy-100 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-400">
                    Récapitulatif de votre demande
                  </p>
                  <p className="mt-2 text-sm font-semibold text-navy-900">{receipt.subject}</p>
                  <div className="mt-3 max-h-36 overflow-y-auto rounded-lg bg-navy-50/80 px-3.5 py-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-700">{receipt.message}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    requestAnimationFrame(() => submitButtonRef.current?.focus({ preventScroll: true }));
                  }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
                >
                  <Check size={16} /> Terminer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

// ——— Composants d'aide ———
const inputCls =
  "w-full rounded-xl border border-navy-200/90 bg-white py-3 pr-4 text-sm text-navy-950 placeholder:text-navy-400 transition-all duration-200 hover:border-navy-300 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/15";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-navy-800">
          {label}
          {required && <span className="text-primary-600 font-bold"> *</span>}
        </label>
        {hint && (
          <span className="text-[0.6875rem] font-normal text-navy-400">
            {hint}
          </span>
        )}
      </div>
      <div>{children}</div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}