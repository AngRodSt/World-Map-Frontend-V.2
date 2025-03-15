'use client'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Feature, Geometry, MultiPolygon, FeatureCollection } from 'geojson';
import L from "leaflet"
import fetchGeoData from '@/utils/fetchGeoData';
import { useMemo, useEffect, useState } from 'react';
import ModalStructure from './ModalStructure';
import useCountry from '@/hooks/useCountry';

const Worldmap = () => {

    const { saveCountry, countries, deleteCountry } = useCountry()
    const [geoData, setGeoData] = useState<GeoData | null>(null)
    const [selectedCountryName, setSelectedCountryName] = useState<string>('')
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>('')
    const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(null)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [selectedColor, setSelectedColor] = useState<string>('#fff')

    // Creates a lookup object to store saved countries with their colors
    const arrCountry = useMemo(() => {
        return countries.reduce((acc: { [key: string]: string }, item: { country: string; color: string }) => {
            acc[item.country] = item.color;
            return acc;
        }, {} as { [key: string]: string })
    }, [countries])


    type CountryFeature = Feature<MultiPolygon, { ADMIN: string; ISO_A2: string; ISO_A3: string }>;
    type GeoData = FeatureCollection<MultiPolygon, { ADMIN: string; ISO_A2: string; ISO_A3: string }>;

    useEffect(() => {
        // Fetches the geoJson data when the component mounts
        fetchGeoData().then(setGeoData)
    }, [])

    // Saves the selected country with a color
    const handleAccept = (newColor: string) => {
        let selectedId;
        const countryToSave = countries.find(country => country.country === selectedCountryName)
        if (countryToSave) {
            selectedId = countryToSave._id
        }
        saveCountry({
            country: selectedCountryName,
            color: newColor,
            id: selectedId
        })
    }

    // Deletes a country
    const handleDelete = () => {
        const countryToDelete = countries.find(country => country.country === selectedCountryName)
        if (countryToDelete) {
            const selectedId = countryToDelete._id
            deleteCountry(selectedId)
        }

    }
    // Handles country clicks and opens the modal
    const onEachCountry = (feature: CountryFeature, layer: L.Layer) => {
        (layer as L.Path).setStyle(getCountryStyle(feature))
        layer.on({
            click: () => {
                const countryName = feature.properties.ADMIN
                setSelectedCountryName(countryName);
                setSelectedCountryCode(feature.properties.ISO_A2);
                const country = extractCountry(countryName);
                setSelectedCountry(country);
                setModalIsOpen(true);
            }
        });
    }
    // Returns the style for each country based on saved colors
    const getCountryStyle = useMemo(() => {
        return (feature?: Feature<Geometry, { ADMIN: string; ISO_A2: string }>) => {
            if (!feature) return {};
            const countryName = feature.properties.ADMIN;
            const color = arrCountry[countryName] || 'transparent';

            return {
                color: color,
                weight: 1,
                fillColor: color,
                fillOpacity: color === 'transparent' ? 0 : 1
            };
        }
    }, [arrCountry])

    // Extracts country details from geoData
    const extractCountry = (countryName: string) => {
        const country = geoData?.features.find((feature: CountryFeature) => feature.properties.ADMIN === countryName);
        return country || null;
    }

    return (
        <>
            <div id="map" style={{ width: "100%" }}
                className=" w-[90vh] h-[80vh] overflow-hidden ">

                <MapContainer className='' center={[40.505, -0.09]} zoom={2.8} maxBounds={[[-85, -180],
                [85, 180]]} maxBoundsViscosity={1.0} scrollWheelZoom={false} style={{
                    width: "100%", height: "100%",

                }} >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geoData && <GeoJSON data={geoData} onEachFeature={onEachCountry} style={getCountryStyle} />}
                </MapContainer>

                {modalIsOpen && selectedCountry && <ModalStructure modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} countryName={selectedCountryName} selectedContry={selectedCountry} countryCode={selectedCountryCode} selectedColor={selectedColor} setSelectedColor={setSelectedColor} onAccept={handleAccept} onDelete={handleDelete} />}
            </div>

        </>
    );
};

export default Worldmap;
