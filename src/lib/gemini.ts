/**
 * Client minimal pour l'API Gemini (Google AI Studio).
 * Mapping des modèles disponibles gratuitement — vérifié en ligne le 25/08/2026.
 * Le mapping est centralisé ici pour être mis à jour facilement si Google
 * change la liste des modèles gratuits (voir ai.google.dev/pricing).
 */

export const GEMINI_MODEL_MAP = {
  primary: "gemini-2.5-flash",
  fallback: "gemini-2.5-flash-lite",
} as const;

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiContentPart[];
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
}

function buildUrl(model: string, apiKey: string) {
  return `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
}

async function callModel(
  model: string,
  systemInstruction: string,
  history: GeminiContent[],
  apiKey: string
): Promise<{ text: string; blocked: boolean }> {
  const res = await fetch(buildUrl(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      contents: history,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  if (res.status === 429) {
    throw new RateLimitError(model);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API error (${model}): ${res.status} ${body}`);
  }

  const data = (await res.json()) as GeminiResponse;
  if (data.promptFeedback?.blockReason) {
    return { text: "", blocked: true };
  }
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return { text, blocked: false };
}

class RateLimitError extends Error {
  constructor(model: string) {
    super(`Rate limit atteint pour le modèle ${model}`);
    this.name = "RateLimitError";
  }
}

/**
 * Envoie un message au chatbot avec repli automatique vers le modèle
 * "flash-lite" si le modèle principal est rate-limité (HTTP 429).
 */
export async function askGemini(
  systemInstruction: string,
  history: GeminiContent[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Le chatbot n'est pas encore configuré. Veuillez définir GEMINI_API_KEY dans les variables d'environnement (voir .env.example).";
  }

  try {
    const { text, blocked } = await callModel(
      GEMINI_MODEL_MAP.primary,
      systemInstruction,
      history,
      apiKey
    );
    if (blocked) {
      return "Je ne peux pas répondre à cette demande. Reformulez votre question, s'il vous plaît.";
    }
    return text || "Désolé, je n'ai pas pu générer de réponse. Pouvez-vous reformuler ?";
  } catch (err) {
    if (err instanceof RateLimitError) {
      try {
        const { text, blocked } = await callModel(
          GEMINI_MODEL_MAP.fallback,
          systemInstruction,
          history,
          apiKey
        );
        if (blocked) {
          return "Je ne peux pas répondre à cette demande. Reformulez votre question, s'il vous plaît.";
        }
        return text || "Désolé, je n'ai pas pu générer de réponse.";
      } catch {
        return "Le service est momentanément surchargé. Merci de réessayer dans quelques instants.";
      }
    }
    console.error(err);
    return "Une erreur est survenue. Merci de réessayer plus tard ou d'utiliser le formulaire de contact.";
  }
}

export type { GeminiContent };
