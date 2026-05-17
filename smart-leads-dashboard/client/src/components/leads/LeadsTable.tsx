import { LeadRow } from './LeadRow';
import { Inbox } from 'lucide-react';
import type { Lead } from '../../types';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onViewProfile: (lead: Lead) => void;
}

function SkeletonRow({ index }: { index: number }) {
  const widths = [70, 85, 60, 75, 80, 65, 90, 68, 72, 88];
  return (
    <tr className="border-b border-border">
      {Array.from({ length: 6 }).map((_, i) => {
        const width = widths[(index * 6 + i) % widths.length];
        return (
          <td key={i} className="px-5 py-4">
            <div className="h-4 animate-pulse rounded-lg bg-muted" style={{ width: `${width}%` }} />
          </td>
        );
      })}
    </tr>
  );
}

const headerCells = ['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'];

export function LeadsTable({ leads, isLoading, onEdit, onDelete, onViewProfile }: LeadsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {headerCells.map((h) => (
                <th key={h} className="px-5 py-3.5 font-mono tracking-[0.1em]">{h}</th>
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 shadow-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-base font-semibold text-foreground">No leads yet</p>
        <p className="mt-1.5 text-sm text-muted-foreground">Get started by creating your first lead.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase text-muted-foreground">
            {headerCells.map((h) => (
              <th key={h} className="px-5 py-3.5 font-mono tracking-[0.1em]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadRow key={lead._id} lead={lead} onEdit={onEdit} onDelete={onDelete} onViewProfile={onViewProfile} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
