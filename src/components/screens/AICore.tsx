import { motion } from 'motion/react';
import { GlassPanel } from '../ui-sci-fi/GlassPanel';
import { NeonDivider } from '../ui-sci-fi/NeonDivider';
import { Brain, TrendingUp, Target, BookOpen, Zap } from 'lucide-react';

export function AICore() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 p-4 sm:p-6">
          <div className="flex items-center gap-4 mb-2">
            <Brain className="w-10 h-10 text-purple-400" />
            <h2 className="text-purple-400">AI Core — Adaptive Insights</h2>
          </div>
          <p className="text-slate-400">Personalized learning analytics powered by artificial intelligence</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6 p-2 sm:p-4">
          {/* Performance Overview */}
          <GlassPanel glow="cyan" className="p-4 sm:p-6">
            
            {/* HUD Ring Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  {/* Background circles */}
                  <circle cx="96" cy="96" r="80" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="12" fill="none" />
                  <circle cx="96" cy="96" r="60" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="12" fill="none" />
                  <circle cx="96" cy="96" r="40" stroke="rgba(45, 212, 191, 0.1)" strokeWidth="12" fill="none" />
                  
                  {/* Progress circles */}
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#06b6d4"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 502" }}
                    animate={{ strokeDasharray: "439 502" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="60"
                    stroke="#a855f7"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 377" }}
                    animate={{ strokeDasharray: "301 377" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="40"
                    stroke="#2dd4bf"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251" }}
                    animate={{ strokeDasharray: "213 251" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl text-cyan-400">87%</div>
                    <div className="text-xs text-slate-500">OVERALL</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-cyan-400">87%</div>
                <div className="text-slate-500">Knowledge</div>
              </div>
              <div>
                <div className="text-purple-400">80%</div>
                <div className="text-slate-500">Engagement</div>
              </div>
              <div>
                <div className="text-teal-400">85%</div>
                <div className="text-slate-500">Retention</div>
              </div>
            </div>
          </GlassPanel>

          {/* Learning Velocity */}
          <GlassPanel glow="purple">
            <h3 className="text-purple-400 mb-6">Learning Velocity</h3>
            
            <div className="space-y-4">
              {[
                { subject: 'Neural Networks', progress: 85, color: 'cyan' },
                { subject: 'Quantum Physics', progress: 70, color: 'purple' },
                { subject: 'Space Science', progress: 60, color: 'teal' },
                { subject: 'Biotechnology', progress: 45, color: 'pink' }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{item.subject}</span>
                    <span className={`text-${item.color}-400`}>{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${
                        item.color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
                        item.color === 'purple' ? 'from-purple-400 to-purple-600' :
                        item.color === 'teal' ? 'from-teal-400 to-teal-600' :
                        'from-pink-400 to-pink-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                    {/* Scanning line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-[scan-line_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* AI Recommendations */}
        <GlassPanel glow="teal" className="mb-6 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-teal-400" />
            <h3 className="text-teal-400">AI Recommendations</h3>
          </div>

          <NeonDivider color="teal" className="mb-6" />

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-8 h-8 text-cyan-400 mb-3" />
              <h4 className="text-cyan-400 mb-2">Focus Area</h4>
              <p className="text-slate-300 text-sm">
                Practice more on activation functions to strengthen your neural network foundation
              </p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
              <h4 className="text-purple-400 mb-2">Next Challenge</h4>
              <p className="text-slate-300 text-sm">
                Ready for Advanced Neural Networks? Your progress suggests you're prepared
              </p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-8 h-8 text-teal-400 mb-3" />
              <h4 className="text-teal-400 mb-2">Review Session</h4>
              <p className="text-slate-300 text-sm">
                Revisit Quantum Basics this week to maintain retention levels
              </p>
            </motion.div>
          </div>
        </GlassPanel>

        {/* Study Patterns */}
        <div className="grid md:grid-cols-2 gap-6 p-2 sm:p-4">
          <GlassPanel glow="magenta" className="p-4 sm:p-6">
            <h3 className="text-pink-400 mb-6">Study Patterns</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-pink-500/10">
                <span className="text-slate-300">Peak Performance Time</span>
                <span className="text-pink-400">2:00 PM - 4:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-pink-500/10">
                <span className="text-slate-300">Average Session Length</span>
                <span className="text-pink-400">45 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-pink-500/10">
                <span className="text-slate-300">Preferred Learning Style</span>
                <span className="text-pink-400">Visual + Interactive</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-pink-500/10">
                <span className="text-slate-300">Weekly Streak</span>
                <span className="text-pink-400">12 days</span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel glow="cyan" className="p-4 sm:p-6">
            <h3 className="text-cyan-400 mb-6">Achievement Unlocked</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Fast Learner', icon: '⚡', color: 'cyan' },
                { name: 'Perfect Score', icon: '🎯', color: 'purple' },
                { name: 'Week Warrior', icon: '🔥', color: 'teal' },
                { name: 'Night Owl', icon: '🦉', color: 'pink' }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg bg-${achievement.color}-500/10 border border-${achievement.color}-500/30 text-center`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className={`text-${achievement.color}-400 text-sm`}>{achievement.name}</div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
