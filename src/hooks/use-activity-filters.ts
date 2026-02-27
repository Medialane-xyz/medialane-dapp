"use client"

import { useState, useEffect, useMemo } from "react"
import { Activity } from "@/hooks/use-activities"

export function useActivityFilters(activities: Activity[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const filtered = useMemo(() => {
    let r = activities
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      r = r.filter(
        (a) =>
          a.assetName.toLowerCase().includes(q) ||
          a.user.toLowerCase().includes(q) ||
          a.details.toLowerCase().includes(q) ||
          a.txHash.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== "all") r = r.filter((a) => a.type === typeFilter)
    return r
  }, [activities, debouncedSearch, typeFilter])

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filtered,
    clearFilters: () => {
      setSearchQuery("")
      setTypeFilter("all")
    },
    // Use debouncedSearch so hasActiveFilters aligns with the actual filtered output
    hasActiveFilters: debouncedSearch !== "" || typeFilter !== "all",
  }
}
