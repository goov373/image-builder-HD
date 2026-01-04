/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Slider from '../Slider';

describe('Slider', () => {
  describe('rendering', () => {
    it('should render a range input', () => {
      render(<Slider value={50} onChange={() => {}} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should display current value by default', () => {
      render(<Slider value={75} onChange={() => {}} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should hide value when showValue is false', () => {
      render(<Slider value={75} onChange={() => {}} showValue={false} />);
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('should render label when provided', () => {
      render(<Slider value={50} onChange={() => {}} label="Opacity" />);
      expect(screen.getByText('Opacity')).toBeInTheDocument();
    });

    it('should not render label when not provided', () => {
      const { container } = render(<Slider value={50} onChange={() => {}} />);
      const labels = container.querySelectorAll('span');
      // Only the value display span should exist
      expect(labels.length).toBe(1);
    });
  });

  describe('suffix', () => {
    it('should display suffix with value', () => {
      render(<Slider value={100} onChange={() => {}} suffix="%" />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should display suffix with label', () => {
      render(<Slider value={75} onChange={() => {}} label="Zoom" suffix="%" />);
      expect(screen.getByText('Zoom')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('min/max/step', () => {
    it('should set min value', () => {
      render(<Slider value={50} onChange={() => {}} min={10} />);
      expect(screen.getByRole('slider')).toHaveAttribute('min', '10');
    });

    it('should set max value', () => {
      render(<Slider value={50} onChange={() => {}} max={200} />);
      expect(screen.getByRole('slider')).toHaveAttribute('max', '200');
    });

    it('should set step value', () => {
      render(<Slider value={50} onChange={() => {}} step={5} />);
      expect(screen.getByRole('slider')).toHaveAttribute('step', '5');
    });

    it('should use default min of 0', () => {
      render(<Slider value={50} onChange={() => {}} />);
      expect(screen.getByRole('slider')).toHaveAttribute('min', '0');
    });

    it('should use default max of 100', () => {
      render(<Slider value={50} onChange={() => {}} />);
      expect(screen.getByRole('slider')).toHaveAttribute('max', '100');
    });

    it('should use default step of 1', () => {
      render(<Slider value={50} onChange={() => {}} />);
      expect(screen.getByRole('slider')).toHaveAttribute('step', '1');
    });
  });

  describe('onChange', () => {
    it('should call onChange with numeric value', () => {
      const handleChange = vi.fn();
      render(<Slider value={50} onChange={handleChange} />);
      
      fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
      expect(handleChange).toHaveBeenCalledWith(75);
    });

    it('should convert string value to number', () => {
      const handleChange = vi.fn();
      render(<Slider value={0} onChange={handleChange} />);
      
      fireEvent.change(screen.getByRole('slider'), { target: { value: '42' } });
      expect(handleChange).toHaveBeenCalledWith(42);
      expect(typeof handleChange.mock.calls[0][0]).toBe('number');
    });

    it('should not throw when onChange is not provided', () => {
      render(<Slider value={50} />);
      expect(() => {
        fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
      }).not.toThrow();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Slider value={50} onChange={() => {}} disabled />);
      expect(screen.getByRole('slider')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Slider value={50} onChange={() => {}} disabled />);
      expect(screen.getByRole('slider')).toHaveClass('opacity-40');
      expect(screen.getByRole('slider')).toHaveClass('cursor-not-allowed');
    });
  });

  describe('className', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <Slider value={50} onChange={() => {}} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('props spreading', () => {
    it('should spread additional props to input', () => {
      render(<Slider value={50} onChange={() => {}} data-testid="test-slider" />);
      expect(screen.getByTestId('test-slider')).toBeInTheDocument();
    });

    it('should apply aria-label', () => {
      render(<Slider value={50} onChange={() => {}} aria-label="Volume control" />);
      expect(screen.getByRole('slider')).toHaveAttribute('aria-label', 'Volume control');
    });
  });

  describe('value display', () => {
    it('should display correct value format', () => {
      render(<Slider value={0} onChange={() => {}} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should update displayed value', () => {
      const { rerender } = render(<Slider value={25} onChange={() => {}} />);
      expect(screen.getByText('25')).toBeInTheDocument();
      
      rerender(<Slider value={75} onChange={() => {}} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });
});

