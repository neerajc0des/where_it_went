import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    setAuth: (user: User, accessToken: string, refreshToken: string)=>void;
    setAccessToken: (token: string)=>void;
    setUser: (user:User)=>void;
    logout: ()=>void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set)=>({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth:(user, accessToken, refreshToken)=>{
                // savign token to cookies for middleware
                document.cookie = `accessToken=${accessToken}; path=/; max-age=900`; // for 15 mins

                set({ user, accessToken, refreshToken, isAuthenticated: true });
            },

            setAccessToken: (token) => {
                // updating the cookie
                document.cookie = `accessToken=${token}; path=/; max-age=900`;

                set({ accessToken: token, isAuthenticated: true });
            },

            setUser: (user) => set({ user }),

            logout: () => {
                // clear cookie so middleware blocks dashboard access
                document.cookie = 'accessToken=; path=/; max-age=0';

                set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                });
            },
        }),

        {
            name: 'authStorage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    ),
)