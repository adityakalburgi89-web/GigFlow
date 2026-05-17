import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import type { Lead } from '../../types';

interface LeadDeleteConfirmProps {
  lead: Lead;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function LeadDeleteConfirm({ lead, onClose, onConfirm }: LeadDeleteConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <Modal open onClose={onClose} title="Delete Lead">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to delete <strong className="text-foreground">{lead.name}</strong>? This action cannot be undone.
        </p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>Delete</Button>
      </div>
    </Modal>
  );
}
