import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  angle: number;
}

interface ModulePlanetCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  color: 'cyan' | 'purple' | 'teal' | 'magenta' | 'blue';
  position: { x: number; y: number };
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
}

export function ModulePlanetCard({ 
  title, 
  description, 
  progress, 
  color, 
  position, 
  lessons,
  onLessonClick 
}: ModulePlanetCardProps) {
  const colorVariants = {
    cyan: {
      glow: 'drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]',
      planet: '#06b6d4',
      gradient: 'from-cyan-400 to-cyan-600',
      text: 'text-cyan-400',
      border: 'border-cyan-400'
    },
    purple: {
      glow: 'drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]',
      planet: '#a855f7',
      gradient: 'from-purple-400 to-purple-600',
      text: 'text-purple-400',
      border: 'border-purple-400'
    },
    teal: {
      glow: 'drop-shadow-[0_0_20px_rgba(45,212,191,0.8)]',
      planet: '#2dd4bf',
      gradient: 'from-teal-400 to-teal-600',
      text: 'text-teal-400',
      border: 'border-teal-400'
    },
    magenta: {
      glow: 'drop-shadow-[0_0_20px_rgba(232,121,249,0.8)]',
      planet: '#e879f9',
      gradient: 'from-pink-400 to-pink-600',
      text: 'text-pink-400',
      border: 'border-pink-400'
    },
    blue: {
      glow: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]',
      planet: '#3b82f6',
      gradient: 'from-blue-400 to-blue-600',
      text: 'text-blue-400',
      border: 'border-blue-400'
    }
  };

  const variant = colorVariants[color];
  const orbitRadius = 120;

  return (
    <g className="module-planet">
      {/* Orbit path */}
      <circle
        cx={position.x}
        cy={position.y}
        r={orbitRadius}
        fill="none"
        stroke={variant.planet}
        strokeWidth="1"
        strokeDasharray="5,5"
        opacity="0.3"
      />

      {/* Planet */}
      <g className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
        <circle
          cx={position.x}
          cy={position.y}
          r="50"
          fill={`url(#planet-gradient-${color})`}
          className={variant.glow}
        />
        <circle
          cx={position.x}
          cy={position.y}
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <circle
          cx={position.x}
          cy={position.y}
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Progress text */}
        <text
          x={position.x}
          y={position.y + 5}
          textAnchor="middle"
          className="fill-white text-xl font-bold"
        >
          {progress}%
        </text>

        {/* Planet label */}
        <foreignObject
          x={position.x - 75}
          y={position.y + 60}
          width="150"
          height="60"
        >
          <div className="text-center">
            <div className={`${variant.text} text-sm mb-1`}>{title}</div>
            <div className="text-slate-400 text-xs">{lessons.length} lecciones</div>
          </div>
        </foreignObject>
      </g>

      {/* Lesson satellites */}
      {lessons.map((lesson, index) => {
        const angle = (lesson.angle * Math.PI) / 180;
        const x = position.x + orbitRadius * Math.cos(angle);
        const y = position.y + orbitRadius * Math.sin(angle);

        return (
          <g
            key={lesson.id}
            className="cursor-pointer lesson-satellite"
            onClick={() => onLessonClick(lesson.id)}
          >
            {/* Connection line */}
            <line
              x1={position.x}
              y1={position.y}
              x2={x}
              y2={y}
              stroke={variant.planet}
              strokeWidth="1"
              opacity="0.2"
              strokeDasharray="2,2"
            />

            {/* Satellite */}
            <circle
              cx={x}
              cy={y}
              r="12"
              fill={lesson.completed ? variant.planet : 'rgba(30,41,59,0.8)'}
              stroke={variant.planet}
              strokeWidth="2"
              className="transition-all hover:r-[15]"
            />
            
            {/* Icon */}
            <foreignObject x={x - 8} y={y - 8} width="16" height="16">
              <BookOpen className={`w-4 h-4 ${lesson.completed ? 'text-white' : 'text-slate-400'}`} />
            </foreignObject>

            {/* Satellite label on hover */}
            <foreignObject
              x={x - 60}
              y={y + 20}
              width="120"
              height="40"
              className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            >
              <div className={`text-center backdrop-blur-lg bg-slate-900/95 border ${variant.border} rounded px-2 py-1`}>
                <div className={`${variant.text} text-xs`}>{lesson.title}</div>
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Gradient definitions */}
      <defs>
        <radialGradient id={`planet-gradient-${color}`}>
          <stop offset="0%" stopColor={variant.planet} stopOpacity="0.8" />
          <stop offset="100%" stopColor={variant.planet} stopOpacity="0.4" />
        </radialGradient>
      </defs>
    </g>
  );
}
