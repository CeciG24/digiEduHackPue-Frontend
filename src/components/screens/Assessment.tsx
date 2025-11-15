import { useState } from 'react';
import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { HolographicButton } from '../ui-sci-fi/HolographicButton';
import { Lightbulb, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary function of a neural network's hidden layer?",
      options: [
        "To receive input data",
        "To process information through weighted connections",
        "To display the final output",
        "To store training data"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which component determines the firing pattern of artificial neurons?",
      options: [
        "Input Layer",
        "Weight Matrix",
        "Activation Function",
        "Loss Function"
      ],
      correctAnswer: 2
    }
  ];

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

  const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-cyan-400 mb-2">Simulation Training</h2>
          <p className="text-slate-400">Test your knowledge and skills</p>
        </div>

        {/* Progress Reactor */}
        <div className="flex items-center justify-center mb-8">
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
        <GlassPanel glow="cyan" className="mb-6">
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
        <div className="flex gap-4 justify-center">
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
      </div>
    </div>
  );
}
