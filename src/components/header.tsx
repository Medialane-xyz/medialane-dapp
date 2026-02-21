"use client";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils"
import { ShoppingBag, Rocket, User, ChevronDown, Command, Boxes } from "lucide-react";
import { Logo } from "@/components/header/logo"
import { ThemeToggle } from "@/components/header/theme-toggle"
import { useCart } from "@/store/use-cart"
import { CartDrawer } from "@/components/cart-drawer"

const WalletConnect = dynamic(() => import("./header/wallet-connect").then(mod => mod.WalletConnect), {
  ssr: false,
});

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { items, setIsOpen } = useCart()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openCommandMenu = (filter?: string) => {
    document.dispatchEvent(new CustomEvent("openCommandMenu", { detail: { filter } }))
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-transparent backdrop-blur-2xl backdrop-saturate-150"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Center: Desktop Smart Navigation Triggers */}
        <div className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCommandMenu("marketplace")}
            className="h-8 gap-2 rounded-full px-4 text-xs font-medium hover:bg-white/50 dark:hover:bg-white/10 text-foreground transition-all"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Explore</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCommandMenu("launchpad")}
            className="h-8 gap-2 rounded-full px-4 text-xs font-medium hover:bg-white/50 dark:hover:bg-white/10 text-foreground transition-all"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Launchpad</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCommandMenu("portfolio")}
            className="h-8 gap-2 rounded-full px-4 text-xs font-medium hover:bg-white/50 dark:hover:bg-white/10 text-foreground transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">

          {/* Cart Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="relative h-9 w-9 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-foreground"
          >
            <ShoppingBag className="w-4 h-4" />
            {mounted && items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-outrun-cyan text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-background">
                {items.length}
              </span>
            )}
          </Button>

          {/* Wallet Connect */}
          <WalletConnect />

          {/* Theme Toggle (Desktop Only) */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* Command Menu Trigger (Desktop) */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex h-9 gap-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-foreground px-3"
            onClick={() => document.dispatchEvent(new CustomEvent("openCommandMenu"))}
          >
            <Command className="h-3.5 w-3.5" />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">K</span>
            </kbd>
          </Button>

          {/* Mobile CMD Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="flex md:hidden h-9 w-16 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-sm transition-all text-foreground"
            onClick={() => document.dispatchEvent(new CustomEvent("openCommandMenu"))}
          >
            <Command className="h-4 w-4" />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">K</span>
            </kbd>
          </Button>

        </div>
      </div>
      <CartDrawer />
    </header>
  )
}
