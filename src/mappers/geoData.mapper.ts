import { GeoDataSchema } from "@/types/geo";
import type { CountryFeature } from "@/types/geo";

export function validateAndParseGeoData(raw: unknown): CountryFeature {
  const parsed = GeoDataSchema.parse(raw);
  return parsed as CountryFeature;
}

export function extractCountryNames(data: CountryFeature): string[] {
  const set = new Set<string>();
  data.features.forEach((f) => {
    set.add(f.properties.name ?? "unknown");
  });
  return Array.from(set).sort();
}
