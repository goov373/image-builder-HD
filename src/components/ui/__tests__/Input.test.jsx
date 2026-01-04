/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input, { InputGroup } from '../Input';

describe('Input', () => {
  describe('rendering', () => {
    it('should render an input element', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });
  });

  describe('types', () => {
    it('should render text input by default', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('should render number input', () => {
      render(<Input type="number" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
    });

    it('should render password input', () => {
      render(<Input type="password" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    it('should render email input', () => {
      render(<Input type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });
  });

  describe('sizes', () => {
    it('should render with xs size', () => {
      const { container } = render(<Input size="xs" />);
      expect(container.firstChild).toHaveClass('text-[10px]');
    });

    it('should render with sm size', () => {
      const { container } = render(<Input size="sm" />);
      expect(container.firstChild).toHaveClass('text-[11px]');
    });

    it('should render with md size (default)', () => {
      const { container } = render(<Input />);
      expect(container.firstChild).toHaveClass('text-xs');
    });

    it('should render with lg size', () => {
      const { container } = render(<Input size="lg" />);
      expect(container.firstChild).toHaveClass('text-sm');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      const { container } = render(<Input disabled />);
      expect(container.firstChild).toHaveClass('opacity-40');
      expect(container.firstChild).toHaveClass('cursor-not-allowed');
    });
  });

  describe('error state', () => {
    it('should apply error styles', () => {
      const { container } = render(<Input error />);
      expect(container.firstChild).toHaveClass('border-[--semantic-error]');
    });
  });

  describe('value and onChange', () => {
    it('should display value', () => {
      render(<Input value="test value" readOnly data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveValue('test value');
    });

    it('should call onChange when typing', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);
      
      fireEvent.change(screen.getByTestId('input'), { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Input className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

describe('InputGroup', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <InputGroup>
          <Input data-testid="input" />
        </InputGroup>
      );
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('should render label', () => {
      render(
        <InputGroup label="Name">
          <Input />
        </InputGroup>
      );
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(
        <InputGroup error="This field is required">
          <Input />
        </InputGroup>
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should render both label and error', () => {
      render(
        <InputGroup label="Email" error="Invalid email">
          <Input />
        </InputGroup>
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <InputGroup className="custom-class">
          <Input />
        </InputGroup>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

