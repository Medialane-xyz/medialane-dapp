"use client"

import React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AddressLink } from "@/components/ui/address-link"
import {
  ACTIVITY_LABELS,
  getActivityColor,
  getActivityIcon,
  formatTimeAgo,
  getGradient,
  shouldShowGradient,
} from "@/lib/activity-ui"
import { Activity } from "@/hooks/use-activities"

interface ActivityListRowProps {
  activity: Activity
}

export const ActivityListRow = React.memo(function ActivityListRow({ activity }: ActivityListRowProps) {
  const colors = getActivityColor(activity.type)
  const Icon = getActivityIcon(activity.type)
  const timeAgo = formatTimeAgo(activity.timestamp)
  const showGradient = shouldShowGradient(activity.type, activity.assetImage)
  const gradient = showGradient ? getGradient(activity.assetName) : ""
  const label = ACTIVITY_LABELS[activity.type] ?? activity.type

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border/10 hover:bg-muted/30 transition-colors group last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted/20">
        {showGradient ? (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
        ) : (
          <Image
            src={activity.assetImage || `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(activity.assetName)}`}
            alt={activity.assetName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="64px"
          />
        )}
      </div>

      {/* Center content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
            {activity.assetName}
          </span>
          {activity.tokenId && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal opacity-60 shrink-0">
              #{activity.tokenId}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <AddressLink
            address={activity.user}
            className="hover:text-primary transition-colors"
            showFull={false}
          />
          <span>·</span>
          <span className="truncate">{activity.details}</span>
        </div>
      </div>

      {/* Right metadata */}
      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
        <Badge className={`text-[10px] h-5 px-1.5 gap-1 border ${colors.badge}`}>
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
        {activity.price && (
          <span className="text-sm font-semibold text-primary">{activity.price}</span>
        )}
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
    </div>
  )
})
