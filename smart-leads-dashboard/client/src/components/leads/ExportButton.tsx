import { useState } from 'react';
import { leads as leadsApi } from '../../services/api';
import { Button } from '../ui/Button';
import type { LeadFilters } from '../../types';

interface ExportButtonProps {
  filters: LeadFilters;
}

export function ExportButton({ filters }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await leadsApi.exportCSV(filters);
    } catch {
      alert("Failed to export CSV. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleExport} isLoading={isLoading}>
      Export CSV
    </Button>
  );
}
