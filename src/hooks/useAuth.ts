import { useState, useEffect, useCallback } from 'react';
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

  // Check for existing session on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // No Supabase = skip auth, run in local mode
      setLoading(false);
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
        setUser(session?.user ?? null);
      } catch (err) {
        const authError = err as AuthError;
        logger.error('Error getting session:', authError);
        setError(authError.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    if (!isSupabaseConfigured()) {
      setError('Authentication not configured');
      return { data: null, error: { message: 'Authentication not configured' } };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      setUser(data.user);
      return { data, error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      return { data: null, error: { message: authError.message } };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    setLoading(true);
    try {
      const { error: signOutError } = await supabase!.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    } finally {
      setLoading(false);
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

