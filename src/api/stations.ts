import axios from "axios";

import { Station } from "@/interfaces";

// I know that adding axios might look redundant in this case
// But IMO project's functionality might scale
// So using fetch API will not be efficient in this case

const STATIONS_API_ENDPOINT =
  "https://s3-us-west-1.amazonaws.com/cdn-web.tunein.com/stations.json";

export const getStationsList = async () => {
  const response = await axios.get<{ data: Station[] }>(STATIONS_API_ENDPOINT);

  return response.data.data;
};
