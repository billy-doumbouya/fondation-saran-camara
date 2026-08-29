"use client";

import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardChartItem {
  label: string;
  value: number;
  color: string;
}

interface DashboardChartsProps {
  data: DashboardChartItem[];
}

const tooltipStyle = {
  border: "1px solid #d3daea",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(16, 26, 46, 0.12)",
  fontSize: "12px",
};

export default function DashboardCharts({ data }: DashboardChartsProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">Inventaire</p>
            <h2 className="font-display mt-1 text-lg font-semibold text-navy-900">Contenu par rubrique</h2>
          </div>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{total} éléments</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#325086", fontSize: 11 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#7690bd", fontSize: 11 }} />
              <Tooltip cursor={{ fill: "#eefaf1" }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Éléments" radius={[8, 8, 0, 0]}>
                {data.map((item) => <Cell key={item.label} fill={item.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="rounded-3xl border border-navy-100 bg-navy-900 p-5 text-white shadow-sm sm:p-6"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-300">Répartition</p>
        <h2 className="font-display mt-1 text-lg font-semibold">Vue du portefeuille</h2>
        <div className="relative mx-auto mt-2 h-48 w-full max-w-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">
                {data.map((item) => <Cell key={item.label} fill={item.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="font-display text-2xl">{total}</strong>
            <span className="text-xs text-navy-200">total</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4">
          {data.map((item) => (
            <div key={item.label} className="flex min-w-0 items-center gap-2 text-xs text-navy-200">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.label}</span>
              <strong className="ml-auto text-white">{item.value}</strong>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
