import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const res = await fetch('http://127.0.0.1:8000/api/auth/me/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser({
                            ...data,
                            name: data.name || data.email.split('@')[0].toUpperCase(),
                        });
                    } else {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                    }
                } catch (e) {
                    console.error("Auth init failed", e);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData) => {
        setUser({
            ...userData,
            name: userData.name || userData.email.split('@')[0].toUpperCase(),
        });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!isLoading ? children : (
                <div className="flex items-center justify-center min-h-screen bg-slate-50">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
