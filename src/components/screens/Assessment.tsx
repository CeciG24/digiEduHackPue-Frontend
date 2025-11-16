import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { Lightbulb, AlertCircle, Loader } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  answer?: number;
}

interface BackendQuestion {
  question: string;
  options: string[];
  answer: number;
}

export function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get lesson ID from URL or use a default
  const lessonId = new URLSearchParams(window.location.search).get('lessonId') || '1';
  const apiUrl = "https://digieduhackpue-backend.onrender.com";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${apiUrl}/ai/generate-test/${lessonId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Parse the generated_text if it's a string
          let parsedData = data.generated_text;
          if (typeof parsedData === 'string') {
            // Remove markdown code block if present
            parsedData = parsedData.trim();
            if (parsedData.startsWith('```')) {
              // Remove the first line (```json or ```)
              parsedData = parsedData.replace(/^```[a-zA-Z]*\s*/, '');
              // Remove the last line if it is ```
              parsedData = parsedData.replace(/```\s*$/, '');
            }
            parsedData = JSON.parse(parsedData);
          }

          // Transform backend questions to our format
          const formattedQuestions: Question[] = (parsedData.questions || []).map(
            (q: BackendQuestion, index: number) => ({
              id: index + 1,
              question: q.question,
              options: q.options,
              correctAnswer: q.answer,
            })
          );

          if (formattedQuestions.length === 0) {
            throw new Error('No questions received from backend');
          }

          setQuestions(formattedQuestions);
        } else {
          throw new Error(data.error || 'Failed to generate test');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonId]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentQuestion(currentQuestion + 1);
  };

  const isCorrect = questions.length > 0 && selectedAnswer === questions[currentQuestion]?.correctAnswer;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl px-4 sm:px-6 md:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <p className="text-slate-300 mt-4">Generating assessment...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <GlassPanel glow="pink" className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-pink-400 font-semibold">Error Loading Assessment</h3>
                <p className="text-slate-300 mt-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-pink-500/20 border border-pink-400 rounded-lg text-pink-400 hover:bg-pink-500/30 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Questions Content */}
        {!loading && !error && questions.length > 0 && (
          <>
            {/* Header */}
            <div className="mb-8 p-4 sm:p-6">
              <h2 className="text-cyan-400 mb-2">Simulation Training</h2>
              <p className="text-slate-400">Test your knowledge and skills</p>
            </div>

            {/* Progress Reactor */}
            <div className="flex items-center justify-center mb-8 p-2 sm:p-4">
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="10"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#progressGradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 440" }}
                animate={{ 
                  strokeDasharray: `${(currentQuestion / questions.length) * 440} 440` 
                }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl text-cyan-400">{currentQuestion + 1}</span>
              <span className="text-sm text-slate-400">of {questions.length}</span>
            </div>
          </div>
        </div>

        {/* Question Panel */}
        <GlassPanel glow="cyan" className="mb-6 p-4 sm:p-6 md:p-8">
          <h3 className="text-slate-200 mb-6">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === questions[currentQuestion].correctAnswer;
              
              let borderColor = 'border-slate-600';
              let bgColor = 'bg-slate-800/30';
              let glowColor = '';

              if (showFeedback && isSelected) {
                if (isCorrect) {
                  borderColor = 'border-cyan-400';
                  bgColor = 'bg-cyan-500/20';
                  glowColor = 'shadow-[0_0_20px_rgba(6,182,212,0.5)]';
                } else {
                  borderColor = 'border-pink-400';
                  bgColor = 'bg-pink-500/20';
                  glowColor = 'shadow-[0_0_20px_rgba(236,72,153,0.5)]';
                }
              } else if (showFeedback && isCorrectOption) {
                borderColor = 'border-cyan-400';
                bgColor = 'bg-cyan-500/10';
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => !showFeedback && handleAnswer(index)}
                  disabled={showFeedback}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all
                    ${borderColor} ${bgColor} ${glowColor}
                    ${!showFeedback ? 'hover:border-cyan-400/50 hover:bg-slate-700/30' : ''}
                    disabled:cursor-not-allowed
                  `}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${isSelected && showFeedback 
                        ? isCorrect 
                          ? 'border-cyan-400 bg-cyan-400' 
                          : 'border-pink-400 bg-pink-400'
                        : 'border-slate-500'
                      }
                    `}>
                      {isSelected && showFeedback && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-slate-200">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg border-2 ${
                isCorrect 
                  ? 'border-cyan-400 bg-cyan-500/10' 
                  : 'border-pink-400 bg-pink-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <Lightbulb className="w-5 h-5 text-cyan-400 mt-1" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-pink-400 mt-1" />
                )}
                <div>
                  <h4 className={isCorrect ? 'text-cyan-400' : 'text-pink-400'}>
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </h4>
                  <p className="text-slate-300 text-sm mt-1">
                    {isCorrect 
                      ? 'Great job! You understand this concept well.' 
                      : 'The correct answer processes information through weighted connections in the hidden layers.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
            </GlassPanel>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center p-4 sm:p-6">
              {showFeedback && currentQuestion < questions.length - 1 && (
                <HolographicButton variant="primary" onClick={nextQuestion}>
                  Next Question
                </HolographicButton>
              )}
              {showFeedback && currentQuestion === questions.length - 1 && (
                <HolographicButton variant="success">
                  Complete Assessment - Score: {score}/{questions.length}
                </HolographicButton>
              )}
              <HolographicButton variant="secondary">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                AI Explanation
              </HolographicButton>
            </div>
          </>
        )}

        {/* No questions state */}
        {!loading && !error && questions.length === 0 && (
          <GlassPanel glow="cyan" className="p-6 text-center">
            <p className="text-slate-300">No questions available</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
