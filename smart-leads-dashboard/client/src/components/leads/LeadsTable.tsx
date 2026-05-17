import { LeadRow } from './LeadRow';
import type { Lead } from '../../types';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function SkeletonRow({ index }: { index: number }) {
  // Use deterministic widths to prevent layout thrashing and React warnings
  const widths = [70, 85, 60, 75, 80, 65, 90, 68, 72, 88];
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700">
      {Array.from({ length: 6 }).map((_, i) => {
        const width = widths[(index * 6 + i) % widths.length];
        return (
          <td key={i} className="px-4 py-3">
            <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" style={{ width: `${width}%` }} />
          </td>
        );
      })}
    </tr>
  );
}

export function LeadsTable({ leads, isLoading, onEdit, onDelete }: LeadsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400">
              {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} index={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-600 dark:bg-gray-800">
        <svg className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm font-medium text-gray-900 dark:text-white">No leads yet</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first lead.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400">
            {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadRow key={lead._id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
