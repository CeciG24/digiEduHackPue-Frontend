import React, { useEffect, useState } from 'react';
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
  const [learningPaths, setLearningPaths] = useState<LearningPath[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadPaths() {
      setLoading(true);
      setError(null);
      try {
  const base = 'https://digieduhackpue-backend.onrender.com';
  const res = await fetch(`${base}/rutas`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const api = await res.json();
  console.log("RESPUESTA API:", api);

  const mapped = (api.data ?? []).map((item: any, index: number) => ({
  id: String(item.id),
  title: item.titulo,
  description: item.descripcion,
  progress: 0,
  moduleCount: 0,
  color: "cyan",
  position: { 
    x: 150 + (index * 200),   // separa horizontalmente
    y: 300                    // todos alineados en el centro vertical
  },
  stars: generateStars(),      // opcional (abajo te pongo esto)
}));

        function generateStars(count = 4) {
  return Array.from({ length: count }).map(() => ({
    x: Math.random() * 80 - 40,
    y: Math.random() * 80 - 40
  }));
}


  setLearningPaths(mapped);
}catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'Error al cargar rutas');
        setLearningPaths([]);
      } finally {
        setLoading(false);
      }
    }

    loadPaths();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen p-8 pl-24 md:pl-72">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
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

          {/* Estado de carga / error */}
          <div className="p-6">
            {loading && <div className="text-slate-400">Cargando rutas...</div>}
            {error && <div className="text-red-400">Error: {error}</div>}
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
            // En MissionMap.tsx, encuentra la parte donde renderizas las rutas:

{(learningPaths ?? []).map((path) => {
  console.log("🎨 Renderizando ruta:", path.id, path.title);
  return (
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
      onClick={() => {
        console.log("🎯 Click detectado en ruta:", path.id, path.title);
        console.log("🔄 Llamando onNavigate con:", { pathId: path.id });
        onNavigate('path-overview', { pathId: path.id });
      }}
    />
  );
})}
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
