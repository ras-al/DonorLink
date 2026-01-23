import { motion } from 'framer-motion';

const GlitchText = ({ text, className }) => {
    return (
        <div className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-brand-400 opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-400 opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px]">
                {text}
            </span>
        </div>
    );
};

export default GlitchText;
