"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobile-nav"
import { Logo } from "@/components/ui/logo"

export function SiteHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const routes = [
    {
      href: "/about",
      label: "About Me",
    },
    {
      href: "/projects",
      label: "Projects",
    },
    {
      href: "/tools",
      label: "Tools",
    },
    {
      href: "/processes",
      label: "Processes",
    },
    {
      href: "/edit",
      label: "Edit",
      icon: <Pencil1Icon className="h-4 w-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "transition-colors hover:text-foreground/80 inline-flex items-center gap-1",
                pathname === route.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {route.icon && <span>{route.icon}</span>}
              {route.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <MobileNav routes={routes} />
        </div>
      </div>
    </header>
  )
} 