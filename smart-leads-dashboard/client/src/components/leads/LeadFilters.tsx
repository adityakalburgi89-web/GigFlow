import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { ExportButton } from './ExportButton';
import { LeadStatus, LeadSource } from '../../types';
import type { LeadFilters as LeadFiltersType } from '../../types';
import { Select } from '../ui/Select';
import { Search } from 'lucide-react';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFilterChange: (key: string, value: string) => void;
}

export function LeadFilters({ filters, onFilterChange }: LeadFiltersProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onFilterChange('search', debouncedSearch);
  }, [debouncedSearch, onFilterChange]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-border bg-transparent pl-11 pr-4 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        </div>
      </div>
      <Select
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="w-auto min-w-[140px]"
      >
        <option value="">All Statuses</option>
        {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
      </Select>
      <Select
        value={filters.source || ''}
        onChange={(e) => onFilterChange('source', e.target.value)}
        className="w-auto min-w-[140px]"
      >
        <option value="">All Sources</option>
        {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
      </Select>
      <Select
        value={filters.sort || 'latest'}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        className="w-auto min-w-[120px]"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </Select>
      {user?.role === 'admin' && <ExportButton filters={filters} />}
    </div>
  );
}
