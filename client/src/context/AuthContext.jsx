import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // We need to handle navigation inside components or use a different method if outside Router
    // But here AuthProvider will likely be inside Router

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.data);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (emailOrToken, password) => {
        // If only one argument and it looks like a token, use it directly
        if (!password && typeof emailOrToken === 'string' && emailOrToken.length > 50) {
            localStorage.setItem('token', emailOrToken);
            await checkUserLoggedIn();
            return;
        }
        // Otherwise it's email/password login
        const { data } = await api.post('/auth/login', { email: emailOrToken, password });
        localStorage.setItem('token', data.token);
        await checkUserLoggedIn();
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        // Don't save token yet - user needs to verify OTP first
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
