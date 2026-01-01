/**
 * Button Component Tests
 * Tests for the Button UI primitive
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    );

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    // Primary variant uses CSS variable for accent brand color
    expect(button).toHaveClass('bg-[--accent-brand]');
  });

  it('applies secondary variant styles by default', () => {
    render(<Button>Secondary</Button>);
    const button = screen.getByText('Secondary');
    // Secondary is default, uses surface-default
    expect(button).toHaveClass('bg-[--surface-default]');
  });

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies danger variant styles', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByText('Danger');
    // Danger variant starts as surface-default, changes on hover
    expect(button).toHaveClass('bg-[--surface-default]');
    expect(button).toHaveClass('hover:bg-[--semantic-error]');
  });

  it('applies different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('px-2.5');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('px-4');
  });

  it('applies disabled styles when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-40');
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('renders as button type by default', () => {
    render(<Button>Button</Button>);
    expect(screen.getByText('Button')).toHaveAttribute('type', 'button');
  });

  it('spreads additional props to button element', () => {
    render(<Button data-testid="test-btn">Test</Button>);
    expect(screen.getByTestId('test-btn')).toBeInTheDocument();
  });

  it('applies active styles when active prop is true', () => {
    render(<Button active>Active</Button>);
    const button = screen.getByText('Active');
    expect(button).toHaveClass('bg-[--surface-overlay]');
  });
});
