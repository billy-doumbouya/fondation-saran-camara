"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Star, User } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validations";
import type { Testimonial } from "@/lib/db/schema";
import { playConfirmSound } from "@/lib/sound";
import { useAdminUIStore } from "@/lib/store";

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch("/api/testimonials");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

export default function AdminTestimonialsPage() {
  const imageUploadInProgress = useAdminUIStore((state) => state.activeImageUploadIds.length > 0);
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: fetchTestimonials,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: yupResolver(testimonialSchema),
    defaultValues: {
      authorName: "",
      authorRole: "",
      quote: "",
      rating: 5,
      published: true,
      photoUrl: null,
      photoPublicId: null,
    },
  });

  const photoUrl = watch("photoUrl");
  const photoPublicId = watch("photoPublicId");

  const openCreate = () => {
    setEditing(null);
    reset({
      authorName: "",
      authorRole: "",
      quote: "",
      rating: 5,
      published: true,
      photoUrl: null,
      photoPublicId: null,
    });
    setModalOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditing(item);
    reset({
      authorName: item.authorName,
      authorRole: item.authorRole ?? "",
      quote: item.quote,
      rating: item.rating ?? 5,
      published: item.published,
      photoUrl: item.photoUrl,
      photoPublicId: item.photoPublicId,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: TestimonialFormValues) => {
      const url = editing ? `/api/testimonials/${editing.id}` : "/api/testimonials";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Échec de l'enregistrement.");
      return res.json();
    },
    onSuccess: () => {
      playConfirmSound();
      toast.success(editing ? "Témoignage mis à jour." : "Témoignage enregistré.");
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      setModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
    },
    onSuccess: () => {
      toast.success("Témoignage supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
  });

  const columns: DataTableColumn<Testimonial>[] = [
    {
      header: "Photo",
      render: (r) =>
        r.photoUrl ? (
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-primary-200 bg-navy-50">
            <Image src={r.photoUrl} alt={r.authorName} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-100 text-navy-400">
            <User size={18} />
          </div>
        ),
      className: "w-16",
    },
    {
      header: "Auteur & Rôle",
      render: (r) => (
        <div>
          <span className="font-semibold text-navy-900 block">{r.authorName}</span>
          <span className="text-xs text-navy-500">{r.authorRole ?? "Bénéficiaire / Partenaire"}</span>
        </div>
      ),
    },
    {
      header: "Témoignage",
      render: (r) => <p className="text-xs text-navy-600 line-clamp-2 max-w-sm">&ldquo;{r.quote}&rdquo;</p>,
    },
    {
      header: "Note",
      render: (r) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
          <Star size={12} className="fill-amber-400 text-amber-500" /> {r.rating} / 5
        </span>
      ),
      className: "w-24",
    },
    {
      header: "Statut",
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            r.published ? "bg-emerald-100/80 text-emerald-800" : "bg-navy-100 text-navy-600"
          }`}
        >
          {r.published ? "Visible" : "Masqué"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors shadow-2xs"
            title="Modifier"
            aria-label="Modifier"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-2xs"
            title="Supprimer"
            aria-label="Supprimer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      className: "w-28 text-right",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Confiance & Témoignages</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Témoignages & Retours d&apos;Expérience</h1>
            <p className="mt-1 text-sm text-navy-500">
              Valorisez la voix des bénéficiaires, familles, bénévoles et partenaires de la FSCPE.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <Plus size={16} /> Nouveau témoignage
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier le témoignage" : "Ajouter un témoignage"}
        badge="Témoignages FSCPE"
        description="Partagez l'impact concret de la fondation à travers les mots de ses bénéficiaires."
        size="xl"
      >
        <form onSubmit={handleSubmit((v) => {
          if (!imageUploadInProgress) saveMutation.mutate(v);
        })} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy-800">Nom complet de l&apos;auteur</label>
              <input
                {...register("authorName")}
                placeholder="Ex: Aminata Diallo"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {errors.authorName && <p className="mt-1 text-xs text-red-600">{errors.authorName.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-navy-800">Rôle / Qualité</label>
              <input
                {...register("authorRole")}
                placeholder="Ex: Mère de famille bénéficiaire, Commune de Matam"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Témoignage (Citation)</label>
            <textarea
              rows={4}
              {...register("quote")}
              placeholder="Ex: Grâce à la Fondation Saran Camara, mes enfants ont reçu leurs kits scolaires complets et leurs uniformes dès la rentrée. C'est une bénédiction pour notre famille..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.quote && <p className="mt-1 text-xs text-red-600">{errors.quote.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Évaluation (Note sur 5)</label>
            <input
              type="number"
              min={1}
              max={5}
              {...register("rating")}
              placeholder="5"
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Photo avec Cloudinary multi-sources */}
          <div>
            <ImageUploader
              label="Photo de l'auteur (optionnel)"
              description="Portrait du témoin (Local, Google Drive, Dropbox)."
              value={photoUrl ? { url: photoUrl, publicId: photoPublicId ?? undefined } : null}
              onChange={(v) => {
                setValue("photoUrl", v?.url ?? null, { shouldValidate: true });
                setValue("photoPublicId", v?.publicId ?? null);
              }}
              folder="fscpe/testimonials"
              aspectRatio="square"
            />
          </div>

          <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("published")}
                className="h-4 w-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-navy-800">
                Afficher publiquement ce témoignage dans le carrousel du site
              </span>
            </label>
          </div>

          {/* Footer d'action collant (sticky) pour garantir l'accessibilité sur mobile */}
          <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-8 sm:-mb-6 mt-6 px-5 py-3.5 sm:px-8 bg-white/95 backdrop-blur-md border-t border-navy-100 flex items-center justify-end gap-3 z-30 shadow-[0_-8px_16px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-600 hover:bg-navy-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending || imageUploadInProgress}
              className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:opacity-60 transition-all min-h-[42px]"
            >
              {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
              {editing ? "Mettre à jour" : "Enregistrer le témoignage"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        title="Supprimer ce témoignage ?"
        description="Cette action est définitive. Le témoignage sera retiré du site."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
