"use client"

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoTransitionProps {
  isTransitioning: boolean
  onTransitionComplete: () => void
  sourceVideoRef: React.RefObject<HTMLVideoElement | null>
  targetPosition: { x: number; y: number; width: number; height: number }
}

export function VideoTransition({ 
  isTransitioning, 
  onTransitionComplete, 
  sourceVideoRef,
  targetPosition 
}: VideoTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [calculatedTargetPosition, setCalculatedTargetPosition] = useState(targetPosition)
  const transitionRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true)
      
      // Calculate the actual logo position when transition starts
      const logoElement = document.querySelector('[data-logo-ref]')
      if (logoElement) {
        const rect = logoElement.getBoundingClientRect()
        setCalculatedTargetPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        })
      }
      
      // Copy the source video to our transition element
      if (sourceVideoRef.current && transitionRef.current) {
        const sourceVideo = sourceVideoRef.current
        const transitionVideo = transitionRef.current
        
        // Copy current time and state
        transitionVideo.currentTime = sourceVideo.currentTime
        transitionVideo.play()
      }
    }
  }, [isTransitioning, sourceVideoRef])

  const handleAnimationComplete = () => {
    setIsVisible(false)
    onTransitionComplete()
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.video
            ref={transitionRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute object-cover"
            style={{
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh'
            }}
            initial={{
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0
            }}
            animate={{
              left: calculatedTargetPosition.x,
              top: calculatedTargetPosition.y,
              width: calculatedTargetPosition.width,
              height: calculatedTargetPosition.height,
              borderRadius: '50%'
            }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              onComplete: handleAnimationComplete
            }}
          >
            <source src="/videos/loop.mp4" type="video/mp4" />
          </motion.video>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
