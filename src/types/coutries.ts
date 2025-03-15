import { ReactNode } from "react";

export interface CountryContextProps {
    country?: Country;
    setCountry?: React.Dispatch<React.SetStateAction<Country>>;
    countries: Country[];
    setCountries?: React.Dispatch<React.SetStateAction<Country[]>>;
    saveCountry: (country: SaveCountyProps) => Promise<void>;
    deleteCountry: (id: string) => Promise<void>;
}

export interface SaveCountyProps {
    country?: string,
    color?: string,
    id?: string
}

export interface Country {
    _id: string;
    country: string;
    color: string;
}

export interface CountryProviderProps {
    children: ReactNode
}