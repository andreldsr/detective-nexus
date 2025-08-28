import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCase() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-40" />
        <div className="flex-1 text-center space-y-2">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        <div className="w-48 flex justify-end gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </header>

      <div className="mb-8">
        <Skeleton className="h-28 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <Skeleton className="h-[60vh] w-full" />
        <Skeleton className="h-[60vh] w-full" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    </main>
  );
}
