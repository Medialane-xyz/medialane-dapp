"use client"

import { Activity as ActivityIcon, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActivityListRow } from "@/components/activity-list-row"
import { Activity } from "@/hooks/use-activities"

interface ActivityFeedProps {
  activities: Activity[]
  filteredActivities: Activity[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  emptyMessage?: string
  emptyMessageFiltered?: string
  showEndMessage?: boolean
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export function ActivityFeed({
  activities,
  filteredActivities,
  loading,
  loadingMore,
  error,
  hasMore,
  loadMore,
  refresh,
  emptyMessage = "No activities yet",
  emptyMessageFiltered,
  showEndMessage = false,
  hasActiveFilters = false,
  onClearFilters,
}: ActivityFeedProps) {
  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-2">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Failed to load activity</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={refresh} variant="outline" className="mt-4">Retry</Button>
      </div>
    )
  }

  // Initial loading skeleton
  if (loading && !loadingMore && activities.length === 0) {
    return (
      <div className="rounded-xl border border-border/10 overflow-hidden divide-y divide-border/10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[76px] animate-pulse bg-muted/20" />
        ))}
      </div>
    )
  }

  // Empty state
  if (filteredActivities.length === 0 && !loading) {
    const isFiltered = !!emptyMessageFiltered
    const message = emptyMessageFiltered ?? emptyMessage
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border-2 border-dashed rounded-3xl border-muted">
        <div className="p-4 rounded-full bg-muted/30 text-muted-foreground">
          <ActivityIcon className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-medium">{message}</h3>
        </div>
        {isFiltered && onClearFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="mt-2">
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/10 overflow-hidden divide-y divide-border/10">
        {filteredActivities.map((activity) => (
          <ActivityListRow key={activity.id} activity={activity} />
        ))}
      </div>

      {hasMore && filteredActivities.length > 0 && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="min-w-[160px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {showEndMessage && !hasMore && activities.length > 0 && !hasActiveFilters && (
        <p className="text-center text-xs text-muted-foreground py-4">
          You&apos;ve reached the end of your activity history.
        </p>
      )}
    </div>
  )
}
