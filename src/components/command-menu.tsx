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
  LogOut,
  Book,
  ShoppingBag,
  Rocket
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
  const [search, setSearch] = React.useState("")
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

  // Flatten navigation for Global Search
  const allItems = React.useMemo(() => {
    const items: { category: string; title: string; href: string; icon: any }[] = []
    Object.entries(navigation).forEach(([key, value]) => {
      // @ts-ignore
      value.forEach((item: any) => {
        items.push({ category: key, ...item })
      })
    })
    return items
  }, [])

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
        setSearch("")
      }
    }

    const openMenu = (e: CustomEvent) => {
      setOpen(true)
      if (e.detail?.filter) {
        setActivePage(e.detail.filter)
      } else {
        setActivePage(null)
      }
      setSearch("")
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

  // Handle Backspace to go up a level
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !search && activePage) {
      e.preventDefault()
      setActivePage(null)
    }
  }

  // Dynamic Content Rendering
  const renderContent = () => {
    // 1. If searching, show global results flattened (grouped by category)
    if (search) {
      return (
        <>
          {Object.keys(navigation).map((group) => {
            const groupItems = allItems.filter((item) => item.category === group && item.title.toLowerCase().includes(search.toLowerCase()))
            if (groupItems.length === 0) return null
            return (
              <CommandGroup key={group} heading={group.charAt(0).toUpperCase() + group.slice(1)}>
                {groupItems.map((item) => (
                  <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(item.href))}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground capitalize">{item.category}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </>
      )
    }

    // 2. If activePage is set, show that category
    if (activePage) {
      const categoryItems = (navigation as any)[activePage]
      if (!categoryItems) return null

      return (
        <CommandGroup heading={activePage.charAt(0).toUpperCase() + activePage.slice(1)}>
          {categoryItems.map((navItem: any) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
          <CommandSeparator className="my-2" />
          <CommandItem onSelect={() => setActivePage(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Main Menu</span>
            <CommandShortcut>⌫</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      )
    }

    // 3. Root View (Default)
    return (
      <>
        {/* Wallet Section */}
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

        {/* Main Navigation (Always visible) */}
        <CommandGroup heading="Main">
          {navigation.main.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => router.push(navItem.href))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Drill-down Categories */}
        <CommandGroup heading="Categories">
          <CommandItem onSelect={() => setActivePage("marketplace")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Marketplace...</span>
          </CommandItem>
          <CommandItem onSelect={() => setActivePage("launchpad")}>
            <Rocket className="mr-2 h-4 w-4" />
            <span>Launchpad...</span>
          </CommandItem>
          <CommandItem onSelect={() => setActivePage("portfolio")}>
            <User className="mr-2 h-4 w-4" />
            <span>Portfolio...</span>
          </CommandItem>
          <CommandItem onSelect={() => setActivePage("create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create...</span>
          </CommandItem>
          <CommandItem onSelect={() => setActivePage("discover")}>
            <Search className="mr-2 h-4 w-4" />
            <span>Discover...</span>
          </CommandItem>
          <CommandItem onSelect={() => setActivePage("resources")}>
            <Book className="mr-2 h-4 w-4" />
            <span>Resources...</span>
          </CommandItem>
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

        <CommandGroup heading="Socials">
          {navigation.socials.map((navItem) => (
            <CommandItem key={navItem.href} onSelect={() => runCommand(() => window.open(navItem.href, '_blank'))}>
              <navItem.icon className="mr-2 h-4 w-4" />
              <span>{navItem.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </>
    )

  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={activePage ? `Search ${activePage}...` : "Type to search all commands..."}
        value={search}
        onValueChange={setSearch}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {renderContent()}
      </CommandList>
    </CommandDialog>
  )
}
