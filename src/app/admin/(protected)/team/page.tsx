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
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validations";
import type { TeamMember } from "@/lib/db/schema";
import { playConfirmSound } from "@/lib/sound";

async function fetchTeam(): Promise<TeamMember[]> {
  const res = await fetch("/api/team");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

const ORGAN_LABELS: Record<string, string> = {
  fondatrice: "Fondatrice",
  bureau: "Bureau Exécutif",
  ca: "Conseil d'Administration",
};

export default function AdminTeamPage() {
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
  } = useForm<TeamMemberFormValues>({ resolver: yupResolver(teamMemberSchema), defaultValues: { organBody: "bureau", displayOrder: 0 } });

  const photoUrl = watch("photoUrl");
  const photoPublicId = watch("photoPublicId");

  const openCreate = () => {
    setEditing(null);
    reset({ fullName: "", role: "", bio: "", organBody: "bureau", displayOrder: 0, photoUrl: null, photoPublicId: null });
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
      toast.success("Membre enregistré.");
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
    { header: "Nom", render: (r) => <span className="font-medium text-navy-800">{r.fullName}</span> },
    { header: "Fonction", render: (r) => r.role },
    { header: "Organe", render: (r) => ORGAN_LABELS[r.organBody ?? "bureau"] },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50">
            <Pencil size={15} />
          </button>
          <button type="button" onClick={() => setDeleteId(r.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Gouvernance</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Équipe / Gouvernance</h1>
            <p className="mt-1 text-sm text-navy-500">Fondatrice, Bureau Exécutif et Conseil d&apos;Administration.</p>
          </div>
          <button type="button" onClick={openCreate} className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700">
            <Plus size={16} /> Nouveau membre
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le membre" : "Nouveau membre"}>
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy-700">Nom complet</label>
              <input {...register("fullName")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Fonction</label>
              <input {...register("role")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Organe</label>
            <select {...register("organBody")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
              <option value="fondatrice">Fondatrice</option>
              <option value="bureau">Bureau Exécutif</option>
              <option value="ca">Conseil d&apos;Administration</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Biographie</label>
            <textarea rows={3} {...register("bio")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Ordre d&apos;affichage</label>
            <input type="number" {...register("displayOrder")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <ImageUploader
            label="Photo"
            value={photoUrl && photoPublicId ? { url: photoUrl, publicId: photoPublicId } : null}
            onChange={(v) => {
              setValue("photoUrl", v?.url ?? null);
              setValue("photoPublicId", v?.publicId ?? null);
            }}
          />

          <button type="submit" disabled={saveMutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Enregistrer
          </button>
        </form>
      </Modal>
      <ConfirmationModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); setDeleteId(null); }} title="Supprimer ce membre ?" description="Cette action est définitive. Le membre sera retiré de la gouvernance affichée." confirmLabel="Supprimer" destructive isPending={deleteMutation.isPending} />
    </motion.div>
  );
}
