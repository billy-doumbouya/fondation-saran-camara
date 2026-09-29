import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { donations } from "@/lib/db/schema";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminStatCard from "@/components/admin/ui/AdminStatCard";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import { HeartHandshake, CreditCard, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dons & Finances — Administration FSCPE",
};

interface DonationRow {
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
  createdAt: Date;
}

export default async function AdminDonationsPage() {
  let rows: DonationRow[] = [];
  try {
    rows = await db
      .select({
        id: donations.id,
        reference: donations.reference,
        donorName: donations.donorName,
        donorEmail: donations.donorEmail,
        donorPhone: donations.donorPhone,
        amount: donations.amount,
        currency: donations.currency,
        provider: donations.provider,
        paymentMethod: donations.paymentMethod,
        status: donations.status,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .orderBy(desc(donations.createdAt));
  } catch (error) {
    console.error("Erreur chargement dons:", error);
    rows = [];
  }

  // Calculs statistiques
  const totalAmountGNF = rows
    .filter((d) => d.status === "success")
    .reduce((sum, d) => sum + d.amount, 0);

  const successCount = rows.filter((d) => d.status === "success").length;
  const pendingCount = rows.filter((d) => d.status === "pending").length;

  const formatGNF = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " GNF";
  };

  const columns: DataTableColumn<DonationRow>[] = [
    {
      header: "Référence & Date",
      sortKey: "createdAt",
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950">
            {row.reference}
          </span>
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
          <p className="font-semibold text-navy-900">
            {row.donorName || "Donateur anonyme"}
          </p>
          <div className="flex flex-col text-[11px] text-slate-500">
            {row.donorEmail && <span>{row.donorEmail}</span>}
            {row.donorPhone && (
              <span className="font-mono text-slate-400">{row.donorPhone}</span>
            )}
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
          <span className="font-bold text-navy-950 text-sm">
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
        const formatted =
          method === "orange_money"
            ? "Orange Money Guinée"
            : method === "mtn_money"
            ? "MTN Mobile Money"
            : method === "card"
            ? "Carte bancaire"
            : method;

        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
            <CreditCard size={12} className="text-slate-400" />
            <span className="capitalize">{formatted}</span>
          </span>
        );
      },
    },
    {
      header: "Statut",
      sortKey: "status",
      render: (row) => {
        if (row.status === "success") {
          return (
            <AdminBadge variant="success" dot size="sm">
              Confirmé
            </AdminBadge>
          );
        }
        if (row.status === "pending") {
          return (
            <AdminBadge variant="warning" dot pulse size="sm">
              En cours
            </AdminBadge>
          );
        }
        return (
          <AdminBadge variant="danger" dot size="sm">
            Échoué
          </AdminBadge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
          Suivi des Dons & Contributions
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Traçabilité intégrale des générosités reçues en ligne (GeniusPay, Orange Money, MTN, Cartes) et des virements officiels.
        </p>
      </div>

      {/* Cartes KPI Synthèse */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total collecté validé"
          value={formatGNF(totalAmountGNF)}
          icon={<HeartHandshake size={22} />}
          accent="primary"
          trend={{ value: "+18.2%", isPositive: true, label: "ce mois" }}
        />
        <AdminStatCard
          label="Dons confirmés"
          value={successCount}
          icon={<CheckCircle2 size={22} />}
          accent="gold"
          description="Paiements validés avec succès"
        />
        <AdminStatCard
          label="Transactions en cours"
          value={pendingCount}
          icon={<Clock size={22} />}
          accent="navy"
          description="Paiements mobile money initiés"
        />
        <AdminStatCard
          label="Total contributions"
          value={rows.length}
          icon={<CreditCard size={22} />}
          accent="sky"
          description="Historique complet des intentions"
        />
      </div>

      {/* Pro DataTable des dons */}
      <DataTable
        title="Historique des transactions"
        subtitle="Recherche instantanée par nom, référence ou e-mail"
        keyField="id"
        columns={columns}
        rows={rows}
        searchable={true}
        searchPlaceholder="Rechercher par référence (ex: FSCPE-), nom, email..."
        exportable={true}
        exportFilename="fscpe-dons-donateurs"
        emptyLabel="Aucun don enregistré pour l'instant."
      />
    </div>
  );
}
