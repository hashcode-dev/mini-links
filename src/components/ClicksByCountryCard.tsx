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
    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 card-shadow border border-slate-200 dark:border-slate-800 flex flex-col ${className}`.trim()}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">Clicks by Country</h3>
        <Globe className="text-slate-400" size={18} />
      </div>
      <div className="space-y-4 flex-1 justify-center flex flex-col">
        {data.map((country, index) => (
          <div key={country.name} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600 dark:text-slate-400">{country.name}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatCount(country.count)} ({country.val}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${country.val}%`, opacity: 1 - (index * 0.18) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
