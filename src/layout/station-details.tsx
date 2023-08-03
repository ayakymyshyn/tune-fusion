import { ArrowLeftIcon, PlayIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getStationsList } from "@/api";
import {
  Button,
  Separator,
  Spinner,
  StationCard,
  useToast,
} from "@/components";
import { Station } from "@/interfaces";

interface StationDetailsProps {
  playStation: (station: Station) => void;
}
export const StationDetails = ({ playStation }: StationDetailsProps) => {
  const { stationId } = useParams<{ stationId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  // It would be nice to have a separate endpoint for that
  // And do such things on the server-side
  const { data, isLoading } = useQuery(["stations"], getStationsList, {
    select: (stations) => {
      const currentStation = stations.find(
        (station) => station.id === stationId,
      );
      // Once again, I know that that's not the best way of doing that
      // I'd probably do that on server-side
      const similarStations = stations.filter((station) => {
        return (
          station.id !== currentStation?.id &&
          station.tags.some((tag) => currentStation?.tags.includes(tag))
        );
      });

      return { currentStation, similarStations };
    },
    onError: () =>
      toast({
        title: "Failed to fetch Station data! Please try again later!",
        variant: "destructive",
      }),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex gap-5 m-5">
        <img
          src={data?.currentStation?.imgUrl}
          className="h-auto w-auto object-cover rounded-md"
        />
        <div className="space-y-1 ml-5">
          <h2 className="text-2xl font-semibold tracking-tight">
            {data?.currentStation?.name}
          </h2>
          <p className="text-sm text-muted-foreground w-1/2">
            {data?.currentStation?.description}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          className="mt-5 w-1/6"
        >
          <ArrowLeftIcon className="mr-2" />
          Go back
        </Button>
        <Button
          onClick={() =>
            data?.currentStation && playStation(data.currentStation)
          }
          className="mt-5 w-1/6"
        >
          <PlayIcon className="mr-2" />
          Play {data?.currentStation?.name}
        </Button>
      </div>
      <Separator />

      {data?.similarStations.length && (
        <div className="space-y-1 m-5">
          <h2 className="text-2xl font-semibold tracking-tight mb-5">
            Similar to {data?.currentStation?.name}:
          </h2>
          <div className="flex space-x-4 pb-4">
            {data?.similarStations?.map((station) => (
              <StationCard
                key={station.name}
                station={station}
                play={playStation}
                className="w-[150px]"
                aspectRatio="portrait"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
