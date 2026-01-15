import type { InputHTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
      <input
        className={cn(
            "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-200",
            "hover:bg-white/10 hover:border-white/20",
            "focus:bg-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-inner",
            className
        )}
        {...props}
      />
  );
};
