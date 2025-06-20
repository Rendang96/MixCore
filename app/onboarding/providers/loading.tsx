import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="border rounded-md p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-6 flex-1" />
              ))}
          </div>

          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex gap-4 mt-4">
                {Array(9)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-6 flex-1" />
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
