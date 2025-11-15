import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface PlanetCardProps {
  title: string;
  description: string;
  progress: number;
  color: 'cyan' | 'purple' | 'teal' | 'magenta' | 'blue';
  onClick: () => void;
  position: { x: number; y: number };
}

export function PlanetCard({ title, description, progress, color, onClick, position }: PlanetCardProps) {
  const colorVariants = {
    cyan: {
      glow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
      border: 'border-cyan-400',
      gradient: 'from-cyan-500/30 to-cyan-600/30',
      text: 'text-cyan-400'
    },
    purple: {
      glow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
      border: 'border-purple-400',
      gradient: 'from-purple-500/30 to-purple-600/30',
      text: 'text-purple-400'
    },
    teal: {
      glow: 'shadow-[0_0_40px_rgba(45,212,191,0.6)]',
      border: 'border-teal-400',
      gradient: 'from-teal-500/30 to-teal-600/30',
      text: 'text-teal-400'
    },
    magenta: {
      glow: 'shadow-[0_0_40px_rgba(232,121,249,0.6)]',
      border: 'border-pink-400',
      gradient: 'from-pink-500/30 to-pink-600/30',
      text: 'text-pink-400'
    },
    blue: {
      glow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
      border: 'border-blue-400',
      gradient: 'from-blue-500/30 to-blue-600/30',
      text: 'text-blue-400'
    }
  };

  const variant = colorVariants[color];

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      {/* Planet orb */}
      <div className={`
        w-20 h-20 rounded-full ${variant.glow} ${variant.border} border-2
        bg-gradient-to-br ${variant.gradient} backdrop-blur-sm
        flex items-center justify-center relative
        transition-all duration-300
      `}>
        <div className="absolute inset-2 rounded-full border border-white/30 animate-[pulse-glow_2s_ease-in-out_infinite]" />
        <div className="absolute inset-4 rounded-full border border-white/20" />
        <span className={`${variant.text} z-10`}>{progress}%</span>
      </div>

      {/* Info card on hover */}
      <motion.div
        className={`
          absolute left-24 top-0 w-64 p-4 opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto
          backdrop-blur-xl bg-slate-900/90 border-2 ${variant.border}
          rounded-lg ${variant.glow} transition-all duration-300
        `}
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        <h4 className={variant.text}>{title}</h4>
        <p className="text-slate-300 text-sm mt-2">{description}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-slate-400">Enter Module</span>
          <ChevronRight className={`w-4 h-4 ${variant.text}`} />
        </div>
      </motion.div>
    </motion.div>
  );
}
