"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CheckCircle2,
  ArrowRight,
  Music,
  Palette,
  FileText,
  Hexagon,
  Video,
  Award,
  MessageSquare,
  BookOpen,
  Building,
  Code,
  Settings,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  icon: string
  description: string
  color: string
  category: string
  features: string[]
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: () => void
}

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  // Map template icon string to the actual icon component
  const IconComponent = getIconComponent(template.icon)

  // Map color string to Tailwind color classes
  const colorClasses = getColorClasses(template.color)

  const isPopular = template.id === "audio" || template.id === "art" || template.id === "nft"

  return (
    <Card
      className={cn(
        "group overflow-hidden cursor-pointer transition-all duration-500 relative rounded-2xl border border-border/50 bg-card/40 dark:bg-card/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
        isSelected
          ? `ring-1 ring-offset-2 ring-offset-background ring-${colorClasses.border.split('-')[1]} border-${colorClasses.border.split('-')[1]} shadow-glow-md shadow-${colorClasses.border.split('-')[1]}/30`
          : "hover:-translate-y-1 hover:border-white/20 dark:hover:border-white/10"
      )}
      onClick={onSelect}
    >
      {/* Status Badges */}
      <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity", colorClasses.topBorderGradient)} />
      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
        {isPopular && (
          <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/50 text-[10px] tracking-wider uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)] backdrop-blur-md">
            <Sparkles className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>

      <CardContent className="p-0">
        {/* Header with gradient background */}
        <div className={cn("p-6 pb-4 relative overflow-hidden", colorClasses.bgGradient)}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay" />
          <div className="relative flex items-start justify-between z-10">
            <div className={cn("p-3 rounded-xl backdrop-blur-md border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-110", colorClasses.iconBg)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.iconColor)} />
            </div>
            {isSelected && (
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center backdrop-blur-md border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]", colorClasses.iconBg)}>
                <CheckCircle2 className={cn("h-4 w-4", colorClasses.iconColor)} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-1 tracking-wide">{template.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-[10px] border border-white/10 dark:border-white/5 uppercase tracking-wider bg-black/5 dark:bg-black/20 text-foreground/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                {template.category}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-foreground/80 line-clamp-2 mb-4 leading-relaxed">{template.description}</p>

          {/* Features Preview */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Key Features</h4>
            <div className="flex flex-wrap gap-1.5">
              {template.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-[10px] bg-card/50 dark:bg-black/20 border border-white/10 dark:border-white/5 text-foreground/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  {feature}
                </Badge>
              ))}
              {template.features.length > 2 && (
                <Badge variant="secondary" className="text-[10px] bg-card/50 dark:bg-black/20 border border-white/10 dark:border-white/5 text-foreground/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  +{template.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-5 pt-2 relative z-10">
            <Link href={`/create/templates/${template.id}`} onClick={(e) => e.stopPropagation()} className="block w-full">
              <Button className={cn("w-full gap-2 transition-all active:scale-[0.98] font-bold tracking-wide",
                isSelected ? "bg-gradient-to-r from-outrun-cyan to-outrun-magenta text-white shadow-[0_0_15px_rgba(0,255,255,0.4)] border-none hover:-translate-y-0.5" : `bg-card/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/10 dark:hover:bg-white/10 border border-border/50 text-foreground group-[&:hover]:border-primary/50 dark:group-[&:hover]:border-white/30 group-[&:hover]:text-primary dark:group-[&:hover]:text-white  transition-all duration-300`)} size="sm">
                Use Template
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

// Helper function to get the icon component based on the icon name
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Music":
      return Music
    case "Palette":
      return Palette
    case "FileText":
      return FileText
    case "Hexagon":
      return Hexagon
    case "Video":
      return Video
    case "Award":
      return Award
    case "MessageSquare":
      return MessageSquare
    case "BookOpen":
      return BookOpen
    case "Building":
      return Building
    case "Code":
      return Code
    case "Settings":
      return Settings
    default:
      return FileText
  }
}

// Helper function to get Tailwind color classes based on the color name
function getColorClasses(color: string) {
  switch (color) {
    case "blue":
      return {
        bgGradient: "bg-outrun-cyan/5 dark:bg-outrun-cyan/10",
        iconBg: "bg-outrun-cyan/10 border-outrun-cyan/30 group-hover:border-outrun-cyan/60 group-hover:bg-outrun-cyan/20",
        iconColor: "text-outrun-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]",
        border: "border-outrun-cyan",
        topBorderGradient: "via-outrun-cyan/70"
      }
    case "purple":
    case "violet":
      return {
        bgGradient: "bg-outrun-magenta/5 dark:bg-outrun-magenta/10",
        iconBg: "bg-outrun-magenta/10 border-outrun-magenta/30 group-hover:border-outrun-magenta/60 group-hover:bg-outrun-magenta/20",
        iconColor: "text-outrun-magenta drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]",
        border: "border-outrun-magenta",
        topBorderGradient: "via-outrun-magenta/70"
      }
    case "amber":
    case "orange":
      return {
        bgGradient: "bg-outrun-yellow/5 dark:bg-outrun-yellow/10",
        iconBg: "bg-amber-500/10 border-amber-500/30 group-hover:border-amber-500/60 group-hover:bg-amber-500/20",
        iconColor: "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]",
        border: "border-amber-500",
        topBorderGradient: "via-amber-500/70"
      }
    case "teal":
    case "emerald":
      return {
        bgGradient: "bg-neon-cyan/5 dark:bg-neon-cyan/10",
        iconBg: "bg-teal-500/10 border-teal-500/30 group-hover:border-teal-500/60 group-hover:bg-teal-500/20",
        iconColor: "text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]",
        border: "border-teal-500",
        topBorderGradient: "via-teal-500/70"
      }
    case "red":
      return {
        bgGradient: "bg-red-500/5 dark:bg-red-500/10",
        iconBg: "bg-red-500/10 border-red-500/30 group-hover:border-red-500/60 group-hover:bg-red-500/20",
        iconColor: "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]",
        border: "border-red-500",
        topBorderGradient: "via-red-500/70"
      }
    case "sky":
    case "indigo":
      return {
        bgGradient: "bg-blue-500/5 dark:bg-blue-500/10",
        iconBg: "bg-blue-500/10 border-blue-500/30 group-hover:border-blue-500/60 group-hover:bg-blue-500/20",
        iconColor: "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]",
        border: "border-blue-500",
        topBorderGradient: "via-blue-500/70"
      }
    case "slate":
    case "gray":
    default:
      return {
        bgGradient: "bg-muted/30 dark:bg-white/5",
        iconBg: "bg-foreground/5 border-border group-hover:border-primary/40 group-hover:bg-foreground/10",
        iconColor: "text-foreground",
        border: "border-border",
        topBorderGradient: "via-primary/50"
      }
  }
}

