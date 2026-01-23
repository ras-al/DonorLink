import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', isLoading, className, ...props }) => {
    const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/25 border border-transparent",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        outline: "bg-transparent border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 size={20} className="animate-spin" />}
            {children}
        </button>
    );
};

export default Button;