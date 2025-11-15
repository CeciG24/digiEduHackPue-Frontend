import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'teal' | 'magenta' | 'none';
  animate?: boolean;
}

export function GlassPanel({ 
  children, 
  className = '', 
  glow = 'cyan',
  animate = true 
}: GlassPanelProps) {
  const glowColors = {
    cyan: 'shadow-[0_0_30px_rgba(6,182,212,0.3)] border-cyan-500/50',
    purple: 'shadow-[0_0_30px_rgba(168,85,247,0.3)] border-purple-500/50',
    teal: 'shadow-[0_0_30px_rgba(45,212,191,0.3)] border-teal-500/50',
    magenta: 'shadow-[0_0_30px_rgba(232,121,249,0.3)] border-pink-500/50',
    none: 'border-white/20'
  };

  const Panel = animate ? motion.div : 'div';

  return (
    <Panel
      className={`
        relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5
        border border-solid rounded-lg p-6
        ${glowColors[glow]} ${className}
      `}
      {...(animate ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      } : {})}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-[scan-line_3s_ease-in-out_infinite]" />
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80" />
      
      <div className="relative z-10">{children}</div>
    </Panel>
  );
}
