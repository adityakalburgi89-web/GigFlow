import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helpers';
import type { PaginationMeta } from '../../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, pages, total } = pagination;
  const start = total === 0 ? 0 : (page - 1) * 10 + 1;
  const end = Math.min(page * 10, total);

  const getPages = (): (number | '...')[] => {
    const result: (number | '...')[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) result.push(i);
      return result;
    }
    result.push(1);
    if (page > 3) result.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) result.push(i);
    if (page < pages - 2) result.push('...');
    result.push(pages);
    return result;
  };

  const navBtnClass =
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}–{end}</span> of <span className="font-medium text-foreground">{total}</span> leads
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={navBtnClass}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "h-10 w-10 rounded-xl text-sm font-medium transition-all duration-200",
                p === page
                  ? "bg-gradient-to-r from-accent to-accent-secondary text-white shadow-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className={navBtnClass}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
