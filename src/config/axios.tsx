import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/worldmap`,
});

export const apiGeoData = axios.create({
  baseURL: "https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/main/raw",
  timeout: 10_000,
});

export default axiosClient;
