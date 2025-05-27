import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import { useTracking } from '@/hooks/useTracking';

// Mock the useTracking hook
jest.mock('@/hooks/useTracking', () => ({
  useTracking: jest.fn(),
}));

describe('Button Component', () => {
  const mockTrackEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTracking as jest.Mock).mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-600');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('text-lg');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    // Check for loading spinner
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('tracks events when tracking config is provided', () => {
    const handleClick = jest.fn();
    const tracking = {
      category: 'CTA',
      action: 'Button Click',
      label: 'Test Button',
    };

    render(
      <Button onClick={handleClick} tracking={tracking}>
        Track me
      </Button>
    );

    fireEvent.click(screen.getByText('Track me'));
    
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'CTA',
      action: 'Button Click',
      label: 'Test Button',
      timestamp: expect.any(Number),
    });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading onClick={jest.fn()}>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies fullWidth class when prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByText('Full Width')).toHaveClass('w-full');
  });

  it('renders with icon', () => {
    const Icon = () => <span>Icon</span>;
    render(<Button icon={<Icon />}>With Icon</Button>);
    
    expect(screen.getByText('With Icon')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });
}); 