"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import type { GalleryImage } from "@/lib/db/schema";
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
  const [category, setCategory] = useState("");
  const [pending, setPending] = useState<{ url: string; publicId: string } | null>(null);

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
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Galerie photos</h1>
          <p className="mt-1 text-navy-500">Ajoutez ou retirez des photos de la galerie publique.</p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          <Plus size={16} /> Ajouter une photo
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-navy-400">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-navy-400">Aucune photo pour le moment.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((img) => (
            <div key={img.id} className="group relative h-40 overflow-hidden rounded-2xl border border-navy-100">
              <Image src={img.imageUrl} alt={img.title ?? ""} fill className="object-cover" />
              <button
                type="button"
                onClick={() => confirm("Supprimer cette photo ?") && deleteMutation.mutate(img.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
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
            <label className="text-sm font-medium text-navy-700">Catégorie (optionnel)</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
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
    </div>
  );
}
