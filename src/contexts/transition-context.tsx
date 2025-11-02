"use client"

import { createContext, useContext, useState, useRef, ReactNode } from 'react'

interface TransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
  completeTransition: () => void
  sourceVideoRef: React.RefObject<HTMLVideoElement | null>
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sourceVideoRef = useRef<HTMLVideoElement>(null)

  const startTransition = () => {
    setIsTransitioning(true)
  }

  const completeTransition = () => {
    setIsTransitioning(false)
  }

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        startTransition,
        completeTransition,
        sourceVideoRef
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
