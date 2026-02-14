"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActivityCard } from "@/components/activity-card"
import { useUserActivities } from "@/hooks/use-user-activities"
import { useAccount } from "@starknet-react/core"
import {
    Activity,
    Search,
    Filter,
    RefreshCw,
    X,
    Loader2,
    AlertCircle,
    Wallet
} from "lucide-react"

export default function PortfolioActivitiesPage() {
    const { address } = useAccount()
    const [searchQuery, setSearchQuery] = useState("")
    const [activityTypeFilter, setActivityTypeFilter] = useState("all")

    const { activities, loading, loadingMore, error, hasMore, loadMore, refresh } = useUserActivities(address || "", 20);

    // Client-side filtering of loaded activities
    const filteredActivities = useMemo(() => {
        let result = activities;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (activity) =>
                    activity.assetName.toLowerCase().includes(lowerQuery) ||
                    activity.txHash.toLowerCase().includes(lowerQuery) ||
                    activity.details.toLowerCase().includes(lowerQuery)
            );
        }

        if (activityTypeFilter !== "all") {
            result = result.filter((activity) => activity.type === activityTypeFilter);
        }

        return result;
    }, [activities, searchQuery, activityTypeFilter]);

    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 pt-24 text-center">
                <div className="p-4 rounded-full bg-muted/20 backdrop-blur-sm border border-border/20">
                    <Wallet className="h-10 w-10 text-muted-foreground/80" />
                </div>
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                    Connect Wallet
                </h2>
                <p className="text-muted-foreground max-w-sm">
                    Connect your wallet to view your activity history on the Mediolano Protocol.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none fixed" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-outrun-cyan/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-outrun-magenta/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <main className="container relative mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-20 space-y-10 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end justify-between">
                    <div className="space-y-4 max-w-2xl">
                        <Badge variant="outline" className="rounded-full px-4 py-1.5 border-outrun-magenta/20 bg-outrun-magenta/5 text-outrun-magenta">
                            <span className="flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5" />
                                Your History
                            </span>
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 leading-none pb-1">
                            My Activities
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                            Track your personal history on the Mediolano Protocol. View your mints, transfers, and remixes.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-background/40 backdrop-blur-md text-sm text-muted-foreground shadow-sm flex-1 md:flex-none justify-center md:justify-start">
                            <span className="font-semibold text-foreground">{activities.length}</span>
                            <span>events loaded</span>
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <div>
                    {/* Controls Section */}
                    <div className="-mx-4 px-4 py-4 md:mx-0 md:px-0 md:py-0 bg-background/80 backdrop-blur-xl md:bg-transparent">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-outrun-cyan transition-colors" />
                                <Input
                                    placeholder="Search by asset name or transaction..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11 bg-background/50 border-input/50 focus:border-outrun-cyan/50 focus:ring-outrun-cyan/20 rounded-xl shadow-sm transition-all"
                                />
                            </div>

                            {/* Filters & Actions */}
                            <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
                                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                                    <SelectTrigger className="w-[140px] h-11 bg-background/50 border-input/50 focus:ring-outrun-cyan/20 rounded-xl">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="mint">Mint</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                        <SelectItem value="remix">Remix</SelectItem>
                                        <SelectItem value="collection">Collection</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={refresh}
                                    disabled={loading}
                                    className="h-11 w-11 shrink-0 bg-background/50 border-input/50 hover:bg-outrun-cyan/10 hover:text-outrun-cyan rounded-xl transition-colors"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading && !loadingMore ? "animate-spin" : ""}`} />
                                </Button>

                                {/* Clear Filters (Desktop) */}
                                {(searchQuery || activityTypeFilter !== "all") && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setSearchQuery("")
                                            setActivityTypeFilter("all")
                                        }}
                                        className="h-11 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                {/* Activity Feed */}
                <div className="min-h-[400px]">
                    {error ? (
                        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
                            <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-2">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-destructive">Failed to load activity</h3>
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={refresh} variant="outline" className="mt-4">Retry Connection</Button>
                        </div>
                    ) : loading && !loadingMore && activities.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-[340px] rounded-xl bg-muted/20 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredActivities.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border-2 border-dashed rounded-3xl border-muted/50 bg-muted/5">
                            <div className="p-4 rounded-full bg-muted/30 text-muted-foreground">
                                <Activity className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-medium">
                                    {activities.length === 0 ? "No activities yet" : "No matches found"}
                                </h3>
                                <p className="text-muted-foreground max-w-sm">
                                    {activities.length === 0
                                        ? "You haven't performed any recorded activities on the Protocol yet."
                                        : "Try adjusting your filters to see more results."}
                                </p>
                            </div>
                            {activities.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setActivityTypeFilter("all")
                                    }}
                                    className="mt-2"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredActivities.map((activity) => (
                                    <div key={activity.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards">
                                        <ActivityCard activity={activity} />
                                    </div>
                                ))}
                            </div>

                            {/* Load More Pagination */}
                            {hasMore && (
                                <div className="flex justify-center py-8">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="min-w-[180px] rounded-xl hover:border-outrun-cyan/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-outrun-cyan" />
                                                Loading more...
                                            </>
                                        ) : (
                                            "Load More Activities"
                                        )}
                                    </Button>
                                </div>
                            )}
                            {!hasMore && activities.length > 0 && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground text-sm">You have reached the end of your activity history.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
