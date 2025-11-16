import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { NeonDivider } from '../ui-sci-fi/NeonDivider';
import { StudentDetailModal } from '../ui-sci-fi/StudentDetailModal';
import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  Plus,
  Search,
  Filter,
  BookOpen,
  Target,
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TeacherDashboardProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Mock data
  const stats = {
    totalStudents: 127,
    activeClasses: 4,
    avgCompletion: 73,
    pendingAssessments: 18
  };

  const recentActivity = [
    { student: 'Ana García', action: 'Completó', module: 'Redes Neuronales', time: '5 min', status: 'success' },
    { student: 'Carlos Ruiz', action: 'Comenzó', module: 'Deep Learning', time: '12 min', status: 'info' },
    { student: 'María López', action: 'Necesita ayuda', module: 'Procesamiento NLP', time: '23 min', status: 'warning' },
    { student: 'José Martínez', action: 'Completó evaluación', module: 'Introducción a IA', time: '1 h', status: 'success' },
    { student: 'Laura Sánchez', action: 'Inactivo 3 días', module: 'Computación Cuántica', time: '3 d', status: 'alert' }
  ];

  const classPerformance = [
    { class: 'IA-101A', students: 32, avg: 85, color: '#06b6d4' },
    { class: 'IA-101B', students: 28, avg: 78, color: '#a855f7' },
    { class: 'ML-202', students: 35, avg: 82, color: '#2dd4bf' },
    { class: 'DL-301', students: 32, avg: 91, color: '#e879f9' }
  ];

  const progressOverTime = [
    { week: 'Sem 1', completion: 45, engagement: 65 },
    { week: 'Sem 2', completion: 52, engagement: 70 },
    { week: 'Sem 3', completion: 58, engagement: 68 },
    { week: 'Sem 4', completion: 65, engagement: 75 },
    { week: 'Sem 5', completion: 70, engagement: 78 },
    { week: 'Sem 6', completion: 73, engagement: 80 }
  ];

  const skillsRadar = [
    { skill: 'IA Básica', fullMark: 100, value: 85 },
    { skill: 'Redes Neuronales', fullMark: 100, value: 78 },
    { skill: 'Deep Learning', fullMark: 100, value: 72 },
    { skill: 'NLP', fullMark: 100, value: 65 },
    { skill: 'Visión Comp.', fullMark: 100, value: 70 },
    { skill: 'ML Prod.', fullMark: 100, value: 60 }
  ];

  const topStudents = [
    { name: 'Elena Torres', progress: 98, modules: 12, rank: 1, avatar: 'ET', email: 'elena.torres@academy.edu', modulesCompleted: 12, totalModules: 12, lastActive: '2 horas', avgScore: 95, timeSpent: '48h' },
    { name: 'David Chen', progress: 95, modules: 11, rank: 2, avatar: 'DC', email: 'david.chen@academy.edu', modulesCompleted: 11, totalModules: 12, lastActive: '5 horas', avgScore: 93, timeSpent: '45h' },
    { name: 'Sofia Ramírez', progress: 93, modules: 11, rank: 3, avatar: 'SR', email: 'sofia.ramirez@academy.edu', modulesCompleted: 11, totalModules: 12, lastActive: '1 día', avgScore: 91, timeSpent: '42h' },
    { name: 'Miguel Santos', progress: 91, modules: 10, rank: 4, avatar: 'MS', email: 'miguel.santos@academy.edu', modulesCompleted: 10, totalModules: 12, lastActive: '3 horas', avgScore: 89, timeSpent: '40h' },
    { name: 'Isabella Moreno', progress: 89, modules: 10, rank: 5, avatar: 'IM', email: 'isabella.moreno@academy.edu', modulesCompleted: 10, totalModules: 12, lastActive: '6 horas', avgScore: 87, timeSpent: '38h' }
  ];

  const atRiskStudents = [
    { name: 'Pedro Vargas', progress: 32, lastActive: '5 días', issue: 'Inactividad' },
    { name: 'Lucía Herrera', progress: 45, lastActive: '2 días', issue: 'Bajo rendimiento' },
    { name: 'Roberto Díaz', progress: 38, lastActive: '4 días', issue: 'Múltiples fallos' }
  ];

  const statusConfig = {
    success: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: CheckCircle2 },
    info: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Activity },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
    alert: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertCircle }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-[1800px] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-cyan-400 mb-2">Panel de Instructor</h1>
              <p className="text-slate-400">Control central de seguimiento académico y análisis de rendimiento</p>
            </div>
            
            <div className="flex gap-3">
              <HolographicButton variant="secondary" size="md">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </HolographicButton>
              <HolographicButton variant="primary" size="md">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Evaluación
              </HolographicButton>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassPanel glow="cyan" animate={true}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-cyan-400 mb-1">{stats.totalStudents}</div>
                  <div className="text-sm text-slate-400">Estudiantes Activos</div>
                  <div className="text-xs text-cyan-400 mt-1">↑ 12% vs mes anterior</div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel glow="purple" animate={true}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-purple-400 mb-1">{stats.activeClasses}</div>
                  <div className="text-sm text-slate-400">Clases Activas</div>
                  <div className="text-xs text-purple-400 mt-1">En progreso</div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-purple-400" />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel glow="teal" animate={true}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-teal-400 mb-1">{stats.avgCompletion}%</div>
                  <div className="text-sm text-slate-400">Completitud Promedio</div>
                  <div className="text-xs text-teal-400 mt-1">↑ 5% esta semana</div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-teal-400" />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel glow="pink" animate={true}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-pink-400 mb-1">{stats.pendingAssessments}</div>
                  <div className="text-sm text-slate-400">Evaluaciones Pendientes</div>
                  <div className="text-xs text-yellow-400 mt-1">Requiere atención</div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Target className="w-7 h-7 text-pink-400" />
                </div>
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        <NeonDivider color="cyan" className="mb-8" />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Over Time */}
            <GlassPanel glow="cyan" animate={false}>
              <h3 className="text-purple-400 mb-4">Progreso Temporal del Grupo</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={progressOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
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
                    dataKey="completion" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 4 }}
                    name="Completitud"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 4 }}
                    name="Engagement"
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassPanel>

            {/* Class Performance */}
            <GlassPanel glow="purple" animate={false}>
              <h3 className="text-purple-400 mb-4">Rendimiento por Clase</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                  <XAxis 
                    dataKey="class" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                  />
                  <Bar dataKey="avg" radius={[8, 8, 0, 0]} name="Promedio %">
                    {classPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {classPerformance.map((cls, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-slate-400 mb-1">{cls.class}</div>
                    <div className="text-sm text-slate-300">{cls.students} estudiantes</div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Recent Activity */}
            <GlassPanel glow="teal" animate={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-400">Actividad Reciente</h3>
                <HolographicButton variant="ghost" size="sm">
                  Ver todo <ChevronRight className="w-4 h-4 ml-1" />
                </HolographicButton>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const config = statusConfig[activity.status as keyof typeof statusConfig];
                  const StatusIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-200">
                          <span className="text-cyan-400">{activity.student}</span> {activity.action}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{activity.module}</div>
                      </div>
                      <div className="text-xs text-slate-500 flex-shrink-0">{activity.time}</div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassPanel>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Skills Radar */}
            <GlassPanel glow="purple" animate={false}>
              <h3 className="text-purple-400 mb-4">Mapa de Competencias</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={skillsRadar}>
                  <PolarGrid stroke="rgba(100,116,139,0.3)" />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    stroke="#94a3b8"
                    style={{ fontSize: '11px' }}
                  />
                  <PolarRadiusAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '10px' }}
                  />
                  <Radar 
                    name="Promedio Clase" 
                    dataKey="value" 
                    stroke="#a855f7" 
                    fill="#a855f7" 
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </GlassPanel>

            {/* Top Students */}
            <GlassPanel glow="cyan" animate={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-400">Top Estudiantes</h3>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer"
                    onClick={() => handleStudentClick(student)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs">
                      #{student.rank}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-200">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.modules} módulos</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-cyan-400">{student.progress}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>

            {/* At Risk Students */}
            <GlassPanel glow="pink" animate={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-400">Requieren Atención</h3>
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="space-y-3">
                {atRiskStudents.map((student, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-slate-200">{student.name}</div>
                      <div className="text-lg text-red-400">{student.progress}%</div>
                    </div>
                    <div className="text-xs text-slate-400 mb-1">Última vez: {student.lastActive}</div>
                    <div className="text-xs text-red-400">{student.issue}</div>
                  </motion.div>
                ))}
              </div>
              <HolographicButton variant="danger" size="sm" className="w-full mt-4">
                Contactar Estudiantes
              </HolographicButton>
            </GlassPanel>
          </div>
        </div>

        {/* Quick Actions */}
        <GlassPanel glow="cyan" animate={false}>
          <h3 className="text-purple-400 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HolographicButton variant="primary" size="md" className="justify-center">
              <Plus className="w-5 h-5 mr-2" />
              Crear Tarea
            </HolographicButton>
            <HolographicButton variant="secondary" size="md" className="justify-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Nueva Lección
            </HolographicButton>
            <HolographicButton variant="secondary" size="md" className="justify-center">
              <Target className="w-5 h-5 mr-2" />
              Nueva Evaluación
            </HolographicButton>
            <HolographicButton variant="secondary" size="md" className="justify-center">
              <Activity className="w-5 h-5 mr-2" />
              Generar Reporte
            </HolographicButton>
          </div>
        </GlassPanel>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}