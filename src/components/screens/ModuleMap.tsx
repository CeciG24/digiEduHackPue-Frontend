import { motion } from 'motion/react';
import { ModulePlanetCard } from '../ui-sci-fi/ModulePlanetCard';
import { ChevronRight } from 'lucide-react';

interface ModuleMapProps {
  moduleId: string;
  pathId: string;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function ModuleMap({ moduleId, pathId, onNavigate, onBack }: ModuleMapProps) {
  // Mock data - would come from props/API
  const moduleData = {
    title: 'Redes Neuronales',
    description: 'Explora las lecciones sobre arquitecturas neuronales, backpropagation y funciones de activación',
    progress: 100
  };

  const lessons = [
    { id: 'lesson-1', title: 'Introducción a Redes Neuronales', completed: true, angle: 0 },
    { id: 'lesson-2', title: 'Perceptrón y Modelo Lineal', completed: true, angle: 45 },
    { id: 'lesson-3', title: 'Funciones de Activación', completed: true, angle: 90 },
    { id: 'lesson-4', title: 'Backpropagation', completed: true, angle: 135 },
    { id: 'lesson-5', title: 'Optimización y Gradientes', completed: true, angle: 180 },
    { id: 'lesson-6', title: 'Regularización', completed: true, angle: 225 },
    { id: 'lesson-7', title: 'Dropout y Batch Norm', completed: true, angle: 270 },
    { id: 'lesson-8', title: 'Arquitecturas Profundas', completed: true, angle: 315 }
  ];

  const handleLessonClick = (lessonId: string) => {
    // Randomly decide between lesson viewer and assessment
    const screens = ['lesson', 'assessment'];
    const randomScreen = screens[Math.floor(Math.random() * screens.length)];
    onNavigate(randomScreen, { lessonId, moduleId, pathId });
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
          <h2 className="text-cyan-400 mb-2">{moduleData.title}</h2>
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

        {/* Module Map */}
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
            />
          </svg>
        </div>

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
