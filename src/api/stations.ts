import axios from "axios";

import { Station } from "@/interfaces";

// I know that adding axios might look redundant in this case
// But IMO project's functionality might scale
// So using fetch API will not be efficient in this case

export const getStationsList = async () => {
  const response = await axios.get<{ data: Station[] }>(
    import.meta.env.VITE_TUNE_IN_API_URL,
  );

  return response.data.data;
};
