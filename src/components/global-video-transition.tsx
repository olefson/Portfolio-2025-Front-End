"use client"

import { useTransition } from '@/contexts/transition-context'
import { VideoTransition } from './video-transition'

export function GlobalVideoTransition() {
  const { 
    isTransitioning, 
    completeTransition, 
    sourceVideoRef,
    comingFromLanding,
    setComingFromLanding
  } = useTransition()

  return (
    <VideoTransition
      isTransitioning={isTransitioning}
      onTransitionComplete={completeTransition}
      sourceVideoRef={sourceVideoRef}
      targetPosition={{ x: 0, y: 0, width: 56, height: 56 }}
      comingFromLanding={comingFromLanding}
      onLandingTransitionComplete={() => setComingFromLanding(false)}
    />
  )
}

