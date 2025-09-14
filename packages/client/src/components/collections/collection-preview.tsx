function CollectionPreview({ links }: { links: string[] }) {
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

export default CollectionPreview;
