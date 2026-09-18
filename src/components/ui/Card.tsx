import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${
        hover ? 'transition-all duration-300 hover:shadow-md hover:border-slate-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: 'teal' | 'amber' | 'red' | 'green' | 'navy';
  subtitle?: string;
}

const accentMap = {
  teal: 'bg-teal-50 text-teal-700 ring-teal-600/10',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  green: 'bg-green-50 text-green-700 ring-green-600/10',
  navy: 'bg-navy-50 text-navy-700 ring-navy-600/10',
};

export function StatCard({ label, value, icon, accent = 'teal', subtitle }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-navy-900 tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ring-1 ${accentMap[accent]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
