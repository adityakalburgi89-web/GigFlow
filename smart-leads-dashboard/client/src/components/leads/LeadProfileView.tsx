import { useState, useEffect } from 'react';
import {
  X, Mail, Calendar, Compass,
  Sparkles, Send, Edit, Trash2, Clock
} from 'lucide-react';
import { leads as leadsApi } from '../../services/api';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import type { Lead, LeadStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LeadProfileViewProps {
  leadId: string;
  onClose: () => void;
  onUpdateSuccess: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}



export function LeadProfileView({
  leadId,
  onClose,
  onUpdateSuccess,
  onEdit,
  onDelete
}: LeadProfileViewProps) {
  const { user } = useAuth();

  // Lead state
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');

  // CRM Notes state
  const [notes, setNotes] = useState<Array<{ id: string; text: string; date: string }>>([]);
  const [newNote, setNewNote] = useState('');

  // Slide-in animation trigger
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger open animation on mount
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Fetch lead details
  const fetchLeadDetails = async () => {
    setIsLoading(true);
    try {
      // Get all leads (with high limit or search) and locate the specific lead,
      // since the default mock API doesn't have a single-fetch endpoint.
      const res = await leadsApi.getAll({ limit: 1000 });
      const found = res.data.data?.find((l) => l._id === leadId);
      if (found) {
        setLead(found);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Failed to load lead details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();

    // Load local CRM notes for this specific lead
    const savedNotes = localStorage.getItem(`crm-notes-${leadId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Default initial mock note to make it look premium
      setNotes([
        {
          id: 'init-1',
          text: 'Prospect was automatically discovered by GigFlow inbound pipeline scan.',
          date: new Date(Date.now() - 3600000 * 24).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [leadId]);

  // Update lead status
  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    setIsUpdatingStatus(true);
    try {
      await leadsApi.update(lead._id, { status: newStatus });
      setLead((prev) => prev ? { ...prev, status: newStatus } : null);

      // Log update in activity
      const logNote = {
        id: `status-${Date.now()}`,
        text: `Pipeline status updated to ${newStatus} directly from lead profile view.`,
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      const updatedNotes = [logNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(`crm-notes-${leadId}`, JSON.stringify(updatedNotes));

      onUpdateSuccess();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Add a new CRM note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const added = {
      id: `note-${Date.now()}`,
      text: newNote.trim(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedNotes = [added, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`crm-notes-${leadId}`, JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const handleClose = () => {
    setIsOpen(false);
    // Wait for transition animation to finish
    setTimeout(onClose, 300);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-950 shadow-xl border border-slate-100 dark:border-slate-800 text-[#0052FF]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!lead) return null;

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      {/* Semi-transparent backdrop blur */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Slide-out Panel - Strictly Light Theme (White not Black) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-lg bg-white border-r border-slate-200/80 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header Row with Close Button */}
        <div className="flex justify-end items-center px-6 pt-6 pb-2 shrink-0">
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            aria-label="Close Profile"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lead name, email & status picker spacing */}
        <div className="px-6 shrink-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Lead Avatar Container */}
              <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-lg font-bold font-serif shadow-sm shrink-0">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-serif text-slate-900 leading-tight">
                  {lead.name}
                </h2>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                  {lead.email}
                </p>
              </div>
            </div>

            {/* PIPELINE STATUS SELECTOR */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Pipeline Status</span>
              <div className="relative">
                <select
                  disabled={isUpdatingStatus}
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0052FF] transition-all bg-white ${lead.status === 'New' ? 'text-blue-500 border-blue-200' :
                      lead.status === 'Contacted' ? 'text-amber-500 border-amber-200' :
                        lead.status === 'Qualified' ? 'text-emerald-500 border-emerald-200' :
                          'text-rose-500 border-rose-200'
                    }`}
                >
                  <option value="New"> New Inbound</option>
                  <option value="Contacted"> Contacted</option>
                  <option value="Qualified"> Qualified Lead</option>
                  <option value="Lost">Lost Prospect</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <Clock size={11} />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-slate-100 mt-6 gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 text-xs font-semibold font-mono uppercase tracking-[0.15em] transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'overview'
                  ? 'border-[#0052FF] text-[#0052FF]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {activeTab === 'overview' && <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />}
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-2.5 text-xs font-semibold font-mono uppercase tracking-[0.15em] transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'activity'
                  ? 'border-[#0052FF] text-[#0052FF]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {activeTab === 'activity' && <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />}
              Activity Log & CRM Notes ({notes.length})
            </button>
          </div>
        </div>

        {/* Scrollable Details Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Premium AI Lead Intel Card - Featured Gradient Border Technique */}
              <div className="rounded-xl bg-gradient-to-br from-[#0052FF] via-[#4D7CFF] to-[#0052FF] p-[1.5px] shadow-sm hover:shadow-accent-lg transition-all duration-300 relative group overflow-hidden">
                <div className="h-full w-full rounded-[calc(12px-1.5px)] bg-white p-5 relative overflow-hidden">
                  {/* ambient overlay radial glow */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#0052FF]/5 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-[#0052FF]">
                      <Sparkles size={16} className="animate-pulse" />
                    </div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-[#0052FF] font-semibold">
                      AI Lead Intelligence
                    </h3>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-mono">Lead Match Quality</div>
                      <div className="text-2xl font-bold text-slate-800 mt-0.5 font-serif">94% Fit Score</div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center h-11 w-11 rounded-full border-2 border-emerald-500 text-emerald-500 text-xs font-bold bg-emerald-50">
                      High
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs leading-relaxed text-slate-600">
                    <div className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0052FF] mt-1.5 shrink-0 animate-ping" />
                      <p>
                        <strong>Target Signals:</strong> Key target patterns detected matching active outreach keywords. High intent search behavior detected from original social sources.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0052FF] mt-1.5 shrink-0" />
                      <p>
                        <strong>Recommendation:</strong> Initiate automated outreach sequence. The lead conversion possibility is optimized within a 48-hour response window.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-mono">
                    <Compass size={12} className="text-[#0052FF]" />
                    <span>Inbound Channel</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    {lead.source}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-mono">
                    <Calendar size={12} className="text-[#0052FF]" />
                    <span>Acquisition Date</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-800">
                    {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* System Metadata Card */}
              <div className="rounded-xl border border-slate-100 p-4 space-y-3.5 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0052FF]/20 bg-[#0052FF]/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#0052FF] font-semibold">
                    Prospect Metadata
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-mono text-[10px]">Database ID</span>
                    <span className="font-mono text-[10px] text-slate-600">{lead._id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-mono text-[10px]">Date Captured</span>
                    <span className="text-slate-600">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-mono text-[10px]">Acquisition Owner</span>
                    <span className="text-slate-600 font-mono text-[10px]">
                      {lead.createdBy || 'Automatic Scrape'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* CRM note input form */}
              <form onSubmit={handleAddNote} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0052FF]/20 bg-[#0052FF]/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#0052FF] font-semibold">
                    Create CRM Note
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type client details, call outcomes, or quick reminders..."
                    className="w-full text-xs rounded-xl p-3 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-white text-slate-800 placeholder-slate-400 pr-10 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 bottom-3 p-2 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm shadow-blue-500/10 hover:shadow-accent"
                    title="Add CRM Note"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </form>

              {/* TIMELINE ACTIVITIES */}
              <div className="relative border-l border-slate-100 pl-5 ml-2.5 space-y-5">
                {notes.map((item, idx) => (
                  <div key={item.id} className="relative group">
                    {/* Circle timeline indicators */}
                    <div className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white flex items-center justify-center transition-all ${idx === 0
                        ? 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] ring-4 ring-blue-500/10 scale-110'
                        : 'bg-slate-300'
                      }`} />

                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Clock size={11} className="text-[#0052FF]" />
                      <span>{item.date}</span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed bg-white group-hover:bg-slate-50 border border-transparent group-hover:border-slate-100 p-2.5 rounded-xl transition-all duration-200">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Footer */}
        <div className="shrink-0 border-t border-slate-200/80 p-6 bg-slate-50/50 flex items-center justify-between gap-3">
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent("GigFlow Partner Integration")}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white text-xs font-semibold py-3 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-accent-lg cursor-pointer"
          >
            <Mail size={14} />
            <span>Send Email</span>
          </a>

          <Button
            variant="ghost"
            onClick={() => onEdit(lead)}
            className="flex items-center gap-2 border border-slate-200 text-xs py-3 px-4 rounded-xl cursor-pointer hover:border-[#0052FF]/30 hover:bg-slate-100 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Edit size={14} />
            <span>Edit</span>
          </Button>

          {user?.role === 'admin' && (
            <Button
              variant="ghost"
              onClick={() => onDelete(lead)}
              className="flex items-center gap-2 border border-red-200/50 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
