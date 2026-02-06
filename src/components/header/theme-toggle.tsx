"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <button className="h-9 w-9 rounded-full bg-white/5 border border-white/10" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full flex items-center justify-center bg-white/5 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10 border border-white/10 dark:border-white/5 transition-all duration-200"
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground/70" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground/70" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}