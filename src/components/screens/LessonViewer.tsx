import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Type, Contrast, Volume2, Download, Bot, Mic, MicOff } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  progress?: number;
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
  
  // Voice control states
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListeningForQuestion, setIsListeningForQuestion] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const baseUrl = 'https://digieduhackpue-backend.onrender.com';

  // Load lesson
  useEffect(() => {
    const ac = new AbortController();
    async function loadLesson() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/lessons/${lessonId}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const response = await res.json();
        if (response.success && response.data) {
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

  // Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Tu navegador no soporta reconocimiento de voz');
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'es-ES'; // Español

    recognition.onstart = () => {
      setIsVoiceActive(true);
      setVoiceStatus('Escuchando comandos...');
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
      if (!isListeningForQuestion) {
        setVoiceStatus('');
      }
      // Reiniciar automáticamente si está en modo escucha de pregunta
      if (isListeningForQuestion) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      }
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('🎤 Reconocido:', transcript);

      // Modo 1: Escuchando comandos generales
      if (!isListeningForQuestion) {
        if (transcript.includes('pregunta') || transcript.includes('asistente') || transcript.includes('ask') || transcript.includes('question')) {
          setVoiceStatus('Activando asistente...');
          setShowAiForm(true);
          setAiResponse(null);
          setAiError(null);
          setIsListeningForQuestion(true);
          setVoiceStatus('🎤 Haz tu pregunta ahora');
        } else if (transcript.includes('aumentar texto') || transcript.includes('texto grande')) {
          setTextSize(Math.min(textSize + 0.1, 1.5));
          setVoiceStatus('Texto aumentado');
          setTimeout(() => setVoiceStatus(''), 2000);
        } else if (transcript.includes('contrastar') || transcript.includes('contraste')) {
          setHighContrast(!highContrast);
          setVoiceStatus('Contraste cambiado');
          setTimeout(() => setVoiceStatus(''), 2000);
        } else if (transcript.includes('leer') || transcript.includes('audio')) {
          handleTextToSpeech();
          setVoiceStatus('Reproduciendo audio');
          setTimeout(() => setVoiceStatus(''), 2000);
        } else if (transcript.includes('descargar') || transcript.includes('pdf')) {
          handleDownloadPdf();
          setVoiceStatus('Descargando PDF...');
        }
      } 
      // Modo 2: Escuchando la pregunta para la IA
      else {
        if (transcript.includes('cancelar') || transcript.includes('cerrar')) {
          setIsListeningForQuestion(false);
          setShowAiForm(false);
          setVoiceStatus('Cancelado');
          setTimeout(() => setVoiceStatus(''), 2000);
        } else {
          // Capturar la pregunta y enviarla automáticamente
          setAiPrompt(transcript);
          setVoiceStatus('Pregunta capturada, enviando...');
          setIsListeningForQuestion(false);
          
          // Enviar automáticamente
          setTimeout(() => {
            handleAiQuestion(transcript);
          }, 500);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Error de voz:', event.error);
      if (event.error === 'no-speech') {
        setVoiceStatus('No se detectó voz');
      } else if (event.error === 'not-allowed') {
        setVoiceStatus('Permiso de micrófono denegado');
        setVoiceSupported(false);
      }
      setTimeout(() => setVoiceStatus(''), 3000);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        console.log('Recognition cleanup');
      }
    };
  }, [isListeningForQuestion, highContrast, textSize]);

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    try {
      if (isVoiceActive) {
        recognitionRef.current.stop();
        setIsListeningForQuestion(false);
      } else {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error toggling voice:', error);
    }
  };

  // Handle AI question (manual or voice)
  const handleAiQuestion = async (question: string = aiPrompt) => {
    if (!question.trim()) {
      setAiError('Debes escribir una pregunta');
      return;
    }
    
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    setVoiceStatus('Consultando IA...');
    
    try {
      const res = await fetch(`${baseUrl}/ai/generate_content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question })
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json || (json && json.success === false)) {
        const serverMsg = json?.error || `Error ${res.status}`;
        setAiError(serverMsg);
        setVoiceStatus('Error en la consulta');
        return;
      }

      if (json && json.generated_text) {
        setAiResponse(json.generated_text);
        setVoiceStatus('Respuesta recibida');
        
        // Leer la respuesta en voz alta automáticamente
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(json.generated_text);
          utterance.lang = 'es-ES';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }, 500);
      } else {
        const raw = json ? JSON.stringify(json) : 'No response body';
        setAiError(`No se pudo extraer texto. Raw: ${raw}`);
        setVoiceStatus('Error en respuesta');
      }
    } catch (err: any) {
      setAiError(err?.message || 'Error al comunicarse con el asistente');
      setVoiceStatus('Error de conexión');
    } finally {
      setAiLoading(false);
      setTimeout(() => setVoiceStatus(''), 3000);
    }
  };

  const handleTextToSpeech = () => {
    const text = lesson?.content ?? 'Neural networks are computing systems...';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadPdf = async () => {
    if (!lesson) {
      setError('No hay lección cargada para descargar');
      return;
    }
    setDownloadLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/lessons/generate_pdf/${lesson.id}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lesson.title ?? 'leccion'}.pdf`;
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Voice Status Banner */}
        {voiceStatus && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
            <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-xl border border-purple-400/50 rounded-full px-6 py-3 shadow-lg shadow-purple-500/50">
              <p className="text-white font-medium flex items-center gap-2">
                {isListeningForQuestion && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                {voiceStatus}
              </p>
            </div>
          </div>
        )}

        {/* Main Content Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-6">
            
            {/* Accessibility Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/30">
              <h3 className="text-cyan-400 text-xl font-semibold">
                {lesson?.title ?? 'Neural Networks: Introduction'}
              </h3>
              <div className="flex gap-2">
                {voiceSupported && (
                  <button
                    onClick={toggleVoiceRecognition}
                    className={`p-2 rounded transition-all ${
                      isVoiceActive 
                        ? 'bg-green-500/30 text-green-400 animate-pulse' 
                        : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                    }`}
                    title="Toggle voice control"
                  >
                    {isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                )}
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
                  onClick={handleTextToSpeech}
                  className="p-2 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  title="Text to speech"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadLoading}
                  className={`p-2 rounded text-cyan-400 transition-colors ${
                    downloadLoading ? 'bg-cyan-500/20 cursor-wait' : 'bg-cyan-500/10 hover:bg-cyan-500/20'
                  }`}
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

              {!loading && !error && lesson && (
                <>
                  {lesson.content.split(/\n{2,}/).map((para, i) => (
                    <p key={i} className={highContrast ? 'text-white' : 'text-slate-300'}>
                      {para}
                    </p>
                  ))}
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
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-purple-400/30 rounded-2xl shadow-2xl shadow-purple-500/20 p-6">
            
            {/* AI Avatar */}
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400 flex items-center justify-center relative">
                <Bot className="w-16 h-16 text-purple-400" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-pulse" />
              </div>
              <h4 className="text-purple-400 text-lg font-semibold mb-2">AI Assistant</h4>
              <p className="text-sm text-slate-400">Di "pregunta" para activar</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent my-4" />

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => {
                  setShowAiForm(true);
                  setAiResponse(null);
                  setAiError(null);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl text-purple-300 hover:border-purple-400/60 transition-all"
              >
                Ask a Question
              </button>
            </div>

            {/* AI Form */}
            {showAiForm && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-purple-300">Tu pregunta:</label>
                  {isListeningForQuestion && (
                    <span className="flex items-center gap-2 text-xs text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Escuchando...
                    </span>
                  )}
                </div>
                
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Escribe o di tu pregunta..."
                  className="w-full min-h-[100px] p-3 rounded-xl bg-black/40 text-slate-200 border border-purple-400/20 focus:border-purple-400/60 focus:outline-none"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAiQuestion()}
                    disabled={aiLoading}
                    className={`flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium transition-all ${
                      aiLoading ? 'opacity-60 cursor-wait' : 'hover:shadow-lg hover:shadow-purple-500/50'
                    }`}
                  >
                    {aiLoading ? 'Consultando...' : 'Enviar'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAiForm(false);
                      setAiPrompt('');
                      setAiResponse(null);
                      setAiError(null);
                    }}
                    className="px-4 py-2 bg-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

                {aiError && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{aiError}</p>
                  </div>
                )}
                
                {aiResponse && (
                  <div className="p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-400/30 rounded-xl animate-fade-in">
                    <h5 className="text-sm text-purple-200 font-semibold mb-2">Respuesta:</h5>
                    <p className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voice Commands Help */}
          {voiceSupported && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-teal-400/30 rounded-2xl shadow-xl p-4">
              <h4 className="text-teal-400 text-sm font-semibold mb-3">🎤 Comandos de Voz</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <p>• "Pregunta" / "Asistente" - Activar IA</p>
                <p>• "Aumentar texto" - Texto más grande</p>
                <p>• "Contraste" - Cambiar contraste</p>
                <p>• "Leer" / "Audio" - Leer contenido</p>
                <p>• "Descargar" / "PDF" - Descargar PDF</p>
                <p>• "Cancelar" - Cerrar asistente</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}