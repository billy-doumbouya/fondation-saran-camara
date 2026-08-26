"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { eventSchema, type EventFormValues } from "@/lib/validations";
import type { EventItem } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils";
import { playConfirmSound } from "@/lib/sound";

async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Erreur de chargement.");
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({ resolver: yupResolver(eventSchema), defaultValues: { published: true } });

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", description: "", location: "", startAt: "", endAt: "", published: true });
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
      toast.success("Événement enregistré.");
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

  const columns: DataTableColumn<EventItem>[] = [
    { header: "Titre", render: (r) => <span className="font-medium text-navy-800">{r.title}</span> },
    { header: "Date", render: (r) => formatDateTime(r.startAt) },
    { header: "Lieu", render: (r) => r.location ?? "—" },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50">
            <Pencil size={15} />
          </button>
          <button type="button" onClick={() => confirm("Supprimer cet événement ?") && deleteMutation.mutate(r.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
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
          <h1 className="font-display text-2xl font-bold text-navy-900">Agenda / Événements</h1>
          <p className="mt-1 text-navy-500">Gérez les événements affichés sur le site.</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          <Plus size={16} /> Nouvel événement
        </button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={items} isLoading={isLoading} keyField="id" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'événement" : "Nouvel événement"}>
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700">Titre</label>
            <input {...register("title")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy-700">Début</label>
              <input type="datetime-local" {...register("startAt")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              {errors.startAt && <p className="mt-1 text-xs text-red-600">{errors.startAt.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700">Fin (optionnel)</label>
              <input type="datetime-local" {...register("endAt")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Lieu</label>
            <input {...register("location")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700">Description</label>
            <textarea rows={3} {...register("description")} className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

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
