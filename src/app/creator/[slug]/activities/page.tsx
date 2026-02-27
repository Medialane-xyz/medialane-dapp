"use client"

import { Card } from "@/components/ui/card"
import { ActivityFilters } from "@/components/activity-filters"
import { ActivityFeed } from "@/components/activity-feed"
import { useUserActivities } from "@/hooks/use-user-activities"
import { useActivityFilters } from "@/hooks/use-activity-filters"
import { useCreatorData } from "@/components/creator/creator-data-context"

export default function CreatorActivitiesPage() {
    const { walletAddress } = useCreatorData()
    const { activities, loading, loadingMore, error, hasMore, loadMore, refresh } = useUserActivities(walletAddress, 12)
    const {
        searchQuery, setSearchQuery,
        typeFilter, setTypeFilter,
        filtered,
        hasActiveFilters,
        clearFilters,
    } = useActivityFilters(activities)

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Filters Bar */}
            <div className="sticky top-[57px] z-10 -mx-4 px-4 pb-4">
                <Card className="bg-background/80 backdrop-blur-xl border-white/10 shadow-lg">
                    <div className="p-3 md:p-4">
                        <ActivityFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            typeFilter={typeFilter}
                            onTypeChange={setTypeFilter}
                            onRefresh={refresh}
                            isRefreshing={loading && !loadingMore}
                            searchPlaceholder="Search activities..."
                        />
                    </div>
                </Card>
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
                emptyMessage="This creator hasn't performed any activities yet"
                emptyMessageFiltered={hasActiveFilters ? "Try adjusting your search or filters" : undefined}
                onClearFilters={clearFilters}
            />
        </div>
    )
}
