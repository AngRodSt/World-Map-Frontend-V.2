import { apiGeoData } from "@/config/axios";
import {
  extractCountryNames,
  validateAndParseGeoData,
} from "@/mappers/geoData.mapper";
import { CountryFeature } from "@/types/geo";

export default async function fetchGeoJSON(): Promise<CountryFeature> {
  const { data } = await apiGeoData.get("/data/countries.geojson");
  return validateAndParseGeoData(data);
}

export async function fetchCountryNames(): Promise<string[]> {
  const geo = await fetchGeoJSON();
  return extractCountryNames(geo);
}
