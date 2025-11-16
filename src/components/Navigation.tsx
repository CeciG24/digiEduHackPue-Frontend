import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Map, BookOpen, Target, Brain, Settings, LogOut, Mic, MicOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string, data?: any) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const { logout, user } = useAuth();
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const navItems = [
    { id: 'welcome', icon: Home, label: 'Mission Control' },
    { id: 'map', icon: Map, label: 'Mission Map' },
    { id: 'lesson', icon: BookOpen, label: 'Lección' },
    { id: 'assessment', icon: Target, label: 'Evaluación' },
    { id: 'ai-core', icon: Brain, label: 'IA Core' },
    { id: 'accessibility', icon: Settings, label: 'Configuración' }
  ];

  const getActiveNavId = (screen: string) => {
    if (screen === 'path-overview' || screen === 'module-map') return 'map';
    return screen;
  };
  const activeNavId = getActiveNavId(currentScreen);

  const handleNavClick = (navId: string) => {
    if (navId === 'map' && (currentScreen === 'path-overview' || currentScreen === 'module-map')) {
      onNavigate('map');
    } else {
      onNavigate(navId);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // 🎤 Configuración Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.lang = 'es-ES';
    recog.interimResults = false;

    recog.onresult = (event: any) => {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  console.log('🎤 Reconocido:', transcript);

  // Función de retroalimentación por voz
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Comandos de navegación por voz
  if (transcript.includes('mission control') || transcript.includes('inicio') || transcript.includes('home')) {
    handleNavClick('welcome');
    speak('Estás en Mission Control');
  } else if (transcript.includes('mapa') || transcript.includes('map')) {
    handleNavClick('map');
    speak('Estás en el Mapa de Misiones');
  } else if (transcript.match(/lección (\d+)/)) {
    const match = transcript.match(/lección (\d+)/);
    if (match) {
      const leccionNum = match[1];
      console.log('Ir a lección:', leccionNum);
      handleNavClick('lesson');
      speak(`Estás en la Lección ${leccionNum}`);
    }
  } else if (transcript.includes('evaluación')) {
    handleNavClick('assessment');
    speak('Estás en la Evaluación');
  } else if (transcript.includes('ia core') || transcript.includes('inteligencia artificial')) {
    handleNavClick('ai-core');
    speak('Estás en IA Core');
  } else if (transcript.includes('configuración') || transcript.includes('ajustes')) {
    handleNavClick('accessibility');
    speak('Estás en Configuración');
  } else if (transcript.includes('salir') || transcript.includes('logout')) {
    handleLogout();
  }

  // Comandos de micrófono
  if (transcript.includes('apagar micrófono') || transcript.includes('silencio')) {
    console.log('Apagando micrófono por comando de voz');
    toggleListening(false);
  } else if (transcript.includes('prender micrófono') || transcript.includes('activar micrófono')) {
    toggleListening(true);
  }
};

    recog.onerror = (err: any) => console.error('Error de voz:', err);
    setRecognition(recog);
  }, []);

  const toggleListening = (forceState?: boolean) => {
    if (!recognition) return;
    console.log('🎤 toggleListening llamado');
    const newState = forceState !== undefined ? forceState : !listening;

    if (newState) {
      recognition.start();
    } else {
      recognition.stop();
    }
    setListening(newState);
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
                onClick={(e) => { e.stopPropagation(); handleNavClick(item.id); }}
                className={`
                  relative w-12 h-12 rounded-lg flex items-center justify-center
                  transition-all duration-300 group
                  ${isActive ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'}
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
                <div className="absolute left-16 px-3 py-2 bg-slate-900 border border-cyan-400/50 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="text-sm text-cyan-400">{item.label}</span>
                </div>
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

        {/* Mic Button */}
        <motion.button
          onClick={() => toggleListening()}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
            listening ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {listening ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
        </motion.button>

        {/* Logout/User */}
        <div className="mt-auto flex flex-col items-center gap-3 mb-6">
          {user && (
            <button
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] group relative focus:outline-none"
              onClick={() => onNavigate('user-profile')}
              title="Ver perfil"
            >
              <span className="font-bold text-white text-xs">{user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</span>
              <div className="absolute left-16 px-3 py-2 bg-slate-900 border border-cyan-400/50 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                <span className="text-sm text-cyan-400">{user.name}</span>
              </div>
            </button>
          )}

          <motion.button
            onClick={handleLogout}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-6 h-6" />
            <div className="absolute left-16 px-3 py-2 bg-slate-900 border border-red-400/50 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-red-400">Logout</span>
            </div>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
