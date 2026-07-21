import { Link } from 'react-router-dom';
import { Link as LinkIcon, MousePointerClick, BarChart2, Activity, Download, ExternalLink, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLinks } from '../context/LinksContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import ClicksByDeviceCard from '../components/ClicksByDeviceCard';
import ClicksByCountryCard from '../components/ClicksByCountryCard';

const trendData = [
  { date: 'Nov 1', clicks: 1200 },
  { date: 'Nov 7', clicks: 2100 },
  { date: 'Nov 14', clicks: 1800 },
  { date: 'Nov 21', clicks: 3200 },
  { date: 'Nov 28', clicks: 2800 },
  { date: 'Dec 1', clicks: 3800 },
];

const deviceData = [
  { name: 'Mobile', value: 64, color: '#004bca' },
  { name: 'Desktop', value: 28, color: '#712ae2' },
  { name: 'Tablet', value: 8, color: '#007f57' },
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
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Executive Dashboard — <span className="text-blue-600 dark:text-blue-400">Overview</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
            Real-time link activity and audience engagement statistics for active campaigns.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/links/new"
            className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <Plus size={18} />
            <span>Create Link</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid (4 columns on desktop) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Links Created"
          value={totalLinks.toLocaleString('en-US')}
          change="+12%"
          status="success"
          icon={<LinkIcon size={20} />}
        />
        <MetricCard
          title="Total Clicks Today"
          value={Math.round(allClicks * 0.08).toLocaleString('en-US')}
          change="+24%"
          status="success"
          icon={<MousePointerClick size={20} />}
        />
        <MetricCard
          title="All-Time Clicks"
          value={allClicks.toLocaleString('en-US')}
          change="-3%"
          status="danger"
          icon={<BarChart2 size={20} />}
        />
        <MetricCard
          title="Active Redirects"
          value={activeLinks.toLocaleString('en-US')}
          change="+8%"
          status="success"
          icon={<Activity size={20} />}
        />
      </section>

      {/* Click Trends Chart */}
      <section className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Click Trends Over Time
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Daily interaction metrics for active campaigns over the last 30 days
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <Download size={16} />
              <span>Report</span>
            </button>
            <button
              type="button"
              className="min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004bca" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0061ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#5a6072', fontSize: 12 }} dy={10} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #c2c6d9',
                  boxShadow: '0 10px 25px -5px rgba(11, 28, 48, 0.1)',
                  backgroundColor: '#ffffff',
                }}
                itemStyle={{ color: '#004bca', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#004bca" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Main Content Grid (2/3 Table + 1/3 Side Breakdown) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Links Table (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow overflow-hidden flex flex-col">
          <div className="p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Top Performing Links
            </h2>
            <Link to="/links" className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3.5">Short URL</th>
                  <th className="px-6 py-3.5">Original URL</th>
                  <th className="px-6 py-3.5">Clicks</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {topLinks.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/links/${row.id}`} className="text-blue-600 dark:text-blue-400 font-mono font-semibold hover:underline flex items-center gap-1">
                        {row.shortUrl} <ExternalLink size={12} />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{row.originalUrl}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-bold font-display">{row.clicks.toLocaleString('en-US')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Cards (1/3 width) */}
        <div className="flex flex-col gap-6">
          <ClicksByDeviceCard data={deviceData} />
          <ClicksByCountryCard data={countryData} />
        </div>
      </section>
    </div>
  );
}
