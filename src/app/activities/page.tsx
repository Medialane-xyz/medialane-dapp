"use client"

import { Button } from "@/components/ui/button"
import { useActivitySection, ActivityFeedSection } from "@/components/activity-feed-section"
import { RefreshCw } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function ActivitiesPage() {
  const section = useActivitySection(undefined, 20)

  return (
    <div className="min-h-screen py-10">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none fixed" />

      <main className="container relative mx-auto px-4 pb-12 space-y-12 max-w-7xl">
        <PageHeader
          title="Protocol Activity"
          description="Explore the pulse of the Mediolano ecosystem. Track live mints, collections, and asset transfers occurring on Starknet."
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur text-sm text-muted-foreground shadow-sm flex-1 md:flex-none justify-center md:justify-start">
            <span className="font-semibold text-foreground">{section.activities.length}</span>
            <span>events</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={section.refresh}
            disabled={section.loading}
            className="rounded-full h-10 w-10 shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${section.loading && !section.loadingMore ? "animate-spin" : ""}`} />
          </Button>
        </PageHeader>

        <ActivityFeedSection
          {...section}
          searchPlaceholder="Search by asset, user, or details..."
          emptyMessage="No protocol activity yet"
          emptyMessageFiltered={section.hasActiveFilters ? "No results — try adjusting your filters" : undefined}
        />
      </main>
    </div>
  )
}
