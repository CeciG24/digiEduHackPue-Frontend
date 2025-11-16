import React from 'react';

const UserProfile = () => {
  // Datos de ejemplo
  const user = {
    name: 'Ana García',
    email: 'ana.garcia@example.com',
    progress: {
      completedLessons: 5,
      totalLessons: 10,
      completedModules: 2,
      totalModules: 4,
    }
  };

  const progress = user?.progress || {
    completedLessons: 5,
    totalLessons: 10,
    completedModules: 2,
    totalModules: 4,
  };

  const lessonsProgress = (progress.completedLessons / progress.totalLessons) * 100;
  const modulesProgress = (progress.completedModules / progress.totalModules) * 100;

  if (!user) return <div className="p-8">No user data available.</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Card Principal */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 shadow-2xl border border-cyan-400/20 backdrop-blur-xl overflow-hidden">
          
          {/* Header con Banner */}
          <div className="relative h-32 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
            </div>
          </div>

          <div className="relative px-8 pb-8">
            {/* Avatar Flotante */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-5xl font-bold text-white shadow-2xl border-4 border-slate-900">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                {/* Anillo animado */}
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400/40 animate-ping"></div>
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-400/30 animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{user.name}</h2>
              <p className="text-slate-400 text-lg">{user.email}</p>
            </div>

            {/* Grid de Contenido */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              
              {/* Progreso de Lecciones */}
              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-2xl p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-cyan-300">Lecciones</h3>
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Completadas</span>
                    <span className="font-bold text-cyan-300">{progress.completedLessons} / {progress.totalLessons}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-500/50"
                      style={{ width: `${lessonsProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs text-slate-400">{Math.round(lessonsProgress)}% completado</p>
                </div>
              </div>

              {/* Progreso de Módulos */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-purple-300">Módulos</h3>
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Completados</span>
                    <span className="font-bold text-purple-300">{progress.completedModules} / {progress.totalModules}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-500/50"
                      style={{ width: `${modulesProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs text-slate-400">{Math.round(modulesProgress)}% completado</p>
                </div>
              </div>
            </div>

            {/* Badges de Logros */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Logros Desbloqueados
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Badge 1 */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-3 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-cyan-300">Explorador Galáctico</p>
                    </div>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-purple-300">Maestro de Constelaciones</p>
                    </div>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl p-4 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-3 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-pink-300">Innovador Estelar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;