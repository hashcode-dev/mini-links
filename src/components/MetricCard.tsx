import type { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive,
  status,
  icon,
}: MetricCardProps) {
  const computedStatus =
    status || (isPositive !== undefined ? (isPositive ? 'success' : 'danger') : 'neutral');

  const badgeColors = {
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/60',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {change && (
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeColors[computedStatus]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
