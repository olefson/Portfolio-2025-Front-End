import React from "react";

export function Separator({ className = "" }: { className?: string }) {
  return (
    <hr
      className={`
        border-0
        h-1
        w-full
        my-6
        rounded-full
        bg-gradient-to-r from-primary/20 via-muted-foreground/30 to-primary/20
        opacity-0 animate-fadeIn
        ${className}
      `}
      style={{ animation: 'fadeIn 0.8s ease forwards' }}
    />
  );
}

// Add fadeIn animation to global styles if not present
// @keyframes fadeIn { to { opacity: 1; } } 