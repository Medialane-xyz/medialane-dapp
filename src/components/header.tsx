"use client";
import { useState, useEffect } from "react"
import { MobileSidebar } from "@/components/header/sidebar"
import { MainNav } from "@/components/header/nav"
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils"
import { Search, Command } from "lucide-react";

const WalletConnect = dynamic(() => import("./header/wallet-connect").then(mod => mod.WalletConnect), {
  ssr: false,
});
import { ThemeToggle } from "@/components/header/theme-toggle"
import { Logo } from "@/components/header/logo"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-white/10 dark:bg-slate-950/30 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <MainNav />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">

          {/* Wallet Connect */}
          <WalletConnect />

          {/* Command Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex h-9 w-9 rounded-full bg-white/5 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10 border border-white/10 dark:border-white/5 transition-all duration-200"
            onClick={() => document.dispatchEvent(new CustomEvent("openCommandMenu"))}
            title="Open Command Menu (Cmd+K)"
          >
            <Command className="h-4 w-4 text-foreground/70" />
            <span className="sr-only">Open Command Menu</span>
          </Button>

          {/* Theme Toggle */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <MobileSidebar />
        </div>
      </div>
    </header>
  )
}
