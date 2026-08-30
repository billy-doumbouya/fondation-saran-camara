"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, ShieldCheck, KeyRound } from "lucide-react";
import { siteSettingsSchema, adminPasswordUpdateSchema, type SiteSettingsFormValues, type AdminPasswordUpdateFormValues } from "@/lib/validations";
import { DEFAULT_BRAND } from "@/lib/site-data";

async function fetchSettings(): Promise<SiteSettingsFormValues> {
  const res = await fetch("/api/admin/settings");
  if (!res.ok) throw new Error("Erreur de chargement des paramètres.");
  return res.json();
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: fetchSettings,
  });

  const settingsForm = useForm<SiteSettingsFormValues>({
    resolver: yupResolver(siteSettingsSchema),
    defaultValues: { ...DEFAULT_BRAND },
  });

  const passwordForm = useForm<AdminPasswordUpdateFormValues>({
    resolver: yupResolver(adminPasswordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (settings) {
      settingsForm.reset({ ...DEFAULT_BRAND, ...settings });
    }
  }, [settings, settingsForm]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (values: SiteSettingsFormValues) => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Échec de l’enregistrement.");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Paramètres du site enregistrés.");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (values: AdminPasswordUpdateFormValues) => {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Impossible de modifier le mot de passe.");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Mot de passe mis à jour.");
      passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading || !settings) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-navy-500">
        <Loader2 className="mr-2 animate-spin" size={16} /> Chargement des paramètres…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Paramètres</p>
        <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Informations du site & accès admin</h1>
        <p className="mt-1 text-sm text-navy-500">Adaptez les informations publiques et sécurisez le mot de passe du back-office.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <form onSubmit={settingsForm.handleSubmit((v) => saveSettingsMutation.mutate(v))} className="space-y-5 rounded-[28px] border border-navy-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-primary-700">
            <ShieldCheck size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.12em]">Profil de la fondation</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy-700">Nom court</label>
              <input {...settingsForm.register("name")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.name && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Sigle</label>
              <input {...settingsForm.register("acronym")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.acronym && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.acronym.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Nom complet</label>
              <input {...settingsForm.register("fullName")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.fullName && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.fullName.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Slogan</label>
              <input {...settingsForm.register("slogan")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.slogan && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.slogan.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Fondateur</label>
              <input {...settingsForm.register("founderName")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.founderName && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.founderName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Email</label>
              <input {...settingsForm.register("email")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.email && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.email.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Adresse</label>
              <input {...settingsForm.register("address")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.address && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.address.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Téléphone</label>
              <input {...settingsForm.register("phone")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.phone && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.phone.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Téléphone secondaire</label>
              <input {...settingsForm.register("phoneSecondary")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">WhatsApp (numéro sans +)</label>
              <input {...settingsForm.register("whatsappNumber")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.whatsappNumber && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.whatsappNumber.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">WhatsApp (affichage)</label>
              <input {...settingsForm.register("whatsappDisplay")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.whatsappDisplay && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.whatsappDisplay.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Citation</label>
              <textarea rows={3} {...settingsForm.register("quote")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {settingsForm.formState.errors.quote && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.quote.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Vidéo d’accueil (URL)</label>
              <input {...settingsForm.register("heroVideoUrl")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder="https://...mp4" />
              {settingsForm.formState.errors.heroVideoUrl && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.heroVideoUrl.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Poster d’accueil (URL)</label>
              <input {...settingsForm.register("heroPosterUrl")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder="https://...jpg" />
              {settingsForm.formState.errors.heroPosterUrl && <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.heroPosterUrl.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={saveSettingsMutation.isPending} className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 disabled:opacity-60">
            {saveSettingsMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            <Save size={16} /> Enregistrer les paramètres
          </button>
        </form>

        <form onSubmit={passwordForm.handleSubmit((v) => updatePasswordMutation.mutate(v))} className="space-y-5 rounded-[28px] border border-navy-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-primary-700">
            <KeyRound size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.12em]">Mot de passe admin</p>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-700">Mot de passe actuel</label>
            <input type="password" {...passwordForm.register("currentPassword")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {passwordForm.formState.errors.currentPassword && <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Nouveau mot de passe</label>
            <input type="password" {...passwordForm.register("newPassword")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {passwordForm.formState.errors.newPassword && <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Confirmer le mot de passe</label>
            <input type="password" {...passwordForm.register("confirmPassword")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {passwordForm.formState.errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={updatePasswordMutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 disabled:opacity-60">
            {updatePasswordMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
