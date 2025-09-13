import { cn, getCoverPreviewLinks } from "@/lib/utils";
import type { CollectionWithGames } from "@game-forge/shared";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

type CollectionCardProps = {
  collection: CollectionWithGames;
  className?: string;
};

function CollectionCard({ collection, className }: CollectionCardProps) {
  if (!collection || collection.games.length === 0) return null;

  const coverPreview = getCoverPreviewLinks(collection.games) || [];
  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-card rounded-md py-2 px-4 flex-1 min-w-[180px] max-w-[220px] border shadow-md shadow-primary/12",
        className,
      )}
    >
      <CoverPreview links={coverPreview} />
      <h3 className="text-sm mt-1 text-center font-semibold truncate">
        {collection.name}
      </h3>
      <Button variant={"outline"} size="sm" asChild>
        <Link
          to="/collections/$collectionId"
          params={{ collectionId: collection.id.toString() }}
        >
          Browse
        </Link>
      </Button>
    </div>
  );
}

function CoverPreview({ links }: { links: string[] }) {
  const fanAngle = 12;
  const center = Math.floor(links.length / 2);

  return (
    <div className="relative aspect-[3/4] w-full flex items-center justify-center">
      {links.map((link, i) => {
        const offset = i - center;
        return (
          <div
            key={i}
            className="absolute rounded-md overflow-hidden shadow-md border border-border"
            style={{
              width: "85%",
              height: "auto",
              transform: `translateX(${offset * 18}px) rotate(${offset * fanAngle}deg) scale(0.9)`,
              zIndex: links.length - i,
            }}
          >
            <img
              src={link.replace("t_thumb", "t_original")}
              alt={`Game preview ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
export default CollectionCard;
