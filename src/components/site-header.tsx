"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobile-nav"
import { Logo } from "@/components/ui/logo"
import { useEffect, useRef } from "react"
import GlassSurface from "@/components/GlassSurface"

export function SiteHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const logoRef = useRef<HTMLDivElement>(null)

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
      href: "/toolkit",
      label: "Toolkit",
    },
  ]


  return (
    <header className="sticky top-0 z-50 w-full">
      <GlassSurface
        width={"100%" as any}
        height={56 as any}
        borderRadius={0}
        backgroundOpacity={0.5}
        blur={11}
        opacity={0.93}
        displace={0.5}
        className="border-b border-white/20"
      >
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <div ref={logoRef} data-logo-ref>
              <Logo />
            </div>
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
              {route.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <MobileNav routes={routes} />
        </div>
      </div>
      </GlassSurface>
    </header>
  )
} 