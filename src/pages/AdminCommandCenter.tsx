import { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Clock,
  TrendingUp,
  CheckCircle2,
  Search,
  X,
  MapPin,
  User,
  Calendar,
  Users,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useComplaints } from '@/hooks/useComplaints';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { complaintService } from '@/services/complaintService';
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  type Complaint,
  type ComplaintStatus,
  type ComplaintCategory,
  type PriorityLevel,
  type Team,
} from '@/types/complaint';
import { categoryColors } from '@/data/mockComplaints';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const statusOptions = Object.entries(STATUS_LABELS) as [ComplaintStatus, string][];
const categoryOptions = Object.entries(CATEGORY_LABELS) as [ComplaintCategory, string][];
const priorityOptions = Object.entries(PRIORITY_LABELS) as [PriorityLevel, string][];

export function AdminCommandCenter() {
  const { complaints, loading, error, refresh, updateStatus, assignTeam, updatePriority } = useComplaints();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    complaintService.getTeams().then(setTeams);
  }, []);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length,
      highPriority: complaints.filter((c) => c.priority === 'high' || c.priority === 'critical').length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
    }),
    [complaints]
  );

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.reporterName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, statusFilter, categoryFilter, search]);

  function handleStatusChange(id: string, status: ComplaintStatus) {
    updateStatus(id, status);
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status, updatedAt: new Date().toISOString() } : prev));
  }

  function handleAssign(id: string, teamName: string) {
    assignTeam(id, teamName);
    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, assignedTeam: teamName, status: 'assigned', updatedAt: new Date().toISOString() } : prev
    );
  }

  function handlePriorityChange(id: string, priority: PriorityLevel) {
    updatePriority(id, priority);
    setSelected((prev) => (prev && prev.id === id ? { ...prev, priority, updatedAt: new Date().toISOString() } : prev));
  }

  const hasFilters = search || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Admin Command Center</h1>
        <p className="mt-1.5 text-slate-500">Monitor, prioritize, and resolve civic reports across all categories</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Reports" value={stats.total} icon={<ClipboardList className="w-5 h-5" />} accent="navy" />
        <StatCard label="Pending Review" value={stats.pending} icon={<Clock className="w-5 h-5" />} accent="amber" />
        <StatCard label="High Priority" value={stats.highPriority} icon={<TrendingUp className="w-5 h-5" />} accent="red" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5" />} accent="green" />
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, ID, location, or reporter..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm"
              />
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }}
              >
                <X className="w-4 h-4" />
                Clear filters
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              Filters:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ComplaintCategory | 'all')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <span className="ml-auto text-xs text-slate-400 font-medium self-center">
              {filtered.length} of {complaints.length} reports
            </span>
          </div>
        </div>

        {loading && <LoadingState message="Loading reports..." />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No reports match your filters"
            message="Try adjusting your search or filter criteria to see more results."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 sm:px-6 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Report</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">Team</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const colors = categoryColors[c.category];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3.5">
                        <div className="flex items-start gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} mt-1.5 shrink-0`} />
                          <div className="min-w-0">
                            <p className="font-semibold text-navy-900 text-sm truncate max-w-[200px]">{c.title}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{c.id}</p>
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px] md:hidden">
                              {CATEGORY_LABELS[c.category]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                          {CATEGORY_LABELS[c.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3.5"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        {c.assignedTeam ? (
                          <span className="text-xs font-medium text-slate-600">{c.assignedTeam}</span>
                        ) : (
                          <span className="text-xs text-slate-300">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-right">
                        <button
                          onClick={() => setSelected(c)}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Report ${selected.id}` : ''}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            {selected.imageUrl && (
              <img src={selected.imageUrl} alt={selected.title} className="w-full h-48 object-cover rounded-xl border border-slate-200" />
            )}

            <div>
              <h3 className="text-xl font-bold text-navy-900">{selected.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                <PriorityBadge priority={selected.priority} />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[selected.category].bg} ${categoryColors[selected.category].text}`}>
                  {CATEGORY_LABELS[selected.category]}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="text-sm font-medium text-navy-800">{selected.location}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Reporter</p>
                  <p className="text-sm font-medium text-navy-800">{selected.reporterName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selected.reporterContact}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Submitted</p>
                  <p className="text-sm font-medium text-navy-800">{formatDate(selected.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50">
                <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Assigned Team</p>
                  <p className="text-sm font-medium text-navy-800">{selected.assignedTeam || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <p className="text-sm font-semibold text-navy-800 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handleStatusChange(selected.id, value)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        selected.status === value
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy-800 mb-2">Assign Response Team</p>
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleAssign(selected.id, team.name)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selected.assignedTeam === team.name
                          ? 'bg-navy-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {team.name}
                      <span className="text-xs opacity-60">({team.activeAssignments})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy-800 mb-2">Adjust Priority</p>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handlePriorityChange(selected.id, value)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        selected.priority === value
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
