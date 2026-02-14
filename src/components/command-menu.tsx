"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutGrid,
  PlusCircle,
  Moon,
  Sun,
  Laptop,
  GitBranch,
  ArrowRightLeft,
  Search,
  Command,
  Home,
  ArrowLeft,
  Wallet,
  LogOut
} from "lucide-react"
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core"
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { navigation } from "@/config/navigation"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [activePage, setActivePage] = React.useState<string | null>(null)
  const router = useRouter()
  const { setTheme } = useTheme()

  // Wallet Hooks
  const { connectAsync, connectors } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  })

  const handleConnect = async () => {
    try {
      const { connector } = await starknetkitConnectModal()
      if (!connector) return
      await connectAsync({ connector })
    } catch (err) {
      console.error("Failed to connect wallet", err)
    }
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        setActivePage(null) // Reset to root on toggle
      }
    }

    const openMenu = (e: CustomEvent) => {
      setOpen(true)
      if (e.detail?.filter) {
        setActivePage(e.detail.filter)
      } else {
        setActivePage(null)
      }
    }

    document.addEventListener("keydown", down)
    document.addEventListener("openCommandMenu", openMenu as EventListener)

    return () => {
      document.removeEventListener("keydown", down)
      document.removeEventListener("openCommandMenu", openMenu as EventListener)
    }
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  // Render content based on active page
  const renderContent = () => {
    if (activePage === "marketplace") {
      return (
        <CommandGroup heading="Marketplace">
          {navigation.marketplace.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
          </CommandItem>
        </CommandGroup>
      )
    }

    if (activePage === "launchpad") {
      return (
        <CommandGroup heading="Launchpad">
          {navigation.launchpad.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
          </CommandItem>
        </CommandGroup>
      )
    }

    if (activePage === "portfolio") {
      return (
        <CommandGroup heading="Portfolio">
          {navigation.portfolio.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
          </CommandItem>
        </CommandGroup>
      )
    }

    if (activePage === "create") {
      return (
        <CommandGroup heading="Create">
          {navigation.create.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
          </CommandItem>
        </CommandGroup>
      )
    }

    if (activePage === "discover") {
      return (
        <CommandGroup heading="Discover">
          {navigation.discover.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
          </CommandItem>
        </CommandGroup>
      )
    }

    if (activePage === "resources") {
      return (
        <CommandGroup heading="Resources">
          {navigation.resources.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
          </CommandItem>
        </CommandGroup>
      )
    }

    // Default Root View (All Categories)
    return (
      <>
        {/* Wallet Section - Top Priority if disconnected */}
        {!isConnected && (
          <CommandGroup heading="Wallet">
            <CommandItem onSelect={() => runCommand(handleConnect)}>
              <Wallet className="mr-2 h-4 w-4 text-cyan-500" />
              <span className="font-medium text-cyan-500">Connect Wallet</span>
            </CommandItem>
          </CommandGroup>
        )}

        {isConnected && (
          <CommandGroup heading="Wallet">
            <CommandItem onSelect={() => runCommand(disconnect)}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Disconnect ({address?.slice(0, 6)}...{address?.slice(-4)})</span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Main">
          {navigation.main.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Marketplace">
          {navigation.marketplace.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Launchpad">
          {navigation.launchpad.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Details">
          <CommandItem onSelect={() => runCommand(() => setActivePage("discover"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Discover...</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage("create"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create...</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage("resources"))}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            <span>Resources...</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Socials">
          {navigation.socials.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => window.open(navItem.href, '_blank'))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
      </>
    )

  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={activePage ? `Search ${activePage}...` : "Type a command or search..."} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {renderContent()}
      </CommandList>
    </CommandDialog>
  )
}
