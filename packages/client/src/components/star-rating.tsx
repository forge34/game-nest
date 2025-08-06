import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  onRatingChange?: (rating: number) => void;
  initialRating?: number;
  disabled?: boolean;
  size?: "sm" | "md";
}

function StarRating({
  onRatingChange,
  disabled,
  initialRating = 0,
  size = "md",
}: StarRatingProps) {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  function calcRating(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const raw = ((e.clientX - rect.left) / width) * 5;
    const clamped = Math.min(5, Math.max(0, raw + 0.001));
    return Math.round(clamped * 4) / 4;
  }

  function handleHover(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    setHoverRating(calcRating(e));
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rating = calcRating(e);
    setSelectedRating(rating);
    onRatingChange?.(rating);
  }

  const displayRating = hoverRating ?? selectedRating;
  const sizeMap = {
    sm: 16,
    md: 24,
  };

  const starSize = sizeMap[size];

  return (
    <div
      className="flex flex-row py-1"
      onMouseMove={handleHover}
      onMouseLeave={() => {
        if (!disabled) setHoverRating(null);
      }}
      onClick={handleClick}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fillPercent = Math.max(0, Math.min(1, displayRating - i)) * 100;
        return (
          <div
            key={i}
            className={cn(
              "relative",
              disabled && "pointer-events-none",
            )}
          >
            <Star className="text-gray-300" strokeWidth={1.25} size={starSize} />
            <Star
              className="absolute top-0 left-0 text-yellow-400 fill-current pointer-events-none"
              strokeWidth={1.25}
              size={starSize}
              style={{
                clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default StarRating;
