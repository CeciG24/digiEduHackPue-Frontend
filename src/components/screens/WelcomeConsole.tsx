import { motion } from 'motion/react';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { Rocket, Download, Play, Settings } from 'lucide-react';

interface WelcomeConsoleProps {
  onNavigate: (screen: string) => void;
}

export function WelcomeConsole({ onNavigate }: WelcomeConsoleProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Main Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-cyan-400 mb-4 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">
            Learning Hub
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-400" />
            <h2 className="text-purple-400">Mission Control</h2>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
          <p className="text-slate-400 mt-4">Initialize your learning trajectory</p>
        </motion.div>

        {/* Floating panels */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <GlassPanel glow="cyan" className="hover:scale-105 transition-transform cursor-pointer" animate>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-cyan-400 mb-2">Active Missions</h4>
                <p className="text-slate-300 text-sm">3 modules in progress</p>
                <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: '67%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel glow="purple" className="hover:scale-105 transition-transform cursor-pointer" animate>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-purple-400 mb-2">Offline Content</h4>
                <p className="text-slate-300 text-sm">5 modules downloaded</p>
                <p className="text-slate-500 text-xs mt-2">2.4 GB available offline</p>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Main CTA */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <HolographicButton 
            variant="primary" 
            size="lg"
            onClick={() => onNavigate('map')}
            className="text-xl"
          >
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5" />
              Begin Mission
            </div>
          </HolographicButton>

          <div className="flex gap-4 mt-4">
            <HolographicButton 
              variant="secondary" 
              size="sm"
              onClick={() => onNavigate('accessibility')}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Accessibility
            </HolographicButton>
            
            <HolographicButton 
              variant="secondary" 
              size="sm"
              onClick={() => onNavigate('map')}
            >
              Continue Mission
            </HolographicButton>
          </div>
        </motion.div>

        {/* Status indicators */}
        <motion.div
          className="flex justify-center gap-8 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <div className="text-2xl text-cyan-400 mb-1">12</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Missions Complete</div>
          </div>
          <div className="w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />
          <div className="text-center">
            <div className="text-2xl text-purple-400 mb-1">87%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Overall Progress</div>
          </div>
          <div className="w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />
          <div className="text-center">
            <div className="text-2xl text-teal-400 mb-1">A+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Performance Grade</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
