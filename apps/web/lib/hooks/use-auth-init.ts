import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/auth';
import { authService } from '../services/auth.service';

/**
 * Hook to initialize and verify authentication on app load
 * - Loads user from sessionStorage
 * - Verifies session with server using HttpOnly cookies
 * - Derives isAuthenticated from token validation
 */
export function useAuthInit() {
  const { initializeAuth, setAuth, clearAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      // First, load user from sessionStorage
      initializeAuth();
      
      // Then verify the session with server (using HttpOnly cookies)
      try {
        const currentUser = await authService.getCurrentUser();
        
        // Update store with fresh user data from server
        setAuth(currentUser);
      } catch {
        // If verification fails, clear the session
        // This means cookies are invalid/expired
        console.log('[Auth Init] Session invalid, clearing auth');
        clearAuth();
      }
      
      setIsInitialized(true);
    };

    initAuth();
  }, [initializeAuth, setAuth, clearAuth]);

  return { isInitialized };
}
