import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface HolographicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HolographicButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = ''
}: HolographicButtonProps) {
  const variants = {
    primary: 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    secondary: 'border-purple-400 text-purple-400 hover:bg-purple-400/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    success: 'border-teal-400 text-teal-400 hover:bg-teal-400/20 hover:shadow-[0_0_20px_rgba(45,212,191,0.5)]',
    danger: 'border-pink-400 text-pink-400 hover:bg-pink-400/20 hover:shadow-[0_0_20px_rgba(232,121,249,0.5)]'
  };

  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative border-2 backdrop-blur-sm bg-white/5 
        transition-all duration-300 uppercase tracking-wider
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
