import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// 1. User interfeysi
interface User {
    token: string;
    role: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, role: string, username: string) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');
                const username = localStorage.getItem('username');

                // Faqat hamma ma'lumot bor bo'lsa user'ni o'rnatamiz
                if (token && role && username) {
                    setUser({ 
                        token: token.trim(), 
                        role: role.trim(), 
                        username: username.trim() 
                    });
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.clear(); // Xato bo'lsa tozalab tashlaymiz
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (token: string, role: string, username: string) => {
        // Ma'lumotlarni xavfsiz holatga keltiramiz
        const cleanToken = token.trim();
        const cleanRole = role.trim();
        const cleanUsername = username.trim();

        // LocalStorage'ga yozish
        localStorage.setItem('token', cleanToken);
        localStorage.setItem('role', cleanRole);
        localStorage.setItem('username', cleanUsername);

        // State'ni yangilash
        setUser({ 
            token: cleanToken, 
            role: cleanRole, 
            username: cleanUsername 
        });
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