import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {User, LoginRequest, LoginResponse} from '../types/index';
import { loginApi, logoutApi } from '../api/auth';

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    token: string | null;
    login: (loginData: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    setToken: (token: string) => void;
    clearAuth: () => void;
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
        (set, get) => ({
            isAuthenticated: false,
            currentUser: null,
            token: null,
            login: async (loginData: LoginRequest) => {
                try {
                    const response = await loginApi(loginData);
                    const { token, user } = response;
                    
                    // 保存token到localStorage
                    localStorage.setItem('token', token);
                    
                    set({ 
                        isAuthenticated: true, 
                        currentUser: user,
                        token: token
                    });
                } catch (error) {
                    console.error('登录失败:', error);
                    throw error;
                }
            },
            logout: async () => {
                try {
                    await logoutApi();
                } catch (error) {
                    console.error('登出失败:', error);
                } finally {
                    // 无论登出API是否成功，都清除本地状态
                    localStorage.removeItem('token');
                    set({ 
                        isAuthenticated: false, 
                        currentUser: null,
                        token: null
                    });
                }
            },
            setToken: (token: string) => {
                localStorage.setItem('token', token);
                set({ token, isAuthenticated: true });
            },
            clearAuth: () => {
                localStorage.removeItem('token');
                set({ 
                    isAuthenticated: false, 
                    currentUser: null,
                    token: null
                });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                token: state.token,
                currentUser: state.currentUser,
                isAuthenticated: state.isAuthenticated
            }),
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