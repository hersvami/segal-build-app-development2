/* ─── Segal Build — Services (Gemini AI FREE TIER + Cloudinary) ─── */

// ─── FREE-ONLY Gemini Model Cascade ───
// All models below are confirmed FREE (no credit card required)
// Strategy: Start with best quality, cascade down on 429/503
// Total free capacity: ~2,850 requests/day across all models
const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    tier: 1,
    freeRPM: 10,
    freeRPD: 250,
    note: 'Best quality free model',
  },
  {
    id: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    tier: 2,
    freeRPM: 15,
    freeRPD: 1000,
    note: 'Most generous free quota',
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5 Flash',
    tier: 3,
    freeRPM: 15,
    freeRPD: 1500,
    note: 'Legacy — highest daily limit',
  },
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    tier: 4,
    freeRPM: 5,
    freeRPD: 100,
    note: 'Stable fallback',
  },
] as const;

// Track which models have hit rate limits (resets after cooldown)
const rateLimitedModels: Record<string, number> = {};
const RATE_LIMIT_COOLDOWN_MS = 65_000; // 65 second cooldown (slightly over 1 min)

function getAvailableModels() {
  const now = Date.now();
  return GEMINI_MODELS.filter(m => {
    const limitedAt = rateLimitedModels[m.id];
    if (!limitedAt) return true;
    if (now - limitedAt > RATE_LIMIT_COOLDOWN_MS) {
      delete rateLimitedModels[m.id];
      return true;
    }
    return false;
  });
}

export type GeminiResult = {
  text: string;
  model: string;
  tier: number;
  fallback: boolean;
};

async function callGeminiWithFallback(
  prompt: string,
  apiKey: string
): Promise<GeminiResult> {
  const models = getAvailableModels();
  if (models.length === 0) {
    throw new Error('All models rate-limited. Try again in 1 minute.');
  }

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 4096, topP: 0.95 },
        }),
      });

      if (resp.status === 429 || resp.status === 503) {
        rateLimitedModels[model.id] = Date.now();
        console.warn(`⚠️ ${model.label} rate-limited, trying next...`);
        continue;
      }

      if (!resp.ok) {
        console.warn(`⚠️ ${model.label} error ${resp.status}, trying next...`);
        continue;
      }

      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.warn(`⚠️ ${model.label} empty response, trying next...`);
        continue;
      }

      return {
        text,
        model: model.label,
        tier: model.tier,
        fallback: i > 0,
      };
    } catch (err) {
      console.warn(`⚠️ ${model.label} network error:`, err);
      continue;
    }
  }

  throw new Error('All free models exhausted. Using keyword fallback.');
}

// ─── Get current model status for UI display ───
export function getModelStatus(): {
  available: { id: string; label: string; tier: number; freeRPD: number }[];
  rateLimited: { id: string; label: string; resumesIn: number }[];
  totalFreeRPD: number;
} {
  const now = Date.now();
  const available: { id: string; label: string; tier: number; freeRPD: number }[] = [];
  const rateLimited: { id: string; label: string; resumesIn: number }[] = [];

  for (const m of GEMINI_MODELS) {
    const limitedAt = rateLimitedModels[m.id];
    if (limitedAt && now - limitedAt < RATE_LIMIT_COOLDOWN_MS) {
      rateLimited.push({
        id: m.id,
        label: m.label,
        resumesIn: Math.ceil((RATE_LIMIT_COOLDOWN_MS - (now - limitedAt)) / 1000),
      });
    } else {
      available.push({ id: m.id, label: m.label, tier: m.tier, freeRPD: m.freeRPD });
    }
  }

  const totalFreeRPD = GEMINI_MODELS.reduce((sum, m) => sum + m.freeRPD, 0);
  return { available, rateLimited, totalFreeRPD };
}

// ─── Polish Scope with AI ───
export async function polishScopeWithAI(
  description: string,
  apiKey?: string
): Promise<{ text: string; model?: string; tier?: number; fallback?: boolean }> {
  if (!apiKey) return { text: description };

  const prompt = `You are a senior Australian construction estimator writing a formal Scope of Works.

Rewrite the builder notes below into a complete, professionally structured Scope of Works using clear, plain Australian building terminology (e.g. "plasterboard", "colour", "skirting", "architrave", "tapware", "cornice").

Output requirements:
- Start with a one-line summary heading (no markdown).
- Then 4–8 short sections, each with a bold header on its own line, e.g. "Demolition:", "Structural:", "Plumbing:", "Electrical:", "Wet Areas / Waterproofing:", "Finishes:", "Inclusions:", "Exclusions:".
- Under each header, use short bullet points (one per line) starting with "- ".
- Reference relevant trades, AS standards (e.g. AS3740 waterproofing) and BCA where appropriate.
- Do NOT invent dimensions or PC item dollar values that weren't in the notes.
- Do NOT use markdown asterisks for bold (no **). Use plain text headers ending in ":".
- Cover the full scope; do not stop early. Write the whole document.

Builder notes:
"""
${description}
"""

Return ONLY the finished Scope of Works document. No preamble, no closing remarks.`;

  try {
    const result = await callGeminiWithFallback(prompt, apiKey);
    return {
      text: result.text.trim(),
      model: result.model,
      tier: result.tier,
      fallback: result.fallback,
    };
  } catch {
    return { text: description };
  }
}

// ─── Recognise Scope Category with AI ───
export async function recogniseScopeWithAI(
  description: string,
  categoryIds: string[],
  apiKey?: string
): Promise<{ categoryId: string | null; model?: string } | null> {
  if (!apiKey) return null;

  const prompt = `You are an Australian construction expert. Given this description of building work, identify the SINGLE most relevant construction category from the list below.

Description: "${description}"

Categories:
${categoryIds.map(id => `- ${id}`).join('\n')}

Return ONLY the category ID (exactly as shown above), nothing else. If no category matches, return "unknown".`;

  try {
    const result = await callGeminiWithFallback(prompt, apiKey);
    const cleaned = result.text.trim().toLowerCase().replace(/[^a-z-]/g, '');
    if (categoryIds.includes(cleaned)) {
      return { categoryId: cleaned, model: result.model };
    }
    const match = categoryIds.find(id => cleaned.includes(id) || id.includes(cleaned));
    return match ? { categoryId: match, model: result.model } : null;
  } catch {
    return null;
  }
}

// ─── Cloudinary Photo Upload ───
export function isCloudinaryConfigured(): boolean {
  const env = (import.meta as any).env || {};
  return !!(env.VITE_CLOUDINARY_CLOUD_NAME && env.VITE_CLOUDINARY_UPLOAD_PRESET);
}

export async function uploadPhotoToCloudinary(_file: File): Promise<string> {
  const env = (import.meta as any).env || {};
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const preset = env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
  if (!cloudName || !preset) {
    return URL.createObjectURL(_file);
  }
  try {
    const formData = new FormData();
    formData.append('file', _file);
    formData.append('upload_preset', preset);
    const resp = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await resp.json();
    return data.secure_url;
  } catch {
    return URL.createObjectURL(_file);
  }
}
