import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { donations } from "@/lib/db/schema";
import { donationsRepo } from "@/lib/db/repo";
import AdminStatCard from "@/components/admin/ui/AdminStatCard";
import DonationsTable, { type DonationRow } from "@/components/admin/DonationsTable";
import { HeartHandshake, CreditCard, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dons & Finances — Administration FSCPE",
};

export default async function AdminDonationsPage() {
  let rows: DonationRow[] = [];
  try {
    await donationsRepo.expireStalePending();
    const donationRows = await db
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
    rows = donationRows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
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

  const formatGNF = (val: number) =>
    new Intl.NumberFormat("fr-FR").format(val) + " GNF";

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
          description="Cumul des paiements confirmés"
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
      <DonationsTable rows={rows} />
    </div>
  );
}
