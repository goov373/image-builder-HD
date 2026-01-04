import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logger } from '../utils';
import type { User, AuthError, Session, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Auth Error with message
 */
interface AuthErrorWithMessage {
  message: string;
}

/**
 * Sign In Result
 */
interface SignInResult {
  data: { user: User; session: Session } | null;
  error: AuthErrorWithMessage | null;
}

/**
 * UseAuth Return Interface
 */
export interface UseAuthReturn {
  /** Current authenticated user */
  user: User | null;
  /** Loading state */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** Sign in with email/password */
  signIn: (email: string, password: string) => Promise<SignInResult>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether Supabase is configured */
  isConfigured: boolean;
}

/**
 * useAuth Hook
 *
 * Manages user authentication state with Supabase including:
 * - Session persistence and restoration
 * - Sign in/out functionality
 * - Loading and error states
 * - Auth state change subscriptions
 *
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * import useAuth from './hooks/useAuth';
 *
 * function LoginPage() {
 *   const { user, loading, signIn, signOut, isAuthenticated } = useAuth();
 *
 *   if (loading) return <Spinner />;
 *
 *   if (isAuthenticated) {
 *     return (
 *       <div>
 *         <p>Welcome, {user.email}</p>
 *         <button onClick={signOut}>Sign Out</button>
 *       </div>
 *     );
 *   }
 *
 *   return <LoginForm onSubmit={signIn} />;
 * }
 * ```
 */
export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Check for existing session on mount
  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseConfigured()) {
      // No Supabase = skip auth, run in local mode
      if (mountedRef.current) {
        setLoading(false);
      }
      return;
    }

    // Get initial session
    const getSession = async (): Promise<void> => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase!.auth.getSession();
        if (sessionError) throw sessionError;
        
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        const authError = err as AuthError;
        logger.error('Error getting session:', authError);
        
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setError(authError.message);
        }
      } finally {
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    if (!isSupabaseConfigured()) {
      if (mountedRef.current) {
        setError('Authentication not configured');
      }
      return { data: null, error: { message: 'Authentication not configured' } };
    }

    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const { data, error: signInError } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setUser(data.user);
      }
      return { data, error: null };
    } catch (err) {
      const authError = err as AuthError;
      if (mountedRef.current) {
        setError(authError.message);
      }
      return { data: null, error: { message: authError.message } };
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    if (mountedRef.current) {
      setLoading(true);
    }
    try {
      const { error: signOutError } = await supabase!.auth.signOut();
      if (signOutError) throw signOutError;
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setUser(null);
      }
    } catch (err) {
      const authError = err as AuthError;
      if (mountedRef.current) {
        setError(authError.message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => setError(null), []);

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
    isAuthenticated: !!user,
    isConfigured: isSupabaseConfigured(),
  };
}

