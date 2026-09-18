import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useComplaints } from '@/hooks/useComplaints';
import { Button } from '@/components/ui/Button';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { CATEGORY_LABELS } from '@/types/complaint';
import { categoryColors, mockComplaints } from '@/data/mockComplaints';
import { useEffect, useState } from 'react';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CitizenDashboard() {
  const { complaints, loading, error, refresh } = useComplaints();
  const [stats, setStats] = useState({ total: 0, pending: 0, highPriority: 0, resolved: 0 });

  useEffect(() => {
    const s = {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length,
      highPriority: complaints.filter((c) => c.priority === 'high' || c.priority === 'critical').length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
    };
    setStats(s);
  }, [complaints]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Citizen Dashboard</h1>
          <p className="mt-1.5 text-slate-500">Track civic reports across your community</p>
        </div>
        <Button to="/report">
          <Plus className="w-4 h-4" />
          Report New Issue
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Reports" value={stats.total} icon={<ClipboardList className="w-5 h-5" />} accent="navy" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock className="w-5 h-5" />} accent="amber" />
        <StatCard label="High Priority" value={stats.highPriority} icon={<TrendingUp className="w-5 h-5" />} accent="red" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5" />} accent="green" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-navy-900">Recent Complaints</h2>
          <span className="text-xs text-slate-400 font-medium">{complaints.length} total</span>
        </div>

        {loading && <LoadingState message="Loading complaints..." />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        {!loading && !error && complaints.length === 0 && (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No complaints yet"
            message="Be the first to report a civic issue in your area."
            action={<Button to="/report" size="sm">Report an Issue</Button>}
          />
        )}

        {!loading && !error && complaints.length > 0 && (
          <div className="divide-y divide-slate-100">
            {complaints.slice(0, 8).map((complaint) => {
              const colors = categoryColors[complaint.category];
              return (
                <div key={complaint.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${colors.bg} ${colors.text}`}>
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{complaint.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                        {CATEGORY_LABELS[complaint.category]}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-navy-900 text-sm truncate">{complaint.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{complaint.location}</span>
                      <span className="text-slate-300">·</span>
                      <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button to="/map" variant="outline">View on Map</Button>
        <Button to="/admin" variant="ghost">Open Admin Center</Button>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Showing demo data from {mockComplaints.length} mock reports. New reports submitted through the Report Issue page appear here during your session.
      </p>
    </div>
  );
}
