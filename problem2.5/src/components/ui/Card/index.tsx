import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export const Card = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div 
            className={cn(
                "relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl",
                 // Glossy overlay
                "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none",
                 // Rim lighting
                "after:absolute after:inset-0 after:rounded-3xl after:ring-1 after:ring-inset after:ring-white/10 after:pointer-events-none",
                className
            )} 
            {...props}
        >
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
