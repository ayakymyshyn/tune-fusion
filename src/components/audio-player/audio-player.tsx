import { forwardRef, useImperativeHandle, useRef } from "react";
import { PauseIcon, PlayIcon, SpeakerLoudIcon } from "@radix-ui/react-icons";
import { PlayerState } from "@/enums";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Station } from "@/interfaces";

import { Button, Slider } from "..";

interface AudioPlayerProps {
  station: Station | null;
  state: PlayerState;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const AudioPlayer = forwardRef<
  { play: (station: Station) => void },
  AudioPlayerProps
>(({ state, station, volume, onVolumeChange }, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { togglePlayer, play } = useAudioPlayer({ audioRef, station });

  useImperativeHandle(ref, () => ({
    play,
  }));

  const PlayerIcon = state === PlayerState.PLAYING ? PauseIcon : PlayIcon;

  return (
    <>
      {station !== null && (
        <div className="bg-white w-full overflow-hidden flex justify-between text-xs font-semibold text-gray-500 px-4 py-2 space-x-3 p-2 fixed bottom-0 left-0 shadow-lg shadow-slate-950">
          <div className="flex items-center">
            <img
              src={station.imgUrl}
              className="h-14 w-14 mr-5 object-cover rounded-md"
            />
            <div>
              <h3 className="font-bold">{station?.name ?? ""}</h3>
            </div>
          </div>
          <Button variant="outline" className="self-center">
            <PlayerIcon className="h-5 w-5" onClick={togglePlayer} />
          </Button>
          <div className="flex w-1/6 items-center gap-4">
            <SpeakerLoudIcon className="h-5 w-5" />
            <Slider
              defaultValue={[0.3]}
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={([currentVolume]) => {
                if (audioRef.current !== null) {
                  audioRef.current.volume = currentVolume;
                  onVolumeChange(currentVolume);
                }
              }}
            />
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        controls
        className="invisible"
        id="audio"
        controlsList="noremoteplayback"
        src="http://stream-uk1.radioparadise.com/aac-320"

        // `streamUrl` fields, which I'm receiving from API endpoint
        // does not seem to be valid
        // I grabbed URL from some open sources, just to be able to demonstrate application functionality
        // TODO: uncomment when URLs will be fixed

        // src={station?.streamUrl}
      />
    </>
  );
});
