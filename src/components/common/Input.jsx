import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ label, error, className, icon: Icon, ...props }, ref) => {
    return (
        <div className="space-y-1.5">
            {label && <label className="text-sm font-medium text-slate-700 block">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        Icon && "pl-10",
                        error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";
export default Input;
