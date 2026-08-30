import { DEFAULT_BRAND } from "@/lib/site-data";
import { settingsRepo } from "@/lib/db/repo";

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

export async function getSiteSettings(): Promise<SiteSettings> {
  const entries = await Promise.all(
    (Object.entries(SITE_SETTINGS_KEYS) as Array<[keyof typeof DEFAULT_BRAND, string]>).map(async ([key, dbKey]) => {
      const value = await settingsRepo.get(dbKey, null);
      const defaultValue = DEFAULT_BRAND[key];
      return [key, value ?? defaultValue ?? null] as const;
    })
  );

  const merged = Object.fromEntries(entries) as Partial<SiteSettings>;
  return { ...DEFAULT_BRAND, ...merged } as SiteSettings;
}

export async function seedDefaultSiteSettings(): Promise<SiteSettings> {
  const values = Object.entries(SITE_SETTINGS_KEYS).map(([key, dbKey]) => {
    const value = DEFAULT_BRAND[key as keyof typeof DEFAULT_BRAND];
    return settingsRepo.set(dbKey, String(value ?? ""));
  });

  await Promise.all(values);
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
  return getSiteSettings();
}
