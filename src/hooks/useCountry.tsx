import { useContext } from "react";
import CountryContext from "@/contexts/CountryContext";

const useCountry = () => {
  return useContext(CountryContext);
};

export default useCountry;
