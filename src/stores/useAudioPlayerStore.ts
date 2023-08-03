import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { PlayerState } from "@/enums";
import { Station } from "@/interfaces";

interface PlayerStore {
  station: Station | null;
  currentState: PlayerState;
  volume: number;
  setPlayerState: (newState: PlayerState) => void;
  setStation: (newStation: Station | null) => void;
  setVolume: (volume: number) => void;
}
export const useAudioPlayerStore = createWithEqualityFn<PlayerStore>(
  (set) => ({
    station: null,
    currentState: PlayerState.ON_PAUSE,
    volume: 0.3,
    setPlayerState: (newState) =>
      set((state) => ({ ...state, currentState: newState })),
    setStation: (station) => set((state) => ({ ...state, station })),
    setVolume: (volume) => set((state) => ({ ...state, volume })),
  }),
  shallow,
);
