"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ImageIcon } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { newsSchema, type NewsFormValues } from "@/lib/validations";
import type { News } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { playConfirmSound } from "@/lib/sound";
import { useAdminUIStore } from "@/lib/store";

async function fetchNews(): Promise<News[]> {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminNewsPage() {
  const imageUploadInProgress = useAdminUIStore((state) => state.activeImageUploadIds.length > 0);
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-news"], queryFn: fetchNews });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: yupResolver(newsSchema),
    defaultValues: { published: false },
  });

  const coverImageUrl = watch("coverImageUrl");
  const coverImagePublicId = watch("coverImagePublicId");

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: null,
      coverImagePublicId: null,
      published: false,
    });
    setModalOpen(true);
  };

  const openEdit = (item: News) => {
    setEditing(item);
    reset({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      coverImageUrl: item.coverImageUrl,
      coverImagePublicId: item.coverImagePublicId,
      published: item.published,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: NewsFormValues) => {
      const url = editing ? `/api/news/${editing.id}` : "/api/news";
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
      toast.success(editing ? "Article mis à jour." : "Article créé avec succès.");
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      setModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
    },
    onSuccess: () => {
      toast.success("Article supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
    },
  });

  const columns: DataTableColumn<News>[] = [
    {
      header: "Aperçu",
      render: (r) =>
        r.coverImageUrl ? (
          <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-navy-100 bg-navy-50">
            <Image src={r.coverImageUrl} alt={r.title} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-navy-200 bg-navy-50 text-navy-400">
            <ImageIcon size={18} />
          </div>
        ),
      className: "w-20",
    },
    {
      header: "Titre de l'article",
      render: (r) => (
        <div>
          <span className="font-semibold text-navy-900 block">{r.title}</span>
          <span className="text-xs text-navy-400 font-mono">/{r.slug}</span>
        </div>
      ),
    },
    {
      header: "Statut",
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            r.published ? "bg-emerald-100/80 text-emerald-800" : "bg-navy-100 text-navy-600"
          }`}
        >
          {r.published ? "Publié" : "Brouillon"}
        </span>
      ),
    },
    { header: "Créé le", render: (r) => formatDate(r.createdAt) },
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Gestion éditoriale</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Actualités & Blog FSCPE</h1>
            <p className="mt-1 text-sm text-navy-500">
              Rédigez et publiez les articles, rapports d’activités et communiqués de la fondation.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <Plus size={16} /> Nouvel article
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier l'article" : "Rédiger un nouvel article"}
        badge="Actualités FSCPE"
        description="Complétez les informations pour la publication sur le blog et les réseaux."
        size="2xl"
      >
        <form onSubmit={handleSubmit((v) => {
          if (!imageUploadInProgress) saveMutation.mutate(v);
        })} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-navy-800">Titre de l&apos;article</label>
              <input
                {...register("title")}
                placeholder="Ex: Distribution de kits scolaires et rentrée solidaire pour 500 orphelins"
                onChange={(e) => {
                  register("title").onChange(e);
                  if (!editing) setValue("slug", slugify(e.target.value));
                }}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-navy-800">Identifiant d&apos;URL (Slug)</label>
              <div className="relative mt-1.5 flex items-center">
                <span className="absolute left-3 text-xs text-navy-400 font-mono">/actualites/</span>
                <input
                  {...register("slug")}
                  placeholder="distribution-kits-scolaires-rentree-solidaire"
                  className="w-full rounded-xl border border-navy-200 pl-24 pr-4 py-2.5 text-sm font-mono outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Résumé court (Chapeau)</label>
            <textarea
              rows={2}
              {...register("excerpt")}
              placeholder="Ex: À l'occasion de la rentrée 2026, la Fondation Saran Camara s'est mobilisée dans les quartiers vulnérables de Conakry pour garantir la scolarisation..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Contenu intégral de l&apos;article</label>
            <textarea
              rows={7}
              {...register("content")}
              placeholder="Ex: Rédigez les détails de l'action menée, les témoignages des bénéficiaires, les déclarations des partenaires et les perspectives futures..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
          </div>

          {/* Image de couverture avec Cloudinary multi-sources */}
          <div>
            <ImageUploader
              label="Image de couverture de l'article"
              description="Affiche principale de l'article (Local, Google Drive, Dropbox)."
              value={coverImageUrl ? { url: coverImageUrl, publicId: coverImagePublicId ?? undefined } : null}
              onChange={(v) => {
                setValue("coverImageUrl", v?.url ?? null, { shouldValidate: true });
                setValue("coverImagePublicId", v?.publicId ?? null);
              }}
              folder="fscpe/news"
              aspectRatio="video"
            />
            {errors.coverImageUrl && <p className="mt-1 text-xs text-red-600">{errors.coverImageUrl.message}</p>}
          </div>

          <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("published")}
                className="h-4 w-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-navy-800">
                Mettre en ligne cet article immédiatement (visible par tous les visiteurs)
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
              {editing ? "Mettre à jour l'article" : "Publier l'article"}
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
        title="Supprimer cet article ?"
        description="Cette action est définitive. L’article sera retiré du site web et des archives publiques."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
