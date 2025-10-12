import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {User} from '../types/index';

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
}

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    addUser: (user: User) => void;
    removeUser: (id: number) => void;
    setUsers: (users: User[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            currentUser: null,
            login: (user) => set({ isAuthenticated: true, currentUser: user }),
            logout: () => set({ isAuthenticated: false, currentUser: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export const useUserStore = create<UserState>((set) => ({
    users: [],
    loading: false,
    error: null,
    setUsers: (users) => set({ users, error: null }),
    addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),
    removeUser: (id) =>
        set((state) => ({ users: state.users.filter(u => u.id !== id) })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));