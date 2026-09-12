import { Terminal } from 'lucide-react';

type OperatingSystemStat = {
  name: string;
  value: number;
  count: number | string;
};

type ClicksByOperatingSystemCardProps = {
  data: OperatingSystemStat[];
  className?: string;
};

function formatCount(count: number | string) {
  if (typeof count === 'number') return count.toLocaleString('en-US');
  return count;
}

export default function ClicksByOperatingSystemCard({ data, className = '' }: ClicksByOperatingSystemCardProps) {
  return (
    <div className={`bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col ${className}`.trim()}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-display font-bold text-sm text-navy dark:text-white">Operating Systems</h4>
        <Terminal className="text-slate-400" size={16} />
      </div>
      <div className="space-y-5 flex-1 justify-center flex flex-col">
        {data.map((os, index) => (
          <div key={os.name} className="space-y-1">
            <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-300">
              <span>{os.name}</span>
              <span className="font-bold text-navy dark:text-white">{formatCount(os.count)} ({os.value}%)</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary dark:bg-teal-500 rounded-full" style={{ width: `${os.value}%`, opacity: 1 - (index * 0.2) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

