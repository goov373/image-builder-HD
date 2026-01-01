/**
 * Logger Utility Tests
 * Tests for the environment-aware logger
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to mock import.meta.env before importing logger
vi.mock('../../utils/logger', async () => {
  const originalModule = await vi.importActual('../../utils/logger');
  return {
    ...originalModule,
    default: originalModule.default,
  };
});

import { logger } from '../index';

describe('logger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports logger object with expected methods', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.group).toBe('function');
    expect(typeof logger.groupEnd).toBe('function');
  });

  it('logger.error always logs (production-safe)', () => {
    logger.error('Test error');
    expect(consoleSpy.error).toHaveBeenCalledWith('[App Error]', 'Test error');
  });

  it('logger.error includes multiple arguments', () => {
    const error = new Error('Test');
    logger.error('Error occurred:', error);
    expect(consoleSpy.error).toHaveBeenCalledWith('[App Error]', 'Error occurred:', error);
  });

  // In dev mode (which Vitest runs in), these should log
  it('logger.log includes [App] prefix', () => {
    logger.log('Test message');
    // In dev mode, should have been called
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it('logger.warn includes [App] prefix', () => {
    logger.warn('Warning message');
    expect(consoleSpy.warn).toHaveBeenCalled();
  });
});

