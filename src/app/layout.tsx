import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/config/site"
import { ThemeProvider } from "@/components/theme-provider"

import { cn } from "@/lib/utils"
import { SiteFooter } from "@/components/site-footer"
import { ConditionalSiteHeader } from "@/components/ConditionalSiteHeader"
import { TransitionProvider } from "@/contexts/transition-context"
import { ChatWidget } from "@/components/chat-widget"
import { GlobalVideoTransition } from "@/components/global-video-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Tools",
    "Processes",
    "Productivity",
    "Development",
    "Stack",
    "Workflow",
  ],
  authors: [
    {
      name: "Jason Olefson",
      url: "https://jasonolefson.com",
    },
  ],
  creator: "Jason Olefson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: "@olefson",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐙</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
        suppressHydrationWarning
      >
        <TransitionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <ConditionalSiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <ChatWidget />
              <GlobalVideoTransition />
            </div>
          </ThemeProvider>
        </TransitionProvider>
      </body>
    </html>
  )
} 