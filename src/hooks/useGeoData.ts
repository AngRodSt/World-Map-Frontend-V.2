"use client";

import { useEffect, useState } from "react";
import fetchGeoJSON, { fetchCountryNames } from "@/utils/fetchGeoData";
import type { CountryFeature } from "../types/geo";

export function useGeoData() {
  const [geoData, setGeoData] = useState<CountryFeature | null>(null);
  const [countryNames, setCountryNames] = useState<string[]>([]);

  useEffect(() => {
    fetchGeoJSON().then(setGeoData).catch(console.error);
    fetchCountryNames().then(setCountryNames).catch(console.error);
  }, []);

  return { geoData, countryNames };
}
