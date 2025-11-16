import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { NeonDivider } from '../ui-sci-fi/NeonDivider';
import { Type, Contrast, Volume2, Download, Bot } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string; // texto con saltos de línea para párrafos
  progress?: number; // porcentaje 0-100
}

interface LessonViewerProps {
  lessonId?: string;
}

export function LessonViewer({ lessonId = '1' }: LessonViewerProps) {
  const [textSize, setTextSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    async function loadLesson() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = 'https://digieduhackpue-backend.onrender.com';
        const res = await fetch(`${baseUrl}/lessons/${lessonId}`, { signal: ac.signal });
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const response = await res.json();
        // El backend devuelve { success, data: { id_leccion, titulo, contenido, ... } }
        if (response.success && response.data) {
          // Mapear los nombres de campos del backend a los que espera el frontend
          setLesson({
            id: response.data.id_leccion.toString(),
            title: response.data.titulo,
            content: response.data.contenido || '',
            progress: response.data.progress
          });
        } else {
          throw new Error(response.error || 'Error al cargar la lección');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message || 'Error al cargar la lección');
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
    return () => ac.abort();
  }, [lessonId]);

  const handleTextToSpeech = () => {
    const text = lesson?.content ?? 'Neural networks are computing systems inspired by the biological neural networks...';
    const utterance = new window.SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === 'Google US English');
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    window.speechSynthesis.cancel(); // cancelar lecturas previas
    window.speechSynthesis.speak(utterance);
  };

  const progressDisplay = lesson?.progress ?? 67;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Content Panel */}
        <div className="lg:col-span-2">
          <GlassPanel glow="cyan" className="h-full">
            {/* Accessibility Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/30">
              <h3 className="text-cyan-400">{lesson?.title ?? 'Neural Networks: Introduction'}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTextSize(Math.min(textSize + 0.1, 1.5))}
                  className="p-2 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  title="Increase text size"
                >
                  <Type className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`p-2 rounded transition-colors ${
                    highContrast ? 'bg-cyan-500/30 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                  }`}
                  title="Toggle high contrast"
                >
                  <Contrast className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  title="Text to speech" onClick={handleTextToSpeech}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lesson Content */}
            <div 
              className={`space-y-4 ${highContrast ? 'bg-black/50 p-6 rounded' : ''}`}
              style={{ fontSize: `${textSize}rem` }}
            >
              {loading && <p className="text-slate-400">Cargando lección...</p>}
              {error && <p className="text-red-400">Error: {error}</p>}

              {!loading && !error && (
                <>
                  {lesson ? (
                    <>
                      {lesson.content.split(/\n{2,}/).map((para, i) => (
                        <p key={i} className={highContrast ? 'text-white' : 'text-slate-300'}>
                          {para}
                        </p>
                      ))}
                    </>
                  ) : (
                    <>
                      <h4 className={highContrast ? 'text-white' : 'text-slate-200'}>
                        What are Neural Networks?
                      </h4>
                      <p className={highContrast ? 'text-white' : 'text-slate-300'}>
                        Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. 
                        An artificial neural network is based on a collection of connected units or nodes called artificial neurons, 
                        which loosely model the neurons in a biological brain.
                      </p>

                      <NeonDivider color="cyan" className="my-6" />

                      <h4 className={highContrast ? 'text-white' : 'text-slate-200'}>
                        Key Components
                      </h4>
                      <ul className={`list-disc list-inside space-y-2 ${highContrast ? 'text-white' : 'text-slate-300'}`}>
                        <li>Input Layer: Receives the initial data</li>
                        <li>Hidden Layers: Process information through weighted connections</li>
                        <li>Output Layer: Produces the final result</li>
                        <li>Activation Functions: Determine neuron firing patterns</li>
                      </ul>

                      <NeonDivider color="purple" className="my-6" />

                      <h4 className={highContrast ? 'text-white' : 'text-slate-200'}>
                        Applications
                      </h4>
                      <p className={highContrast ? 'text-white' : 'text-slate-300'}>
                        Neural networks power modern AI applications including image recognition, natural language processing, 
                        autonomous vehicles, medical diagnosis, and financial forecasting. Their ability to learn complex patterns 
                        from data makes them invaluable in solving real-world problems.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Lesson Progress</span>
                <span className="text-sm text-cyan-400">{progressDisplay}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressDisplay}%` }}
                  transition={{ duration: 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan-line_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* AI Assistant Panel */}
        <div className="space-y-6">
          {/* AI Avatar */}
          <GlassPanel glow="purple">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400 flex items-center justify-center relative">
                <Bot className="w-16 h-16 text-purple-400" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-[pulse-glow_2s_ease-in-out_infinite]" />
              </div>
              <h4 className="text-purple-400 mb-2">AI Assistant</h4>
              <p className="text-sm text-slate-400">Ready to help you learn</p>
            </div>

            <NeonDivider color="purple" className="my-4" />

            <div className="space-y-3">
              <HolographicButton variant="secondary" size="sm" className="w-full">
                Ask a Question
              </HolographicButton>
              <HolographicButton variant="secondary" size="sm" className="w-full">
                Explain Simply
              </HolographicButton>
              <HolographicButton variant="secondary" size="sm" className="w-full">
                Show Examples
              </HolographicButton>
            </div>
          </GlassPanel>

          {/* Quick Actions */}
          <GlassPanel glow="teal">
            <h4 className="text-teal-400 mb-4">Quick Actions</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded bg-teal-500/10 hover:bg-teal-500/20 transition-colors cursor-pointer">
                <span className="text-slate-300">Bookmark Page</span>
                <div className="w-2 h-2 rounded-full bg-teal-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-teal-500/10 hover:bg-teal-500/20 transition-colors cursor-pointer">
                <span className="text-slate-300">Take Notes</span>
                <div className="w-2 h-2 rounded-full bg-teal-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-teal-500/10 hover:bg-teal-500/20 transition-colors cursor-pointer">
                <span className="text-slate-300">Practice Quiz</span>
                <div className="w-2 h-2 rounded-full bg-teal-400" />
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
