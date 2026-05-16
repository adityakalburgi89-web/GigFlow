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
      // Silently fail — the download may be blocked by the browser
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
