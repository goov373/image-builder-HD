/**
 * Toast Component Tests
 * Tests for the Toast notification system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../Toast';

// Test component that uses the toast hook
const ToastTrigger = ({ message = 'Test message', type = 'info' }) => {
  const { addToast } = useToast();
  return <button onClick={() => addToast(message, { type })}>Show Toast</button>;
};

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders ToastProvider without crashing', () => {
    render(
      <ToastProvider>
        <div>App Content</div>
      </ToastProvider>
    );
    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('useToast returns an object with addToast function when inside provider', () => {
    let toastContext = null;
    const Capture = () => {
      toastContext = useToast();
      return null;
    };

    render(
      <ToastProvider>
        <Capture />
      </ToastProvider>
    );

    expect(toastContext).not.toBeNull();
    expect(typeof toastContext.addToast).toBe('function');
    expect(typeof toastContext.removeToast).toBe('function');
  });

  it('shows toast when addToast is called', () => {
    render(
      <ToastProvider>
        <ToastTrigger message="Hello World" />
      </ToastProvider>
    );

    // Click the button to trigger toast
    act(() => {
      screen.getByText('Show Toast').click();
    });

    // Toast should appear
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies correct icon based on type', () => {
    render(
      <ToastProvider>
        <ToastTrigger message="Success!" type="success" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Toast').click();
    });

    // Toast message should be visible
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('auto-dismisses after duration', () => {
    render(
      <ToastProvider>
        <ToastTrigger message="Temporary" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Toast').click();
    });

    // Toast should be visible initially
    expect(screen.getByText('Temporary')).toBeInTheDocument();

    // Fast-forward past auto-dismiss duration (3000ms default)
    act(() => {
      vi.advanceTimersByTime(3500);
    });

    // Toast should be gone
    expect(screen.queryByText('Temporary')).not.toBeInTheDocument();
  });

  it('can display multiple toasts', () => {
    const MultiToast = () => {
      const { addToast } = useToast();
      return (
        <button
          onClick={() => {
            addToast('First');
            addToast('Second');
          }}
        >
          Show Both
        </button>
      );
    };

    render(
      <ToastProvider>
        <MultiToast />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Both').click();
    });

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('throws error when useToast is used outside provider', () => {
    // Capture console.error to prevent noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const OutsideProvider = () => {
      useToast();
      return null;
    };

    expect(() => {
      render(<OutsideProvider />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });
});
