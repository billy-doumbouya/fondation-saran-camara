"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  siteSettingsSchema,
  adminPasswordUpdateSchema,
  type SiteSettingsFormValues,
  type AdminPasswordUpdateFormValues,
} from "@/lib/validations";
import { DEFAULT_BRAND } from "@/lib/site-data";
import { useAdminUIStore } from "@/lib/store";

async function fetchSettings(): Promise<SiteSettingsFormValues> {
  const res = await fetch("/api/admin/settings");
  if (!res.ok) throw new Error("Erreur de chargement des paramètres.");
  return res.json();
}

export default function AdminSettingsPage() {
  const imageUploadInProgress = useAdminUIStore((state) => state.activeImageUploadIds.length > 0);
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: fetchSettings,
  });

  // États pour afficher/masquer les mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.success("Mot de passe mis à jour avec succès.");
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

  const currentPosterUrl = settingsForm.watch("heroPosterUrl");

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Configuration</p>
        <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Paramètres & Accès de la plateforme</h1>
        <p className="mt-1 text-sm text-navy-500">
          Gérez l’identité publique de la fondation, les coordonnées, les médias d’accueil et vos identifiants administrateur.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Formulaire des paramètres du site */}
        <form
          onSubmit={settingsForm.handleSubmit((v) => {
            if (!imageUploadInProgress) saveSettingsMutation.mutate(v);
          })}
          className="space-y-5 rounded-[28px] border border-navy-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-2 text-primary-700">
            <ShieldCheck size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.12em]">Profil de la fondation</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy-700">Nom usuel</label>
              <input
                {...settingsForm.register("name")}
                placeholder="Ex: FSCPE"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.name && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">Sigle</label>
              <input
                {...settingsForm.register("acronym")}
                placeholder="Ex: FSCPE"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.acronym && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.acronym.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Nom officiel complet</label>
              <input
                {...settingsForm.register("fullName")}
                placeholder="Ex: Fondation Saran Camara pour la Protection de l'Enfance"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Slogan de la fondation</label>
              <input
                {...settingsForm.register("slogan")}
                placeholder="Ex: Protéger, éduquer et offrir un avenir à chaque enfant en Guinée."
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.slogan && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.slogan.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">Nom de la fondatrice</label>
              <input
                {...settingsForm.register("founderName")}
                placeholder="Ex: Mme Saran Camara"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.founderName && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.founderName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">Email officiel</label>
              <input
                {...settingsForm.register("email")}
                placeholder="Ex: contact@fscpe.org"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Siège social / Adresse</label>
              <input
                {...settingsForm.register("address")}
                placeholder="Ex: Quartier Matam Lido, Commune de Matam, Conakry, Guinée"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.address && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">Téléphone principal</label>
              <input
                {...settingsForm.register("phone")}
                placeholder="Ex: +224 622 00 00 00"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.phone && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">Téléphone secondaire (optionnel)</label>
              <input
                {...settingsForm.register("phoneSecondary")}
                placeholder="Ex: +224 664 00 00 00"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">WhatsApp (chiffres sans +)</label>
              <input
                {...settingsForm.register("whatsappNumber")}
                placeholder="Ex: 224622000000"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.whatsappNumber && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.whatsappNumber.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700">WhatsApp (libellé d'affichage)</label>
              <input
                {...settingsForm.register("whatsappDisplay")}
                placeholder="Ex: +224 622 00 00 00"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.whatsappDisplay && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.whatsappDisplay.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Citation phare</label>
              <textarea
                rows={3}
                {...settingsForm.register("quote")}
                placeholder="Ex: Donner à chaque orphelin et enfant vulnérable les moyens de construire son propre avenir."
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.quote && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.quote.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy-700">Vidéo d’accueil (URL directe MP4)</label>
              <input
                {...settingsForm.register("heroVideoUrl")}
                placeholder="Ex: https://res.cloudinary.com/fscpe/video/upload/v1/hero-bg.mp4"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {settingsForm.formState.errors.heroVideoUrl && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.heroVideoUrl.message}</p>
              )}
            </div>

            {/* Poster d’accueil avec le widget Cloudinary multi-sources */}
            <div className="md:col-span-2 pt-2 border-t border-navy-100">
              <ImageUploader
                label="Poster d’accueil (Image de couverture Hero)"
                description="Image affichée en fond avant le lancement de la vidéo ou sur les écrans mobiles."
                value={currentPosterUrl ? { url: currentPosterUrl } : null}
                onChange={(img) => settingsForm.setValue("heroPosterUrl", img?.url || null, { shouldDirty: true })}
                folder="fscpe/brand"
                aspectRatio="video"
              />
              {settingsForm.formState.errors.heroPosterUrl && (
                <p className="mt-1 text-xs text-red-600">{settingsForm.formState.errors.heroPosterUrl.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saveSettingsMutation.isPending || imageUploadInProgress}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 disabled:opacity-60 min-h-[44px]"
          >
            {saveSettingsMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            <Save size={16} /> Enregistrer les paramètres
          </button>
        </form>

        {/* Formulaire de mot de passe avec gestion des icônes yeux (Eye / EyeOff) */}
        <div className="space-y-6">
          <form
            onSubmit={passwordForm.handleSubmit((v) => updatePasswordMutation.mutate(v))}
            className="space-y-5 rounded-[28px] border border-navy-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center gap-2 text-primary-700">
              <KeyRound size={18} />
              <p className="text-sm font-semibold uppercase tracking-[0.12em]">Mot de passe administrateur</p>
            </div>
            <p className="text-xs text-navy-500">
              Assurez la sécurité de votre espace de gestion en choisissant un mot de passe fort d&apos;au moins 8 caractères.
            </p>

            {/* Mot de passe actuel */}
            <div>
              <label className="text-sm font-medium text-navy-700">Mot de passe actuel</label>
              <div className="relative mt-1.5">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  {...passwordForm.register("currentPassword")}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-navy-200 px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 transition-colors p-1"
                  aria-label={showCurrentPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label className="text-sm font-medium text-navy-700">Nouveau mot de passe</label>
              <div className="relative mt-1.5">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...passwordForm.register("newPassword")}
                  placeholder="Minimum 8 caractères (ex: FSCPE_2026!#)"
                  className="w-full rounded-xl border border-navy-200 px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 transition-colors p-1"
                  aria-label={showNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label className="text-sm font-medium text-navy-700">Confirmer le nouveau mot de passe</label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...passwordForm.register("confirmPassword")}
                  placeholder="Répétez à l'identique le nouveau mot de passe"
                  className="w-full rounded-xl border border-navy-200 px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 transition-colors p-1"
                  aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-navy-800 disabled:opacity-60 min-h-[44px]"
            >
              {updatePasswordMutation.isPending && <Loader2 className="animate-spin" size={16} />}
              Mettre à jour le mot de passe
            </button>
          </form>

          {/* Conseils de sécurité */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Sparkles size={14} /> Conseil de sécurité FSCPE
            </div>
            <p className="text-emerald-700">
              Utilisez des lettres majuscules, minuscules, des chiffres et des symboles pour renforcer la sécurité de la session d&apos;administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
