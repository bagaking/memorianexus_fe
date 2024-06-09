import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api/auth';
import Cookies from 'js-cookie';

interface AuthContextProps {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('ACCESS_TOKEN');
        const storedUser = Cookies.get('USER');
        console.log('Loaded token:', token);
        console.log('Loaded user:', storedUser);
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await loginApi({ username, password });
            const token = response.data.token; // 假设响应中包含 token
            setIsAuthenticated(true);
            setUser({ username });
            Cookies.set('ACCESS_TOKEN', token, { expires: 7 }); // 设置 7 天过期
            Cookies.set('USER', JSON.stringify({ username }), { expires: 7 });
            console.log('Stored token:', token);
            console.log('Stored user:', { username });
        } catch (error) {
            console.error('Failed to login', error);
            throw error;
        }
    };


    const register = async (username: string, email: string, password: string, confirmPassword: string) => {
        try {
            await registerApi({ username, email, password, confirmPassword });
            navigate('/login'); // 注册成功后跳转到登录页面
        } catch (error) {
            console.error('Failed to register', error);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove('ACCESS_TOKEN');
        Cookies.remove('USER');
        navigate('/login'); // 注销成功后跳转到登录页面
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
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