
import axios from "axios";

export default async function fetchGeoData() {
    try {
        const url = 'https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/main/raw/data/countries.geojson'
        const response = await axios(url);
        const geoData = response.data
        return geoData

    } catch (error) {
        console.log(error)
    }
}

export const fillSelectCountries = async() => {
    const countries = new Set<string>()
    const geoData = await fetchGeoData()
    const geoDataFeatures = geoData.features
    for (const feature of geoDataFeatures) {
        countries.add(feature.properties.ADMIN);
    }
    const arrCountry = Array.from(countries)
    return arrCountry.sort()


}


