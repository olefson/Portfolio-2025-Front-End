import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import GlassSurface from "@/components/GlassSurface";

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
  const content = (
    <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-white">
      {icon}
      {children}
    </div>
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`block w-full ${className}`}
      >
        <GlassSurface
          width={"100%" as any}
          height={"auto" as any}
          borderRadius={12}
          backgroundOpacity={0.1}
          blur={11}
          opacity={0.93}
          displace={0.5}
          className="cursor-pointer"
        >
          {content}
        </GlassSurface>
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`block w-full ${className}`}
    >
      <Link
        href={href}
        onClick={onClick}
        className="block w-full"
      >
        <GlassSurface
          width={"100%" as any}
          height={"auto" as any}
          borderRadius={12}
          backgroundOpacity={0.1}
          blur={11}
          opacity={0.93}
          displace={0.5}
          className="cursor-pointer"
        >
          {content}
        </GlassSurface>
      </Link>
    </motion.div>
  );
}
