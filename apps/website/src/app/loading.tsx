import { Spinner } from "@workspace/ui/components/spinner";

function GlobalLoadingSkeleton() {
  return (
    <div className="mx-page-margin-auto h-[calc(100vh-7rem)] text-muted-foreground flex justify-center items-center my-page-margin gap-2">
      <Spinner className="size-5" />
      <span className="shimmer">Loading Page...</span>
    </div>
  );
}

export default GlobalLoadingSkeleton;
