import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('aiml_token');
    const userStr = localStorage.getItem('aiml_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('aiml_token');
        localStorage.removeItem('aiml_user');
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('aiml_token', token);
      localStorage.setItem('aiml_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.register({ name, email, password });
      const { token, user } = res.data;
      localStorage.setItem('aiml_token', token);
      localStorage.setItem('aiml_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('aiml_token');
    localStorage.removeItem('aiml_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
