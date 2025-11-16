import { motion } from 'motion/react';
import { Home, Map, BookOpen, Target, Brain, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string, data?: any) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const navItems = [
    { id: 'welcome', icon: Home, label: 'Mission Control' },
    { id: 'map', icon: Map, label: 'Mission Map' },
    { id: 'lesson', icon: BookOpen, label: 'Lesson' },
    { id: 'assessment', icon: Target, label: 'Assessment' },
    { id: 'ai-core', icon: Brain, label: 'AI Core' },
    { id: 'accessibility', icon: Settings, label: 'Settings' }
  ];

  // Map multiple screens to their base nav item
  const getActiveNavId = (screen: string) => {
    if (screen === 'path-overview' || screen === 'module-map') return 'map';
    return screen;
  };

  const activeNavId = getActiveNavId(currentScreen);

  // ✅ NUEVO: Maneja clicks en navegación sin resetear el contexto
  const handleNavClick = (navId: string) => {
    console.log("🧭 Navigation click:", navId, "desde:", currentScreen);
    
    // Si estás en path-overview o module-map y haces click en 'map',
    // vuelve al mapa principal
    if (navId === 'map' && (currentScreen === 'path-overview' || currentScreen === 'module-map')) {
      onNavigate('map');
    } else {
      onNavigate(navId);
    }
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 backdrop-blur-xl bg-slate-950/80 border-r border-cyan-500/30 z-40">
      <div className="flex flex-col items-center py-6 gap-6 h-full">
        {/* Logo */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
          <span className="font-bold text-white">LH</span>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavId === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Prevenir propagación
                  handleNavClick(item.id);
                }}
                className={`
                  relative w-12 h-12 rounded-lg flex items-center justify-center
                  transition-all duration-300 group
                  ${isActive 
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
                
                {/* Tooltip */}
                <div className="absolute left-16 px-3 py-2 bg-slate-900 border border-cyan-400/50 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="text-sm text-cyan-400">{item.label}</span>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Logout and User Info - Fixed at bottom */}
        <div className="mt-auto flex flex-col items-center gap-3 mb-6">
          {user && (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] group relative">
              <span className="font-bold text-white text-xs">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
              
              {/* User tooltip */}
              <div className="absolute left-16 px-3 py-2 bg-slate-900 border border-cyan-400/50 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                <span className="text-sm text-cyan-400">{user.name}</span>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleLogout}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-6 h-6" />
            
            {/* Logout tooltip */}
            <div className="absolute left-16 px-3 py-2 bg-slate-900 border border-red-400/50 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-red-400">Logout</span>
            </div>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}