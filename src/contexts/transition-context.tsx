"use client"

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface TransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
  completeTransition: () => void
  sourceVideoRef: React.RefObject<HTMLVideoElement | null>
  comingFromLanding: boolean
  setComingFromLanding: (value: boolean) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [comingFromLanding, setComingFromLanding] = useState(false)
  const sourceVideoRef = useRef<HTMLVideoElement>(null)

  // Check if we're coming from landing page on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fromLanding = sessionStorage.getItem('comingFromLanding') === 'true'
      if (fromLanding && pathname !== '/') {
        setComingFromLanding(true)
        // Clear the flag after a short delay to allow animation to start
        setTimeout(() => {
          sessionStorage.removeItem('comingFromLanding')
        }, 100)
      }
    }
  }, [pathname])

  const startTransition = () => {
    setIsTransitioning(true)
    // Mark that we're navigating from landing page
    if (typeof window !== 'undefined' && pathname === '/') {
      sessionStorage.setItem('comingFromLanding', 'true')
    }
  }

  const completeTransition = () => {
    setIsTransitioning(false)
    setComingFromLanding(false)
  }

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        startTransition,
        completeTransition,
        sourceVideoRef,
        comingFromLanding,
        setComingFromLanding
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}
