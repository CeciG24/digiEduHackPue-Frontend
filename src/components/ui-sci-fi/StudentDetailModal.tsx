import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, MessageSquare, TrendingUp, Award, Clock, BookOpen } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { HolographicButton } from './HolographicButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: {
    name: string;
    avatar: string;
    email: string;
    progress: number;
    modulesCompleted: number;
    totalModules: number;
    lastActive: string;
    avgScore: number;
    timeSpent: string;
  };
}

export function StudentDetailModal({ isOpen, onClose, student }: StudentDetailModalProps) {
  if (!student) return null;

  const progressData = [
    { week: 'S1', score: 72 },
    { week: 'S2', score: 78 },
    { week: 'S3', score: 75 },
    { week: 'S4', score: 82 },
    { week: 'S5', score: 85 },
    { week: 'S6', score: 88 }
  ];

  const modules = [
    { name: 'Introducción a IA', progress: 100, status: 'completed' },
    { name: 'Redes Neuronales', progress: 100, status: 'completed' },
    { name: 'Deep Learning', progress: 75, status: 'in-progress' },
    { name: 'NLP', progress: 30, status: 'in-progress' },
    { name: 'Visión Computacional', progress: 0, status: 'not-started' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <GlassPanel glow="cyan" animate={false} className="relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-red-500/20 border border-slate-600 hover:border-red-500/50 flex items-center justify-center transition-all group"
                >
                  <X className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                </button>

                {/* Header */}
                <div className="flex items-start gap-6 mb-6 pb-6 border-b border-cyan-500/30">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-cyan-400 mb-2">{student.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </span>
                      <span>•</span>
                      <span>Última actividad: {student.lastActive}</span>
                    </div>
                    <div className="flex gap-3">
                      <HolographicButton variant="secondary" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Mensaje
                      </HolographicButton>
                      <HolographicButton variant="ghost" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </HolographicButton>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-slate-400">Progreso</span>
                    </div>
                    <div className="text-2xl text-cyan-400">{student.progress}%</div>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-400">Módulos</span>
                    </div>
                    <div className="text-2xl text-purple-400">{student.modulesCompleted}/{student.totalModules}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-teal-400" />
                      <span className="text-xs text-slate-400">Promedio</span>
                    </div>
                    <div className="text-2xl text-teal-400">{student.avgScore}%</div>
                  </div>

                  <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span className="text-xs text-slate-400">Tiempo</span>
                    </div>
                    <div className="text-2xl text-pink-400">{student.timeSpent}</div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="mb-6">
                  <h3 className="text-purple-400 mb-4">Evolución del Rendimiento</h3>
                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                        <XAxis 
                          dataKey="week" 
                          stroke="#94a3b8"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          style={{ fontSize: '12px' }}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#06b6d4" 
                          strokeWidth={3}
                          dot={{ fill: '#06b6d4', r: 5 }}
                          name="Puntuación"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Modules Progress */}
                <div>
                  <h3 className="text-purple-400 mb-4">Progreso por Módulo</h3>
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-200">{module.name}</span>
                          <span className={`text-sm ${
                            module.status === 'completed' ? 'text-cyan-400' :
                            module.status === 'in-progress' ? 'text-purple-400' :
                            'text-slate-500'
                          }`}>
                            {module.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              module.status === 'completed' ? 'bg-gradient-to-r from-cyan-400 to-teal-500' :
                              module.status === 'in-progress' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                              'bg-slate-700'
                            }`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-cyan-500/30 flex justify-end gap-3">
                  <HolographicButton variant="ghost" size="md" onClick={onClose}>
                    Cerrar
                  </HolographicButton>
                  <HolographicButton variant="primary" size="md">
                    Ver Detalles Completos
                  </HolographicButton>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
