"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Inbox,
  X,
  Check,
} from "lucide-react";
import AdminButton from "./ui/AdminButton";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  sortKey?: keyof T;
}

export interface DataTableBulkAction {
  label: string;
  icon?: ReactNode;
  variant?: "primary" | "destructive" | "secondary";
  onClick: (selectedKeys: string[]) => void;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  isLoading?: boolean;
  keyField: keyof T;
  emptyLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  pagination?: boolean;
  defaultPageSize?: number;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  enableSelection?: boolean;
  bulkActions?: DataTableBulkAction[];
  exportable?: boolean;
  exportFilename?: string;
}

export default function DataTable<T extends object>({
  columns,
  rows,
  isLoading,
  keyField,
  emptyLabel = "Aucun élément pour le moment.",
  searchable = true,
  searchPlaceholder = "Rechercher dans la liste...",
  searchFields,
  pagination = true,
  defaultPageSize = 10,
  title,
  subtitle,
  headerActions,
  enableSelection = false,
  bulkActions,
  exportable = false,
  exportFilename = "export-fscpe",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // 1. Filtrage par recherche
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase().trim();

    return rows.filter((row) => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some((field) => {
          const val = row[field];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
        });
      }

      // Par défaut, recherche dans toutes les propriétés de type chaîne ou nombre
      return Object.values(row as Record<string, unknown>).some((val) => {
        if (typeof val === "string" || typeof val === "number") {
          return String(val).toLowerCase().includes(q);
        }
        return false;
      });
    });
  }, [rows, searchQuery, searchFields]);

  // 2. Tri
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredRows, sortKey, sortAsc]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    if (!pagination) return sortedRows;
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize, pagination]);

  // Réinitialiser la page quand la recherche change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // Gestion de la sélection
  const allCurrentSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((r) => selectedKeys.has(String(r[keyField])));

  const toggleSelectAll = () => {
    const next = new Set(selectedKeys);
    if (allCurrentSelected) {
      paginatedRows.forEach((r) => next.delete(String(r[keyField])));
    } else {
      paginatedRows.forEach((r) => next.add(String(r[keyField])));
    }
    setSelectedKeys(next);
  };

  const toggleSelectRow = (key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedKeys(next);
  };

  // Export CSV natif
  const handleExportCSV = () => {
    if (sortedRows.length === 0) return;
    const headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const csvLines = sortedRows.map((row) =>
      columns
        .map((c) => {
          const key = c.sortKey || (c.header.toLowerCase() as keyof T);
          const raw = row[key];
          const val = raw !== null && raw !== undefined ? String(raw) : "";
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const blob = new Blob([[headers, ...csvLines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${exportFilename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Barre de contrôle supérieure (Recherche, Filtres, Actions) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title && (
            <h3 className="font-display text-lg font-bold text-navy-950 sm:text-xl">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {searchable && (
            <div className="relative min-w-[220px] max-w-xs flex-1 sm:flex-initial">
              <Search
                size={16}
                className="absolute inset-y-0 left-3 my-auto text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-navy-950 placeholder:text-slate-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute inset-y-0 right-2.5 my-auto text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {exportable && (
            <AdminButton
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download size={14} />}
            >
              Export CSV
            </AdminButton>
          )}

          {headerActions}
        </div>
      </div>

      {/* Barre flottante d'actions groupées */}
      {enableSelection && selectedKeys.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/90 px-4 py-2.5 text-xs text-primary-900 shadow-sm animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
              {selectedKeys.size}
            </span>
            <span className="font-semibold">
              élément{selectedKeys.size > 1 ? "s" : ""} sélectionné{selectedKeys.size > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {bulkActions?.map((act, i) => (
              <button
                key={i}
                type="button"
                onClick={() => act.onClick(Array.from(selectedKeys))}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-2xs transition-colors",
                  act.variant === "destructive"
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : "bg-white text-navy-800 hover:bg-slate-100 border border-slate-200"
                )}
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedKeys(new Set())}
              className="text-xs text-slate-500 hover:text-slate-800 underline ml-2"
            >
              Désélectionner
            </button>
          </div>
        </div>
      )}

      {/* Tableau principal */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                {enableSelection && (
                  <th className="w-10 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={allCurrentSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => handleSort(col.sortKey)}
                    className={cn(
                      "px-4 py-3.5 select-none",
                      col.sortKey && "cursor-pointer hover:bg-slate-100/70 hover:text-navy-950",
                      col.className
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortKey && (
                        <ArrowUpDown
                          size={12}
                          className={cn(
                            "opacity-40 transition-opacity",
                            sortKey === col.sortKey && "opacity-100 text-gold-600"
                          )}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                // Skeletons de chargement
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {enableSelection && (
                      <td className="px-4 py-4">
                        <div className="h-4 w-4 rounded bg-slate-200" />
                      </td>
                    )}
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="px-4 py-4">
                        <div
                          className="h-4 rounded bg-slate-200/80"
                          style={{ width: `${60 + ((rIdx + cIdx) % 4) * 10}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="px-4 py-16 text-center text-slate-400"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Inbox size={24} />
                    </div>
                    <p className="mt-3 font-medium text-slate-600">{emptyLabel}</p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => handleSearchChange("")}
                        className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                      >
                        Effacer la recherche
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => {
                  const keyStr = String(row[keyField]);
                  const isRowSelected = selectedKeys.has(keyStr);

                  return (
                    <tr
                      key={keyStr}
                      className={cn(
                        "transition-colors duration-150 hover:bg-slate-50/70",
                        isRowSelected && "bg-primary-50/40"
                      )}
                    >
                      {enableSelection && (
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isRowSelected}
                            onChange={() => toggleSelectRow(keyStr)}
                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                      )}
                      {columns.map((col, idx) => (
                        <td
                          key={idx}
                          className={cn("px-4 py-3.5 align-middle text-xs sm:text-sm", col.className)}
                        >
                          {col.render(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de pagination & compteur */}
        {pagination && !isLoading && sortedRows.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>
                Affichage de{" "}
                <strong className="text-navy-950 font-mono">
                  {(currentPage - 1) * pageSize + 1}
                </strong>{" "}
                à{" "}
                <strong className="text-navy-950 font-mono">
                  {Math.min(currentPage * pageSize, sortedRows.length)}
                </strong>{" "}
                sur{" "}
                <strong className="text-navy-950 font-mono">
                  {sortedRows.length}
                </strong>{" "}
                élément{sortedRows.length > 1 ? "s" : ""}
              </span>

              {sortedRows.length > 10 && (
                <div className="ml-3 hidden sm:flex items-center gap-1.5">
                  <span>Lignes :</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 font-mono text-xs text-navy-900 focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Page précédente"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-2 font-mono text-xs font-semibold text-navy-900">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Page suivante"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
