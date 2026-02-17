"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Command, Github, Twitter, Send } from "lucide-react"

export function Footer() {
  const openCommandMenu = (filter?: string) => {
    document.dispatchEvent(new CustomEvent("openCommandMenu", { detail: { filter } }))
  }

  const fadeIn: any = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  return (
    <footer className="w-full relative py-10 select-none bg-transparent">
      <div className="container mx-auto px-6">

        {/* Main Hub Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">

          {/* Column 1: Platform */}
          <motion.div {...fadeIn} className="flex flex-col gap-6">
            <h4 className="text-[11px] tracking-[0.2em] text-foreground/40">Platform</h4>
            <div className="flex flex-col gap-4">
              <FooterLink onClick={() => openCommandMenu("discover")}>Discover</FooterLink>
              <FooterLink onClick={() => openCommandMenu("launchpad")}>Launchpad</FooterLink>
              <FooterLink onClick={() => openCommandMenu("portfolio")}>Portfolio</FooterLink>
              <FooterLink onClick={() => openCommandMenu("search")}>Search Hub</FooterLink>
            </div>
          </motion.div>

          {/* Column 2: Create */}
          <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} className="flex flex-col gap-6">
            <h4 className="text-[11px] tracking-[0.2em] text-foreground/40">Create</h4>
            <div className="flex flex-col gap-4">
              <Link href="/create" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Mint IP</Link>
              <Link href="/create/remix" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Start Remix</Link>
              <Link href="/launchpad/create" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">IP Clubs</Link>
              <Link href="/templates" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Licensing</Link>
            </div>
          </motion.div>

          {/* Column 3: Marketplace */}
          <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} className="flex flex-col gap-6">
            <h4 className="text-[11px] tracking-[0.2em] text-foreground/40">Marketplace</h4>
            <div className="flex flex-col gap-4">
              <Link href="/marketplace" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">All Assets</Link>
              <Link href="/collections" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Top Collections</Link>
              <Link href="/marketplace?sort=trending" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Trending Now</Link>
              <Link href="/marketplace?sort=new" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Newest Drops</Link>
            </div>
          </motion.div>

          {/* Column 4: Security */}
          <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.3 }} className="flex flex-col gap-6">
            <h4 className="text-[11px] tracking-[0.2em] text-foreground/40">Guidelines</h4>
            <div className="flex flex-col gap-4">
              <Link href="/privacy" className="text-[11px] tracking-widest text-foreground/20 hover:text-foreground/50 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[11px] tracking-widest text-foreground/20 hover:text-foreground/50 transition-colors">Terms of Service</Link>
            </div>
          </motion.div>

        </div>

        {/* Global Bottom Bar */}
        <motion.div
          {...fadeIn}
          transition={{ ...fadeIn.transition, delay: 0.4 }}
          className="mt-10 pt-10 border-t border-foreground/[0.03] flex flex-col md:flex-row justify-between items-center gap-12"
        >
          {/* Brand Signature */}
          <div className="flex flex-col gap-1 items-center md:items-start">
            <div className="text-muted-foreground">
              © 2026 Medialane
            </div>
          </div>

          {/* Primary Socials */}
          <div className="flex gap-8">
            <SocialLink href="https://x.com/medialane_xyz" icon={<Twitter className="w-4 h-4" />} />
            <SocialLink href="https://github.com/medialanexyz" icon={<Github className="w-4 h-4" />} />
            <SocialLink href="#" icon={<Send className="w-4 h-4" />} />
          </div>

          {/* Command Trigger */}
          <button
            onClick={() => openCommandMenu()}
            className="group relative flex items-center gap-4 py-2.5 px-8 rounded-full bg-foreground/[0.02] border border-foreground/[0.05] hover:bg-foreground/[0.04] hover:border-foreground/[0.1] transition-all duration-300"
          >
            <Command className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            <span className="text-muted-foreground group-hover:text-blue-600">
              <kbd className="ml-2 font-mono group-hover:opacity-60 transition-opacity">⌘K</kbd>
            </span>
          </button>
        </motion.div>

      </div>
    </footer>
  )
}

function FooterLink({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium text-foreground/60 hover:text-foreground transition-all duration-300 w-fit text-left"
    >
      {children}
    </button>
  )
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="text-foreground/20 hover:text-foreground transition-all duration-500 scale-100 hover:scale-110"
    >
      {icon}
    </Link>
  )
}
