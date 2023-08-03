import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StationsPage } from "./layout/stations-page";
import { HOME_URL, STATION_DETAILS } from "./constants/urls";
import { AudioPlayer, Toaster } from "./components";
import { useAudioPlayerStore } from "./stores";
import { Station } from "./interfaces";
import { StationDetails } from "./layout/station-details";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  const audioPlayerRef = useRef<{ play: (station: Station) => void }>(null);
  const { station, volume, setVolume, currentState } = useAudioPlayerStore(
    (state) => ({
      currentState: state.currentState,
      station: state.station,
      volume: state.volume,
      setVolume: state.setVolume,
    }),
  );

  const playStation = (station: Station) => {
    audioPlayerRef.current?.play(station);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path={HOME_URL}
            element={<StationsPage playStation={playStation} />}
          />
          <Route
            path={STATION_DETAILS}
            element={<StationDetails playStation={playStation} />}
          />
        </Routes>
      </Router>
      <AudioPlayer
        ref={audioPlayerRef}
        station={station}
        state={currentState}
        volume={volume}
        onVolumeChange={setVolume}
      />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
