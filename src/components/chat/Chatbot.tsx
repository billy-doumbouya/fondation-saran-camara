"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useChatUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const WELCOME_MESSAGE: ChatMessage = {
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

export default function Chatbot() {
  const open = useChatUIStore((s) => s.open);
  const setOpen = useChatUIStore((s) => s.setOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const mutation = useMutation({
    mutationFn: async (history: ChatMessage[]) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });
      if (!res.ok) throw new Error("Erreur de communication avec l'assistant.");
      return res.json() as Promise<{ reply: string }>;
    },
    onSuccess: (data) => {
      setMessages((m) => [...m, { role: "model", text: data.reply }]);
    },
    onError: () => {
      setMessages((m) => [
        ...m,
        { role: "model", text: "Une erreur est survenue. Merci de réessayer ou d'utiliser le formulaire de contact." },
      ]);
    },
  });

  const send = (question = input) => {
    const trimmed = question.trim();
    if (!trimmed || mutation.isPending) return;
    const next: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-5 z-50 flex h-[min(39rem,calc(100vh-7rem))] w-[24rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-[0_24px_70px_-20px_rgba(16,26,46,0.45)]"
        >
          <div className="relative overflow-hidden bg-navy-900 px-5 py-5 text-white">
            <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-900/30">
                  <Bot size={21} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Assistant FSCPE</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-300" /> En ligne pour vous aider
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50/35 to-white px-4 py-5">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex items-end gap-2", m.role === "user" && "justify-end")}>
                {m.role === "model" && (
                  <div className="mb-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-primary-200">
                    <Sparkles size={12} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[84%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "rounded-br-md bg-primary-600 text-white"
                      : "rounded-bl-md border border-navy-100 bg-white text-navy-800"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {messages.length === 1 && !mutation.isPending && (
              <div className="ml-8 pt-2">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Questions fréquentes</p>
                <div className="flex flex-col items-start gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => send(question)}
                      className="group inline-flex max-w-full items-center gap-2 rounded-xl border border-primary-200 bg-white px-3 py-2 text-left text-xs font-medium text-navy-700 transition-all hover:border-primary-500 hover:bg-primary-50"
                    >
                      {question}
                      <ArrowUpRight size={13} className="shrink-0 text-primary-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {mutation.isPending && (
              <div className="ml-8 flex w-fit items-center gap-2 rounded-2xl border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-navy-500 shadow-sm">
                <Loader2 size={14} className="animate-spin" />
                En train d&apos;écrire...
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-navy-100 bg-white p-3"
          >
            <input
              aria-label="Votre question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="min-w-0 flex-1 rounded-full border border-navy-200 bg-navy-50/40 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !input.trim()}
              aria-label="Envoyer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
