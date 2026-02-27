"use client"

import { Button } from "@/components/ui/button"
import { ActivityFilters } from "@/components/activity-filters"
import { ActivityFeed } from "@/components/activity-feed"
import { useActivities } from "@/hooks/use-activities"
import { useActivityFilters } from "@/hooks/use-activity-filters"
import { RefreshCw } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function ActivitiesPage() {
  const { activities, loading, loadingMore, error, hasMore, loadMore, refresh } = useActivities(undefined, 20)
  const { searchQuery, setSearchQuery, typeFilter, setTypeFilter, filtered, hasActiveFilters, clearFilters } = useActivityFilters(activities)

  return (
    <div className="min-h-screen py-10">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none fixed" />

      <main className="container relative mx-auto px-4 pb-12 space-y-12 max-w-7xl">
        <PageHeader
          title="Protocol Activity"
          description="Explore the pulse of the Mediolano ecosystem. Track live mints, collections, and asset transfers occurring on Starknet."
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur text-sm text-muted-foreground shadow-sm flex-1 md:flex-none justify-center md:justify-start">
            <span className="font-semibold text-foreground">{activities.length}</span>
            <span>events</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={loading}
            className="rounded-full h-10 w-10 shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading && !loadingMore ? "animate-spin" : ""}`} />
          </Button>
        </PageHeader>

        <div className="space-y-6 bg-background/80 backdrop-blur-xl p-1 -m-1 rounded-2xl md:bg-transparent md:p-0">
          <ActivityFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            searchPlaceholder="Search by asset, user, or details..."
          />
        </div>

        <ActivityFeed
          activities={activities}
          filteredActivities={filtered}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          hasMore={hasMore}
          loadMore={loadMore}
          refresh={refresh}
          emptyMessage="No protocol activity yet"
          emptyMessageFiltered={hasActiveFilters ? "No results — try adjusting your filters" : undefined}
          onClearFilters={clearFilters}
        />
      </main>
    </div>
  )
}
