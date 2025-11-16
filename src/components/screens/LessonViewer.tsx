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
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextChecking, setNextChecking] = useState(false);
  // AI assistant states
  const [showAiForm, setShowAiForm] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Base API URL reutilizable
  const baseUrl = 'https://digieduhackpue-backend.onrender.com';

  useEffect(() => {
    const ac = new AbortController();
    async function loadLesson() {
      setLoading(true);
      setError(null);
      try {
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

  // Comprobar si existe la siguiente lección (por id numérico consecutivo)
  useEffect(() => {
    if (!lesson?.id) return;
    let mounted = true;
    async function checkNext() {
      setNextChecking(true);
      setHasNext(false);
      try {
        const nextId = (parseInt(lesson.id, 10) + 1).toString();
        const res = await fetch(`${baseUrl}/lessons/${nextId}`);
        if (!mounted) return;
        if (res.ok) {
          const j = await res.json();
          // si el backend devuelve success:true y data, asumimos que existe
          setHasNext(Boolean(j && j.success && j.data));
        } else {
          setHasNext(false);
        }
      } catch (err) {
        if (mounted) setHasNext(false);
      } finally {
        if (mounted) setNextChecking(false);
      }
    }
    checkNext();
    return () => {
      mounted = false;
    };
  }, [lesson?.id]);

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

  // Nuevo: descarga el PDF desde el endpoint Flask y fuerza la descarga en el cliente
  const handleDownloadPdf = async () => {
    if (!lesson) {
      setError('No hay lección cargada para descargar');
      return;
    }
    setDownloadLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/lessons/generate_pdf/${lesson.id}`, {
        method: 'GET'
      });
      if (!res.ok) {
        // intentar leer error json
        let errMsg = `Error ${res.status}`;
        try {
          const j = await res.json();
          if (j?.error) errMsg = j.error;
        } catch {}
        throw new Error(errMsg);
      }

      const blob = await res.blob();
      // Intentar obtener filename desde header Content-Disposition
      let filename = `${lesson.title ?? 'leccion'}.pdf`;
      const cd = res.headers.get('content-disposition');
      if (cd) {
        // filename*=UTF-8''... or filename="..."
        const mUtf = cd.match(/filename\*=UTF-8''([^;]+)/i);
        const mQuote = cd.match(/filename="([^"]+)"/i);
        const mPlain = cd.match(/filename=([^;]+)/i);
        if (mUtf && mUtf[1]) filename = decodeURIComponent(mUtf[1]);
        else if (mQuote && mQuote[1]) filename = mQuote[1];
        else if (mPlain && mPlain[1]) filename = mPlain[1];
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || 'Error al descargar PDF');
    } finally {
      setDownloadLoading(false);
    }
  };

  const progressDisplay = lesson?.progress ?? 67;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 sm:p-4 md:p-6">
        {/* Main Content Panel */}
        <div className="lg:col-span-2 p-2 sm:p-4">
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
                  onClick={handleDownloadPdf}
                  disabled={downloadLoading}
                  className={`p-2 rounded text-cyan-400 transition-colors ${downloadLoading ? 'bg-cyan-500/20 cursor-wait' : 'bg-cyan-500/10 hover:bg-cyan-500/20'}`}
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
            {/* Siguiente lección */}
            <div className="mt-4 flex justify-end">
              <HolographicButton
                variant="primary"
                size="sm"
                onClick={() => {
                  if (!lesson) return;
                  const nextId = (parseInt(lesson.id, 10) + 1).toString();
                  // Navegar al siguiente id (recarga la página con query param lessonId)
                  window.location.href = `${window.location.pathname}?lessonId=${nextId}`;
                }}
                disabled={!hasNext || nextChecking}
                className={`${!hasNext || nextChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Siguiente lección
              </HolographicButton>
            </div>
          </GlassPanel>
        </div>

        {/* AI Assistant Panel */}
        <div className="space-y-6 p-2 sm:p-4">
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
              <HolographicButton
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setShowAiForm(true);
                  setAiResponse(null);
                  setAiError(null);
                }}
              >
                Ask a Question
              </HolographicButton>
              <HolographicButton variant="secondary" size="sm" className="w-full">
                Explain Simply
              </HolographicButton>
              <HolographicButton variant="secondary" size="sm" className="w-full">
                Show Examples
              </HolographicButton>
            </div>

            {/* AI Ask form (inline) */}
            {showAiForm && (
              <div className="mt-4 text-left">
                <label className="text-sm text-purple-300 block mb-2">Pregunta para el asistente</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="w-full min-h-[80px] p-2 rounded bg-black/40 text-slate-200 border border-purple-400/20"
                />
                <div className="flex items-center gap-2 mt-2">
                  <HolographicButton
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      // send prompt
                      if (!aiPrompt.trim()) {
                        setAiError('Debes escribir una pregunta');
                        return;
                      }
                      setAiLoading(true);
                      setAiError(null);
                      setAiResponse(null);
                      try {
                        const res = await fetch(`${baseUrl}/ai/generate_content`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ prompt: aiPrompt })
                        });
                        const json = await res.json().catch(() => null);

                        // Si la respuesta no es OK o el backend indicó success:false,
                        // mostramos el mensaje de error y, si existe, el raw_response para depuración.
                        if (!res.ok || !json || (json && json.success === false)) {
                          const serverMsg = json?.error || `Error ${res.status}`;
                          const raw = json?.raw_response ? `\n\nRaw response: ${typeof json.raw_response === 'string' ? json.raw_response : JSON.stringify(json.raw_response)}` : '';
                          setAiError(`${serverMsg}${raw}`);
                          return;
                        }

                        // Caso exitoso: tomar generated_text si viene.
                        if (json && json.generated_text) {
                          setAiResponse(json.generated_text);
                        } else {
                          // Si no hay generated_text, mostrar raw para saber qué devuelve el backend
                          const raw = json ? JSON.stringify(json) : 'No response body';
                          setAiError(`No se pudo extraer texto de la respuesta del asistente. Raw: ${raw}`);
                        }
                      } catch (err: any) {
                        setAiError(err?.message || 'Error al comunicarse con el asistente');
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    disabled={aiLoading}
                    className={`${aiLoading ? 'opacity-60 cursor-wait' : ''}`}
                  >
                    {aiLoading ? 'Enviando...' : 'Enviar'}
                  </HolographicButton>
                  <button
                    onClick={() => {
                      setShowAiForm(false);
                      setAiPrompt('');
                      setAiResponse(null);
                      setAiError(null);
                    }}
                    className="ml-auto text-sm text-purple-300 underline"
                  >
                    Cerrar
                  </button>
                </div>

                {aiError && <p className="text-red-400 mt-2">Error: {aiError}</p>}
                {aiResponse && (
                  <div className="mt-3 p-3 rounded bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-400/20 text-slate-100">
                    <h5 className="text-sm text-purple-200 mb-2">Respuesta del asistente</h5>
                    <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
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
              <div 
                className="flex items-center justify-between p-2 rounded bg-teal-500/10 hover:bg-teal-500/20 transition-colors cursor-pointer"
                onClick={() => {
                  if (lesson?.id) {
                    window.location.href = `/assessment?lessonId=${lesson.id}`;
                  }
                }}
              >
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
