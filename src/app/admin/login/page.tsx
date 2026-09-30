"use client";

import { useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { BRAND } from "@/lib/site-data";

// ==========================================
// 1. EFFET 3D FLOTTANT EN ARRIÈRE-PLAN
// ==========================================
function Background3DScene() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.12;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.18) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#4bb56d" />
      <pointLight position={[-4, -3, 2]} intensity={0.9} color="#e3b32c" />

      {/* Polyèdre 3D Flottant et Rotatif */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.2}>
        <mesh ref={meshRef} position={[2, 0.2, -2]}>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial
            color="#2f9950"
            wireframe
            transparent
            opacity={0.22}
            emissive="#194e2c"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Particules Lumineuses Vertes & Dorées FSCPE */}
      <DreiSparkles count={55} scale={14} size={3} speed={0.4} opacity={0.65} color="#4bb56d" />
      <DreiSparkles count={35} scale={12} size={3.5} speed={0.5} opacity={0.7} color="#e3b32c" />
    </>
  );
}

// ==========================================
// 2. FORMULAIRE DE CONNEXION & EXPÉRIENCE MOBILE-FIRST
// ==========================================
function LoginForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: yupResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Mot de passe incorrect.");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Authentification réussie. Bienvenue, Madame Camara.");
      const nextPath = searchParams.get("next");
      const destination =
        nextPath?.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/admin/dashboard";

      window.location.assign(destination);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-navy-950 px-4 py-8 sm:py-12 selection:bg-primary-600 selection:text-white">
      {/* SCÈNE THREE.JS DE FOND AVEC OVERLAY LUXURY */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
          <Background3DScene />
        </Canvas>
        <div className="absolute inset-0 bg-radial from-transparent via-navy-950/70 to-navy-950/95" />
      </div>

      {/* BOUTON RETOUR AU SITE (Toujours accessible et lisible sur mobile & desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 mb-5 flex w-full max-w-4xl justify-between items-center"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md shadow-xs transition-all hover:bg-white/20 hover:text-white hover:border-white/30"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Retour au site</span>
        </Link>

        {/* Indicateur de statut sécurisé */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-950/60 px-3 py-1 font-mono text-[11px] text-primary-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
          <span>Session Chiffrée TLS</span>
        </div>
      </motion.div>

      {/* CARTE CENTRALE DE CONNEXION AVEC GLASSMORPHISM ULTRA-SOIGNÉ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl md:grid md:grid-cols-2"
      >
        {/* ========================================================
            VOLET GAUCHE (DESKTOP) : PORTRAIT & CITATION OFFICIELLE
            ======================================================== */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary-800 via-primary-900 to-navy-950 p-8 text-white md:flex">
          {/* Motifs géométriques décoratifs */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-60 w-60 rounded-full bg-gold-500/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-primary-500/30 blur-2xl" />

          {/* En-tête volet gauche */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gold-400/80 shadow-md">
                <Image
                  src="/icon.png"
                  alt="Logo FSCPE"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white tracking-wide">
                  FSCPE Guinée
                </p>
                <p className="font-mono text-[10px] text-primary-200 uppercase tracking-widest">
                  Administration
                </p>
              </div>
            </div>

            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-gold-300 border border-white/10">
              Confidentiel
            </span>
          </div>

          {/* Centre : Portrait de Saran Camara */}
          <div className="relative z-10 my-6 flex flex-col items-center text-center">
            <div className="group relative h-36 w-36 overflow-hidden rounded-full border-4 border-gold-400/40 p-1 shadow-2xl shadow-navy-950/50">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-navy-800">
                <Image
                  src="/admin-picture.png"
                  alt={BRAND.founderName}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="144px"
                />
              </div>
            </div>

            <h3 className="font-display mt-4 text-xl font-bold tracking-tight text-white">
              {BRAND.founderName}
            </h3>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-300 mt-0.5">
              Présidente &amp; Fondatrice
            </p>

            <blockquote className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 text-xs italic text-primary-100 backdrop-blur-md shadow-xs">
              &ldquo;{BRAND.quote}&rdquo;
            </blockquote>
          </div>

          {/* Pied de volet gauche */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-primary-200/80 font-mono">
            <span>Conakry, République de Guinée</span>
            <span>Version 2.0</span>
          </div>
        </div>

        {/* ========================================================
            VOLET DROIT : FORMULAIRE SÉCURISÉ & ADAPTÉ MOBILE
            ======================================================== */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* HEADER MOBILE : Identité de marque visible sur smartphone ! */}
          <div className="md:hidden mb-6 flex flex-col items-center text-center pb-5 border-b border-navy-100">
            <div className="relative flex items-center gap-3">
              {/* Logo FSCPE */}
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary-600 shadow-md">
                <Image
                  src="/icon.png"
                  alt="Logo FSCPE"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              {/* Mini Portrait Saran Camara */}
              <div className="relative -ml-3 h-12 w-12 overflow-hidden rounded-full border-2 border-gold-500 shadow-md">
                <Image
                  src="/admin-picture.png"
                  alt={BRAND.founderName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="font-display mt-3 text-lg font-bold text-navy-950">
              {BRAND.name}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary-800 border border-primary-200">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse" />
              <span>Accès Réservé à la Direction</span>
            </div>
          </div>

          {/* En-tête formulaire (Desktop) */}
          <div className="hidden md:block">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 shadow-xs border border-primary-100">
              <ShieldCheck size={26} strokeWidth={2.2} />
            </div>

            <h1 className="font-display mt-4 text-2xl font-bold text-navy-950">
              Espace administration
            </h1>
            <p className="mt-1 text-sm text-navy-600">
              Veuillez saisir votre clé d&apos;accès sécurisée pour gérer la plateforme.
            </p>
          </div>

          {/* En-tête formulaire (Mobile) */}
          <div className="md:hidden text-center mb-2">
            <h1 className="font-display text-xl font-bold text-navy-950">
              Authentification
            </h1>
            <p className="mt-0.5 text-xs text-navy-600">
              Entrez le code secret pour accéder au tableau de bord.
            </p>
          </div>

          {/* Formulaire de saisie */}
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="mt-6 sm:mt-8 space-y-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="font-mono text-xs font-bold uppercase tracking-wider text-navy-700"
                >
                  Mot de passe administrateur
                </label>
                <span className="font-mono text-[11px] text-navy-400">
                  Accès protégé
                </span>
              </div>

              <div className="relative mt-2">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400">
                  <KeyRound size={18} />
                </div>

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="Tapez le mot de passe secret"
                  className="w-full rounded-2xl border border-navy-200 bg-white py-3.5 pl-11 pr-12 text-sm text-navy-950 placeholder-navy-400 shadow-2xs outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
                />

                {/* Bouton Afficher / Masquer avec bonne zone tactile pour mobile */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl text-navy-400 transition-colors hover:bg-navy-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1">
                  <span>•</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Bouton d'action de connexion */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative flex w-full min-h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-primary-700 via-primary-600 to-primary-700 py-3.5 px-6 font-display text-sm font-bold text-white shadow-lg shadow-primary-700/25 transition-all duration-300 hover:from-primary-800 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-700/30 active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Vérification sécurisée...</span>
                </>
              ) : (
                <>
                  <Lock size={16} className="transition-transform group-hover:scale-110" />
                  <span>Se connecter au tableau de bord</span>
                </>
              )}
            </button>
          </form>

          {/* Footer de sécurité */}
          <div className="mt-8 border-t border-navy-100 pt-4 text-center">
            <p className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-navy-500">
              <ShieldCheck size={14} className="text-primary-600" />
              <span>Chiffrement AES 256-bit · Accès tracé et sécurisé</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}