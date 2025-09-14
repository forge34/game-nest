import { cn, getCoverPreviewLinks } from "@/lib/utils";
import type { CollectionWithGames } from "@game-forge/shared";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import CollectionPreview from "./collection-preview";

type CollectionCardProps = {
  collection: CollectionWithGames;
  className?: string;
  showEmpty?: boolean;
};

function CollectionCard({
  collection,
  className,
  showEmpty = false,
}: CollectionCardProps) {
  if ((!collection || collection.games.length === 0) && !showEmpty) return null;

  const coverPreview = getCoverPreviewLinks(collection.games) || [];
  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-card rounded-md py-2 px-4 flex-1 max-w-full md:min-w-[180px] md:max-w-[220px] border shadow-md shadow-primary/12",
        className,
      )}
    >
      <CollectionPreview links={coverPreview} />
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

export default CollectionCard;
