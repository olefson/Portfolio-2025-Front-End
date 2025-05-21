'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Wrench } from 'lucide-react';

export default function Home() {
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
    { label: "My Work", href: "/work", icon: <Briefcase className="w-5 h-5" /> },
    { label: "My Toolkit", href: "/toolkit", icon: <Wrench className="w-5 h-5" /> },
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/loop.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-[90vw] max-w-xl mx-auto px-6 py-8 flex flex-col items-center gap-12"
      >
        {/* Title */}
        <div className="space-y-4 text-center">
          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl font-light text-white/90 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {displayed}
            <motion.span
              className="inline-block w-[2px] h-[1em] bg-white/80 ml-1 -mb-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-white/60 font-light max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Software Engineer specializing in elegant, user-centric web experiences.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {buttons.map((btn, idx) => (
            <motion.a
              key={btn.label}
              href={btn.href}
              className="group relative px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
            >
              {btn.icon}
              <span className="text-sm font-light text-white/90">
                {btn.label}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
