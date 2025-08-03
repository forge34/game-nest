import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const dummyNews = [
  {
    title: "New update: Co-op mode added!",
    source: "Game Forge Blog",
    date: "Jun 30",
    summary:
      "Multiplayer co-op is now available with new maps and matchmaking improvements.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4n7z.jpg",
  },
  {
    title: "Top 10 Indie Games this month",
    source: "IndieByte",
    date: "Jun 27",
    summary:
      "Discover the most creative and well-rated indie gems you might’ve missed.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2v95.jpg",
  },
  {
    title: "Patch 1.2.1: Balance Changes + Fixes",
    source: "Patch Notes",
    date: "Jun 25",
    summary:
      "Adjusted difficulty scaling, fixed crash on save, and improved UI responsiveness.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1xyz.jpg",
  },
];

export function GameNews({ className }: { className?: string }) {
  return (
    <div className={cn("w-[42rem] space-y-6 mt-2", className)}>
      <h2 className="text-xl font-bold">Latest News</h2>

      {dummyNews.map((news, idx) => (
        <Card
          key={idx}
          className="p-2 flex flex-row items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
        >
          {news.image && (
            <img
              src={news.image}
              alt={news.title}
              className="w-[5rem] h-[5rem] object-cover rounded"
            />
          )}

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-md font-semibold leading-tight">
                {news.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {news.summary}
              </p>
            </div>
            <span className="text-xs text-muted-foreground mt-2">
              {news.source} · {news.date}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
