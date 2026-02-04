
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api/axios';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                // 1. SYNC TOKEN for Axios
                localStorage.setItem('token', session.access_token);

                // 2. Prepare User Object (Handle Name Fallback)
                const baseUser = {
                    ...session.user,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
                };

                try {
                    console.log('Fetching full profile from /api/auth/me...');
                    const res = await api.get('/auth/me');
                    console.log('Backend Profile:', res.data.data);

                    const fullUser = { ...baseUser, ...res.data.data };
                    console.log('Merged User Object:', fullUser);

                    setUser(fullUser);
                } catch (err) {
                    console.error('Failed to fetch user profile:', err);
                    setUser(baseUser);
                }
            } else {
                localStorage.removeItem('token'); // Clear token
                setUser(null);
            }
            setLoading(false);
        });

        // Initial Load Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                localStorage.setItem('token', session.access_token);
                // Same logic for initial load
                const baseUser = {
                    ...session.user,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
                };

                api.get('/auth/me').then(res => {
                    setUser({ ...baseUser, ...res.data.data });
                }).catch(() => {
                    setUser(baseUser);
                }).finally(() => setLoading(false));
            } else {
                localStorage.removeItem('token');
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    const register = async (name, email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
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
