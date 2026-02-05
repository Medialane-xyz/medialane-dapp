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
    <Card className="overflow-hidden">
      <CardHeader className={cn("pb-4 relative overflow-hidden", colorClasses.bgGradient)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-3 rounded-xl shadow-lg", colorClasses.iconBg)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.iconColor)} />
            </div>
            <div className="flex flex-col gap-1">
              {isPopular && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-xl mb-2">{template.name} Template</CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="outline" className="text-xs bg-white/20 border-white/30">
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
        bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30",
        bgLight: "bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50",
        iconBg: "bg-white/90 dark:bg-blue-900/50",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      }
    case "purple":
      return {
        bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30",
        bgLight: "bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/50",
        iconBg: "bg-white/90 dark:bg-purple-900/50",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
      }
    case "teal":
      return {
        bgGradient: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30",
        bgLight: "bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-800/50",
        iconBg: "bg-white/90 dark:bg-teal-900/50",
        iconColor: "text-teal-600 dark:text-teal-400",
        border: "border-teal-200 dark:border-teal-800",
      }
    case "violet":
      return {
        bgGradient: "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/30",
        bgLight: "bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/50 dark:border-violet-800/50",
        iconBg: "bg-white/90 dark:bg-violet-900/50",
        iconColor: "text-violet-600 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
      }
    case "red":
      return {
        bgGradient: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30",
        bgLight: "bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50",
        iconBg: "bg-white/90 dark:bg-red-900/50",
        iconColor: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
      }
    case "amber":
      return {
        bgGradient: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30",
        bgLight: "bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50",
        iconBg: "bg-white/90 dark:bg-amber-900/50",
        iconColor: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
      }
    case "sky":
      return {
        bgGradient: "bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/50 dark:to-sky-900/30",
        bgLight: "bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-800/50",
        iconBg: "bg-white/90 dark:bg-sky-900/50",
        iconColor: "text-sky-600 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-800",
      }
    case "indigo":
      return {
        bgGradient: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30",
        bgLight: "bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/50",
        iconBg: "bg-white/90 dark:bg-indigo-900/50",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
      }
    case "emerald":
      return {
        bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
        bgLight: "bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50",
        iconBg: "bg-white/90 dark:bg-emerald-900/50",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
      }
    case "gray":
      return {
        bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30",
        bgLight: "bg-gray-50/50 dark:bg-gray-950/20 border border-gray-200/50 dark:border-gray-700/50",
        iconBg: "bg-white/90 dark:bg-gray-800/50",
        iconColor: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
    case "slate":
      return {
        bgGradient: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30",
        bgLight: "bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-700/50",
        iconBg: "bg-white/90 dark:bg-slate-800/50",
        iconColor: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-700",
      }
    default:
      return {
        bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30",
        bgLight: "bg-gray-50/50 dark:bg-gray-950/20 border border-gray-200/50 dark:border-gray-700/50",
        iconBg: "bg-white/90 dark:bg-gray-800/50",
        iconColor: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
  }
}
