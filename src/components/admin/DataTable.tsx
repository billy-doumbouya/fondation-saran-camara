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
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/60 text-xs font-semibold uppercase tracking-wide text-navy-500">
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
                <tr key={String(row[keyField])} className="transition-colors hover:bg-primary-50/40">
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
