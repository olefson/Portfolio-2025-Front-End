import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
  external?: boolean;
}

export function GlassButton({ 
  href, 
  children, 
  className = "", 
  icon,
  onClick,
  external = false 
}: GlassButtonProps) {
  const baseClasses = "group relative flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm";
  
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${className}`}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className={`${baseClasses} ${className}`}
        onClick={onClick}
      >
        {content}
      </Link>
    </motion.div>
  );
}
