"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { newsSchema, type NewsFormValues } from "@/lib/validations";
import type { News } from "@/lib/db/schema";
import { formatDate, slugify } from "@/lib/utils";
import { playConfirmSound } from "@/lib/sound";

async function fetchNews(): Promise<News[]> {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

export default function AdminNewsPage() {
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
  } = useForm<NewsFormValues>({ resolver: yupResolver(newsSchema), defaultValues: { published: false } });

  const coverImageUrl = watch("coverImageUrl");
  const coverImagePublicId = watch("coverImagePublicId");

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", slug: "", excerpt: "", content: "", published: false, coverImageUrl: null, coverImagePublicId: null });
    setModalOpen(true);
  };

  const openEdit = (item: News) => {
    setEditing(item);
    reset({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      published: item.published,
      coverImageUrl: item.coverImageUrl,
      coverImagePublicId: item.coverImagePublicId,
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
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Échec de l'enregistrement.");
      }
      return res.json();
    },
    onSuccess: () => {
      playConfirmSound();
      toast.success(editing ? "Article mis à jour." : "Article créé.");
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
    onError: (err: Error) => toast.error(err.message),
  });

  const columns: DataTableColumn<News>[] = [
    { header: "Titre", render: (r) => <span className="font-medium text-navy-800">{r.title}</span> },
    {
      header: "Statut",
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            r.published ? "bg-primary-100 text-primary-700" : "bg-navy-100 text-navy-500"
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
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50">
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      className: "w-28",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="space-y-6">
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Gestion éditoriale</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Actualités / Blog</h1>
            <p className="mt-1 text-sm text-navy-500">Gérez les articles publiés sur le site.</p>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'article" : "Nouvel article"}>
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700">Titre</label>
            <input
              {...register("title")}
              onChange={(e) => {
                register("title").onChange(e);
                if (!editing) setValue("slug", slugify(e.target.value));
              }}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Slug (URL)</label>
            <input
              {...register("slug")}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Résumé</label>
            <textarea
              rows={2}
              {...register("excerpt")}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Contenu</label>
            <textarea
              rows={6}
              {...register("content")}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
          </div>

          <ImageUploader
            label="Image de couverture"
            value={coverImageUrl && coverImagePublicId ? { url: coverImageUrl, publicId: coverImagePublicId } : null}
            onChange={(v) => {
              setValue("coverImageUrl", v?.url ?? null);
              setValue("coverImagePublicId", v?.publicId ?? null);
            }}
          />

          <label className="flex items-center gap-2 text-sm text-navy-700">
            <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-navy-300" />
            Publier immédiatement
          </label>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Enregistrer
          </button>
        </form>
      </Modal>
      <ConfirmationModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); setDeleteId(null); }}
        title="Supprimer cet article ?"
        description="Cette action est définitive. L’article sera retiré de votre espace d’administration."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
