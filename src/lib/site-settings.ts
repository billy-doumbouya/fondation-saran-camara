import { revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_BRAND } from "@/lib/site-data";
import { settingsRepo } from "@/lib/db/repo";

const SITE_SETTINGS_CACHE_TAG = "site-settings";

export const SITE_SETTINGS_KEYS = {
  name: "site_name",
  fullName: "site_full_name",
  acronym: "site_acronym",
  slogan: "site_slogan",
  founderName: "site_founder_name",
  address: "site_address",
  phone: "site_phone",
  phoneSecondary: "site_phone_secondary",
  email: "site_email",
  quote: "site_quote",
  whatsappNumber: "site_whatsapp_number",
  whatsappDisplay: "site_whatsapp_display",
  heroVideoUrl: "site_hero_video_url",
  heroPosterUrl: "site_hero_poster_url",
} as const;

export type SiteSettings = {
  name: string;
  fullName: string;
  acronym: string;
  slogan: string;
  founderName: string;
  address: string;
  phone: string;
  phoneSecondary?: string | null;
  email: string;
  quote: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
};

async function loadSiteSettings(): Promise<SiteSettings> {
  const values = await settingsRepo.getMany(Object.values(SITE_SETTINGS_KEYS));
  const entries = (Object.entries(SITE_SETTINGS_KEYS) as Array<[keyof typeof DEFAULT_BRAND, string]>).map(
    ([key, dbKey]) => [key, values[dbKey] ?? DEFAULT_BRAND[key] ?? null] as const
  );
  return { ...DEFAULT_BRAND, ...Object.fromEntries(entries) } as SiteSettings;
}

const getCachedSiteSettings = unstable_cache(loadSiteSettings, ["site-settings-v1"], {
  revalidate: 3600,
  tags: [SITE_SETTINGS_CACHE_TAG],
});

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await getCachedSiteSettings();
  } catch (error) {
    console.warn("Impossible de charger les réglages de site depuis la base. Utilisation des valeurs par défaut.", error);
    return { ...DEFAULT_BRAND };
  }
}

export async function seedDefaultSiteSettings(): Promise<SiteSettings> {
  const values = Object.entries(SITE_SETTINGS_KEYS).map(([key, dbKey]) => {
    const value = DEFAULT_BRAND[key as keyof typeof DEFAULT_BRAND];
    return settingsRepo.set(dbKey, String(value ?? ""));
  });

  await Promise.all(values);
  revalidateTag(SITE_SETTINGS_CACHE_TAG, { expire: 0 });
  return getSiteSettings();
}

export async function saveSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const updates = Object.entries(SITE_SETTINGS_KEYS)
    .filter(([key]) => key in input)
    .map(([key, dbKey]) => {
      const value = input[key as keyof SiteSettings];
      return settingsRepo.set(dbKey, value == null ? "" : String(value));
    });

  await Promise.all(updates);
  revalidateTag(SITE_SETTINGS_CACHE_TAG, { expire: 0 });
  return getSiteSettings();
}
