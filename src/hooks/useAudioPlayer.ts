import { MutableRefObject } from "react";
import { PlayerState } from "@/enums";
import { useAudioPlayerStore } from "@/stores";
import { Station } from "@/interfaces";
import { useToast } from "@/components";

export type PlayerActionHandler = () => void;

type UseAudioPlayer = ({
  audioRef,
  station,
}: {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  station: Station | null;
}) => { togglePlayer: PlayerActionHandler; play: (station: Station) => void };

export const useAudioPlayer: UseAudioPlayer = ({ audioRef }) => {
  const { setPlayerState, playerState, setStation } = useAudioPlayerStore(
    (state) => ({
      playerState: state.currentState,
      setPlayerState: state.setPlayerState,
      setStation: state.setStation,
    }),
  );
  const { toast } = useToast();

  const handlePlayError = () => {
    toast({
      title: "Ooops! Something went wrong! Try again later",
      variant: "destructive",
    });
  };

  const HANDLERS_BY_PLAYER_STATE: Record<PlayerState, PlayerActionHandler> = {
    [PlayerState.ON_PAUSE]: () => {
      audioRef.current
        ?.play()
        .then(() => {
          setPlayerState(PlayerState.PLAYING);
        })
        .catch(() => handlePlayError());
    },
    [PlayerState.PLAYING]: () => {
      audioRef.current?.pause();
      setPlayerState(PlayerState.ON_PAUSE);
    },
  };

  const play = (station: Station) => {
    audioRef.current
      ?.play()
      .then(() => {
        setStation(station);
        setPlayerState(PlayerState.PLAYING);
      })
      .catch(() => handlePlayError());
  };

  return { togglePlayer: HANDLERS_BY_PLAYER_STATE[playerState], play };
};
