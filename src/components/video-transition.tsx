"use client"

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoTransitionProps {
  isTransitioning: boolean
  onTransitionComplete: () => void
  sourceVideoRef: React.RefObject<HTMLVideoElement | null>
  targetPosition: { x: number; y: number; width: number; height: number }
  comingFromLanding: boolean
  onLandingTransitionComplete: () => void
}

export function VideoTransition({ 
  isTransitioning, 
  onTransitionComplete, 
  sourceVideoRef,
  targetPosition,
  comingFromLanding,
  onLandingTransitionComplete
}: VideoTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [calculatedTargetPosition, setCalculatedTargetPosition] = useState(targetPosition)
  const transitionRef = useRef<HTMLVideoElement>(null)

  // Handle transition FROM landing page (on landing page itself - shrinking animation)
  useEffect(() => {
    if (isTransitioning && pathname === '/') {
      setIsVisible(true)
      
      // Calculate the actual chat widget position when transition starts
      // Chat widget is at bottom-6 right-6 (24px from bottom and right), size h-14 w-14 (56px)
      const chatWidgetElement = document.querySelector('[data-chat-widget-ref]')
      if (chatWidgetElement) {
        const rect = chatWidgetElement.getBoundingClientRect()
        setCalculatedTargetPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        })
      } else {
        // Calculate position manually for landing page (where chat widget is hidden)
        // bottom-6 = 24px from bottom, right-6 = 24px from right, size = 56px
        const buttonSize = 56
        const offset = 24
        setCalculatedTargetPosition({
          x: window.innerWidth - buttonSize - offset,
          y: window.innerHeight - buttonSize - offset,
          width: buttonSize,
          height: buttonSize
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
  }, [isTransitioning, sourceVideoRef, pathname])

  // Handle transition TO destination pages (shrinking animation to chat widget)
  useEffect(() => {
    if (comingFromLanding && pathname !== '/') {
      // Calculate chat widget position (destination pages) - target position
      const calculateTarget = () => {
        const chatWidgetElement = document.querySelector('[data-chat-widget-ref]')
        let targetPosition = { x: 0, y: 0, width: 56, height: 56 }
        
        if (chatWidgetElement) {
          const rect = chatWidgetElement.getBoundingClientRect()
          targetPosition = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          }
        } else {
          // Fallback: calculate position manually (bottom right corner)
          const buttonSize = 56
          const offset = 24
          targetPosition = {
            x: window.innerWidth - buttonSize - offset,
            y: window.innerHeight - buttonSize - offset,
            width: buttonSize,
            height: buttonSize
          }
        }
        
        setCalculatedTargetPosition(targetPosition)
        return targetPosition
      }
      
      // Calculate position immediately
      calculateTarget()
      
      // Small delay to ensure DOM is ready, then start animation
      const initTimer = setTimeout(() => {
        // Recalculate in case layout changed
        calculateTarget()
        
        setIsVisible(true)
        setIsExpanded(false)
        
        // Start video from beginning for shrinking animation
        if (transitionRef.current) {
          transitionRef.current.currentTime = 0
          transitionRef.current.play()
        }
      }, 100)
      
      return () => clearTimeout(initTimer)
    } else if (pathname === '/') {
      // Reset state when back on landing page
      setIsVisible(false)
      setIsExpanded(false)
      if (transitionRef.current) {
        transitionRef.current.pause()
        transitionRef.current.currentTime = 0
      }
    }
  }, [comingFromLanding, pathname])

  const handleVideoAnimationComplete = () => {
    if (pathname === '/') {
      // Landing page: shrink animation complete, hide
      setIsVisible(false)
      onTransitionComplete()
    } else {
      // Destination page: expansion to full screen complete, immediately start fade out
      setIsExpanded(true)
      // Pause the video when starting fade out
      if (transitionRef.current) {
        transitionRef.current.pause()
      }
    }
  }
  
  // Handle fade out completion on destination pages
  useEffect(() => {
    if (pathname !== '/' && isExpanded && isVisible) {
      // After fade out animation completes, hide and cleanup
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false)
        setIsExpanded(false)
        // Stop the video completely
        if (transitionRef.current) {
          transitionRef.current.pause()
          transitionRef.current.currentTime = 0
        }
        onLandingTransitionComplete()
      }, 500) // Match fade out duration
      
      return () => clearTimeout(fadeOutTimer)
    }
  }, [isExpanded, pathname, isVisible, onLandingTransitionComplete])

  // Cleanup: Hide animation if comingFromLanding becomes false
  useEffect(() => {
    if (!comingFromLanding && pathname !== '/') {
      setIsVisible(false)
      setIsExpanded(false)
      if (transitionRef.current) {
        transitionRef.current.pause()
        transitionRef.current.currentTime = 0
      }
    }
  }, [comingFromLanding, pathname])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={pathname !== '/' && isExpanded ? { opacity: 0 } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: pathname !== '/' && isExpanded ? 0.5 : 0.3,
            ease: 'easeOut'
          }}
          style={{
            pointerEvents: pathname !== '/' && isExpanded ? 'none' : 'none'
          }}
        >
          <motion.video
            ref={transitionRef}
            autoPlay
            muted
            loop={!isExpanded || pathname === '/'}
            playsInline
            className="absolute object-cover"
            style={{
              opacity: pathname !== '/' && isExpanded ? 0 : 1
            }}
            initial={pathname === '/' ? {
              // Landing page: Start full screen, shrink to chat widget
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0
            } : {
              // Destination pages: Start at full screen, shrink to chat widget
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0
            }}
            animate={pathname === '/' ? {
              // Landing page: Shrink to chat widget
              left: calculatedTargetPosition.x,
              top: calculatedTargetPosition.y,
              width: calculatedTargetPosition.width,
              height: calculatedTargetPosition.height,
              borderRadius: '50%'
            } : comingFromLanding ? {
              // Destination pages: Shrink to chat widget (bottom right corner)
              left: calculatedTargetPosition.x,
              top: calculatedTargetPosition.y,
              width: calculatedTargetPosition.width,
              height: calculatedTargetPosition.height,
              borderRadius: '50%'
            } : {
              // Fallback: stay at full screen if not coming from landing
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0
            }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              onComplete: handleVideoAnimationComplete
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
