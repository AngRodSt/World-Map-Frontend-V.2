import { z } from "zod";
import type { FeatureCollection, MultiPolygon } from "geojson";

export const GeoPropertiesSchema = z.object({
  name: z.string(),
  "ISO3166-1-Alpha-2": z.string(),
  "ISO3166-1-Alpha-3": z.string(),
});

export const GeoFeatureSchema = z.object({
  type: z.string(),
  properties: GeoPropertiesSchema,
  geometry: z.any(),
});

export const GeoDataSchema = z.object({
  type: z.string(),
  features: z.array(GeoFeatureSchema),
  name: z.string().optional(),
  crs: z.any().optional(),
});

export type CountryFeature = FeatureCollection<
  MultiPolygon,
  { name: string; "ISO3166-1-Alpha-2": string; "ISO3166-1-Alpha-3": string }
>;
