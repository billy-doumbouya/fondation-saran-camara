"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Calendar, MapPin, ImageIcon } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { eventSchema, type EventFormValues } from "@/lib/validations";
import type { EventItem } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils";
import { playConfirmSound } from "@/lib/sound";

async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Erreur de chargement des événements.");
  return res.json();
}

function toLocalInputValue(date: string | Date) {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-events"], queryFn: fetchEvents });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startAt: "",
      endAt: "",
      coverImageUrl: null,
      coverImagePublicId: null,
      published: true,
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "",
      description: "",
      location: "",
      startAt: "",
      endAt: "",
      coverImageUrl: null,
      coverImagePublicId: null,
      published: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: EventItem) => {
    setEditing(item);
    reset({
      title: item.title,
      description: item.description ?? "",
      location: item.location ?? "",
      startAt: toLocalInputValue(item.startAt),
      endAt: item.endAt ? toLocalInputValue(item.endAt) : "",
      coverImageUrl: item.coverImageUrl ?? null,
      coverImagePublicId: null,
      published: item.published,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const url = editing ? `/api/events/${editing.id}` : "/api/events";
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
      toast.success(editing ? "Événement mis à jour." : "Nouvel événement créé avec succès.");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
    },
    onSuccess: () => {
      toast.success("Événement supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const coverImageUrl = watch("coverImageUrl");

  const columns: DataTableColumn<EventItem>[] = [
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
      header: "Titre de l'événement",
      render: (r) => (
        <div>
          <span className="font-semibold text-navy-900 block">{r.title}</span>
          {r.description && <span className="text-xs text-navy-500 line-clamp-1">{r.description}</span>}
        </div>
      ),
    },
    {
      header: "Date & Heure",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-navy-700 font-medium">
          <Calendar size={13} className="text-primary-600" />
          {formatDateTime(r.startAt)}
        </span>
      ),
    },
    {
      header: "Lieu",
      render: (r) =>
        r.location ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-navy-600">
            <MapPin size={13} className="text-navy-400" />
            {r.location}
          </span>
        ) : (
          <span className="text-navy-400">—</span>
        ),
    },
    {
      header: "Statut",
      render: (r) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            r.published ? "bg-emerald-100/80 text-emerald-800" : "bg-navy-100 text-navy-600"
          }`}
        >
          {r.published ? "Publié" : "Brouillon"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="rounded-lg p-2 text-navy-600 hover:bg-navy-100 transition-colors"
            title="Modifier"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      className: "w-24 text-right",
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Agenda FSCPE</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Agenda & Événements</h1>
            <p className="mt-1 text-sm text-navy-500">
              Planifiez les campagnes de dons, cérémonies, ateliers et activités de terrain de la fondation.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <Plus size={16} /> Nouvel événement
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      {/* Boîte modale de création / édition avec design premium */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier l'événement" : "Créer un nouvel événement"}
        badge="Agenda FSCPE"
        description="Renseignez les détails, la date, le lieu et l'affiche officielle de l'événement."
        size="xl"
      >
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-5">
          {/* Titre */}
          <div>
            <label className="text-sm font-semibold text-navy-800">Titre de l&apos;événement</label>
            <input
              {...register("title")}
              placeholder="Ex: Cérémonie de remise des kits scolaires de la rentrée 2026"
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          {/* Dates de début et fin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy-800">Date et heure de début</label>
              <input
                type="datetime-local"
                {...register("startAt")}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {errors.startAt && <p className="mt-1 text-xs text-red-600">{errors.startAt.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-navy-800">Date et heure de fin (optionnel)</label>
              <input
                type="datetime-local"
                {...register("endAt")}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="text-sm font-semibold text-navy-800">Lieu de l&apos;événement</label>
            <input
              {...register("location")}
              placeholder="Ex: Centre culturel Franco-Guinéen, Conakry ou École Primaire de Matam"
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Image de couverture avec Cloudinary multi-sources */}
          <div>
            <ImageUploader
              label="Affiche / Image de couverture"
              description="Affiche officielle de l'événement (Local, Web URL, Google Drive, Dropbox)."
              value={coverImageUrl ? { url: coverImageUrl } : null}
              onChange={(img) => {
                setValue("coverImageUrl", img?.url || null, { shouldValidate: true });
                setValue("coverImagePublicId", img?.publicId || null);
              }}
              folder="fscpe/events"
              aspectRatio="video"
            />
            {errors.coverImageUrl && <p className="mt-1 text-xs text-red-600">{errors.coverImageUrl.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-navy-800">Description détaillée</label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder="Ex: Distribution de 500 sacs à dos, fournitures complètes et uniformes aux orphelins et enfants défavorisés de la commune de Matam..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Publication */}
          <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("published")}
                className="h-4 w-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-navy-800">
                Publier cet événement immédiatement sur le site public
              </span>
            </label>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-navy-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-600 hover:bg-navy-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:opacity-60 transition-all"
            >
              {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
              {editing ? "Mettre à jour" : "Créer l'événement"}
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
        title="Supprimer cet événement ?"
        description="Cette action est définitive. L’événement sera retiré de votre agenda public."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
