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
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col ${className}`.trim()}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-semibold text-base text-slate-900">Operating Systems</h4>
        <Terminal className="text-slate-400" size={18} />
      </div>
      <div className="space-y-5 flex-1 justify-center flex flex-col">
        {data.map((os, index) => (
          <div key={os.name} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>{os.name}</span>
              <span className="font-bold text-slate-900">{formatCount(os.count)} ({os.value}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${os.value}%`, opacity: 1 - (index * 0.2) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


