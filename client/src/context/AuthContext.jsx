import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
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

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
