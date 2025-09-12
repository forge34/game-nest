import { getCoverPreviewLinks } from "@/lib/utils";
import type { CollectionWithGames } from "@game-forge/shared";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

type CollectionCardProps = {
  collection: CollectionWithGames;
};

function CollectionCard({ collection }: CollectionCardProps) {
  if (!collection) return null;

  const coverPreview = getCoverPreviewLinks(collection.games) || [];
  return (
    <div className="flex flex-col gap-2 bg-card rounded-md py-3 px-6 flex-1 min-w-[200px] max-w-[250px] border shadow-md shadow-primary/12">
      <CoverPreview links={coverPreview} />
      <h3 className="text-lg mt-2 text-center font-semibold">
        {collection.name}
      </h3>
      <p className="text-sm text-muted-foreground">{collection.description}</p>
      <Button variant={"outline"} asChild>
        <Link to=".">Browse Collection</Link>
      </Button>
    </div>
  );
}

function CoverPreview({ links }: { links: string[] }) {
  const overlapX = 8;
  const overlapY = 4;
  const rotation = 1.5;

  return (
    <div className="relative aspect-[3/4] w-full">
      {links.map((link, i) => (
        <div
          key={i}
          className="absolute rounded-lg overflow-hidden shadow-md border border-border inset-0"
          style={{
            transform: `translateX(${(i - 1) * overlapX}px) translateY(${i * overlapY}px) rotate(${(i - 1) * rotation}deg)`,
            zIndex: links.length - i,
          }}
        >
          <img
            src={link.replace("t_thumb", "t_original")}
            alt={`Game preview ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
export default CollectionCard;
