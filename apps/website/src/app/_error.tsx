"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-svw w-full flex flex-col max-w-page mx-page-margin-auto">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-gray-500">{error.message}</p>
        <button onClick={reset} className="mt-4 ">
          Try again
        </button>
      </div>
    </div>
  );
}
