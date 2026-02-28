"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
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
  CheckCircle,
  Shield,
  Sparkles,
  ExternalLink,
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

interface TemplateDetailsProps {
  template: Template
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
  // Map template icon string to the actual icon component
  const IconComponent = getIconComponent(template.icon)

  // Map color string to Tailwind color classes
  const colorClasses = getColorClasses(template.color)

  const isPopular = template.id === "audio" || template.id === "art" || template.id === "nft"

  return (
    <Card className="relative bg-card/60 backdrop-blur-xl border border-border shadow-sm rounded-xl overflow-hidden">
      <CardHeader className={cn("pb-4 relative overflow-hidden", colorClasses.bgGradient)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-2.5 rounded-lg border bg-background shadow-sm", colorClasses.border)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.iconColor)} />
            </div>
            <div className="flex flex-col gap-1">
              {isPopular && (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] tracking-wider uppercase shadow-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-xl mb-2">{template.name} Template</CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="outline" className="text-xs bg-background/50 border-border/50 text-muted-foreground">
              {template.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <p className="text-muted-foreground leading-relaxed">{template.description}</p>

        <Separator />

        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Key Features
          </h4>
          <div className="grid gap-2">
            {template.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className={cn("rounded-lg p-4 text-sm", colorClasses.bgLight)}>
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", colorClasses.iconBg)}>
              <Shield className={cn("h-4 w-4", colorClasses.iconColor)} />
            </div>
            <div>
              <p className="font-semibold mb-1">Blockchain Protection</p>
              <p className="text-xs opacity-90 leading-relaxed">
                This template includes specialized fields and validation designed for optimal{" "}
                {template.name.toLowerCase()}
                intellectual property registration and blockchain-based proof of ownership.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Template Documentation
          </Button>
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
        bgGradient: "bg-outrun-cyan/5",
        bgLight: "bg-outrun-cyan/5 border border-outrun-cyan/20",
        iconColor: "text-outrun-cyan",
        border: "border-outrun-cyan/30",
      }
    case "purple":
    case "violet":
      return {
        bgGradient: "bg-outrun-magenta/5",
        bgLight: "bg-outrun-magenta/5 border border-outrun-magenta/20",
        iconColor: "text-outrun-magenta",
        border: "border-outrun-magenta/30",
      }
    case "amber":
    case "orange":
      return {
        bgGradient: "bg-outrun-yellow/5",
        bgLight: "bg-amber-500/5 border border-amber-500/20",
        iconColor: "text-amber-500",
        border: "border-amber-500/30",
      }
    case "teal":
    case "emerald":
      return {
        bgGradient: "bg-neon-cyan/5",
        bgLight: "bg-teal-500/5 border border-teal-500/20",
        iconColor: "text-teal-500",
        border: "border-teal-500/30",
      }
    case "red":
      return {
        bgGradient: "bg-red-500/5",
        bgLight: "bg-red-500/5 border border-red-500/20",
        iconColor: "text-red-500",
        border: "border-red-500/30",
      }
    case "sky":
    case "indigo":
      return {
        bgGradient: "bg-blue-500/5",
        bgLight: "bg-blue-500/5 border border-blue-500/20",
        iconColor: "text-blue-500",
        border: "border-blue-500/30",
      }
    case "slate":
    case "gray":
    default:
      return {
        bgGradient: "bg-muted/50",
        bgLight: "bg-muted/50 border border-border",
        iconColor: "text-foreground",
        border: "border-border",
      }
  }
}

