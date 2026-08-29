"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import { donationSchema, type DonationFormValues } from "@/lib/validations";
import { formatGNF } from "@/lib/utils";

const SUGGESTED_AMOUNTS = [25000, 50000, 100000, 250000, 500000];

export default function DonateForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: yupResolver(donationSchema),
    defaultValues: { amount: 100000 },
  });

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
    setValue("amount", amount, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="font-display text-xl font-semibold text-navy-900">Choisissez un montant</h2>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SUGGESTED_AMOUNTS.map((amount) => (
          <button
            type="button"
            key={amount}
            onClick={() => pickAmount(amount)}
            className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
              selectedAmount === amount
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-navy-200 text-navy-700 hover:border-primary-400"
            }`}
          >
            {formatGNF(amount)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-navy-700">Ou montant personnalisé (GNF)</label>
        <input
          type="number"
          {...register("amount")}
          onChange={() => setSelectedAmount(null)}
          className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          placeholder="100000"
        />
        {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-navy-700">Nom complet</label>
          <input
            {...register("donorName")}
            className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="Votre nom"
          />
          {errors.donorName && <p className="mt-1 text-xs text-red-600">{errors.donorName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700">Téléphone (Mobile Money)</label>
          <input
            {...register("donorPhone")}
            className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="+224 6XX XX XX XX"
          />
          {errors.donorPhone && <p className="mt-1 text-xs text-red-600">{errors.donorPhone.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-navy-700">E-mail</label>
        <input
          type="email"
          {...register("donorEmail")}
          className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          placeholder="vous@exemple.com"
        />
        {errors.donorEmail && <p className="mt-1 text-xs text-red-600">{errors.donorEmail.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-60"
      >
        {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <HeartHandshake size={18} />}
        {mutation.isPending ? "Traitement..." : "Faire un don maintenant"}
      </button>
      <p className="mt-3 text-center text-xs text-navy-400">
        Paiement sécurisé via GeniusPay (Mobile Money, carte bancaire).
      </p>
    </form>
  );
}
