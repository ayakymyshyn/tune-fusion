import { PlayIcon } from "@radix-ui/react-icons";
import { Station } from "@/interfaces";
import { cn } from "@/lib/utils";

import { Badge, Button } from "..";
import { Link, useNavigate } from "react-router-dom";

interface StationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  station: Station;
  play: (station: Station) => void;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function StationCard({
  station,
  aspectRatio = "portrait",
  play,
  className,
  ...props
}: StationCardProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="group relative">
        <div className="overflow-hidden rounded-md">
          <img
            src={station.imgUrl}
            alt={station.name}
            className={cn(
              "h-auto w-auto object-cover transition-all group-hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
            )}
          />
          <div
            className="absolute h-full w-full left-0 top-0 text-white bg-slate-800/[.5] opacity-0 group-hover:opacity-100 duration-500 rounded-md cursor-pointer"
            onClick={() => navigate(`/station/${station.id}`)}
          >
            <div className="flex flex-col justify-center items-center h-full rounded-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  play(station);
                }}
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Listen Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-1 text-sm mb-2 cursor-pointer">
        <Link to={`/station/${station.id}`}>
          <h3 className="font-medium leading-none">{station.name}</h3>
          <p className="text-xs text-muted-foreground truncate mt-2">
            {station.description}
          </p>
        </Link>
      </div>
      {station.tags.map((tag) => (
        <Badge
          key={tag}
          className="mx-0.5 mt-0.5 cursor-pointer"
          variant="secondary"
        >
          {tag.toUpperCase()}
        </Badge>
      ))}
    </div>
  );
}
