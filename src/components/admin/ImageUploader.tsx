"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: { url: string; publicId: string } | null;
  onChange: (value: { url: string; publicId: string } | null) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({ value, onChange, folder = "fscpe", label = "Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const sigRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      if (!sigRes.ok) throw new Error("Signature Cloudinary refusée.");
      const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Échec de l'upload sur Cloudinary.");
      const data = await uploadRes.json();
      onChange({ url: data.secure_url, publicId: data.public_id });
      toast.success("Image téléversée.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-navy-700">{label}</label>
      <div className="mt-1.5">
        {value?.url ? (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-navy-200">
            <Image src={value.url} alt={label} fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
              aria-label="Retirer l'image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 text-navy-400 transition-colors hover:border-primary-400 hover:text-primary-500 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="animate-spin" size={22} /> : <ImagePlus size={22} />}
            <span className="text-xs font-medium">{uploading ? "Envoi en cours..." : "Cliquez pour téléverser"}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
