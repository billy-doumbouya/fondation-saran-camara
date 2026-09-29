"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
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

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      subject: SUBJECT_OPTIONS[0].id,
      consent: false,
      website: "",
    },
  });

  const selectedSubject = watch("subject");
  const messageValue = watch("message") || "";

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
    onSuccess: (data) => {
      toast.success(data.message || "Message transmis avec succès ! Notre équipe vous répondra très rapidement.");
      reset({ subject: SUBJECT_OPTIONS[0].id, consent: false, website: "" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
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
      <div className="rounded-xl border border-navy-100 bg-navy-50/40 p-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("consent")}
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
            .
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-xs font-medium text-red-600">
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