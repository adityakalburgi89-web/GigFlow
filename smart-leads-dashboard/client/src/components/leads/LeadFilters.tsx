import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { ExportButton } from './ExportButton';
import { LeadStatus, LeadSource } from '../../types';
import type { LeadFilters as LeadFiltersType } from '../../types';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFilterChange: (key: string, value: string) => void;
}

const inputBase =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500';

export function LeadFilters({ filters, onFilterChange }: LeadFiltersProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onFilterChange('search', debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`block min-w-0 flex-1 ${inputBase}`}
      />
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className={inputBase}
      >
        <option value="">All Statuses</option>
        {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={filters.source || ''}
        onChange={(e) => onFilterChange('source', e.target.value)}
        className={inputBase}
      >
        <option value="">All Sources</option>
        {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={filters.sort || 'latest'}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        className={inputBase}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
      {user?.role === 'admin' && <ExportButton filters={filters} />}
    </div>
  );
}
