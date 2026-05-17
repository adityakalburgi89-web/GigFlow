import { Card } from '../ui/Card';
import { Users, Target, Compass, ArrowUpRight } from 'lucide-react';
import type { Lead } from '../../types';
import { LeadStatus } from '../../types';

interface KpiGridProps {
  leads: Lead[];
  isLoading: boolean;
}

export function KpiGrid({ leads, isLoading }: KpiGridProps) {
  // 1. Total Leads calculation
  const totalLeads = leads.length;

  // 2. Conversion Rate calculation (Qualified / Total)
  const qualifiedLeads = leads.filter((l) => l.status === LeadStatus.Qualified).length;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // 3. Live Inbound (New leads)
  const newLeads = leads.filter((l) => l.status === LeadStatus.New).length;

  // 4. Primary Channel Calculation
  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let topSource = 'None';
  let topSourcePct = 0;
  if (totalLeads > 0) {
    const sortedSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);
    if (sortedSources.length > 0) {
      topSource = sortedSources[0][0];
      topSourcePct = Math.round((sortedSources[0][1] / totalLeads) * 100);
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 relative overflow-hidden">
            <div className="h-4 w-24 animate-pulse rounded bg-muted mb-4" />
            <div className="h-8 w-16 animate-pulse rounded bg-muted mb-2" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Leads Card */}
      <Card className="p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">Total Leads</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-secondary text-white shadow-accent">
            <Users size={18} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{totalLeads}</h3>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-emerald-500 font-semibold flex items-center">
              +12% <ArrowUpRight size={12} />
            </span>
            vs last month
          </p>
        </div>
      </Card>

      {/* Conversion Rate Card */}
      <Card className="p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">Conversion Rate</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
            <Target size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{conversionRate}%</h3>
            <span className="text-xs text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
              Qualified
            </span>
          </div>
          {/* Custom micro SVG progress bar */}
          <div className="mt-3.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-500" 
              style={{ width: `${conversionRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Active Inbound Card */}
      <Card className="p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">Active Inbound</span>
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{newLeads}</h3>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Unattended inquiries
          </p>
        </div>
      </Card>

      {/* Top acquisition channel */}
      <Card className="p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">Top Source</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
            <Compass size={18} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{topSource}</h3>
          <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Volume share</span>
            <span className="font-semibold text-foreground">{topSourcePct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-500" 
              style={{ width: `${topSourcePct}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
