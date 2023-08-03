import { useState } from "react";
import {
  ScrollArea,
  ScrollBar,
  Separator,
  EmptyPlaceholder,
  StationCard,
  Spinner,
  useToast,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components";
import { useQuery } from "@tanstack/react-query";
import { getStationsList } from "@/api";
import { Station } from "@/interfaces";

interface StationsPageProps {
  playStation: (station: Station) => void;
}

type SortQuery = "popular" | "reliable";
type Sorters = SortQuery | "default";
type SortFunction = (a: Station, b: Station) => number;

const searchStations = (stations: Station[], search: string) => {
  const searchQuery = search.toLowerCase();

  return stations.filter((station) => {
    return (
      station.name.toLowerCase().includes(searchQuery) ||
      station.description.toLowerCase().includes(searchQuery) ||
      station.tags.includes(searchQuery)
    );
  });
};

const sortStations = (stations: Station[], sortQuery: SortQuery) => {
  // We might have more sort options in future
  // So lets do it this way
  const sorters: Record<Sorters, SortFunction> = {
    popular: (a, b) => b.popularity - a.popularity,
    reliable: (a, b) => b.reliability - a.reliability,
    default: () => 0,
  };
  const handleSort = sorters[sortQuery] ?? sorters.default;

  return stations.sort(handleSort);
};

export function StationsPage({ playStation }: StationsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuery, setSortQuery] = useState<SortQuery>("popular");
  const { toast } = useToast();
  const { data: stations, isLoading } = useQuery(
    ["stations"],
    getStationsList,
    {
      select: (stationsData) => {
        const foundStations = searchStations(stationsData, searchQuery);

        return sortStations(foundStations, sortQuery);
      },
      onError: () =>
        toast({
          title: "Failed to fetch Station data! Please try again later!",
          variant: "destructive",
        }),
    },
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid grid-cols-1">
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Listen Now
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Top picks for you. Updated daily.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">Show me the</span>
                  <Select
                    value={sortQuery}
                    onValueChange={(value) => setSortQuery(value as SortQuery)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="reliable">Most Reliable</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="text-sm">stations first</span>
                </div>
                <Input
                  className="w-1/6"
                  placeholder="Search by tag name, name or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Separator className="my-4" />
              {stations?.length ? (
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {stations?.map((station) => (
                      <StationCard
                        key={station.name}
                        station={station}
                        play={playStation}
                        className="w-[150px]"
                        aspectRatio="portrait"
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <EmptyPlaceholder
                  title="No stations found!"
                  message="We have not found anything for you :("
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
