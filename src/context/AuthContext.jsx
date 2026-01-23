
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Default to 'donor' for demo purposes
    const [user, setUser] = useState({
        name: 'Alex Johnson',
        role: 'donor', // 'donor' | 'hospital' | 'organization' | 'admin'
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        trustScore: 85,
    });

    const login = (role = 'donor') => {
        const mockUsers = {
            donor: {
                name: 'Alex Johnson',
                role: 'donor',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
                trustScore: 85,
            },
            hospital: {
                name: 'City General Hospital',
                role: 'hospital',
                avatar: null,
                trustScore: 98,
            },
            organization: {
                name: 'Red Cross Chapter',
                role: 'organization',
                avatar: null,
                trustScore: 100,
            }
        };
        setUser(mockUsers[role]);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
