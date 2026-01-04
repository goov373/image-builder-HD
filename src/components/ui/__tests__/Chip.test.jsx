/**
 * Chip Component Tests
 * Tests for the Chip UI primitive
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chip, { ChipGrid } from '../Chip';

describe('Chip', () => {
  it('renders with children text', () => {
    render(<Chip>Label</Chip>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Chip onClick={handleClick}>Clickable</Chip>);

    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows selected state with border-strong', () => {
    render(<Chip selected>Selected</Chip>);
    const chip = screen.getByText('Selected').closest('button');
    expect(chip).toHaveClass('border-[--border-strong]');
  });

  it('shows unselected state with border-muted', () => {
    render(<Chip>Unselected</Chip>);
    const chip = screen.getByText('Unselected').closest('button');
    expect(chip).toHaveClass('border-[--border-muted]');
  });

  it('applies disabled styles', () => {
    render(<Chip disabled>Disabled</Chip>);
    const chip = screen.getByText('Disabled').closest('button');
    expect(chip).toBeDisabled();
    expect(chip).toHaveClass('opacity-40');
  });

  it('accepts custom className', () => {
    render(<Chip className="custom-class">Custom</Chip>);
    expect(screen.getByText('Custom').closest('button')).toHaveClass('custom-class');
  });

  it('applies different sizes', () => {
    const { rerender } = render(<Chip size="sm">Small</Chip>);
    expect(screen.getByText('Small').closest('button')).toHaveClass('p-1');

    rerender(<Chip size="lg">Large</Chip>);
    expect(screen.getByText('Large').closest('button')).toHaveClass('p-2');
  });
});

describe('ChipGrid', () => {
  it('renders children', () => {
    render(
      <ChipGrid>
        <Chip>One</Chip>
        <Chip>Two</Chip>
        <Chip>Three</Chip>
      </ChipGrid>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('applies grid layout', () => {
    const { container } = render(
      <ChipGrid>
        <Chip>Item</Chip>
      </ChipGrid>
    );

    expect(container.firstChild).toHaveClass('grid');
  });

  it('uses inline style for grid columns', () => {
    const { container } = render(
      <ChipGrid columns={4}>
        <Chip>Item</Chip>
      </ChipGrid>
    );

    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' });
  });

  it('accepts custom gap', () => {
    const { container } = render(
      <ChipGrid gap="gap-4">
        <Chip>Item</Chip>
      </ChipGrid>
    );

    expect(container.firstChild).toHaveClass('gap-4');
  });
});
