import { useEffect, type ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <div className={cn('relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 dark:shadow-black/30', className)}>
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
