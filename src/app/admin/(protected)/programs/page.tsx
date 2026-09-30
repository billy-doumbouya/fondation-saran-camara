"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ImageIcon, Users } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import ImageUploader from "@/components/admin/ImageUploader";
import { programSchema, type ProgramFormValues } from "@/lib/validations";
import type { Program } from "@/lib/db/schema";
import { playConfirmSound } from "@/lib/sound";

const PILLAR_LABELS: Record<string, string> = {
  education: "Éducation & Scolarité",
  protection: "Protection & Droits de l'Enfant",
  orphelins: "Soutien aux Orphelins",
  social: "Accompagnement Social & Médical",
};

async function fetchPrograms(): Promise<Program[]> {
  const res = await fetch("/api/programs");
  if (!res.ok) throw new Error("Erreur de chargement des programmes.");
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

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-programs"], queryFn: fetchPrograms });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: yupResolver(programSchema),
    defaultValues: {
      pillar: "education",
      published: true,
      coverImageUrl: null,
      coverImagePublicId: null,
    },
  });

  const coverImageUrl = watch("coverImageUrl");
  const coverImagePublicId = watch("coverImagePublicId");

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "",
      slug: "",
      summary: "",
      content: "",
      pillar: "education",
      beneficiariesCount: undefined,
      published: true,
      coverImageUrl: null,
      coverImagePublicId: null,
    });
    setModalOpen(true);
  };

  const openEdit = (item: Program) => {
    setEditing(item);
    reset({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      pillar: (item.pillar as "education" | "protection" | "orphelins" | "social") ?? "education",
      beneficiariesCount: item.beneficiariesCount ?? undefined,
      published: item.published,
      coverImageUrl: item.coverImageUrl,
      coverImagePublicId: item.coverImagePublicId,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: ProgramFormValues) => {
      const url = editing ? `/api/programs/${editing.id}` : "/api/programs";
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
      toast.success(editing ? "Programme mis à jour." : "Nouveau programme créé.");
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      setModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
    },
    onSuccess: () => {
      toast.success("Programme supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
    },
  });

  const columns: DataTableColumn<Program>[] = [
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
      header: "Programme / Projet",
      render: (r) => (
        <div>
          <span className="font-semibold text-navy-900 block">{r.title}</span>
          <span className="text-xs text-navy-400 font-mono">/{r.slug}</span>
        </div>
      ),
    },
    {
      header: "Pilier d'action",
      render: (r) => (
        <span className="inline-flex rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-800">
          {PILLAR_LABELS[r.pillar ?? "education"]}
        </span>
      ),
    },
    {
      header: "Bénéficiaires",
      render: (r) =>
        r.beneficiariesCount ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
            <Users size={13} /> {r.beneficiariesCount.toLocaleString()} enfants
          </span>
        ) : (
          <span className="text-navy-400">—</span>
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
          {r.published ? "Actif" : "Brouillon"}
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Impact & Piliers</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Programmes & Projets FSCPE</h1>
            <p className="mt-1 text-sm text-navy-500">
              Gérez les initiatives majeures, les objectifs de développement et l’impact chiffré auprès des enfants.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(34,122,63,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <Plus size={16} /> Nouveau programme
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier le programme" : "Nouveau programme humanitaire"}
        badge="Programmes FSCPE"
        description="Renseignez le pilier, le volume d'enfants impactés et l'image d'illustration."
        size="2xl"
      >
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-navy-800">Titre du programme</label>
            <input
              {...register("title")}
              placeholder="Ex: Éducation pour Tous : Bourses et fournitures scolaires pour orphelins"
              onChange={(e) => {
                register("title").onChange(e);
                if (!editing) setValue("slug", slugify(e.target.value));
              }}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Identifiant d&apos;URL (Slug)</label>
            <div className="relative mt-1.5 flex items-center">
              <span className="absolute left-3 text-xs text-navy-400 font-mono">/programmes/</span>
              <input
                {...register("slug")}
                placeholder="education-pour-tous-bourses-fournitures"
                className="w-full rounded-xl border border-navy-200 pl-28 pr-4 py-2.5 text-sm font-mono outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy-800">Pilier stratégique</label>
              <select
                {...register("pillar")}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option value="education">Éducation & Scolarité</option>
                <option value="protection">Protection & Droits de l&apos;Enfant</option>
                <option value="orphelins">Soutien aux Orphelins</option>
                <option value="social">Accompagnement Social & Médical</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy-800">Nombre estimé de bénéficiaires</label>
              <input
                type="number"
                {...register("beneficiariesCount")}
                placeholder="Ex: 850"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Résumé synthétique</label>
            <textarea
              rows={2}
              {...register("summary")}
              placeholder="Ex: Ce programme assure la prise en charge intégrale de la scolarité et du matériel pédagogique pour 850 enfants vulnérables en République de Guinée..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.summary && <p className="mt-1 text-xs text-red-600">{errors.summary.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-navy-800">Présentation détaillée du programme</label>
            <textarea
              rows={6}
              {...register("content")}
              placeholder="Ex: Détaillez les étapes de sélection, les écoles partenaires, le suivi psychologique et nutritionnel dispensé par les équipes terrain de la fondation..."
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
          </div>

          {/* Image de couverture avec Cloudinary multi-sources */}
          <div>
            <ImageUploader
              label="Photo de couverture du programme"
              description="Affiche ou photo de terrain (Local, URL web, Google Drive, Dropbox)."
              value={coverImageUrl ? { url: coverImageUrl, publicId: coverImagePublicId ?? undefined } : null}
              onChange={(v) => {
                setValue("coverImageUrl", v?.url ?? null, { shouldValidate: true });
                setValue("coverImagePublicId", v?.publicId ?? null);
              }}
              folder="fscpe/programs"
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
                Publier ce programme sur la page Programmes & Piliers du site
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
              disabled={saveMutation.isPending}
              className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:opacity-60 transition-all min-h-[42px]"
            >
              {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
              {editing ? "Mettre à jour le programme" : "Créer le programme"}
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
        title="Supprimer ce programme ?"
        description="Cette action est définitive. Le programme sera retiré du site."
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
