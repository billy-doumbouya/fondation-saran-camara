"use client";

import type { ReactNode } from "react";
import { Loader2, Inbox } from "lucide-react";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  isLoading?: boolean;
  keyField: keyof T;
  emptyLabel?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  isLoading,
  keyField,
  emptyLabel = "Aucun élément pour le moment.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-navy-100/90 bg-white shadow-[0_18px_50px_rgba(16,26,46,0.06)] ring-1 ring-white">
      <div className="flex items-center justify-between border-b border-navy-100/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)] px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold text-navy-500">{isLoading ? "Chargement des données" : `${rows.length} élément${rows.length > 1 ? "s" : ""}`}</p>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-600">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> Vue active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-[#f7f9f8] text-[10px] font-bold uppercase tracking-[0.14em] text-navy-500">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className={`px-4 py-3 ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-navy-400">
                  <Loader2 className="mx-auto animate-spin" size={22} />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-navy-400">
                  <Inbox className="mx-auto mb-2" size={22} />
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row[keyField])} className="transition-all duration-200 hover:bg-primary-50/60 hover:shadow-[inset_0_0_0_1px_rgba(34,122,63,0.05)]">
                  {columns.map((col) => (
                    <td key={col.header} className={`px-4 py-3 align-middle ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
