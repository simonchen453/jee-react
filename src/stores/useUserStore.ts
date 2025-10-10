import { create } from 'zustand';
import { User } from '../types/index.js';

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