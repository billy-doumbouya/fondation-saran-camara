"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import type { GalleryImage } from "@/lib/db/schema";
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS, type GalleryCategory } from "@/lib/site-data";
import { playConfirmSound } from "@/lib/sound";

async function fetchGallery(): Promise<GalleryImage[]> {
  const res = await fetch("/api/gallery");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-gallery"], queryFn: fetchGallery });
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryCategory | "">("");
  const [pending, setPending] = useState<{ url: string; publicId: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!pending) throw new Error("Veuillez téléverser une image.");
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          category: category || null,
          imageUrl: pending.url,
          imagePublicId: pending.publicId,
        }),
      });
      if (!res.ok) throw new Error("Échec de l'enregistrement.");
      return res.json();
    },
    onSuccess: () => {
      playConfirmSound();
      toast.success("Photo ajoutée à la galerie.");
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      setModalOpen(false);
      setTitle("");
      setCategory("");
      setPending(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
    },
    onSuccess: () => {
      toast.success("Photo supprimée.");
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="space-y-6">
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Médias</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Galerie photos</h1>
            <p className="mt-1 text-sm text-navy-500">Ajoutez ou retirez des photos de la galerie publique.</p>
          </div>
          <button type="button" onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700">
            <Plus size={16} /> Ajouter une photo
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[24px] border border-navy-100 bg-white p-8 text-center text-navy-400 shadow-[0_12px_35px_rgba(16,26,46,0.04)]">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="rounded-[24px] border border-navy-100 bg-white p-8 text-center text-navy-400 shadow-[0_12px_35px_rgba(16,26,46,0.04)]">Aucune photo pour le moment.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((img) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="group relative h-40 overflow-hidden rounded-[22px] border border-navy-100 bg-white shadow-[0_12px_30px_rgba(16,26,46,0.04)]">
              <Image src={img.imageUrl} alt={img.title ?? ""} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => setDeleteId(img.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter une photo">
        <div className="space-y-4">
          <ImageUploader label="Photo" value={pending} onChange={setPending} folder="fscpe/galerie" />
          <div>
            <label className="text-sm font-medium text-navy-700">Titre (optionnel)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory((e.target.value as GalleryCategory) || "")}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Aucune catégorie</option>
              {GALLERY_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {GALLERY_CATEGORY_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            Ajouter à la galerie
          </button>
        </div>
      </Modal>
      <ConfirmationModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); setDeleteId(null); }} title="Supprimer cette photo ?" description="Cette action est définitive. La photo sera retirée de la galerie publique." confirmLabel="Supprimer" destructive isPending={deleteMutation.isPending} />
    </motion.div>
  );
}
