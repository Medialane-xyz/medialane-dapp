
"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Shield, GitBranch, Activity as ActivityIcon } from "lucide-react"
import { AddressLink } from "@/components/ui/address-link"
import Image from "next/image"
import { format } from "date-fns"

import { Activity } from "@/hooks/use-activities"

interface ActivityCardProps {
  activity: Activity
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "creation":
    case "mint":
      return Plus
    case "transfer":
      return Send
    case "license":
      return Shield
    case "remix":
      return GitBranch
    case "collection":
      return Plus
    default:
      return ActivityIcon
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "creation":
    case "mint":
      return {
        badge: "bg-outrun-cyan/10 text-outrun-cyan border-outrun-cyan/20 hover:bg-outrun-cyan/20",
        icon: "text-outrun-cyan",
      }
    case "transfer":
      return {
        badge: "bg-outrun-magenta/10 text-outrun-magenta border-outrun-magenta/20 hover:bg-outrun-magenta/20",
        icon: "text-outrun-magenta",
      }
    case "license":
      return {
        badge: "bg-violet-500/10 text-violet-500 border-violet-500/20 hover:bg-violet-500/20",
        icon: "text-violet-500",
      }
    case "remix":
      return {
        badge: "bg-outrun-orange/10 text-outrun-orange border-outrun-orange/20 hover:bg-outrun-orange/20",
        icon: "text-outrun-orange",
      }
    case "collection":
      return {
        badge: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
        icon: "text-purple-400",
      }
    default:
      return {
        badge: "bg-muted text-muted-foreground border-border/20",
        icon: "text-muted-foreground",
      }
  }
}

const formatTimeAgo = (timestamp: string) => {
  try {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
    return format(time, "MMM d")
  } catch (e) {
    return "Recent"
  }
}

const getGradient = (name: string) => {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const gradients = [
    "from-outrun-cyan to-outrun-magenta",
    "from-outrun-magenta to-outrun-orange",
    "from-outrun-orange to-violet-500",
    "from-violet-500 to-outrun-cyan",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-cyan-400"
  ]
  return gradients[hash % gradients.length]
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const Icon = getActivityIcon(activity.type)
  const colors = getActivityColor(activity.type)
  const timeAgo = formatTimeAgo(activity.timestamp)

  return (
    <Card className="glass-card flex flex-col h-full overflow-hidden hover:shadow-[0_0_25px_rgba(0,255,255,0.1)] hover:scale-[1.02] transition-all duration-300 group">

      {/* Header: User & Action - Timeline Feel */}
      <div className="flex items-center gap-3 p-4 pb-3 border-b border-border/10">
        <div className={`p-2 rounded-full flex-shrink-0 ${colors.badge.split(' ')[0]}`}>
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <AddressLink
              address={activity.user}
              className="font-semibold text-sm hover:text-primary transition-colors truncate max-w-[120px]"
              showFull={false}
            />
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground font-medium">{timeAgo}</span>
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {activity.type === 'collection' ? 'Created Collection' : `Performed ${activity.type}`}
          </div>
        </div>
      </div>

      {/* Body: Full Width Image */}
      <div className="relative w-full aspect-square bg-muted/20 border-y border-border/10 overflow-hidden">
        {activity.type === 'collection' && (!activity.assetImage || activity.assetImage === '/placeholder.svg' || activity.assetImage.includes('placeholder')) ? (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(activity.assetName)} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
        ) : (
          <Image
            src={activity.assetImage || `/placeholder.svg?height=400&width=400&text=${activity.assetName}`}
            alt={activity.assetName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
      </div>

      {/* Footer: Metadata */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold tracking-tight text-base line-clamp-1 group-hover:text-primary transition-colors">
            {activity.assetName}
          </h4>
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal opacity-70">
            #{activity.tokenId || '0'}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {activity.details}
        </p>
      </div>
    </Card>
  )
}
