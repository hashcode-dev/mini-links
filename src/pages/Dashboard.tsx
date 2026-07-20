import { Link } from 'react-router-dom';
import { Link as LinkIcon, MousePointerClick, BarChart2, Activity, TrendingUp, TrendingDown, Download, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLinks } from '../context/LinksContext';
import ClicksByDeviceCard from '../components/ClicksByDeviceCard';
import ClicksByCountryCard from '../components/ClicksByCountryCard';
import ResultBox from '../components/ResultBox';

const trendData = [
  { date: 'Nov 1', clicks: 1200 }, { date: 'Nov 7', clicks: 2100 },
  { date: 'Nov 14', clicks: 1800 }, { date: 'Nov 21', clicks: 3200 },
  { date: 'Nov 28', clicks: 2800 }, { date: 'Dec 1', clicks: 3800 }
];

const deviceData = [
  { name: 'Mobile', value: 64, color: '#4f46e5' },
  { name: 'Desktop', value: 28, color: '#712ae2' },
  { name: 'Tablet', value: 8, color: '#059669' }
];

const countryData = [
  { name: 'United States', val: 45, count: '10,931' },
  { name: 'United Kingdom', val: 22, count: '5,344' },
  { name: 'Spain', val: 18, count: '4,372' },
  { name: 'Mexico', val: 10, count: '2,429' },
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
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time link activity and audience engagement statistics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/links/new" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2">
            <LinkIcon size={16} />
            <span>New Link</span>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Links Created', value: totalLinks.toLocaleString('en-US'), change: '+12%', isPositive: true, icon: LinkIcon, color: 'text-indigo-600' },
          { title: 'Total Clicks Today', value: Math.round(allClicks * 0.08).toLocaleString('en-US'), change: '+24%', isPositive: true, icon: MousePointerClick, color: 'text-blue-600' },
          { title: 'All-Time Clicks', value: allClicks.toLocaleString('en-US'), change: '-3%', isPositive: false, icon: BarChart2, color: 'text-purple-600' },
          { title: 'Active Redirects', value: activeLinks.toLocaleString('en-US'), change: '+8%', isPositive: true, icon: Activity, color: 'text-emerald-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-shadow-hover">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600">
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${stat.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  {stat.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
              <div className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </section>

      {/* Middle Chart: Click Trends */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Click Trends Over Time</h2>
            <p className="text-slate-500 text-sm mt-0.5">Daily interaction metrics for the last 30 days</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all flex items-center gap-2">
              <Download size={14} /> Report
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all">
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#712ae2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bottom Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Links Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex justify-between items-center border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Top Performing Links</h2>
            <Link to="/links" className="text-blue-600 text-xs font-semibold hover:underline">View All &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-semibold bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3">Short URL</th>
                  <th className="px-6 py-3">Original URL</th>
                  <th className="px-6 py-3">Clicks</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {topLinks.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/links/${row.id}`} className="text-blue-600 font-mono font-medium hover:underline flex items-center gap-1">
                        {row.shortUrl} <ExternalLink size={12} />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-[180px]">{row.originalUrl}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold">{row.clicks.toLocaleString('en-US')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        row.status === 'Expired' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
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
          <ClicksByDeviceCard data={deviceData} />
          <ClicksByCountryCard data={countryData} />
        </div>
      </section>
    </div>
  );
}
