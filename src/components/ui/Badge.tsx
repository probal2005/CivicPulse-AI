import type { ComplaintStatus, PriorityLevel } from '@/types/complaint';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/types/complaint';

const statusStyles: Record<ComplaintStatus, string> = {
  submitted: 'bg-slate-100 text-slate-700 ring-slate-600/10',
  under_review: 'bg-blue-100 text-blue-700 ring-blue-600/10',
  assigned: 'bg-purple-100 text-purple-700 ring-purple-600/10',
  resolved: 'bg-green-100 text-green-700 ring-green-600/10',
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}

const priorityStyles: Record<PriorityLevel, string> = {
  low: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  medium: 'bg-amber-100 text-amber-700 ring-amber-600/10',
  high: 'bg-orange-100 text-orange-700 ring-orange-600/10',
  critical: 'bg-red-100 text-red-700 ring-red-600/10',
};

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${priorityStyles[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
