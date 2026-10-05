"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, User } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validations";
import type { TeamMember } from "@/lib/db/schema";
import { playConfirmSound } from "@/lib/sound";
import { useAdminUIStore } from "@/lib/store";

const ORGAN_LABELS: Record<string, string> = {
  fondatrice: "Fondatrice & Direction",
  bureau: "Bureau Exécutif",
  ca: "Conseil d'Administration",
};

async function fetchTeam(): Promise<TeamMember[]> {
  const res = await fetch("/api/team");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

export default function AdminTeamPage() {
  const imageUploadInProgress = useAdminUIStore((state) => state.activeImageUploadIds.length > 0);
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-team"], queryFn: fetchTeam });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    resolver: yupResolver(teamMemberSchema),
    defaultValues: {
      fullName: "",
      role: "",
      organBody: "bureau",
      displayOrder: 0,
      photoUrl: null,
      photoPublicId: null,
    },
  });

  const photoUrl = watch("photoUrl");
  const photoPublicId = watch("photoPublicId");

  const openCreate = () => {
    setEditing(null);
    reset({
      fullName: "",
      role: "",
      bio: "",
      organBody: "bureau",
      displayOrder: 0,
      photoUrl: null,
      photoPublicId: null,
    });
    setModalOpen(true);
  };

  const openEdit = (item: TeamMember) => {
    setEditing(item);
    reset({
      fullName: item.fullName,
      role: item.role,
      bio: item.bio ?? "",
      organBody: (item.organBody as "bureau" | "ca" | "fondatrice") ?? "bureau",
      displayOrder: item.displayOrder,
      photoUrl: item.photoUrl,
      photoPublicId: item.photoPublicId,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: TeamMemberFormValues) => {
      const url = editing ? `/api/team/${editing.id}` : "/api/team";
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
      toast.success(editing ? "Membre mis à jour." : "Nouveau membre ajouté.");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      setModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
    },
    onSuccess: () => {
      toast.success("Membre supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    },
  });

  const columns: DataTableColumn<TeamMember>[] = [
    {
      header: "Photo",
      render: (r) =>
        r.photoUrl ? (
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-primary-200 bg-navy-50">
            <Image src={r.photoUrl} alt={r.fullName} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-100 text-navy-400">
            <User size={20} />
          </div>
        ),
      className: "w-16",
    },
    {
      header: "Nom complet",
      render: (r) => (
        <div>
          <span className="font-semibold text-navy-900 block">{r.fullName}</span>
          <span className="text-xs text-navy-500">{r.role}</span>
        </div>
      ),
    },
    {
      header: "Organe de rattachement",
      render: (r) => (
        <span className="inline-flex rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-800">
          {ORGAN_LABELS[r.organBody ?? "bureau"]}
        </span>
      ),
    },
    {
      header: "Ordre",
      render: (r) => <span className="font-mono text-xs text-navy-500">#{r.displayOrder}</span>,
      className: "w-20",
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Gouvernance & Équipe</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Équipe & Conseil d&apos;Administration</h1>
            <p className="mt-1 text-sm text-navy-500">
              Gérez les membres de la fondatrice, du bureau exécutif et des organes consultatifs de la FSCPE.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <Plus size={16} /> Nouveau membre
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier le membre" : "Ajouter un membre à l'équipe"}
        badge="Gouvernance FSCPE"
        description="Renseignez le nom, la fonction, la biographie et la photo officielle."
        size="xl"
      >
        <form onSubmit={handleSubmit((v) => {
          if (!imageUploadInProgress) saveMutation.mutate(v);
        })} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy-800">Nom complet</label>
              <input
                {...register("fullName")}
                placeholder="Ex: Saran Camara"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-navy-800">Fonction / Titre</label>
              <input
                {...register("role")}
                placeholder="Ex: Présidente & Fondatrice ou Secrétaire Général"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy-800">Organe statutaire</label>
              <select
                {...register("organBody")}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option value="fondatrice">Fondatrice & Direction</option>
                <option value="bureau">Bureau Exécutif</option>
                <option value="ca">Conseil d&apos;Administration</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy-800">Ordre d&apos;affichage (priorité)</label>
              <input
                type="number"
                {...register("displayOrder")}
                placeholder="Ex: 0 (premier), 1, 2..."
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Biographie / Présentation</label>
            <textarea
              rows={4}
              {...register("bio")}
              placeholder="Ex: Juriste de formation et engagée depuis plus de 15 ans pour les droits fondamentaux des enfants en Guinée, elle coordonne les actions humanitaires..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Photo avec Cloudinary multi-sources */}
          <div>
            <ImageUploader
              label="Portrait officiel"
              description="Photo de portrait professionnelle (Local, Google Drive, Dropbox)."
              value={photoUrl ? { url: photoUrl, publicId: photoPublicId ?? undefined } : null}
              onChange={(v) => {
                setValue("photoUrl", v?.url ?? null, { shouldValidate: true });
                setValue("photoPublicId", v?.publicId ?? null);
              }}
              folder="fscpe/team"
              aspectRatio="square"
            />
            {errors.photoUrl && <p className="mt-1 text-xs text-red-600">{errors.photoUrl.message}</p>}
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
              {editing ? "Mettre à jour" : "Ajouter le membre"}
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
        title="Supprimer ce membre ?"
        description="Cette action est définitive. Le membre sera retiré de la gouvernance affichée."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
