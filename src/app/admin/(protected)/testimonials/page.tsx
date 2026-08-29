"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validations";
import type { Testimonial } from "@/lib/db/schema";
import { playConfirmSound } from "@/lib/sound";

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch("/api/testimonials");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-testimonials"], queryFn: fetchTestimonials });
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
  } = useForm<TestimonialFormValues>({ resolver: yupResolver(testimonialSchema), defaultValues: { rating: 5, published: true } });

  const photoUrl = watch("photoUrl");
  const photoPublicId = watch("photoPublicId");

  const openCreate = () => {
    setEditing(null);
    reset({ authorName: "", authorRole: "", quote: "", rating: 5, published: true, photoUrl: null, photoPublicId: null });
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
      toast.success("Témoignage enregistré.");
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
    { header: "Auteur", render: (r) => <span className="font-medium text-navy-800">{r.authorName}</span> },
    { header: "Rôle", render: (r) => r.authorRole ?? "—" },
    {
      header: "Note",
      render: (r) => (
        <span className="flex items-center gap-1 text-gold-500">
          <Star size={13} className="fill-gold-400" /> {r.rating}
        </span>
      ),
    },
    {
      header: "Statut",
      render: (r) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.published ? "bg-primary-100 text-primary-700" : "bg-navy-100 text-navy-500"}`}>
          {r.published ? "Publié" : "Masqué"}
        </span>
      ),
    },
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Avis</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Témoignages</h1>
            <p className="mt-1 text-sm text-navy-500">Gérez les témoignages affichés sur le site.</p>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le témoignage" : "Nouveau témoignage"}>
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy-700">Nom</label>
              <input {...register("authorName")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {errors.authorName && <p className="mt-1 text-xs text-red-600">{errors.authorName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Fonction</label>
              <input {...register("authorRole")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Témoignage</label>
            <textarea rows={4} {...register("quote")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {errors.quote && <p className="mt-1 text-xs text-red-600">{errors.quote.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Note (1-5)</label>
            <input type="number" min={1} max={5} {...register("rating")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <ImageUploader
            label="Photo"
            value={photoUrl && photoPublicId ? { url: photoUrl, publicId: photoPublicId } : null}
            onChange={(v) => {
              setValue("photoUrl", v?.url ?? null);
              setValue("photoPublicId", v?.publicId ?? null);
            }}
          />

          <label className="flex items-center gap-2 text-sm text-navy-700">
            <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-navy-300" />
            Afficher publiquement
          </label>

          <button type="submit" disabled={saveMutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Enregistrer
          </button>
        </form>
      </Modal>
      <ConfirmationModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); setDeleteId(null); }} title="Supprimer ce témoignage ?" description="Cette action est définitive. Le témoignage sera retiré du site." confirmLabel="Supprimer" destructive isPending={deleteMutation.isPending} />
    </motion.div>
  );
}
