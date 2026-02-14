"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Github,
  Twitter,
  Send,
  Book,
  Box,
  Layers,
  Sparkles,
  FileText,
  HelpCircle,
  ChevronUp,
  ExternalLink,
  Shield,
  Zap,
  Globe,
  LayoutGrid,
  Mail,
  Search,
  Command,
  Rocket,
  ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function Footer() {
  const pathname = usePathname()

  const openCommandMenu = (filter?: string) => {
    document.dispatchEvent(new CustomEvent("openCommandMenu", { detail: { filter } }))
  }

  return (
    <footer className="w-full relative z-50 mt-20 pb-8 px-4 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Main Glass Bar - Compact and focused */}
        <div className="rounded-2xl p-2 pl-4 pr-3 flex items-center justify-between gap-4 mx-auto border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/30 dark:bg-black/40 relative overflow-hidden group">

          {/* Subtle Animated Gradient Border Top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 -z-10 rounded-2xl" />

          {/* Left: Branding & Icon */}
          <div className="flex items-center gap-4 min-w-fit">
            <Link href="/" className="group/brand relative hover:scale-110 transition-transform duration-300">
              <Image
                src="/icon.png"
                alt="Medialane"
                width={28}
                height={28}
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Center: Contextual Navigation Triggers */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => openCommandMenu("discover")} className="h-9 gap-2 rounded-full px-4 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all text-foreground">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Discover</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={() => openCommandMenu("launchpad")} className="h-9 gap-2 rounded-full px-4 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all text-foreground">
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Launchpad</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={() => openCommandMenu("marketplace")} className="h-9 gap-2 rounded-full px-4 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all text-foreground">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </Button>
          </nav>

          {/* Right: Socials & Extras */}
          <div className="flex items-center gap-1 min-w-fit pl-2 border-l border-black/5 dark:border-white/10">
            <SocialLink href="https://x.com/MediolanoApp" icon={<Twitter className="w-4 h-4 text-foreground" />} label="X (Twitter)" />
            <SocialLink href="https://github.com/mediolano-app" icon={<Github className="w-4 h-4 text-foreground" />} label="GitHub" />
            <SocialLink href="https://t.me/integrityweb" icon={<Send className="w-4 h-4 text-foreground" />} label="Telegram" />
            <SocialLink href="mailto:medialanexyz@gmail.com" icon={<Mail className="w-4 h-4 text-foreground" />} label="Email" />

            <div className="relative group/cmd">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openCommandMenu()}
                className="h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-foreground transition-all ml-1"
                aria-label="All Commands"
              >
                <Command className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 dark:bg-white/20 backdrop-blur-md rounded-md text-[10px] text-white opacity-0 group-hover/cmd:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Cmd + K
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all" asChild>
      <Link href={href} target="_blank" aria-label={label}>
        {icon}
      </Link>
    </Button>
  )
}
