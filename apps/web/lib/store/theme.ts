import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme/UI preferences store
 * Uses localStorage for persistence (non-sensitive data)
 */

export type ColorScheme = 'dark' | 'light' | 'system';

interface ThemeState {
  colorScheme: ColorScheme;
  sidebarCollapsed: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleSidebar: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'dark',
      sidebarCollapsed: false,
      
      setColorScheme: (scheme) => {
        set({ colorScheme: scheme });
      },
      
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
    }),
    {
      name: 'prime-theme-storage', // localStorage key
    }
  )
);
