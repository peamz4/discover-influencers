import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  hasRole: (roles: string[]) => boolean;
  initializeAuth: () => void;
}

// Session storage keys
const USER_KEY = 'prime_user';

// Helper functions for sessionStorage
const saveUserToSession = (user: User) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const loadUserFromSession = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const clearUserFromSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(USER_KEY);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  setAuth: (user) => {
    saveUserToSession(user);
    set({ user, isAuthenticated: true });
  },
  
  clearAuth: () => {
    clearUserFromSession();
    set({ user: null, isAuthenticated: false });
  },
  
  hasRole: (roles) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },
  
  // Initialize auth from sessionStorage on app load
  initializeAuth: () => {
    const user = loadUserFromSession();
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
}));
