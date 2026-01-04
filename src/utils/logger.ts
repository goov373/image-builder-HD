/* eslint-disable no-console */
/**
 * Logger Utility
 * Provides environment-aware logging that silences non-critical logs in production.
 *
 * Usage:
 * import { logger } from '../utils';
 * logger.log('Debug message');  // Only shows in development
 * logger.error('Error!');       // Always shows
 */

// ===== Type Definitions =====

/** Logger interface with all available methods */
export interface Logger {
  /** Debug log - only shows in development */
  log: (...args: unknown[]) => void;
  /** Info log - only shows in development */
  info: (...args: unknown[]) => void;
  /** Warning log - only shows in development */
  warn: (...args: unknown[]) => void;
  /** Error log - ALWAYS logs (important for production) */
  error: (...args: unknown[]) => void;
  /** Group logs together (dev only) */
  group: (label: string) => void;
  /** End group (dev only) */
  groupEnd: () => void;
}

// ===== Environment Detection =====

const isDev: boolean = import.meta.env.DEV;
const isDebug: boolean = import.meta.env.VITE_DEBUG === 'true';

// ===== Logger Implementation =====

/**
 * Conditional logger that respects environment settings.
 * - log/info/warn: Only in development or when VITE_DEBUG=true
 * - error: Always logged (critical for production debugging)
 */
export const logger: Logger = {
  /**
   * Debug log - only shows in development
   */
  log: (...args: unknown[]): void => {
    if (isDev || isDebug) {
      console.log('[App]', ...args);
    }
  },

  /**
   * Info log - only shows in development
   */
  info: (...args: unknown[]): void => {
    if (isDev || isDebug) {
      console.info('[App]', ...args);
    }
  },

  /**
   * Warning log - only shows in development
   */
  warn: (...args: unknown[]): void => {
    if (isDev || isDebug) {
      console.warn('[App]', ...args);
    }
  },

  /**
   * Error log - ALWAYS logs (important for production)
   */
  error: (...args: unknown[]): void => {
    console.error('[App Error]', ...args);
  },

  /**
   * Group logs together (dev only)
   */
  group: (label: string): void => {
    if (isDev || isDebug) {
      console.group(label);
    }
  },

  /**
   * End group (dev only)
   */
  groupEnd: (): void => {
    if (isDev || isDebug) {
      console.groupEnd();
    }
  },
};

export default logger;

