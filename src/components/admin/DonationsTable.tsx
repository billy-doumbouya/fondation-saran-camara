"use client";

import { CreditCard } from "lucide-react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";

export interface DonationRow {
  id: number;
  reference: string;
  donorName: string | null;
  donorEmail: string | null;
  donorPhone: string | null;
  amount: number;
  currency: string;
  provider: string;
  paymentMethod: string | null;
  status: string;
  createdAt: string;
}

function formatPaymentMethod(method: string): string {
  if (method === "orange_money") return "Orange Money Guinée";
  if (method === "mtn_money") return "MTN Mobile Money";
  if (method === "card") return "Carte bancaire";
  return method;
}

export default function DonationsTable({ rows }: { rows: DonationRow[] }) {
  const columns: DataTableColumn<DonationRow>[] = [
    {
      header: "Référence & Date",
      sortKey: "createdAt",
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950">{row.reference}</span>
          <p className="text-[11px] text-slate-400">
            {new Date(row.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Donateur",
      sortKey: "donorName",
      render: (row) => (
        <div>
          <p className="font-semibold text-navy-900">{row.donorName || "Donateur anonyme"}</p>
          <div className="flex flex-col text-[11px] text-slate-500">
            {row.donorEmail && <span>{row.donorEmail}</span>}
            {row.donorPhone && <span className="font-mono text-slate-400">{row.donorPhone}</span>}
          </div>
        </div>
      ),
    },
    {
      header: "Montant",
      sortKey: "amount",
      className: "text-right font-mono",
      render: (row) => (
        <div className="text-right">
          <span className="text-sm font-bold text-navy-950">
            {new Intl.NumberFormat("fr-FR").format(row.amount)} {row.currency}
          </span>
        </div>
      ),
    },
    {
      header: "Moyen de paiement",
      sortKey: "paymentMethod",
      render: (row) => {
        const method = row.paymentMethod || row.provider;
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
            <CreditCard size={12} className="text-slate-400" />
            <span className="capitalize">{formatPaymentMethod(method)}</span>
          </span>
        );
      },
    },
    {
      header: "Statut",
      sortKey: "status",
      render: (row) => {
        if (row.status === "success") {
          return <AdminBadge variant="success" dot size="sm">Confirmé</AdminBadge>;
        }
        if (row.status === "pending") {
          return <AdminBadge variant="warning" dot pulse size="sm">En cours</AdminBadge>;
        }
        return <AdminBadge variant="danger" dot size="sm">Échoué</AdminBadge>;
      },
    },
  ];

  return (
    <DataTable
      title="Historique des transactions"
      subtitle="Recherche instantanée par nom, référence ou e-mail"
      keyField="id"
      columns={columns}
      rows={rows}
      searchable
      searchPlaceholder="Rechercher par référence (ex: FSCPE-), nom, email..."
      exportable
      exportFilename="fscpe-dons-donateurs"
      emptyLabel="Aucun don enregistré pour l'instant."
    />
  );
}
