import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[300px] ${toast.type === 'success' ? 'bg-white border-green-100 text-slate-800' : 'bg-red-50 border-red-100 text-red-800'
                                }`}
                        >
                            {toast.type === 'success' ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : (
                                <AlertCircle className="text-red-500" size={20} />
                            )}
                            <span className="text-sm font-medium flex-1">{toast.message}</span>
                            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);