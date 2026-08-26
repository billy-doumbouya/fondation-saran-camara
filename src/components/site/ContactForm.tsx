"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Loader2, User, Mail, Phone, HelpCircle, MessageSquare } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { playConfirmSound } from "@/lib/sound";

// Liste des sujets prédéfinis standards
const SUBJECT_OPTIONS = [
  "Informations générales",
  "Faire un don / Parrainage",
  "Devenir bénévole / Volontariat",
  "Proposition de partenariat",
  "Presse & Médias",
  "Autre demande",
];

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      subject: SUBJECT_OPTIONS[0],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Échec de l'envoi. Merci de réessayer.");
      return res.json();
    },
    onSuccess: () => {
      playConfirmSound();
      toast.success("Message envoyé ! Nous vous répondrons rapidement.");
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="rounded-3xl border border-navy-100/80 bg-white p-6 shadow-xl shadow-navy-950/5 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nom complet */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            Nom complet <span className="text-primary-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              {...register("name")}
              placeholder="Ex: Saran Camara"
              className="w-full rounded-xl border border-navy-200 bg-navy-50/30 py-3 pl-10 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            E-mail <span className="text-primary-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="exemple@domaine.com"
              className="w-full rounded-xl border border-navy-200 bg-navy-50/30 py-3 pl-10 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Téléphone */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            Téléphone <span className="text-xs font-normal text-navy-400">(optionnel)</span>
          </label>
          <div className="relative mt-1.5">
            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              {...register("phone")}
              placeholder="+224 620 00 00 00"
              className="w-full rounded-xl border border-navy-200 bg-navy-50/30 py-3 pl-10 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        {/* Sujet (Liste déroulante prédéfinie) */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            Objet de la demande <span className="text-primary-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <HelpCircle size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
            <select
              {...register("subject")}
              className="w-full appearance-none rounded-xl border border-navy-200 bg-navy-50/30 py-3 pl-10 pr-10 text-sm text-navy-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {/* Flèche déroulante personnalisée */}
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
        </div>
      </div>

      {/* Message */}
      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
          Message <span className="text-primary-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <MessageSquare size={18} className="absolute left-3.5 top-3.5 text-navy-400" />
          <textarea
            rows={5}
            {...register("message")}
            placeholder="Écrivez votre message ici..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/30 py-3 pl-10 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
          />
        </div>
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl active:scale-95 disabled:opacity-60 sm:w-auto"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Send size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
        Envoyer le message
      </button>
    </form>
  );
}