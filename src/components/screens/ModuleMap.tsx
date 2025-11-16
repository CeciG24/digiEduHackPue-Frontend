import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ModulePlanetCard } from '../ui-sci-fi/ModulePlanetCard';
import { ChevronRight } from 'lucide-react';

interface ModuleMapProps {
  moduleId: string;
  pathId: string;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  angle?: number;
}

interface ModuleData {
  title: string;
  description: string;
  progress: number;
}

export function ModuleMap({ moduleId, pathId, onNavigate, onBack }: ModuleMapProps) {
  // Estados para datos remotos
  const [moduleData, setModuleData] = useState<ModuleData>({ title: '', description: '', progress: 0 });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchModuleAndLessons() {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = 'https://digieduhackpue-backend.onrender.com';

        // 1. Obtener datos del módulo
        const moduleRes = await fetch(`${baseUrl}/modulos/${moduleId}`, { signal: ac.signal });
        if (!moduleRes.ok) {
          throw new Error(`Error ${moduleRes.status} al obtener el módulo`);
        }
        const moduleData = await moduleRes.json();
        console.log('Module fetch response:', moduleData);

        // Extraer información del módulo
        const md = {
          title: moduleData.titulo ?? moduleData.title ?? '',
          description: moduleData.descripcion ?? moduleData.description ?? '',
          progress: moduleData.progreso ?? moduleData.progress ?? 0
        };
        setModuleData(md);

        // 2. Obtener lecciones del módulo
        const lessonsRes = await fetch(`${baseUrl}/lessons/modulo/${moduleId}`, { signal: ac.signal });
        if (!lessonsRes.ok) {
          throw new Error(`Error ${lessonsRes.status} al obtener las lecciones`);
        }
        const lessonsData = await lessonsRes.json();
        console.log('Lessons fetch response:', lessonsData);

        // Procesar lecciones según la estructura de tu API
        const rawLessons = lessonsData.success && Array.isArray(lessonsData.data) 
          ? lessonsData.data 
          : [];

        const processed = rawLessons.map((l: any, i: number) => ({
          id: l.id_leccion?.toString() ?? l.id ?? `lesson-${i}`,
          title: l.titulo ?? l.title ?? `Lección ${i + 1}`,
          completed: !!(l.completada ?? l.completed ?? false),
          angle: Math.round((360 * i) / Math.max(1, rawLessons.length))
        }));

        setLessons(processed);
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        setError(e.message ?? 'Error al cargar el módulo');
      } finally {
        setLoading(false);
      }
    }

    fetchModuleAndLessons();
    return () => ac.abort();
  }, [moduleId, pathId]);

  const handleLessonClick = (lessonId: string) => {
    onNavigate('lesson', { lessonId, moduleId, pathId });
  };

  const handleModuleClick = () => {
    onNavigate('moduleOverview', { moduleId, pathId });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Volver a la Ruta</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-cyan-400 mb-2">{moduleData.title || 'Cargando módulo...'}</h2>
          <p className="text-slate-400">{moduleData.description}</p>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progreso del Módulo</span>
                <span className="text-cyan-400">{moduleData.progress}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${moduleData.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estado de carga / error */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Cargando mapa del módulo...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-400">Error: {error}</div>
        ) : (
          /* Module Map */
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

            {/* SVG with planet and satellites */}
            <svg className="w-full" viewBox="0 0 800 700" preserveAspectRatio="xMidYMid meet">
              {/* Background */}
              <defs>
                <radialGradient id="moduleBg">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.05)" />
                  <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                </radialGradient>
              </defs>
              <rect width="800" height="700" fill="url(#moduleBg)" />

              {/* Module Planet with Lesson Satellites */}
              <ModulePlanetCard
                id={moduleId}
                title={moduleData.title}
                description={moduleData.description}
                progress={moduleData.progress}
                color="purple"
                position={{ x: 400, y: 350 }}
                lessons={lessons}
                onLessonClick={handleLessonClick}
                onSatelliteClick={handleLessonClick}
                onPlanetClick={handleModuleClick}
                onClick={handleModuleClick}
              />
            </svg>
          </div>
        )}

        {/* Debug / fallback list of lessons to verify handlers */}
        {!loading && !error && (
          <div className="mt-6 text-center">
            {lessons.length === 0 ? (
              <p className="text-red-400">No se encontraron lecciones en el módulo. Revisa la respuesta del backend (ver consola).</p>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {lessons.map((l) => (
                  <button
                    key={l.id}
                    className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-cyan-600"
                    onClick={() => handleLessonClick(l.id)}
                  >
                    {l.title} {l.completed ? '(✓)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-slate-400 text-sm">
            Haz clic en los satélites <span className="text-cyan-400">orbitales</span> para acceder a cada lección
          </p>
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-purple-400" />
            <span className="text-slate-400">Lección completada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-purple-400" />
            <span className="text-slate-400">Lección pendiente</span>
          </div>
        </div>
      </div>
    </div>
  );
}