"use client";

import { useEffect, useState } from "react";

interface TypingEffectProps {
  words: string[];
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseMs?: number;
  className?: string;
}

export default function TypingEffect({
  words,
  typingSpeedMs = 65,
  deletingSpeedMs = 35,
  pauseMs = 1800,
  className,
}: TypingEffectProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === currentWord) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, typingSpeedMs);
    } else {
      timeout = setTimeout(
        () => {
          const next = deleting
            ? currentWord.slice(0, text.length - 1)
            : currentWord.slice(0, text.length + 1);
          setText(next);
        },
        deleting ? deletingSpeedMs : typingSpeedMs
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typingSpeedMs, deletingSpeedMs, pauseMs]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle animate-caret" />
    </span>
  );
}
