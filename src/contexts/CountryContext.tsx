'use client'

import { useState, useEffect, createContext, ReactNode } from "react";
import axiosClient from "../config/axios";
import useAuth from "@/hooks/UseAuth";
import axios from "axios";


interface CountryContextProps {
    country?: Country;
    setCountry?: React.Dispatch<React.SetStateAction<Country>>;
    countries: Country[];
    setCountries?: React.Dispatch<React.SetStateAction<Country[]>>;
    saveCountry: (country: SaveCountyProps) => Promise<void>;
    deleteCountry: (id: string) => Promise<void>;
}

interface SaveCountyProps {
    country?: string,
    color?: string,
    id?: string
}

const CountryContext = createContext<CountryContextProps>({
    country: {_id: '', country: '', color: ''},
    setCountry: () => {},
    countries: [],
    setCountries: ()=> {},
    saveCountry: async () => {},
    deleteCountry:async () => {}
   
});

interface Country {
    _id: string;
    country: string;
    color: string;
}

interface CountryProviderProps {
    children: ReactNode
}

const CountryProvider: React.FC<CountryProviderProps> = ({ children }) => {
    const { auth } = useAuth();
    
  

    const [countries, setCountries] = useState<Country[]>([])
    const [country, setCountry] = useState<Country>({_id: '', country: '', color: ''})

    useEffect(() => {
        const getCountries = async () => {
            const token = localStorage.getItem('MapToken');
            if (!token) return;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await axiosClient('/country', config)
                setCountries(data);

            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data.msg)
                }
            }
        }
        getCountries();

    }, [auth])

  
    const saveCountry = async (country: SaveCountyProps) => {
        const token = localStorage.getItem('MapToken');
        if (!token) return;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        if (country.id) {

            try {
                const { data } = await axiosClient.put(`/country/${country.id}`, country, config)
                const updatedCountries = countries.map(country => country._id === data._id ? data : country)
                setCountries(updatedCountries)
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data.msg)
                }
            }

        }
        else {
            try {
                const { data } = await axiosClient.post(`/country`, country, config)
                setCountries([data, ...countries])
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data.msg)
                }
            }

        }
    }

    const deleteCountry = async (id: string) => {
        const token = localStorage.getItem('MapToken');
        if (!token) return;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            await axiosClient.delete(`/country/${id}`, config)
            const updatedCountrys = countries.filter(country => country._id !== id)
            setCountries(updatedCountrys)
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.msg)
            }
        }

    }


    return (
        <CountryContext.Provider value={{countries, setCountry, country, saveCountry, deleteCountry }}>
            {children}
        </CountryContext.Provider>
    )
}

export { CountryProvider }

export default CountryContext
