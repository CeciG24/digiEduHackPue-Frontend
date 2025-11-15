import { motion } from 'motion/react';
import { ConstellationCard } from '../ui-sci-fi/ConstellationCard';
import { Search } from 'lucide-react';

interface MissionMapProps {
  onNavigate: (screen: string, data?: any) => void;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  moduleCount: number;
  color: 'cyan' | 'purple' | 'teal' | 'magenta';
  position: { x: number; y: number };
  stars: { x: number; y: number }[];
}

export function MissionMap({ onNavigate }: MissionMapProps) {
  const learningPaths: LearningPath[] = [
    {
      id: 'ai-fundamentals',
      title: 'IA y Machine Learning',
      description: 'Fundamentos de inteligencia artificial y aprendizaje automático',
      progress: 67,
      moduleCount: 5,
      color: 'cyan',
      position: { x: 200, y: 150 },
      stars: [
        { x: -40, y: -30 },
        { x: -20, y: 0 },
        { x: 0, y: -40 },
        { x: 20, y: -10 },
        { x: 40, y: 20 }
      ]
    },
    {
      id: 'quantum-computing',
      title: 'Computación Cuántica',
      description: 'Principios de mecánica cuántica aplicados a la computación',
      progress: 45,
      moduleCount: 4,
      color: 'purple',
      position: { x: 600, y: 180 },
      stars: [
        { x: -35, y: -25 },
        { x: 0, y: -35 },
        { x: 30, y: -20 },
        { x: 15, y: 15 }
      ]
    },
    {
      id: 'space-science',
      title: 'Ciencias Espaciales',
      description: 'Astrofísica, cosmología y exploración espacial',
      progress: 30,
      moduleCount: 6,
      color: 'teal',
      position: { x: 400, y: 400 },
      stars: [
        { x: -45, y: 0 },
        { x: -25, y: -30 },
        { x: 0, y: -15 },
        { x: 25, y: -25 },
        { x: 40, y: 5 },
        { x: 20, y: 25 }
      ]
    },
    {
      id: 'biotechnology',
      title: 'Biotecnología Avanzada',
      description: 'Ingeniería genética y aplicaciones CRISPR',
      progress: 20,
      moduleCount: 4,
      color: 'magenta',
      position: { x: 150, y: 450 },
      stars: [
        { x: -30, y: -20 },
        { x: 0, y: -30 },
        { x: 30, y: -15 },
        { x: 0, y: 15 }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-cyan-400 mb-2">Mapa de Rutas de Aprendizaje</h2>
            <p className="text-slate-400">Selecciona una constelación para explorar sus módulos</p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar ruta..."
              className="w-64 px-4 py-2 pl-10 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Map Container */}
        <div className="relative rounded-lg border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-sm overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* SVG Map */}
          <svg className="w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            {/* Background gradient */}
            <defs>
              <radialGradient id="bgGradient">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.05)" />
              </radialGradient>
            </defs>
            <rect width="800" height="600" fill="url(#bgGradient)" />

            {/* Learning Path Constellations */}
            {learningPaths.map((path) => (
              <ConstellationCard
                key={path.id}
                id={path.id}
                title={path.title}
                description={path.description}
                progress={path.progress}
                moduleCount={path.moduleCount}
                color={path.color}
                position={path.position}
                stars={path.stars}
                onClick={() => onNavigate('path-overview', { pathId: path.id })}
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span className="text-slate-400">IA y Machine Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <span className="text-slate-400">Computación Cuántica</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
            <span className="text-slate-400">Ciencias Espaciales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(232,121,249,0.8)]" />
            <span className="text-slate-400">Biotecnología</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
