import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export const Label = ({ children, className, ...props }: HTMLAttributes<HTMLLabelElement>) => {
    return (
        <label 
            className={cn(
                "text-sm font-medium text-gray-400 mb-1.5 block uppercase tracking-wider",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
};
