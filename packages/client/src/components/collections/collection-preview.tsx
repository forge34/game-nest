import Fallback from "../../assets/fallback.jpg";

type CollectionPreviewProps = {
  links: (string | undefined)[];
  xOffset?: number;
  fanAngle?: number;
};

function CollectionPreview({ links, xOffset = 18  ,fanAngle = 12}: CollectionPreviewProps) {
  const center = Math.floor(3 / 2);
  const filledLinks = [
    ...links,
    ...Array(3 - links.length).fill(undefined),
  ].slice(0, 3);

  return (
    <div className="relative aspect-[3/4] w-full flex items-center justify-center">
      {filledLinks.map((link, i) => {
        const offset = i - center;
        return (
          <div
            key={i}
            className="absolute rounded-md overflow-hidden shadow-md border border-border"
            style={{
              width: "85%",
              height: "auto",
              transform: `translateX(${offset * xOffset}px) rotate(${offset * fanAngle}deg) scale(0.9)`,
              zIndex: filledLinks.length - i,
            }}
          >
            <img
              src={link ? link.replace("t_thumb", "t_original") : Fallback}
              alt={`Game preview ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export default CollectionPreview;
