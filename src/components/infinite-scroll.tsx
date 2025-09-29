import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    isManual,
    fetchNextPage,
  ]);
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className="h-1">
        {hasNextPage ? (
          <Button
            variant="secondary"
            disabled={!hasNextPage || isFetchingNextPage}
            // intersectionObserver가 어떤 이유에서든 제대로 작동하지 않을 때 작동시키기 위함이다
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            You have reached the end of the list
          </p>
        )}
      </div>
    </div>
  );
};
