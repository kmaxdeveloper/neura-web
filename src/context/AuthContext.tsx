import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// 1. User interfeysini kengaytiramiz
interface User {
    token: string;
    role: string;
    username: string; // Ism uchun joy ochdik
}

interface AuthContextType {
    user: User | null;
    login: (token: string, role: string, username: string) => void; // Username qo'shildi
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username'); // Ismni ham olamiz

        if (token && role && username) {
            setUser({ token, role, username });
        }
        setLoading(false);
    }, []);

    // Login funksiyasiga username-ni ham qo'shdik
    const login = (token: string, role: string, username: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
        setUser({ token, role, username });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};