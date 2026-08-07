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
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col ${className}`.trim()}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-semibold text-base text-slate-900">Clicks by Country</h4>
        <Globe className="text-slate-400" size={18} />
      </div>
      <div className="space-y-4 flex-1 justify-center flex flex-col">
        {data.map((country, index) => (
          <div key={country.name} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">{country.name}</span>
              <span className="font-bold text-slate-900">{formatCount(country.count)} ({country.val}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${country.val}%`, opacity: 1 - (index * 0.18) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

