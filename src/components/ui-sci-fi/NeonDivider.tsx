interface NeonDividerProps {
  color?: 'cyan' | 'purple' | 'teal' | 'magenta';
  className?: string;
}

export function NeonDivider({ color = 'cyan', className = '' }: NeonDividerProps) {
  const colors = {
    cyan: 'from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.8)]',
    purple: 'from-transparent via-purple-400 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    teal: 'from-transparent via-teal-400 to-transparent shadow-[0_0_10px_rgba(45,212,191,0.8)]',
    magenta: 'from-transparent via-pink-400 to-transparent shadow-[0_0_10px_rgba(232,121,249,0.8)]'
  };

  return (
    <div className={`h-px w-full bg-gradient-to-r ${colors[color]} ${className}`} />
  );
}
