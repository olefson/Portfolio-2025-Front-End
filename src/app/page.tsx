'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Wrench } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { useTransition } from '@/contexts/transition-context';
import { VideoTransition } from '@/components/video-transition';

export default function Home() {
  const { sourceVideoRef, startTransition, isTransitioning, completeTransition } = useTransition();

  useEffect(() => {
    // Prevent scrolling on the landing page
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Typewriter effect
  const text = "Hello, I'm Jason Olefson.";
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Button data
  const buttons = [
    { label: "About Me", href: "/about", icon: <User className="w-5 h-5" /> },
    { label: "My Work", href: "/projects", icon: <Briefcase className="w-5 h-5" /> },
    { label: "My Toolkit", href: "/toolkit", icon: <Wrench className="w-5 h-5" /> },
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Video Background */}
      <video
        ref={sourceVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/loop.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-[90vw] max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center gap-8 sm:gap-16"
      >
        {/* Title */}
        <div className="space-y-4 sm:space-y-6 text-center">
          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {displayed}
            <motion.span
              className="inline-block w-[2px] sm:w-[3px] h-[1em] bg-white ml-1 -mb-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/80 font-light max-w-lg mx-auto leading-relaxed px-2 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Software Engineer specializing in elegant, user-centric web experiences.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
        >
          {buttons.map((button, index) => (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="w-full sm:w-auto"
            >
              <GlassButton
                href={button.href}
                icon={button.icon}
                onClick={startTransition}
              >
                {button.label}
              </GlassButton>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Video Transition */}
      <VideoTransition
        isTransitioning={isTransitioning}
        onTransitionComplete={completeTransition}
        sourceVideoRef={sourceVideoRef}
        targetPosition={{ x: 0, y: 0, width: 32, height: 32 }}
      />
    </main>
  );
}
