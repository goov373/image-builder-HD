/**
 * Logger Utility
 * Provides environment-aware logging that silences non-critical logs in production.
 * 
 * Usage:
 * import { logger } from '../utils';
 * logger.log('Debug message');  // Only shows in development
 * logger.error('Error!');       // Always shows
 */

const isDev = import.meta.env.DEV;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

/**
 * Conditional logger that respects environment settings.
 * - log/info/warn: Only in development or when VITE_DEBUG=true
 * - error: Always logged (critical for production debugging)
 */
export const logger = {
  /**
   * Debug log - only shows in development
   */
  log: (...args) => {
    if (isDev || isDebug) {
      console.log('[App]', ...args);
    }
  },

  /**
   * Info log - only shows in development
   */
  info: (...args) => {
    if (isDev || isDebug) {
      console.info('[App]', ...args);
    }
  },

  /**
   * Warning log - only shows in development
   */
  warn: (...args) => {
    if (isDev || isDebug) {
      console.warn('[App]', ...args);
    }
  },

  /**
   * Error log - ALWAYS logs (important for production)
   */
  error: (...args) => {
    console.error('[App Error]', ...args);
  },

  /**
   * Group logs together (dev only)
   */
  group: (label) => {
    if (isDev || isDebug) {
      console.group(label);
    }
  },

  /**
   * End group (dev only)
   */
  groupEnd: () => {
    if (isDev || isDebug) {
      console.groupEnd();
    }
  },
};

export default logger;

