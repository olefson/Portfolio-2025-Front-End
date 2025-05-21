"use client";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
 
export function ConditionalSiteHeader() {
  const pathname = usePathname();
  // Hide header only on the root page for maximum simplicity
  if (pathname === "/") return null;
  return <SiteHeader />;
} 