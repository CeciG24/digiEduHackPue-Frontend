import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  // Simulación de progreso, reemplazar con datos reales si existen
  const progress = user?.progress || {
    completedLessons: 5,
    totalLessons: 10,
    completedModules: 2,
    totalModules: 4,
  };

  if (!user) return <div className="p-8">No user data available.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        {/* Avatar futurista */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-pulse border-4 border-cyan-400/40">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          {/* Efecto de anillo holográfico */}
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-spin-slow pointer-events-none" style={{ borderStyle: 'dashed' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-300">{user.email}</p>
        </div>
      </div>

      {/* Gamificación Espacial Inmersiva */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-purple-500">Gamificación Espacial Inmersiva</h3>
        <div className="flex gap-4 flex-wrap items-center">
          {/* Badges holográficos con animaciones 3D */}
          <span className="relative inline-block">
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-bounce border-2 border-cyan-400/60">
              <svg className="w-6 h-6 mr-2 animate-spin-slow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="url(#badge-gradient)" strokeWidth="3" />
                <defs>
                  <linearGradient id="badge-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              Explorador Galáctico
            </span>
          </span>
          <span className="relative inline-block">
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-pink-400 to-cyan-600 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-pulse border-2 border-pink-400/60">
              <svg className="w-6 h-6 mr-2 animate-spin-reverse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="url(#badge2-gradient)" strokeWidth="3" />
                <defs>
                  <linearGradient id="badge2-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ec4899" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              Maestro de Constelaciones
            </span>
          </span>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-cyan-600">Progreso</h3>
        <div className="mb-2">Lecciones completadas: <span className="font-bold">{progress.completedLessons}</span> / {progress.totalLessons}</div>
        <div>Módulos completados: <span className="font-bold">{progress.completedModules}</span> / {progress.totalModules}</div>
        {/* Aquí puedes agregar más detalles de progreso */}
      </div>
    </div>
  );
};

export default UserProfile;
