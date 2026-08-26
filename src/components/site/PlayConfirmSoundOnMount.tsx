"use client";

import { useEffect } from "react";
import { playConfirmSound } from "@/lib/sound";

export default function PlayConfirmSoundOnMount() {
  useEffect(() => {
    playConfirmSound();
  }, []);
  return null;
}
