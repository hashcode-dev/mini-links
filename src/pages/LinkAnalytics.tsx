import { Link } from 'react-router-dom';
import { Copy, Calendar, MousePointerClick, Edit2, Trash2, Globe, Smartphone, Monitor, Terminal, Link as LinkIcon, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, YAxis } from 'recharts';

const trendData = [
  { date: 'Nov 1', clicks: 120 }, { date: 'Nov 7', clicks: 210 },
  { date: 'Nov 14', clicks: 180 }, { date: 'Nov 21', clicks: 320 },
  { date: 'Nov 28', clicks: 280 }, { date: 'Dec 1', clicks: 380 }
];

const deviceData = [
  { name: 'Mobile', value: 72, color: '#008080' },
  { name: 'Desktop', value: 28, color: '#4FD1C5' }
];

const browserData = [
  { name: 'Chrome', value: 64 },
  { name: 'Safari', value: 22 },
  { name: 'Firefox', value: 8 },
  { name: 'Edge', value: 4 }
];

const osData = [
  { name: 'iOS', value: 48 },
  { name: 'Android', value: 24 },
  { name: 'macOS', value: 18 },
  { name: 'Windows', value: 10 }
];

const timeData = [
  { time: '00:00', clicks: 10 }, { time: '04:00', clicks: 5 },
  { time: '08:00', clicks: 40 }, { time: '12:00', clicks: 80 },
  { time: '16:00', clicks: 60 }, { time: '20:00', clicks: 30 }
];

export default function LinkAnalytics() {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Summary */}
      <section className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-surface-container-high dark:border-slate-700">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-display text-primary dark:text-teal-400 tracking-tight">lp.at/winter-promo-24</h2>
            <button className="text-slate-400 hover:text-primary dark:hover:text-teal-400 transition-colors">
              <Copy size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <LinkIcon size={14} />
            <span className="truncate max-w-[200px] md:max-w-md">https://marketing.enterprise.com/campaigns/winter/2024/tracking?ref=social</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1"><Calendar size={14} /> Created Nov 12, 2024</span>
            <span className="flex items-center gap-1 text-primary dark:text-teal-400"><MousePointerClick size={14} /> 24,492 Total Clicks</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface-container-low dark:bg-navy text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all flex items-center gap-2 border border-surface-container-high dark:border-slate-700">
            <Edit2 size={14} /> Edit Link
          </button>
          <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center gap-2">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </section>

      {/* Main Chart */}
      <section className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-8 space-y-6 shadow-sm border border-surface-container-high dark:border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold font-display text-navy dark:text-white">Click Activity Over Time</h3>
          <div className="flex bg-surface-container-low dark:bg-navy p-1 rounded-lg border border-surface-container-high dark:border-slate-700">
            <button className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-all">7D</button>
            <button className="px-4 py-1.5 text-xs font-bold bg-surface-container-lowest dark:bg-navy-light text-primary dark:text-teal-400 rounded-md shadow-sm">30D</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-all">90D</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-all">All</button>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicksDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#008080" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-surface-container-lowest)' }}
                itemStyle={{ color: '#008080', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#008080" strokeWidth={3} fillOpacity={1} fill="url(#colorClicksDetail)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Grid of Smaller Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Clicks by Country */}
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Clicks by Country</h4>
            <Globe className="text-slate-400" size={16} />
          </div>
          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {[
              { name: 'United States', val: 51, count: '12,402' },
              { name: 'United Kingdom', val: 17, count: '4,120' },
              { name: 'Germany', val: 8, count: '2,011' },
              { name: 'Spain', val: 5, count: '1,200' },
            ].map((country, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-300">{country.name}</span>
                  <span className="font-bold text-navy dark:text-white">{country.count} ({country.val}%)</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-primary dark:bg-teal-500 h-full rounded-full" style={{ width: `${country.val}%`, opacity: 1 - (i * 0.15) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clicks by Device */}
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Clicks by Device</h4>
            <Smartphone className="text-slate-400" size={16} />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative py-4">
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                    {deviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-display text-navy dark:text-white">72%</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Mobile</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {deviceData.map(d => (
              <div key={d.name} className="text-center p-2 rounded bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{d.name}</p>
                <p className="font-bold text-primary dark:text-teal-400">{d.value}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clicks by Browser */}
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Clicks by Browser</h4>
            <Monitor className="text-slate-400" size={16} />
          </div>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {browserData.map((browser, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-300">
                  <span>{browser.name}</span>
                  <span className="font-bold text-navy dark:text-white">{browser.value}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary dark:bg-teal-500 rounded-full" style={{ width: `${browser.value}%`, opacity: 1 - (i * 0.2) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clicks by OS */}
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Operating Systems</h4>
            <Terminal className="text-slate-400" size={16} />
          </div>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {osData.map((os, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-300">
                  <span>{os.name}</span>
                  <span className="font-bold text-navy dark:text-white">{os.value}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary dark:bg-teal-500 rounded-full" style={{ width: `${os.value}%`, opacity: 1 - (i * 0.2) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Top Referrers</h4>
            <LinkIcon className="text-slate-400" size={16} />
          </div>
          <div className="space-y-3 flex-1 justify-center flex flex-col">
            {[
              { name: 'twitter.com', count: '8,124' },
              { name: 'facebook.com', count: '5,431' },
              { name: 'instagram.com', count: '4,992' },
              { name: 'Direct / Email', count: '3,205' },
            ].map((ref, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low dark:bg-navy border border-transparent hover:border-surface-container-high dark:hover:border-slate-600 transition-all">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{ref.name}</span>
                <span className="text-xs font-bold text-primary dark:text-teal-400">{ref.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Heatmap (Bar chart representation) */}
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Activity by Hour</h4>
            <Clock className="text-slate-400" size={16} />
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'rgba(0, 128, 128, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="clicks" fill="#008080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
