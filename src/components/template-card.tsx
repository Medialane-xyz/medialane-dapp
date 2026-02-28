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
        "group overflow-hidden cursor-pointer transition-all duration-300 relative rounded-xl border border-border bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-primary/20",
          isSelected
            ? `ring-1 ring-offset-2 ring-offset-background ring-${colorClasses.border.split('-')[1]} border-${colorClasses.border.split('-')[1]} shadow-sm`
            : "hover:-translate-y-1"
      )}
      onClick={onSelect}
    >
      {/* Status Badges */}
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity", colorClasses.topBorderGradient)} />
      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
        {isPopular && (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] tracking-wider uppercase shadow-sm">
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
            <div className={cn("p-2.5 rounded-lg border bg-background shadow-sm", colorClasses.border)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.iconColor)} />
            </div>
            {isSelected && (
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center border bg-background shadow-sm", colorClasses.border)}>
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
              <Badge variant="secondary" className="text-[10px] border border-border/50 uppercase tracking-wider bg-background/50 text-muted-foreground">
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
                <Badge key={index} variant="secondary" className="text-[10px] bg-background border border-border text-foreground/80">
                  {feature}
                </Badge>
              ))}
              {template.features.length > 2 && (
                <Badge variant="secondary" className="text-[10px] bg-background border border-border text-foreground/80">
                  +{template.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-5 pt-2 relative z-10">
            <Link href={`/create/templates/${template.id}`} onClick={(e) => e.stopPropagation()} className="block w-full">
              <Button className={cn("w-full gap-2 transition-all active:scale-[0.98] font-bold tracking-wide",
                isSelected ? "bg-gradient-to-r from-outrun-cyan to-outrun-magenta text-white shadow-md border hover:-translate-y-0.5" : "bg-background/60 backdrop-blur-sm hover:bg-background/90 border border-border text-foreground hover:border-primary/20")} size="sm">
                Use Template
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className={cn("absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none", colorClasses.hoverGradient)} />
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
        bgGradient: "bg-outrun-cyan/5",
        iconColor: "text-outrun-cyan",
        border: "border-outrun-cyan/30 group-hover:border-outrun-cyan/60",
        topBorderGradient: "via-outrun-cyan/40"
      }
    case "purple":
    case "violet":
      return {
        bgGradient: "bg-outrun-magenta/5",
        iconColor: "text-outrun-magenta",
        border: "border-outrun-magenta/30 group-hover:border-outrun-magenta/60",
        topBorderGradient: "via-outrun-magenta/40"
      }
    case "amber":
    case "orange":
      return {
        bgGradient: "bg-outrun-yellow/5",
        iconColor: "text-amber-500",
        border: "border-amber-500/30 group-hover:border-amber-500/60",
        topBorderGradient: "via-amber-500/40"
      }
    case "teal":
    case "emerald":
      return {
        bgGradient: "bg-neon-cyan/5",
        iconColor: "text-teal-500",
        border: "border-teal-500/30 group-hover:border-teal-500/60",
        topBorderGradient: "via-teal-500/40"
      }
    case "red":
      return {
        bgGradient: "bg-red-500/5",
        iconColor: "text-red-500",
        border: "border-red-500/30 group-hover:border-red-500/60",
        topBorderGradient: "via-red-500/40"
      }
    case "sky":
    case "indigo":
      return {
        bgGradient: "bg-blue-500/5",
        iconColor: "text-blue-500",
        border: "border-blue-500/30 group-hover:border-blue-500/60",
        topBorderGradient: "via-blue-500/40"
      }
    case "slate":
    case "gray":
    default:
      return {
        bgGradient: "bg-muted/50",
        iconColor: "text-foreground",
        border: "border-border group-hover:border-primary/30",
        topBorderGradient: "via-primary/20"
      }
  }
}

