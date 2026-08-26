"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import { programSchema, type ProgramFormValues } from "@/lib/validations";
import type { Program } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { playConfirmSound } from "@/lib/sound";

async function fetchPrograms(): Promise<Program[]> {
  const res = await fetch("/api/programs");
  if (!res.ok) throw new Error("Erreur de chargement.");
  return res.json();
}

const PILLAR_LABELS: Record<string, string> = {
  education: "Éducation",
  protection: "Protection",
  orphelins: "Aide aux orphelins",
  social: "Action sociale",
};

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-programs"], queryFn: fetchPrograms });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProgramFormValues>({ resolver: yupResolver(programSchema), defaultValues: { pillar: "education", published: true } });

  const coverImageUrl = watch("coverImageUrl");
  const coverImagePublicId = watch("coverImagePublicId");

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", slug: "", summary: "", content: "", pillar: "education", published: true, beneficiariesCount: undefined, coverImageUrl: null, coverImagePublicId: null });
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
      toast.success("Programme enregistré.");
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
    { header: "Titre", render: (r) => <span className="font-medium text-navy-800">{r.title}</span> },
    { header: "Pilier", render: (r) => PILLAR_LABELS[r.pillar ?? "education"] },
    { header: "Bénéficiaires", render: (r) => r.beneficiariesCount ?? "—" },
    {
      header: "Statut",
      render: (r) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.published ? "bg-primary-100 text-primary-700" : "bg-navy-100 text-navy-500"}`}>
          {r.published ? "Publié" : "Brouillon"}
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
          <button type="button" onClick={() => confirm("Supprimer ce programme ?") && deleteMutation.mutate(r.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
            <Trash2 size={15} />
          </button>
        </div>
      ),
      className: "w-28",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Programmes / Projets</h1>
          <p className="mt-1 text-navy-500">Gérez les programmes affichés sur le site.</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          <Plus size={16} /> Nouveau programme
        </button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le programme" : "Nouveau programme"}>
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
            <input {...register("slug")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy-700">Pilier</label>
              <select {...register("pillar")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
                <option value="education">Éducation</option>
                <option value="protection">Protection</option>
                <option value="orphelins">Aide aux orphelins</option>
                <option value="social">Action sociale</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Bénéficiaires (nombre)</label>
              <input type="number" {...register("beneficiariesCount")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Résumé</label>
            <textarea rows={2} {...register("summary")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {errors.summary && <p className="mt-1 text-xs text-red-600">{errors.summary.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Contenu détaillé</label>
            <textarea rows={6} {...register("content")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
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

          <button type="submit" disabled={saveMutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {saveMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Enregistrer
          </button>
        </form>
      </Modal>
    </div>
  );
}
