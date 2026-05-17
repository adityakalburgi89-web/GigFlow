import { Card } from '../ui/Card';
import { Sparkles, Lightbulb, Zap } from 'lucide-react';
import type { Lead } from '../../types';
import { LeadStatus, LeadSource } from '../../types';

interface AiInsightsProps {
  leads: Lead[];
  isLoading: boolean;
}

export function AiInsights({ leads, isLoading }: AiInsightsProps) {
  if (isLoading) {
    return (
      <Card featured className="relative overflow-hidden h-32 animate-pulse">
        <div className="h-full w-full bg-muted/40 rounded-[10px]" />
      </Card>
    );
  }

  const totalLeads = leads.length;
  if (totalLeads === 0) {
    return null;
  }

  // 1. Calculate status distributions
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Calculate source distributions
  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 3. Find qualified leads per source
  const sourceQualifiedCounts = leads.reduce((acc, lead) => {
    if (lead.status === LeadStatus.Qualified) {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // 4. Determine highest source
  const websiteCount = sourceCounts[LeadSource.Website] || 0;
  const instagramCount = sourceCounts[LeadSource.Instagram] || 0;

  // Let's formulate the most valuable smart business recommendation:
  let insightTitle = 'High-Value acquisition insights';
  let insightDescription = '';
  let highlightText = '';
  let suggestionAction = 'Optimize campaigns';

  const qualifiedTotal = statusCounts[LeadStatus.Qualified] || 0;
  const qualificationRate = totalLeads > 0 ? Math.round((qualifiedTotal / totalLeads) * 100) : 0;

  if (qualificationRate > 40) {
    insightTitle = 'Exceptional sales performance detected!';
    insightDescription = `Your overall lead conversion rate is a stunning ${qualificationRate}%, which is more than double the industry average (15%). Your current qualification pipeline is extremely healthy.`;
    highlightText = 'Scale acquisition efforts to capitalize on high conversion rates.';
    suggestionAction = 'Launch Scaling Ads';
  } else if (instagramCount > websiteCount && instagramCount > 0) {
    const instaQualified = sourceQualifiedCounts[LeadSource.Instagram] || 0;
    const instaRate = instaQualified > 0 ? Math.round((instaQualified / instagramCount) * 100) : 0;
    
    insightTitle = 'Instagram traffic surge!';
    insightDescription = `Instagram is currently your most active lead source, accounting for ${Math.round((instagramCount / totalLeads) * 100)}% of total inbound leads. The qualification rate on social channels is ${instaRate}%.`;
    highlightText = 'Quick Instagram interactions (under 15 minutes) can boost conversions by 3x.';
    suggestionAction = 'Configure Quick Responses';
  } else if (websiteCount > 0) {
    const webQualified = sourceQualifiedCounts[LeadSource.Website] || 0;
    const webRate = websiteCount > 0 ? Math.round((webQualified / websiteCount) * 100) : 0;

    insightTitle = 'Website traffic leads qualification';
    insightDescription = `Your website is delivering highly intentful prospects. Out of all website inbound queries, ${webRate}% convert to 'Qualified' status. This is your primary engine for growth.`;
    highlightText = 'Allocate 15% more ad spend or SEO focus toward your organic landing page.';
    suggestionAction = 'Refine Landing Page SEO';
  } else {
    insightTitle = 'Growth pipeline initial audit';
    insightDescription = 'Welcome to GigFlow! As you gather more leads across Instagram, Referrals, and your Website, the AI engine will isolate distinct high-conversion pathways for your specific audience.';
    highlightText = 'Create 3 more leads to kick off your channel intelligence mapping.';
    suggestionAction = 'Add New Prospect';
  }

  return (
    <Card featured className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Dynamic ambient radial glows */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 h-40 w-40 rounded-full bg-accent-secondary/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-accent">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
              GigFlow Intelligence
            </span>
          </div>

          <h2 className="text-2xl font-serif text-foreground leading-tight">
            {insightTitle}
          </h2>
          
          <p className="mt-3.5 text-base leading-relaxed text-muted-foreground">
            {insightDescription}
          </p>

          <div className="mt-4 flex items-start gap-2 text-sm text-foreground bg-accent/5 rounded-xl p-3.5 border border-accent/10">
            <Zap size={16} className="text-accent shrink-0 mt-0.5" />
            <span>
              <strong className="text-accent">Recommendation: </strong> 
              {highlightText}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <button className="w-full md:w-auto relative group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white px-6 py-3.5 shadow-accent hover:shadow-accent-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer">
            <Lightbulb size={16} />
            <span>{suggestionAction}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
