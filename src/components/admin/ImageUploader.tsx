"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Loader2,
  X,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: {
            event: string;
            info?: {
              secure_url?: string;
              public_id?: string;
              format?: string;
              bytes?: number;
            };
          }
        ) => void
      ) => {
        open: () => void;
        close: () => void;
        destroy: () => void;
      };
    };
  }
}

export interface ImageValue {
  url: string;
  publicId?: string;
}

interface ImageUploaderProps {
  value?: ImageValue | null;
  onChange: (value: ImageValue | null) => void;
  folder?: string;
  label?: string;
  description?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
}

const CLOUDINARY_SCRIPT_SRC = "https://upload-widget.cloudinary.com/global/all.js";

export default function ImageUploader({
  value,
  onChange,
  folder = "fscpe",
  label = "Image",
  description,
  aspectRatio = "video",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = tempPreviewUrl || value?.url;

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square max-w-[280px]",
    portrait: "aspect-[3/4] max-w-[280px]",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  // Assure le chargement du script Cloudinary à la demande si non encore présent
  const ensureCloudinaryScript = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    if (window.cloudinary) return true;

    return new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${CLOUDINARY_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        // Vérification de sécurité
        if (window.cloudinary) resolve(true);
        setTimeout(() => resolve(!!window.cloudinary), 1500);
        return;
      }

      const script = document.createElement("script");
      script.src = CLOUDINARY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  // Upload local direct avec prévisualisation immédiate et overlay spinner
  const uploadLocalFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP...).");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setTempPreviewUrl(localPreview);
    setIsUploading(true);

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

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Échec de l'envoi sur Cloudinary.");
      const data = await uploadRes.json();

      onChange({
        url: data.secure_url,
        publicId: data.public_id,
      });
      toast.success("Image téléversée avec succès.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du téléversement.");
      setTempPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Ouvrir le widget officiel Cloudinary multi-sources
  const openWidget = useCallback(async () => {
    setIsInitializing(true);

    try {
      const ready = await ensureCloudinaryScript();

      if (!ready || !window.cloudinary) {
        // Fallback transparent vers le sélecteur de fichier local
        fileInputRef.current?.click();
        return;
      }

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "t5ryi38g";
      const apiKey =
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "631927657828482";

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadSignature: (
            callback: (sig: string | null, error?: unknown) => void,
            paramsToSign: Record<string, string | number>
          ) => {
            fetch("/api/cloudinary-signature", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paramsToSign }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Signature refusée");
                return res.json();
              })
              .then((data) => callback(data.signature))
              .catch((err) => callback(null, err));
          },
          sources: ["local", "url", "camera", "google_drive", "dropbox"],
          multiple: false,
          folder,
          clientAllowedFormats: ["png", "jpeg", "jpg", "webp", "avif", "svg"],
          maxFileSize: 10485760, // 10MB
          showAdvancedOptions: false,
          theme: "minimal",
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#CBD5E1",
              tabIcon: "#227A3F",
              menuIcons: "#334155",
              textDark: "#0F172A",
              textLight: "#FFFFFF",
              link: "#227A3F",
              action: "#227A3F",
              inactiveTabIcon: "#64748B",
              error: "#EF4444",
              inProgress: "#3B82F6",
              complete: "#10B981",
              sourceBg: "#F8FAFC",
            },
          },
          language: "fr",
          text: {
            fr: {
              or: "Ou",
              back: "Retour",
              advanced: "Avancé",
              close: "Fermer",
              no_results: "Aucun résultat",
              search_placeholder: "Rechercher",
              about_uw: "Cloudinary FSCPE",
              menu: {
                files: "Mon Appareil",
                web: "URL Web",
                camera: "Caméra",
                gdrive: "Google Drive",
                dropbox: "Dropbox",
              },
              local: {
                browse: "Parcourir vos fichiers",
                dd_title_single: "Glissez et déposez une image ici",
                drop_title_single: "Relâchez pour envoyer l'image",
              },
            },
          },
        },
        (error, result) => {
          if (error) {
            console.error("Erreur Cloudinary:", error);
          }
          if (result && result.event === "queues-start") {
            setIsUploading(true);
          }
          if (result && result.event === "queues-end") {
            setIsUploading(false);
          }
          if (result && result.event === "success" && result.info?.secure_url) {
            setIsUploading(false);
            setTempPreviewUrl(null);
            onChange({
              url: result.info.secure_url,
              publicId: result.info.public_id,
            });
            toast.success("Image téléversée avec succès.");
          }
        }
      );

      widget.open();
    } catch {
      fileInputRef.current?.click();
    } finally {
      setIsInitializing(false);
    }
  }, [folder, onChange]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-navy-800">{label}</label>
        {value?.url && !isUploading && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 size={12} /> Prête
          </span>
        )}
      </div>

      {description && <p className="text-xs text-navy-500">{description}</p>}

      <div className="relative mt-1">
        {displayUrl ? (
          /* Prévisualisation responsive avec overlay de chargement et commandes survolées */
          <div className="group relative overflow-hidden rounded-2xl border border-navy-200/90 bg-navy-950/5 shadow-sm transition-all hover:border-primary-400">
            <div className={`relative w-full ${aspectClasses} overflow-hidden bg-navy-100`}>
              <Image
                src={displayUrl}
                alt={label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                unoptimized
              />

              {/* Overlay avec spinner animé pendant l'upload */}
              {isUploading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/65 backdrop-blur-sm text-white animate-in fade-in duration-200">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-14 w-14 rounded-full border-2 border-emerald-400/30 animate-ping" />
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                  </div>
                  <p className="mt-3 text-xs font-semibold tracking-wide text-white drop-shadow animate-pulse">
                    Téléversement Cloudinary en cours...
                  </p>
                </div>
              )}

              {/* Commandes survolées lorsque le chargement est terminé */}
              {!isUploading && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  {/* Bouton de suppression */}
                  <button
                    type="button"
                    onClick={() => {
                      setTempPreviewUrl(null);
                      onChange(null);
                    }}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md backdrop-blur-sm transition-all hover:bg-red-700 hover:scale-105 opacity-0 group-hover:opacity-100"
                    title="Supprimer l'image"
                    aria-label="Supprimer l'image"
                  >
                    <X size={15} />
                  </button>

                  {/* Barre d'action inférieure */}
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={openWidget}
                      disabled={isInitializing}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-navy-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-primary-700"
                    >
                      {isInitializing ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <RefreshCw size={13} />
                      )}
                      Remplacer
                    </button>

                    {value?.url && (
                      <a
                        href={value.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-navy-700 shadow-md hover:bg-white hover:text-navy-900 transition-colors"
                        title="Ouvrir l'image originale"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Zone de téléversement épurée, animée et responsive */
          <div
            onClick={openWidget}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) uploadLocalFile(file);
            }}
            className={`group relative flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragging
                ? "border-primary-500 bg-primary-50/50 scale-[1.01]"
                : "border-navy-200/90 bg-gradient-to-b from-navy-50/30 to-white hover:border-primary-500 hover:bg-primary-50/20 hover:shadow-md"
            }`}
          >
            {/* Icône animée */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-navy-100 text-primary-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-md">
              {isInitializing ? (
                <Loader2 size={26} className="animate-spin" />
              ) : (
                <ImagePlus size={26} />
              )}
            </div>

            <div className="mt-3.5 space-y-1">
              <p className="text-sm font-semibold text-navy-800 transition-colors group-hover:text-primary-700">
                Cliquez ou glissez-déposez une image ici
              </p>
              <p className="text-xs text-navy-400">
                Widget Cloudinary (Fichiers, URL, Drive, Dropbox) • Max 10 Mo
              </p>
            </div>
          </div>
        )}

        {/* Input file caché pour fallback direct */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadLocalFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
