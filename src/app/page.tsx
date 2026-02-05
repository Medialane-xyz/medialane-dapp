"use client"

import { FullScreenHero } from "@/components/hero/full-screen-hero"
import { AnnouncementBanner } from "@/components/announcement-banner"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <FullScreenHero />

      <div className="relative z-10 bg-background">
        <AnnouncementBanner />
      </div>

    </div>
  )
}
