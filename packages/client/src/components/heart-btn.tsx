import { useMarkAsFavourite } from "@/api/games";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

function HeartBtn({ id, isFavourite }: { isFavourite: boolean; id: number}) {
  const favouriteFn = useMarkAsFavourite();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => favouriteFn.mutate(`${id}`)}
    >
      <Heart
        color="var(--heart)"
        fill={isFavourite ? "var(--heart)" : "transparent"}
      />
    </Button>
  );
}

export default HeartBtn;
