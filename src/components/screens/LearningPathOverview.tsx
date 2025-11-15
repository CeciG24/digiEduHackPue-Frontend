import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { NeonDivider } from '../ui-sci-fi/NeonDivider';
import { CheckCircle2, Circle, ChevronRight, Brain, Clock, Award } from 'lucide-react';

interface LearningPathOverviewProps {
  pathId: string;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  completed: boolean;
  progress: number;
  estimatedTime: string;
}

export function LearningPathOverview({ pathId, onNavigate, onBack }: LearningPathOverviewProps) {
  // Mock data - in real app, this would come from props or API
  const pathData = {
    'ai-fundamentals': {
      title: 'IA y Machine Learning',
      description: 'Domina los fundamentos de la inteligencia artificial y el aprendizaje automático. Desde conceptos básicos hasta implementaciones prácticas con redes neuronales, algoritmos de optimización y aplicaciones del mundo real.',
      progress: 67,
      totalLessons: 45,
      completedLessons: 30,
      estimatedTime: '24 horas',
      color: 'cyan' as const,
      modules: [
        {
          id: 'intro-ai',
          title: 'Introducción a la IA',
          description: 'Conceptos fundamentales y historia de la inteligencia artificial',
          lessonCount: 8,
          completed: true,
          progress: 100,
          estimatedTime: '3 horas'
        },
        {
          id: 'neural-networks',
          title: 'Redes Neuronales',
          description: 'Arquitecturas, backpropagation y funciones de activación',
          lessonCount: 12,
          completed: true,
          progress: 100,
          estimatedTime: '6 horas'
        },
        {
          id: 'deep-learning',
          title: 'Deep Learning',
          description: 'CNNs, RNNs, y arquitecturas avanzadas',
          lessonCount: 10,
          completed: false,
          progress: 60,
          estimatedTime: '8 horas'
        },
        {
          id: 'nlp',
          title: 'Procesamiento de Lenguaje Natural',
          description: 'Transformers, BERT, GPT y aplicaciones de NLP',
          lessonCount: 9,
          completed: false,
          progress: 0,
          estimatedTime: '5 horas'
        },
        {
          id: 'ml-production',
          title: 'ML en Producción',
          description: 'Deployment, MLOps y mejores prácticas',
          lessonCount: 6,
          completed: false,
          progress: 0,
          estimatedTime: '4 horas'
        }
      ]
    }
  };

  const path = pathData[pathId as keyof typeof pathData] || pathData['ai-fundamentals'];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Volver al Mapa</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className={`text-${path.color}-400 mb-3`}>{path.title}</h1>
              <p className="text-slate-300 max-w-3xl">
                {path.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl text-cyan-400">{path.progress}%</div>
                <div className="text-xs text-slate-500">COMPLETADO</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Progreso de la Ruta</span>
              <span className="text-cyan-400">{path.completedLessons} / {path.totalLessons} lecciones</span>
            </div>
            <div className="h-4 bg-slate-900 rounded-full overflow-hidden relative border border-cyan-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${path.progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan-line_3s_ease-in-out_infinite]" />
            </div>
          </div>
        </motion.div>

        <NeonDivider color={path.color} className="mb-8" />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <GlassPanel glow="cyan" animate={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl text-cyan-400">{path.modules.length}</div>
                <div className="text-sm text-slate-400">Módulos</div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel glow="purple" animate={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl text-purple-400">{path.estimatedTime}</div>
                <div className="text-sm text-slate-400">Tiempo Estimado</div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel glow="teal" animate={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="text-2xl text-teal-400">A+</div>
                <div className="text-sm text-slate-400">Calificación</div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Modules List */}
        <div>
          <h3 className="text-purple-400 mb-6">Módulos del Programa</h3>
          
          <div className="space-y-4">
            {path.modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  glow={module.completed ? 'cyan' : module.progress > 0 ? 'purple' : 'none'}
                  animate={false}
                  className="hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className="mt-1">
                      {module.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                      ) : (
                        <Circle className={`w-6 h-6 ${module.progress > 0 ? 'text-purple-400' : 'text-slate-600'}`} />
                      )}
                    </div>

                    {/* Module info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className={`${module.completed ? 'text-cyan-400' : 'text-slate-200'} mb-1`}>
                            Módulo {index + 1}: {module.title}
                          </h4>
                          <p className="text-slate-400 text-sm mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{module.lessonCount} lecciones</span>
                            <span>•</span>
                            <span>{module.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-2xl ${module.completed ? 'text-cyan-400' : 'text-purple-400'} mb-1`}>
                            {module.progress}%
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {module.progress > 0 && (
                        <div className="mb-3">
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${module.completed ? 'bg-gradient-to-r from-cyan-400 to-teal-500' : 'bg-gradient-to-r from-purple-400 to-pink-500'}`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action button */}
                      <HolographicButton
                        variant={module.completed ? 'success' : module.progress > 0 ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => onNavigate('module-map', { moduleId: module.id, pathId })}
                      >
                        {module.completed ? 'Revisar Módulo' : module.progress > 0 ? 'Continuar' : 'Comenzar'}
                        <ChevronRight className="w-4 h-4 inline ml-2" />
                      </HolographicButton>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
