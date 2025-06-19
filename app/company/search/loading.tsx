import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </div>
        <div className="mt-6 flex gap-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
        </div>
      </div>
    </div>
  )
}
