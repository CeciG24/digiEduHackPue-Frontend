import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface PathOverviewProps {
  pathId: string;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

interface Module {
  id_modulo: number;
  id_ruta: number;
  titulo: string;
  descripcion: string;
  orden: number;
  progress?: number;
}

interface PathData {
  title: string;
  description: string;
}

export function LearningPathOverview({ pathId, onNavigate, onBack }: PathOverviewProps) {
  const [pathData, setPathData] = useState<PathData>({ title: '', description: '' });
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 PathOverview montado con pathId:", pathId);
    
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadModules() {
      setLoading(true);
      setError(null);
      try {
        const base = 'https://digieduhackpue-backend.onrender.com';
        const url = `${base}/modulos/ruta/${pathId}`;
        console.log("📡 Fetching:", url);
        
        const res = await fetch(url, { signal });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const api = await res.json();
        console.log("✅ MÓDULOS DE LA RUTA:", api);

        if (api.success && api.data) {
          // Ordenar módulos por el campo 'orden'
          const sortedModules = api.data.sort((a: Module, b: Module) => a.orden - b.orden);
          setModules(sortedModules);
          
          // Si necesitas info adicional de la ruta, podrías hacer otro fetch aquí
          // Por ahora usamos datos básicos
          setPathData({
            title: `Ruta de Aprendizaje ${pathId}`,
            description: 'Selecciona un módulo para comenzar tu viaje de aprendizaje'
          });
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'Error al cargar módulos');
        setModules([]);
      } finally {
        setLoading(false);
      }
    }

    loadModules();
    return () => controller.abort();
  }, [pathId]);

  const handleModuleClick = (moduleId: number) => {
    onNavigate('module-map', { moduleId: String(moduleId), pathId });
  };

  const getModuleProgress = (module: Module) => {
    // Aquí podrías calcular el progreso real desde tu backend
    // Por ahora retorna 0 o un valor simulado
    return module.progress ?? 0;
  };

  return (
    <div className="min-h-screen flex items-start justify-center  p-4 sm:p-6 md:p-8">
      <div className=" max-w-5xl px-4 sm:px-6 md:px-8">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Volver al Mapa de Rutas</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-cyan-400 mb-2">{pathData.title}</h2>
          <p className="text-slate-400">{pathData.description}</p>
          
          {/* Stats */}
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>{modules.length} módulos</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>~{modules.length * 2}h estimadas</span>
            </div>
          </div>
        </motion.div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
            <p className="mt-4">Cargando módulos...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : modules.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No hay módulos disponibles en esta ruta
          </div>
        ) : (
          /* Modules Grid */
          <div className="grid gap-4">
            {modules.map((module, index) => {
              const progress = getModuleProgress(module);
              const isCompleted = progress === 100;

              return (
                <motion.div
                  key={module.id_modulo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleModuleClick(module.id_modulo)}
                  className="group relative p-6 rounded-lg border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-purple-900/20 backdrop-blur-sm cursor-pointer hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                >
                  

                  {/* Completed badge */}
                  {isCompleted && (
                    <div className="absolute -right-2 -top-2">
                      <CheckCircle className="w-8 h-8 text-green-400 fill-green-400/20" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">
                        {module.titulo}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {module.descripcion}
                      </p>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-xs">
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
                            <motion.div
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-cyan-400 font-semibold min-w-[3rem] text-right">
                          {progress}%
                        </span>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        {!loading && !error && modules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-400 text-sm">
              Haz clic en cualquier módulo para explorar sus lecciones
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}