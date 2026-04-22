import { Link } from 'react-router-dom';
import { Link as LinkIcon, MousePointerClick, BarChart2, Activity, TrendingUp, TrendingDown, Download, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLinks } from '../context/LinksContext';
import ClicksByDeviceCard from '../components/ClicksByDeviceCard';

const trendData = [
  { date: 'Nov 1', clicks: 1200 }, { date: 'Nov 7', clicks: 2100 },
  { date: 'Nov 14', clicks: 1800 }, { date: 'Nov 21', clicks: 3200 },
  { date: 'Nov 28', clicks: 2800 }, { date: 'Dec 1', clicks: 3800 }
];

const deviceData = [
  { name: 'Mobile', value: 64, color: '#008080' },
  { name: 'Desktop', value: 28, color: '#4FD1C5' },
  { name: 'Tablet', value: 8, color: '#E2E8F0' }
];

export default function Dashboard() {
  const { links } = useLinks();
  const totalLinks = links.length;
  const activeLinks = links.filter((link) => link.status === 'Active').length;
  const allClicks = links.reduce((total, link) => total + link.clicks, 0);
  const topLinks = [...links]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 4);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Links Created', value: totalLinks.toLocaleString('en-US'), change: '+12%', isPositive: true, icon: LinkIcon },
          { title: 'Total Clicks Today', value: Math.round(allClicks * 0.08).toLocaleString('en-US'), change: '+24%', isPositive: true, icon: MousePointerClick },
          { title: 'All-Time Clicks', value: allClicks.toLocaleString('en-US'), change: '-3%', isPositive: false, icon: BarChart2 },
          { title: 'Active Links', value: activeLinks.toLocaleString('en-US'), change: '+8%', isPositive: true, icon: Activity },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 dark:bg-teal-900/30 rounded-lg text-primary dark:text-teal-400">
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold text-navy dark:text-white mt-1 font-display">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </section>

      {/* Middle Chart: Click Trends */}
      <section className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy dark:text-white font-display">Click Trends Over Time</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Daily interaction metrics for the last 30 days</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-surface-container-low dark:bg-navy text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg border border-surface-container-high dark:border-slate-600 hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all flex items-center gap-2">
              <Download size={16} /> Report
            </button>
            <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-all">
              Export Data
            </button>
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#008080" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#008080', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#008080" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bottom Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Links Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-navy-light rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex justify-between items-center border-b border-surface-container-high dark:border-slate-700">
            <h2 className="text-lg font-bold text-navy dark:text-white font-display">Top Performing Links</h2>
            <Link to="/links" className="text-primary dark:text-teal-400 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-bold bg-surface-container-low/50 dark:bg-navy/50">
                  <th className="px-6 py-4">Short URL</th>
                  <th className="px-6 py-4">Original URL</th>
                  <th className="px-6 py-4">Clicks</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-surface-container-high dark:divide-slate-700">
                {topLinks.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/30 dark:hover:bg-navy/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/links/${row.id}`} className="text-primary dark:text-teal-400 font-mono font-medium hover:underline flex items-center gap-1">
                        {row.shortUrl} <ExternalLink size={12} />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{row.originalUrl}</td>
                    <td className="px-6 py-4 text-navy dark:text-white font-bold">{row.clicks.toLocaleString('en-US')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                        row.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        row.status === 'Expired' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Charts */}
        <div className="flex flex-col gap-6">
          {/* Clicks by Device */}
          <ClicksByDeviceCard data={deviceData} />

          {/* Clicks by Country */}
          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm flex flex-col">
            <h2 className="text-md font-bold text-navy dark:text-white mb-4 font-display">Clicks by Country</h2>
            <div className="space-y-4">
              {[
                { name: 'United States', val: 45 },
                { name: 'United Kingdom', val: 22 },
                { name: 'Spain', val: 18 },
                { name: 'Mexico', val: 10 },
              ].map((country, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>{country.name}</span>
                    <span className="font-bold text-navy dark:text-white">{country.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-primary dark:bg-teal-500 h-full rounded-full" style={{ width: `${country.val}%`, opacity: 1 - (i * 0.2) }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
