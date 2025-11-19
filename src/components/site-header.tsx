"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MobileNav } from "@/components/mobile-nav"
import GlassSurface from "@/components/GlassSurface"

export function SiteHeader() {
  const pathname = usePathname()

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
        width="100%"
        height={56}
        borderRadius={0}
        backgroundOpacity={0.5}
        blur={11}
        opacity={0.93}
        displace={0.5}
        className="border-b border-white/20"
      >
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <Link 
            href="/" 
            className={cn(
              "inline-flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Home
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