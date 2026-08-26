"use client";

import { useRef, Suspense } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { BRAND } from "@/lib/site-data";

// ==========================================
// 1. EFFET 3DInteractif EN ARRIÈRE-PLAN
// ==========================================
function Background3DScene() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#4bb56d" />

      {/* Polyèdre 3D Flottant et Rotatif */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef} position={[2, 0, -2]}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color="#2f9950"
            wireframe
            transparent
            opacity={0.2}
            emissive="#227a3f"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Particules Lumineuses FSCPE */}
      <Sparkles count={60} scale={12} size={3} speed={0.4} opacity={0.6} color="#4bb56d" />
      <Sparkles count={40} scale={10} size={4} speed={0.6} opacity={0.7} color="#e3b32c" />
    </>
  );
}

// ==========================================
// 2. FORMULAIRE DE CONNEXION & PORTRAIT
// ==========================================
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
        throw new Error(body.error || "Connexion impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Bienvenue, Madame Camara.");
      router.push(searchParams.get("next") || "/admin/dashboard");
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-4 py-12">
      {/* SCÈNE THREE.JS DE FOND */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
          <Background3DScene />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/90 via-navy-900/70 to-transparent" />
      </div>

      {/* CARTE CENTRALE DE CONNEXION */}
      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white/95 shadow-2xl backdrop-blur-md border border-white/20 md:grid-cols-2">
        
        {/* Volet Latéral : Portrait de l'Admin */}
        <div className="relative hidden flex-col justify-end bg-gradient-to-br from-primary-700 via-primary-800 to-navy-900 p-8 text-white md:flex">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Conteneur de la Photo Admin */}
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 shadow-xl transition-transform duration-300 hover:scale-105">
              <Image
                src="/admin-picture.png"
                alt={BRAND.founderName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 128px"
              />
            </div>

            <p className="font-display mt-5 text-center text-xl font-bold tracking-wide">
              {BRAND.founderName}
            </p>
            <p className="text-center text-xs font-medium uppercase tracking-wider text-primary-200 mt-0.5">
              Fondatrice, {BRAND.acronym}
            </p>

            <blockquote className="mt-6 rounded-2xl bg-white/10 p-4 text-center text-xs italic text-primary-100 backdrop-blur-sm border border-white/10">
              &ldquo;{BRAND.quote}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Volet Formulaire */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-sm">
            <ShieldCheck size={28} />
          </div>

          <h1 className="font-display mt-5 text-center text-2xl font-bold text-navy-900">
            Espace administration
          </h1>
          <p className="mt-1 text-center text-sm text-navy-500">
            Accès sécurisé réservé à la direction
          </p>

          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                Mot de passe
              </label>
              <div className="relative mt-1.5">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="password"
                  autoFocus
                  {...register("password")}
                  className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:-translate-y-0.5 hover:bg-primary-700 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {mutation.isPending && <Loader2 className="animate-spin" size={18} />}
              Se connecter
            </button>
          </form>
        </div>

      </div>
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