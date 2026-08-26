let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {
      /* ignore — some browsers require a fresh gesture, safe to no-op */
    });
  }
  return audioCtx;
}

/**
 * Joue un très bref "pop" de confirmation (deux notes montantes, ~250ms,
 * volume bas). Généré à la volée via Web Audio API — aucun fichier audio
 * chargé. À réserver aux confirmations réelles (don initié, message envoyé,
 * sauvegarde admin) — jamais sur la navigation ou les clics génériques.
 */
export function playConfirmSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playTone = (freq: number, start: number, duration: number, peakGain: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.linearRampToValueAtTime(peakGain, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + duration + 0.02);
  };

  playTone(660, 0, 0.12, 0.07);
  playTone(880, 0.07, 0.16, 0.06);
}
