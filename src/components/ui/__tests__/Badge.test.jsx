/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<Badge>16</Badge>);
      expect(screen.getByText('16')).toBeInTheDocument();
    });

    it('should render text content', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should render with default variant', () => {
      const { container } = render(<Badge>Default</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--surface-raised]');
    });

    it('should render with success variant', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--semantic-success]/20');
    });

    it('should render with warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--semantic-warning]/20');
    });

    it('should render with error variant', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--semantic-error]/20');
    });

    it('should render with info variant', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--semantic-info]/20');
    });

    it('should render with brand variant', () => {
      const { container } = render(<Badge variant="brand">Brand</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--accent-brand]/20');
    });

    it('should render with muted variant', () => {
      const { container } = render(<Badge variant="muted">Muted</Badge>);
      expect(container.firstChild).toHaveClass('bg-[--surface-default]');
    });
  });

  describe('sizes', () => {
    it('should render with xs size', () => {
      const { container } = render(<Badge size="xs">XS</Badge>);
      expect(container.firstChild).toHaveClass('text-[8px]');
    });

    it('should render with sm size (default)', () => {
      const { container } = render(<Badge>SM</Badge>);
      expect(container.firstChild).toHaveClass('text-[10px]');
    });

    it('should render with md size', () => {
      const { container } = render(<Badge size="md">MD</Badge>);
      expect(container.firstChild).toHaveClass('text-[11px]');
    });
  });

  describe('className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Badge className="custom-class">Test</Badge>);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('props spreading', () => {
    it('should spread additional props', () => {
      render(<Badge data-testid="test-badge">Test</Badge>);
      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    });

    it('should apply title attribute', () => {
      render(<Badge title="Badge tooltip">Test</Badge>);
      expect(screen.getByTitle('Badge tooltip')).toBeInTheDocument();
    });
  });
});

