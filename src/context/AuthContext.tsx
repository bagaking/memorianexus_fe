import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';

interface AuthContextProps {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const navigate = useNavigate();

    const checkAuth = async (): Promise<boolean> => {
        const token = authApi.getToken();
        if (!token) {
            console.log('No token found, user is not authenticated');
            setIsAuthenticated(false);
            setUser(null);
            return false;
        }

        try {
            await authApi.verifyToken();
            const storedUser = authApi.getUser();
            if (storedUser) {
                setIsAuthenticated(true);
                setUser(storedUser);
            }
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            try {
                await authApi.refreshToken();
                const storedUser = authApi.getUser();
                if (storedUser) {
                    setIsAuthenticated(true);
                    setUser(storedUser);
                }
                return true;
            } catch (refreshError) {
                console.error('Token refresh by auth failed:', refreshError);
                authApi.logout();
                setIsAuthenticated(false);
                setUser(null);
                return false;
            }
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            await authApi.login({ username, password });
            setIsAuthenticated(true);
            setUser({ username });
        } catch (error) {
            console.error('Failed to login', error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string, confirmPassword: string) => {
        try {
            await authApi.register({ username, email, password, confirmPassword });
            navigate('/login');
        } catch (error) {
            console.error('Failed to register', error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};