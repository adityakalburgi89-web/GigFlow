import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { leads as leadsApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { Navbar } from '../components/layout/Navbar';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { LeadDeleteConfirm } from '../components/leads/LeadDeleteConfirm';
import { Pagination } from '../components/leads/Pagination';
import { Button } from '../components/ui/Button';
import type { Lead, PaginationMeta, LeadFilters as LeadFiltersType } from '../types';

interface ModalState {
  open: boolean;
  mode: 'create' | 'edit';
  lead?: Lead;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState<LeadFiltersType>({ search: '', status: '', source: '', sort: 'latest' });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'create' });
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 300);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await leadsApi.getAll({
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: debouncedSearch || undefined,
        sort: filters.sort,
        page,
        limit: 10,
      });
      setLeads(res.data.data ?? []);
      setPagination(res.data.pagination!);
    } catch {
      setError('Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.source, filters.sort, debouncedSearch, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleCreate = () => setModal({ open: true, mode: 'create' });
  const handleEdit = (lead: Lead) => setModal({ open: true, mode: 'edit', lead });
  const handleDelete = (lead: Lead) => setDeleteTarget(lead);

  const handleModalSuccess = () => {
    setModal({ open: false, mode: 'create' });
    fetchLeads();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await leadsApi.delete(deleteTarget._id);
    setDeleteTarget(null);
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your leads, filter, and export data.</p>
          </div>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            + New Lead
          </button>
        </div>

        <div className="mb-4">
          <LeadFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={fetchLeads}>Retry</Button>
          </div>
        )}

        <LeadsTable leads={leads} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

        {pagination.pages > 1 && !isLoading && (
          <div className="mt-4">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </main>

      {modal.open && (
        <LeadFormModal
          mode={modal.mode}
          lead={modal.lead}
          onClose={() => setModal({ open: false, mode: 'create' })}
          onSuccess={handleModalSuccess}
        />
      )}

      {deleteTarget && (
        <LeadDeleteConfirm
          lead={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
