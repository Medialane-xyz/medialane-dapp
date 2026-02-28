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
        "group overflow-hidden cursor-pointer transition-all duration-300 relative rounded-xl glass-panel backdrop-blur-md shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] border",
        isSelected
          ? `ring-1 ring-offset-2 ring-offset-background ${colorClasses.border} shadow-glow-md ${colorClasses.shadow} border-${colorClasses.border.split('-')[1]}/50`
          : "border-white/5 hover:border-white/20 hover:-translate-y-1 hover:shadow-lg",
      )}
      onClick={onSelect}
    >
      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
        {isPopular && (
          <Badge className="bg-outrun-yellow/20 text-outrun-yellow border border-outrun-yellow/30 shadow-glow-sm shadow-outrun-yellow/20 text-[10px] tracking-wider uppercase">
            <Sparkles className="h-3 w-3 mr-1 drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]" />
            Popular
          </Badge>
        )}
      </div>

      <CardContent className="p-0">
        {/* Header with gradient background */}
        <div className={cn("p-6 pb-4 relative overflow-hidden", colorClasses.bgGradient)}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay" />
          <div className="relative flex items-start justify-between z-10">
            <div className={cn("p-3 rounded-xl shadow-glow-sm backdrop-blur-sm border border-white/10", colorClasses.iconBg, colorClasses.shadow)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.iconColor)} />
            </div>
            {isSelected && (
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shadow-glow-sm border border-white/10", colorClasses.iconBg, colorClasses.shadow)}>
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
              <Badge variant="outline" className="text-[10px] border-white/10 bg-black/20 uppercase tracking-wider">
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
                <Badge key={index} variant="secondary" className="text-[10px] bg-white/5 border border-white/10 text-foreground/90">
                  {feature}
                </Badge>
              ))}
              {template.features.length > 2 && (
                <Badge variant="secondary" className="text-[10px] bg-white/5 border border-white/10 text-foreground/90">
                  +{template.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-5 pt-2 relative z-10">
            <Link href={`/create/templates/${template.id}`} onClick={(e) => e.stopPropagation()} className="block w-full">
              <Button className={cn("w-full gap-2 transition-all active:scale-[0.98] font-bold tracking-wide",
                isSelected ? "gradient-vivid shadow-glow-sm shadow-neon-cyan/20 text-white" : "bg-white/5 hover:bg-white/10 text-foreground hover:shadow-glow-sm")} size="sm">
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
        bgGradient: "bg-outrun-cyan/10",
        iconBg: "bg-outrun-cyan/20",
        iconColor: "text-outrun-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]",
        border: "border-outrun-cyan",
        shadow: "shadow-neon-cyan/30",
        hoverGradient: "from-outrun-cyan to-transparent"
      }
    case "purple":
    case "violet":
      return {
        bgGradient: "bg-outrun-magenta/10",
        iconBg: "bg-outrun-magenta/20",
        iconColor: "text-outrun-magenta drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]",
        border: "border-outrun-magenta",
        shadow: "shadow-neon-magenta/30",
        hoverGradient: "from-outrun-magenta to-transparent"
      }
    case "amber":
    case "orange":
      return {
        bgGradient: "bg-outrun-yellow/10",
        iconBg: "bg-outrun-yellow/20",
        iconColor: "text-outrun-yellow drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]",
        border: "border-outrun-yellow",
        shadow: "shadow-outrun-yellow/30",
        hoverGradient: "from-outrun-yellow to-transparent"
      }
    case "teal":
    case "emerald":
      return {
        bgGradient: "bg-neon-cyan/10",
        iconBg: "bg-neon-cyan/20",
        iconColor: "text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]",
        border: "border-neon-cyan",
        shadow: "shadow-neon-cyan/30",
        hoverGradient: "from-neon-cyan to-transparent"
      }
    case "red":
      return {
        bgGradient: "bg-red-500/10",
        iconBg: "bg-red-500/20",
        iconColor: "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]",
        border: "border-red-500",
        shadow: "shadow-red-500/30",
        hoverGradient: "from-red-500 to-transparent"
      }
    case "sky":
    case "indigo":
      return {
        bgGradient: "bg-blue-500/10",
        iconBg: "bg-blue-500/20",
        iconColor: "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]",
        border: "border-blue-500",
        shadow: "shadow-blue-500/30",
        hoverGradient: "from-blue-500 to-transparent"
      }
    case "slate":
    case "gray":
    default:
      return {
        bgGradient: "bg-white/5",
        iconBg: "bg-white/10",
        iconColor: "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]",
        border: "border-white/30",
        shadow: "shadow-white/10",
        hoverGradient: "from-white to-transparent"
      }
  }
}
