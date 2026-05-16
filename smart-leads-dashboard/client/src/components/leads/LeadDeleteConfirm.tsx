import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
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
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
