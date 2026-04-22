import { Globe } from 'lucide-react';

type CountryStat = {
  name: string;
  val: number;
  count: number | string;
};

type ClicksByCountryCardProps = {
  data: CountryStat[];
  className?: string;
};

function formatCount(count: number | string) {
  if (typeof count === 'number') return count.toLocaleString('en-US');
  return count;
}

export default function ClicksByCountryCard({ data, className = '' }: ClicksByCountryCardProps) {
  return (
    <div className={`bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col ${className}`.trim()}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-display font-bold text-sm text-navy dark:text-white">Clicks by Country</h4>
        <Globe className="text-slate-400" size={16} />
      </div>
      <div className="space-y-4 flex-1 justify-center flex flex-col">
        {data.map((country, index) => (
          <div key={country.name} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600 dark:text-slate-300">{country.name}</span>
              <span className="font-bold text-navy dark:text-white">{formatCount(country.count)} ({country.val}%)</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="bg-primary dark:bg-teal-500 h-full rounded-full" style={{ width: `${country.val}%`, opacity: 1 - (index * 0.15) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
