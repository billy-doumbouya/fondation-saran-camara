"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Mail, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import type { ContactMessage } from "@/lib/db/schema";

async function fetchMessages(): Promise<ContactMessage[]> {
  const res = await fetch("/api/admin/messages", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur de chargement des messages.");
  return res.json();
}

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: fetchMessages });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items]
  );

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erreur lors de la mise à jour.");
      }
    },
    onSuccess: () => {
      toast.success("Message marqué comme lu.");
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      window.dispatchEvent(new Event("admin-notifications-refresh"));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erreur lors de la suppression.");
      }
    },
    onSuccess: () => {
      toast.success("Message supprimé.");
      setMessageToDelete(null);
      setSelectedId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const selectedMessage = sortedItems.find((message) => message.id === selectedId) ?? null;

  const columns: DataTableColumn<ContactMessage>[] = [
    { header: "Nom", render: (row) => <span className="font-medium text-navy-800">{row.name}</span> },
    { header: "Email", render: (row) => <span className="text-navy-600">{row.email}</span> },
    { header: "Objet", render: (row) => <span className="text-navy-600">{row.subject || "—"}</span> },
    {
      header: "Statut",
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            row.isRead ? "bg-primary-100 text-primary-700" : "bg-gold-50 text-gold-700"
          }`}
        >
          {row.isRead ? "Lu" : "Nouveau"}
        </span>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedId(row.id)}
            className="rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-medium text-navy-700 hover:border-primary-300 hover:text-primary-700"
          >
            Voir
          </button>
          {!row.isRead && (
            <button
              type="button"
              onClick={() => markReadMutation.mutate(row.id)}
              disabled={markReadMutation.isPending}
              aria-label={`Marquer le message de ${row.name} comme lu`}
              title="Marquer comme lu"
              className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-1.5 text-xs font-semibold text-primary-700 hover:border-primary-300 hover:bg-primary-100 disabled:cursor-wait disabled:opacity-60"
            >
              {markReadMutation.isPending && markReadMutation.variables === row.id ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CheckCheck size={13} />
              )}
              Marquer lu
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="space-y-6">
      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Boîte de réception</p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">Messages reçus</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
            <Mail size={16} /> {sortedItems.filter((item) => !item.isRead).length} non lus
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable columns={columns} rows={sortedItems} isLoading={isLoading} keyField="id" emptyLabel="Aucun message reçu pour le moment." />

        <div className="flex min-h-55 flex-col rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] xl:min-h-[calc(100dvh-19rem)]">
          {!selectedMessage ? (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-navy-500">
              Sélectionnez un message pour le lire.
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600">Message</p>
                  <h2 className="font-display mt-1 text-xl font-semibold text-navy-900">{selectedMessage.subject || "Sans objet"}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!selectedMessage.isRead && (
                    <button
                      type="button"
                      onClick={() => markReadMutation.mutate(selectedMessage.id)}
                      disabled={markReadMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                    >
                      {markReadMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <CheckCheck size={14} />}
                      Marquer lu
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMessageToDelete(selectedMessage)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl bg-navy-50 p-3 text-sm text-navy-700">
                <p><span className="font-semibold">Nom :</span> {selectedMessage.name}</p>
                <p><span className="font-semibold">Email :</span> {selectedMessage.email}</p>
                {selectedMessage.phone && <p><span className="font-semibold">Téléphone :</span> {selectedMessage.phone}</p>}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-navy-100 bg-white p-4">
                <p className="whitespace-pre-line text-sm leading-7 text-navy-700">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={messageToDelete !== null}
        onClose={() => setMessageToDelete(null)}
        onConfirm={() => messageToDelete && deleteMutation.mutate(messageToDelete.id)}
        title="Supprimer ce message ?"
        description={
          messageToDelete
            ? `Le message de ${messageToDelete.name} sera définitivement supprimé.`
            : "Ce message sera définitivement supprimé."
        }
        confirmLabel="Supprimer"
        isPending={deleteMutation.isPending}
        destructive
      />
    </motion.div>
  );
}
