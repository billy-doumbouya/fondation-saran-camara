"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Download, Mail, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

interface NewsletterSubscriber {
  key: string;
  email: string;
  source: string;
  subscribedAt: string | null;
  ip: string | null;
}

async function fetchSubscribers(): Promise<NewsletterSubscriber[]> {
  const res = await fetch("/api/admin/newsletter", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur de chargement des abonnés.");
  return res.json();
}

function escapeCsv(value: string | null | undefined): string {
  const text = String(value ?? "");
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export default function AdminNewsletterPage() {
  const queryClient = useQueryClient();
  const [subscriberToDelete, setSubscriberToDelete] =
    useState<NewsletterSubscriber | null>(null);
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: fetchSubscribers,
  });

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.subscribedAt ?? 0).getTime() -
          new Date(a.subscribedAt ?? 0).getTime(),
      ),
    [items],
  );

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || "Erreur lors de la suppression.");
      }
    },
    onSuccess: () => {
      toast.success("Abonné supprimé.");
      setSubscriberToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleExportCsv = () => {
    if (sortedItems.length === 0) {
      toast.info("Aucun abonné à exporter.");
      return;
    }

    const rows = [
      ["email", "source", "inscription", "ip"],
      ...sortedItems.map((row) => [
        row.email,
        row.source,
        row.subscribedAt ?? "",
        row.ip ?? "",
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "newsletter-subscribers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV généré.");
  };

  const columns: DataTableColumn<NewsletterSubscriber>[] = [
    {
      header: "Email",
      render: (row) => (
        <span className="font-medium text-navy-800">{row.email}</span>
      ),
    },
    {
      header: "Source",
      render: (row) => (
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
          {row.source}
        </span>
      ),
    },
    {
      header: "Inscription",
      render: (row) => (
        <span className="text-navy-600">
          {row.subscribedAt ? new Date(row.subscribedAt).toLocaleString("fr-FR") : "—"}
        </span>
      ),
    },
    {
      header: "IP",
      render: (row) => <span className="text-navy-500">{row.ip || "—"}</span>,
    },
    {
      header: "Action",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSubscriberToDelete(row)}
          disabled={deleteMutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={12} />
          Supprimer
        </button>
      ),
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">
              Audience / CRM
            </p>
            <h1 className="font-display mt-2 text-2xl font-bold text-navy-900">
              Newsletter
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
            >
              <Download size={15} />
              Export CSV
            </button>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
              <Users size={16} /> {sortedItems.length} abonnés
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-navy-100 bg-white p-5 shadow-[0_18px_45px_rgba(16,26,46,0.06)] sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-navy-700">
          <Mail size={16} className="text-primary-600" />
          Liste des abonnés
        </div>

        <DataTable
          columns={columns as any}
          rows={sortedItems as any}
          isLoading={isLoading}
          keyField="email"
          emptyLabel="Aucun abonné pour le moment."
        />
      </div>

      <ConfirmationModal
        open={subscriberToDelete !== null}
        onClose={() => setSubscriberToDelete(null)}
        onConfirm={() => {
          if (subscriberToDelete) {
            deleteMutation.mutate(subscriberToDelete.key);
          }
        }}
        title="Supprimer cet abonné ?"
        description={
          subscriberToDelete
            ? `L'adresse ${subscriberToDelete.email} sera définitivement retirée de la liste newsletter.`
            : "Cette action est définitive. L'abonné sera retiré de la liste newsletter."
        }
        confirmLabel="Supprimer"
        destructive
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
