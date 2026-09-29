"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, ExternalLink, Tag } from "lucide-react";
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
  const [pending, setPending] = useState<{ url: string; publicId?: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!pending?.url) throw new Error("Veuillez téléverser une image.");
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          category: category || null,
          imageUrl: pending.url,
          imagePublicId: pending.publicId || "fscpe_gallery_" + Date.now(),
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Médiathèque</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Galerie Photos & Reportages</h1>
            <p className="mt-1 text-sm text-navy-500">
              Gérez les photographies des actions de terrain, cérémonies et missions de la fondation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setCategory("");
              setPending(null);
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <Plus size={16} /> Ajouter une photo
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-[24px] border border-navy-100 bg-white p-8 text-center text-sm text-navy-400 shadow-sm">
          <Loader2 className="mr-2 animate-spin text-primary-600" size={18} /> Chargement de la galerie...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-navy-200 bg-white p-12 text-center text-navy-400">
          <p className="text-sm font-medium">Aucune photo dans la galerie pour le moment.</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:underline"
          >
            <Plus size={14} /> Téléverser une première photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="group relative h-48 overflow-hidden rounded-[22px] border border-navy-100 bg-white shadow-[0_12px_30px_rgba(16,26,46,0.04)]"
            >
              <Image
                src={img.imageUrl}
                alt={img.title ?? "Photo FSCPE"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Bouton de suppression et lien plein écran */}
              <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={img.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
                  title="Voir en grand"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => setDeleteId(img.id)}
                  className="rounded-full bg-red-600/90 p-2 text-white hover:bg-red-700 transition-colors"
                  aria-label="Supprimer"
                  title="Supprimer la photo"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Légende et catégorie au survol */}
              <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.category && (
                  <span className="inline-block mb-1 rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    {GALLERY_CATEGORY_LABELS[img.category as GalleryCategory] ?? img.category}
                  </span>
                )}
                {img.title && (
                  <p className="text-xs font-semibold text-white line-clamp-1 drop-shadow">
                    {img.title}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ajouter une photo à la galerie"
        badge="Médiathèque FSCPE"
        description="Chargez une image via le widget Cloudinary (Appareil, URL web, Google Drive, Dropbox ou Caméra)."
        size="lg"
      >
        <div className="space-y-5">
          <ImageUploader
            label="Fichier image"
            description="Format : JPG, PNG, WEBP, AVIF (max 10 Mo)"
            value={pending}
            onChange={setPending}
            folder="fscpe/galerie"
            aspectRatio="video"
          />

          <div>
            <label className="text-sm font-semibold text-navy-800">Titre ou légende (optionnel)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Caravane médicale pédiatrique - Quartier Matam Lido"
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Catégorie thématique</label>
            <div className="relative mt-1.5">
              <select
                value={category}
                onChange={(e) => setCategory((e.target.value as GalleryCategory) || "")}
                className="w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option value="">Sélectionnez une catégorie (recommandé)</option>
                {GALLERY_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {GALLERY_CATEGORY_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-navy-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-600 hover:bg-navy-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !pending?.url}
              className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
              Ajouter à la galerie
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        title="Supprimer cette photo ?"
        description="Cette action est définitive. La photo sera retirée de la galerie publique."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
