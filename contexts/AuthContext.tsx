"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signInWithOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(mapUser(session.user));
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ? mapUser(session.user) : null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapUser = (sbUser: SupabaseUser): User => {
        return {
            id: sbUser.id,
            name: sbUser.user_metadata.name || sbUser.email?.split("@")[0] || "Usuário",
            email: sbUser.email || "",
            avatar: sbUser.user_metadata.avatar_url,
            company: sbUser.user_metadata.company,
        };
    };

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const register = async (name: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) throw error;

        // Log para debug - verificar se precisa confirmação de email
        console.log('Registration response:', data);

        // Se o usuário foi criado mas precisa confirmar email, mostrar mensagem
        if (data.user && !data.session) {
            throw new Error('Por favor, verifique seu email para confirmar o cadastro antes de fazer login.');
        }
    };

    const signInWithOtp = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            }
        });
        if (error) throw error;
    };

    const verifyOtp = async (email: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                signInWithOtp,
                verifyOtp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
