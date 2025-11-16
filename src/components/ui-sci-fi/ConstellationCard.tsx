import { motion } from 'motion/react';

interface ConstellationCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  moduleCount: number;
  color: 'cyan' | 'purple' | 'teal' | 'magenta';
  position: { x: number; y: number };
  stars: { x: number; y: number }[];
  onClick: () => void;
}

export function ConstellationCard({ 
  id,
  title, 
  description, 
  progress, 
  moduleCount,
  color, 
  position, 
  stars,
  onClick 
}: ConstellationCardProps) {
  const colorVariants = {
    cyan: {
      glow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
      star: '#06b6d4',
      line: 'rgba(6,182,212,0.6)',
      text: 'text-cyan-400',
      border: 'border-cyan-400'
    },
    purple: {
      glow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
      star: '#a855f7',
      line: 'rgba(168,85,247,0.6)',
      text: 'text-purple-400',
      border: 'border-purple-400'
    },
    teal: {
      glow: 'shadow-[0_0_40px_rgba(45,212,191,0.6)]',
      star: '#2dd4bf',
      line: 'rgba(45,212,191,0.6)',
      text: 'text-teal-400',
      border: 'border-teal-400'
    },
    magenta: {
      glow: 'shadow-[0_0_40px_rgba(232,121,249,0.6)]',
      star: '#e879f9',
      line: 'rgba(232,121,249,0.6)',
      text: 'text-pink-400',
      border: 'border-pink-400'
    }
  };

  const variant = colorVariants[color];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🖱️ ConstellationCard onClick:", id, title);
    onClick();
  };

  return (
    <motion.g
      className="cursor-pointer constellation-group"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Invisible clickable area - MUST BE FIRST */}
      <circle
        cx={position.x}
        cy={position.y}
        r="100"
        fill="transparent"
        style={{ cursor: 'pointer' }}
      />

      {/* Constellation lines */}
      {stars.map((star, index) => {
        if (index < stars.length - 1) {
          return (
            <line
              key={`line-${index}`}
              x1={position.x + star.x}
              y1={position.y + star.y}
              x2={position.x + stars[index + 1].x}
              y2={position.y + stars[index + 1].y}
              stroke={variant.line}
              strokeWidth="2"
              opacity="0.6"
              style={{ pointerEvents: 'none' }}
            />
          );
        }
        return null;
      })}

      {/* Constellation stars */}
      {stars.map((star, index) => (
        <g key={`star-${index}`} style={{ pointerEvents: 'none' }}>
          <circle
            cx={position.x + star.x}
            cy={position.y + star.y}
            r="4"
            fill={variant.star}
            className="animate-[pulse-glow_2s_ease-in-out_infinite]"
          />
          <circle
            cx={position.x + star.x}
            cy={position.y + star.y}
            r="8"
            fill="none"
            stroke={variant.star}
            strokeWidth="1"
            opacity="0.3"
          />
        </g>
      ))}

      {/* Center label area */}
<foreignObject
  x={position.x - 80}
  y={position.y - 100}
  width="160"
  height="200"
  onClick={(e) => {
    e.stopPropagation();
    console.log("🖱️ Click en foreignObject");
    onClick();
  }}
  style={{ cursor: 'pointer',pointerEvents: 'auto' }} // ✅ Cambio: permitir clicks
>
  <div 
    className="flex flex-col items-center"
    onClick={(e) => {
      e.stopPropagation();
      console.log("🖱️ Click en div interno");
      onClick();
    }}
  >
    <div className={`px-4 py-2 backdrop-blur-xl bg-slate-900/90 border-2 ${variant.border} rounded-lg ${variant.glow}`}>
      <h4 className={`${variant.text} text-center text-sm mb-1`}>{title}</h4>
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <span>{moduleCount} módulos</span>
        <span>•</span>
        <span>{progress}%</span>
      </div>
    </div>
  </div>
</foreignObject>
    </motion.g>
  );
}