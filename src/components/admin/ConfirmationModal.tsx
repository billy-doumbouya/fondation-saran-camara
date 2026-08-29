"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "@/components/admin/Modal";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isPending?: boolean;
  destructive?: boolean;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  isPending = false,
  destructive = false,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={isPending ? () => undefined : onClose} title={title}>
      <div className="space-y-6">
        <div className="flex gap-3 rounded-2xl bg-navy-50 p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-gold-600" size={20} />
          <p className="text-sm leading-6 text-navy-600">{description}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-primary-600 hover:bg-primary-700"
            }`}
          >
            {isPending ? "En cours..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
