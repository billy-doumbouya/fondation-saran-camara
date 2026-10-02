"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp, RefreshCw, RotateCcw, X } from "lucide-react";
import { useChatUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ————————————————————————————————————————————————
   Types & constantes
———————————————————————————————————————————————— */

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

type HistoryItem = Pick<ChatMessage, "role" | "text">;

const WELCOME_ID = "welcome";
const WELCOME_MESSAGE: ChatMessage = {
  id: WELCOME_ID,
  role: "model",
  text:
    "Bonjour 👋 Je suis l'assistant virtuel de la Fondation Saran Camara. Je peux répondre à vos questions sur nos programmes, notre équipe, nos actualités et nos événements. Comment puis-je vous aider ?",
};

const SUGGESTED_QUESTIONS = [
  "Quels sont vos programmes ?",
  "Comment faire un don ?",
  "Comment devenir partenaire ?",
  "Où agissez-vous ?",
];

const STORAGE_KEY = "fscpe-chat-v1";
const MAX_INPUT = 600;
const MAX_STORED = 40;
const MAX_HISTORY_SENT = 20;
const REQUEST_TIMEOUT_MS = 30_000;

/* ————————————————————————————————————————————————
   Helpers
———————————————————————————————————————————————— */

// crypto.randomUUID n'existe pas en HTTP (ex. test via IP locale) : on évite.
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function buildHistory(messages: ChatMessage[]): HistoryItem[] {
  return messages
    .filter((m) => m.id !== WELCOME_ID) // l'API (Gemini) exige un premier tour « user »
    .slice(-MAX_HISTORY_SENT)
    .map(({ role, text }) => ({ role, text }));
}

function loadStoredMessages(): ChatMessage[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof m.id === "string" &&
          typeof m.text === "string" &&
          (m.role === "user" || m.role === "model") &&
          m.id !== WELCOME_ID,
      )
      .slice(-MAX_STORED);
    return valid.length ? [WELCOME_MESSAGE, ...valid] : null;
  } catch {
    return null;
  }
}

// Liens http(s) cliquables, sans dangerouslySetInnerHTML.
const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:!?)"'])/g;

function renderText(text: string, onUser: boolean) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "break-all underline underline-offset-2",
          onUser ? "text-white" : "text-primary-700 hover:text-primary-800",
        )}
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

/* ————————————————————————————————————————————————
   Composant principal
———————————————————————————————————————————————— */

export default function Chatbot() {
  const open = useChatUIStore((s) => s.open);
  const setOpen = useChatUIStore((s) => s.setOpen);
  const reduce = useReducedMotion() ?? false;

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [failed, setFailed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* — Restaure la conversation de la session (après hydratation) — */
  useEffect(() => {
    const saved = loadStoredMessages();
    if (saved) {
      setMessages(saved);
      // Dernier message = question sans réponse (rechargement en cours de requête)
      if (saved[saved.length - 1].role === "user") setFailed(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch {
      /* stockage indisponible (navigation privée…) : on ignore */
    }
  }, [messages, hydrated]);

  /* — Requête à l'assistant — */
  const mutation = useMutation({
    mutationFn: async (history: HistoryItem[]) => {
      const controller = new AbortController();
      abortRef.current = controller;
      const timer = setTimeout(() => controller.abort("timeout"), REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Erreur de communication avec l'assistant.");
        const data = (await res.json()) as { reply?: unknown };
        if (typeof data.reply !== "string" || !data.reply.trim()) {
          throw new Error("Réponse vide.");
        }
        return data.reply.trim();
      } finally {
        clearTimeout(timer);
      }
    },
    onSuccess: (reply) => {
      setMessages((m) => [...m, { id: uid(), role: "model", text: reply }]);
    },
    onError: () => {
      const c = abortRef.current;
      // Annulation volontaire (« nouvelle conversation ») : pas une erreur.
      if (c?.signal.aborted && c.signal.reason === "reset") return;
      setFailed(true);
    },
  });

  const send = (question: string = input) => {
    const text = question.trim();
    if (!text || mutation.isPending) return;
    const next: ChatMessage[] = [...messages, { id: uid(), role: "user", text }];
    setMessages(next);
    setInput("");
    setFailed(false);
    mutation.mutate(buildHistory(next));
  };

  const retry = () => {
    if (mutation.isPending) return;
    setFailed(false);
    mutation.mutate(buildHistory(messages));
  };

  const resetConversation = () => {
    abortRef.current?.abort("reset");
    mutation.reset();
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setFailed(false);
  };

  /* — Échap pour fermer ; focus auto uniquement sur pointeur précis
       (sur mobile, le clavier masquerait la conversation) — */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    let t: number | undefined;
    if (window.matchMedia("(pointer: fine)").matches) {
      t = window.setTimeout(() => textareaRef.current?.focus(), 150);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (t) window.clearTimeout(t);
    };
  }, [open, setOpen]);

  /* — Défilement vers le dernier message — */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, open, mutation.isPending, failed, reduce]);

  /* — Auto-hauteur du champ de saisie — */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  const canSend = input.trim().length > 0 && !mutation.isPending;
  const showSuggestions = messages.length === 1 && !mutation.isPending;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Assistant FSCPE"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-24 z-50 flex h-[min(40rem,calc(100dvh-7rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(16,26,46,0.5)] ring-1 ring-navy-900/10 sm:inset-x-auto sm:right-5 sm:w-[25rem]"
        >
          {/* ——— En-tête ——— */}
          <header
            className="relative shrink-0 px-4 py-4 text-white"
            style={{
              background:
                "radial-gradient(120% 140% at 0% 0%, rgba(47,153,80,0.45) 0, transparent 55%), radial-gradient(90% 120% at 100% 0%, rgba(212,160,23,0.25) 0, transparent 55%), var(--color-navy-900)",
            }}
          >
            <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Image
                  src="/icon.png"
                  width={40}
                  height={40}
                  alt=""
                  className="h-10 w-10 rounded-full bg-white object-cover ring-2 ring-gold-500/60"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary-400 ring-2 ring-navy-900"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold leading-tight">
                  Assistant FSCPE
                </p>
                <p className="mt-0.5 truncate text-xs text-white/65">
                  Assistant virtuel de la Fondation
                </p>
              </div>

              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={resetConversation}
                  aria-label="Nouvelle conversation"
                  title="Nouvelle conversation"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-gold-400"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-gold-400"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* ——— Conversation ——— */}
          <div
            ref={listRef}
            data-lenis-prevent
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-background px-4 py-5"
          >
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}

            {showSuggestions && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-medium text-navy-500">Questions fréquentes</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="min-w-0 max-w-full rounded-full border border-navy-100 bg-white px-3.5 py-2 text-left text-xs font-medium text-navy-700 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-primary-600"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mutation.isPending && <TypingDots />}

            {failed && !mutation.isPending && (
              <div
                role="alert"
                className="flex flex-col items-start gap-2 rounded-2xl rounded-bl-sm border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
              >
                <p className="leading-relaxed">
                  L&apos;assistant n&apos;a pas pu répondre. Vérifiez votre connexion puis réessayez, ou
                  passez par le formulaire de contact.
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                >
                  <RefreshCw size={12} />
                  Réessayer
                </button>
              </div>
            )}
          </div>

          {/* ——— Saisie ——— */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="shrink-0 border-t border-navy-100 bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-navy-200 bg-navy-50/40 p-1.5 transition-colors focus-within:border-primary-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                maxLength={MAX_INPUT}
                enterKeyHint="send"
                aria-label="Votre question"
                placeholder="Posez votre question…"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                // 16px sur mobile : évite le zoom automatique d'iOS au focus
                className="max-h-[120px] min-h-10 min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-base leading-snug outline-none placeholder:text-navy-400 sm:text-sm"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Envoyer le message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95 disabled:bg-navy-200 disabled:shadow-none disabled:active:scale-100"
              >
                <ArrowUp size={18} strokeWidth={2.25} />
              </button>
            </div>

            <div className="mt-2 flex items-start justify-between gap-3 px-1">
              <p className="text-[11px] leading-snug text-navy-400">
                Assistant automatisé : il peut se tromper. Pour échanger avec l&apos;équipe,{" "}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="font-medium text-primary-700 underline-offset-2 hover:underline"
                >
                  écrivez-nous
                </Link>
                .
              </p>
              {input.length > MAX_INPUT - 100 && (
                <span className="shrink-0 font-mono text-[11px] text-navy-400" aria-live="polite">
                  {input.length}/{MAX_INPUT}
                </span>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ————————————————————————————————————————————————
   Sous-composants
———————————————————————————————————————————————— */

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "min-w-0 max-w-[86%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-2xl rounded-br-sm bg-primary-600 text-white"
            : "rounded-2xl rounded-bl-sm border border-navy-100 bg-white text-navy-800 shadow-sm",
        )}
      >
        {renderText(message.text, isUser)}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div
        role="status"
        className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-navy-100 bg-white px-4 py-3.5 shadow-sm"
      >
        <span className="sr-only">L&apos;assistant est en train d&apos;écrire</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}