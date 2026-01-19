import { Spinner } from "@workspace/ui/components/spinner";

function GlobalLoadingSkeleton() {
  return (
    <div className="mx-page-margin-auto h-[calc(100vh-7rem)] text-muted-foreground flex flex-col justify-center items-center my-page-margin gap-4">
      <Spinner className="size-20" />
      <em className="animate-pulse">Loading Page...</em>
    </div>
  );
}

export default GlobalLoadingSkeleton;
