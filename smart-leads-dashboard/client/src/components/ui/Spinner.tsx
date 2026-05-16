import { cn } from '../../utils/helpers';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-current border-t-transparent text-indigo-600', sizes[size])}
      role="status"
      aria-label="Loading"
    />
  );
}
