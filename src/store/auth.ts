import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  xp: number;
  streak: number;
  gems: number;
  level: number;
  onboarded: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,

  login: async (phone: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      if (!res.ok) {
        set({ isLoading: false });
        return false;
      }
      const data = await res.json();
      const userData = data.user || data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('wasal_user', JSON.stringify(userData));
      }
      set({ user: userData, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  register: async (name: string, phone: string, password?: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password }),
      });
      if (!res.ok) {
        set({ isLoading: false });
        return false;
      }
      const data = await res.json();
      const userData = data.user || data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('wasal_user', JSON.stringify(userData));
      }
      set({ user: userData, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wasal_user');
    }
    set({ user: null });
  },

  refreshUser: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const userData = data.user || data;
        set({ user: userData });
        if (typeof window !== 'undefined') {
          localStorage.setItem('wasal_user', JSON.stringify(userData));
        }
      }
    } catch {
      // silently fail
    }
  },
}));

/* Hydrate from localStorage on client */
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('wasal_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      useAuth.setState({ user });
    } catch {
      localStorage.removeItem('wasal_user');
    }
  }
}
