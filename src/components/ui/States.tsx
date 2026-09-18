import type { ReactNode } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
        <AlertCircle className="w-7 h-7 text-red-600" />
      </div>
      <p className="text-sm text-slate-600 font-medium text-center max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-400">
        {icon}
      </div>
      <p className="text-base font-semibold text-navy-800">{title}</p>
      <p className="text-sm text-slate-500 text-center max-w-sm">{message}</p>
      {action}
    </div>
  );
}
