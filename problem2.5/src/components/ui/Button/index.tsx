import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  disabled,
  isLoading,
  ...props
}) => {
  return (
      <button 
        className={cn(
            "relative inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center px-6 py-3 text-white text-base rounded-2xl transition-all duration-300 antialiased disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden",
            // Glass effect base
            "bg-white/5 border-white/20 backdrop-blur-md shadow-[inset_0_1px_0px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.2)]",
            // Hover effects
            "hover:bg-white/10 hover:border-white/30 hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5",
            // Active effects
            "active:scale-[0.98] active:translate-y-0",
             // Shines
            "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none",
            className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
  );
};
