import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Lead } from '../../types';

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onViewProfile: (lead: Lead) => void;
}

const statusVariantMap: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'default'> = {
  New: 'info',
  Contacted: 'warning',
  Qualified: 'success',
  Lost: 'danger',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function LeadRow({ lead, onEdit, onDelete, onViewProfile }: LeadRowProps) {
  const { user } = useAuth();

  return (
    <tr 
      onClick={() => onViewProfile(lead)}
      className="table-row-hover border-b border-border last:border-b-0 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
    >
      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-foreground">
        {lead.name}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
        {lead.email}
      </td>
      <td className="whitespace-nowrap px-5 py-4">
        <Badge variant={statusVariantMap[lead.status] || 'default'}>
          {lead.status}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
        {lead.source}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
        {formatDate(lead.createdAt)}
      </td>
      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-1.5">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); onEdit(lead); }} 
            className="h-9 w-9 p-0"
          >
            <Pencil size={15} />
          </Button>
          {user?.role === 'admin' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); onDelete(lead); }} 
              className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
