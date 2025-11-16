import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { NeonDivider } from '../ui-sci-fi/NeonDivider';
import { Type, Contrast, Volume2, Download, Eye, Minimize2, Moon, Sun } from 'lucide-react';
import { useState,useEffect } from 'react';

export function AccessibilityTools() {
  const [settings, setSettings] = useState({
    highContrast: false,
    dyslexiaFont: false,
    textToSpeech: false,
    largeText: false,
    reducedMotion: false,
    darkMode: true
  });

  // ...existing code...
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("accessibility-settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Cargar settings guardados al montar para que el toggle tenga efecto real
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem("accessibility-settings");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setSettings(prev => ({ ...prev, ...parsed }));
    } catch (e) {
      console.warn("accessibility-settings: JSON parse error", e);
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (settings.dyslexiaFont) {
      body.classList.add("dyslexia-font");
    } else {
      body.classList.remove("dyslexia-font");
    }

    console.log("CLASE APLICADA:", settings.dyslexiaFont); // <-- debugeo
  }, [settings.dyslexiaFont]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-cyan-400 mb-2">Accessibility & Offline Tools</h2>
          <p className="text-slate-400">Customize your learning experience for maximum comfort and accessibility</p>
        </div>

        {/* Accessibility Settings */}
        <div className="mb-8">
          <h3 className="text-purple-400 mb-6">Accessibility Settings</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* High Contrast */}
            <GlassPanel glow={settings.highContrast ? 'cyan' : 'none'} animate={false}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  settings.highContrast ? 'bg-cyan-500/30' : 'bg-slate-700/30'
                }`}>
                  <Contrast className={`w-6 h-6 ${settings.highContrast ? 'text-cyan-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-200 mb-2">High Contrast</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Increase contrast for better visibility
                  </p>
                  <button
                    onClick={() => toggleSetting('highContrast')}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.highContrast ? 'bg-cyan-500' : 'bg-slate-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: settings.highContrast ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>

            {/* Dyslexia Font */}
            <GlassPanel glow={settings.dyslexiaFont ? 'purple' : 'none'} animate={false}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  settings.dyslexiaFont ? 'bg-purple-500/30' : 'bg-slate-700/30'
                }`}>
                  <Type className={`w-6 h-6 ${settings.dyslexiaFont ? 'text-purple-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-200 mb-2">Dyslexia Font</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Use dyslexia-friendly typography
                  </p>
                  <button
                    onClick={() => toggleSetting('dyslexiaFont')}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.dyslexiaFont ? 'bg-purple-500' : 'bg-slate-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: settings.dyslexiaFont ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>

            {/* Text to Speech */}
            <GlassPanel glow={settings.textToSpeech ? 'teal' : 'none'} animate={false}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  settings.textToSpeech ? 'bg-teal-500/30' : 'bg-slate-700/30'
                }`}>
                  <Volume2 className={`w-6 h-6 ${settings.textToSpeech ? 'text-teal-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-200 mb-2">Text-to-Speech</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Enable AI voice narration
                  </p>
                  <button
                    onClick={() => toggleSetting('textToSpeech')}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.textToSpeech ? 'bg-teal-500' : 'bg-slate-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: settings.textToSpeech ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>

            {/* Large Text */}
            <GlassPanel glow={settings.largeText ? 'cyan' : 'none'} animate={false}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  settings.largeText ? 'bg-cyan-500/30' : 'bg-slate-700/30'
                }`}>
                  <Eye className={`w-6 h-6 ${settings.largeText ? 'text-cyan-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-200 mb-2">Large Text</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Increase default text size
                  </p>
                  <button
                    onClick={() => toggleSetting('largeText')}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.largeText ? 'bg-cyan-500' : 'bg-slate-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: settings.largeText ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>

            {/* Reduced Motion */}
            <GlassPanel glow={settings.reducedMotion ? 'purple' : 'none'} animate={false}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  settings.reducedMotion ? 'bg-purple-500/30' : 'bg-slate-700/30'
                }`}>
                  <Minimize2 className={`w-6 h-6 ${settings.reducedMotion ? 'text-purple-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-200 mb-2">Reduced Motion</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Minimize animations
                  </p>
                  <button
                    onClick={() => toggleSetting('reducedMotion')}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.reducedMotion ? 'bg-purple-500' : 'bg-slate-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: settings.reducedMotion ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>

            {/* Dark Mode */}
            <GlassPanel glow={settings.darkMode ? 'teal' : 'none'} animate={false}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  settings.darkMode ? 'bg-teal-500/30' : 'bg-slate-700/30'
                }`}>
                  {settings.darkMode ? (
                    <Moon className="w-6 h-6 text-teal-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-200 mb-2">Dark Mode</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Reduce eye strain in low light
                  </p>
                  <button
                    onClick={() => toggleSetting('darkMode')}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.darkMode ? 'bg-teal-500' : 'bg-slate-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: settings.darkMode ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>

        <NeonDivider color="cyan" className="my-8" />

        {/* Offline Downloads */}
        <div>
          <h3 className="text-teal-400 mb-6">Offline Content</h3>
          
          <GlassPanel glow="teal">
            <div className="mb-6">
              <p className="text-slate-300">
                Download modules for offline access. Perfect for learning on the go without internet connectivity.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Neural Networks Complete Module', size: '245 MB', downloaded: true },
                { name: 'Quantum Physics Fundamentals', size: '180 MB', downloaded: true },
                { name: 'Space Science Collection', size: '320 MB', downloaded: false },
                { name: 'Biotechnology Essentials', size: '210 MB', downloaded: false }
              ].map((module, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-teal-500/20"
                >
                  <div className="flex items-center gap-4">
                    <Download className={`w-5 h-5 ${module.downloaded ? 'text-teal-400' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="text-slate-200 text-sm">{module.name}</h4>
                      <p className="text-slate-500 text-xs">{module.size}</p>
                    </div>
                  </div>
                  <HolographicButton
                    variant={module.downloaded ? 'success' : 'primary'}
                    size="sm"
                  >
                    {module.downloaded ? 'Downloaded' : 'Download'}
                  </HolographicButton>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Storage Used</span>
                <span className="text-sm text-cyan-400">2.4 GB / 10 GB</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: '24%' }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
