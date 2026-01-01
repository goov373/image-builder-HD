/**
 * IconButton Component Tests
 * Tests for the IconButton UI primitive with focus on accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IconButton from '../IconButton';

describe('IconButton', () => {
  it('renders with children', () => {
    render(
      <IconButton title="Delete">
        <svg data-testid="icon" />
      </IconButton>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <IconButton onClick={handleClick} title="Action">
        <span>X</span>
      </IconButton>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <IconButton disabled title="Disabled">
        <span>X</span>
      </IconButton>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Accessibility tests
  it('has aria-label from title when no explicit aria-label provided', () => {
    render(
      <IconButton title="Delete item">
        <span>🗑️</span>
      </IconButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete item');
  });

  it('uses explicit aria-label over title', () => {
    render(
      <IconButton title="Delete" aria-label="Remove this item from list">
        <span>🗑️</span>
      </IconButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove this item from list');
  });

  it('has proper button role', () => {
    render(
      <IconButton title="Action">
        <span>+</span>
      </IconButton>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has type="button" to prevent form submission', () => {
    render(
      <IconButton title="Click me">
        <span>👆</span>
      </IconButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies different sizes', () => {
    const { rerender } = render(
      <IconButton size="sm" title="Small">
        <span>S</span>
      </IconButton>
    );
    expect(screen.getByRole('button')).toHaveClass('w-7', 'h-7');

    rerender(
      <IconButton size="lg" title="Large">
        <span>L</span>
      </IconButton>
    );
    expect(screen.getByRole('button')).toHaveClass('w-9', 'h-9');
  });

  it('applies active styles when active prop is true', () => {
    render(
      <IconButton active title="Active">
        <span>✓</span>
      </IconButton>
    );

    expect(screen.getByRole('button')).toHaveClass('bg-[--surface-overlay]');
  });
});

