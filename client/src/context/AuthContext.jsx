
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Fetch full profile from backend (MongoDB) to get role
                api.get('/auth/me').then(res => {
                    setUser({ ...session.user, ...res.data.data });
                }).catch(() => {
                    // Fallback if backend unreachable (e.g. local vs production mismatch)
                    setUser(session.user);
                }).finally(() => setLoading(false));
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                try {
                    const res = await api.get('/auth/me');
                    setUser({ ...session.user, ...res.data.data });
                } catch (err) {
                    console.error('Failed to fetch user profile', err);
                    setUser(session.user);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
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
