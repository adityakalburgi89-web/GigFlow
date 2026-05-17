import { useState, useEffect, useCallback } from 'react';
import { leads as leadsApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { Navbar } from '../components/layout/Navbar';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { LeadDeleteConfirm } from '../components/leads/LeadDeleteConfirm';
import { Pagination } from '../components/leads/Pagination';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Plus } from 'lucide-react';
import type { Lead, PaginationMeta, LeadFilters as LeadFiltersType } from '../types';
import { KpiGrid } from '../components/leads/KpiGrid';
import { AiInsights } from '../components/leads/AiInsights';

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

  // States for overall KPI Metrics & AI Insights
  const [statsLeads, setStatsLeads] = useState<Lead[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

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

  const fetchStatsLeads = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await leadsApi.getAll({ limit: 1000 });
      setStatsLeads(res.data.data ?? []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStatsLeads();
  }, [fetchStatsLeads]);

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
    fetchStatsLeads();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await leadsApi.delete(deleteTarget._id);
    setDeleteTarget(null);
    fetchLeads();
    fetchStatsLeads();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Leads</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your leads, filter, and export data.</p>
          </div>
          <Button onClick={handleCreate} className="group">
            <Plus size={18} />
            New Lead
          </Button>
        </div>

        {/* KPI Metrics Summary Grid */}
        <div className="mb-8">
          <KpiGrid leads={statsLeads} isLoading={isStatsLoading} />
        </div>

        {/* Smart AI Insights Panel */}
        <div className="mb-8">
          <AiInsights leads={statsLeads} isLoading={isStatsLoading} />
        </div>

        <div className="mb-6">
          <LeadFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">
              {error}
              <Button variant="ghost" size="sm" onClick={fetchLeads} className="ml-2 -my-0.5">Retry</Button>
            </Alert>
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

