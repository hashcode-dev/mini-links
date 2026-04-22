import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Copy, Calendar, MousePointerClick, Edit2, Trash2, Globe, Monitor, Terminal, Link as LinkIcon, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, YAxis } from 'recharts';
import { useLinks } from '../context/LinksContext';
import ClicksByDeviceCard from '../components/ClicksByDeviceCard';

function buildTrendData(totalClicks: number) {
  const days = ['Nov 1', 'Nov 7', 'Nov 14', 'Nov 21', 'Nov 28', 'Dec 1'];
  const base = Math.max(20, Math.round(totalClicks / 14));
  return days.map((date, index) => ({
    date,
    clicks: base + ((index * 37 + totalClicks) % 140),
  }));
}

export default function LinkAnalytics() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getLinkById, deleteLink } = useLinks();
  const link = getLinkById(id);

  const trendData = useMemo(() => buildTrendData(link?.clicks ?? 0), [link?.clicks]);

  if (!link) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl border border-surface-container-high dark:border-slate-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">Link not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">This link may have been removed.</p>
          <Link to="/links" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">
            Back to Links
          </Link>
        </div>
      </div>
    );
  }

  const deviceData = [
    { name: 'Mobile', value: 64, color: '#008080' },
    { name: 'Desktop', value: 28, color: '#4FD1C5' },
    { name: 'Tablet', value: 8, color: '#E2E8F0' },
  ];
  const browserData = [
    { name: 'Chrome', value: 64, count: '15,571' },
    { name: 'Safari', value: 22, count: '5,350' },
    { name: 'Firefox', value: 8, count: '1,946' },
    { name: 'Edge', value: 4, count: '973' },
  ];
  const osData = [
    { name: 'iOS', value: 48 },
    { name: 'Android', value: 24 },
    { name: 'macOS', value: 18 },
    { name: 'Windows', value: 10 },
  ];
  const timeData = [
    { time: '00:00', clicks: 10 },
    { time: '04:00', clicks: 5 },
    { time: '08:00', clicks: 40 },
    { time: '12:00', clicks: 80 },
    { time: '16:00', clicks: 60 },
    { time: '20:00', clicks: 30 },
  ];

  const handleDelete = () => {
    deleteLink(link.id);
    navigate('/links');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${link.shortUrl}`);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <section className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-surface-container-high dark:border-slate-700">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-display text-primary dark:text-teal-400 tracking-tight">{link.shortUrl}</h2>
            <button type="button" onClick={handleCopy} className="text-slate-400 hover:text-primary dark:hover:text-teal-400 transition-colors">
              <Copy size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <LinkIcon size={14} />
            <span className="truncate max-w-[200px] md:max-w-md">{link.originalUrl}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Created {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-primary dark:text-teal-400">
              <MousePointerClick size={14} />
              {link.clicks.toLocaleString('en-US')} Total Clicks
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/links/new')} className="px-4 py-2 bg-surface-container-low dark:bg-navy text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all flex items-center gap-2 border border-surface-container-high dark:border-slate-700">
            <Edit2 size={14} /> Edit Link
          </button>
          <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center gap-2">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </section>

      <section className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-8 space-y-6 shadow-sm border border-surface-container-high dark:border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold font-display text-navy dark:text-white">Click Activity Over Time</h3>
          <div className="flex bg-surface-container-low dark:bg-navy p-1 rounded-lg border border-surface-container-high dark:border-slate-700">
            <button className="px-4 py-1.5 text-xs font-bold bg-surface-container-lowest dark:bg-navy-light text-primary dark:text-teal-400 rounded-md shadow-sm">30D</button>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicksDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#008080', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="clicks" stroke="#008080" strokeWidth={3} fillOpacity={1} fill="url(#colorClicksDetail)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ].map((country, index) => (
              <div key={country.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-300">{country.name}</span>
                  <span className="font-bold text-navy dark:text-white">{country.count} ({country.val}%)</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-primary dark:bg-teal-500 h-full rounded-full" style={{ width: `${country.val}%`, opacity: 1 - (index * 0.15) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ClicksByDeviceCard data={deviceData} />

        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Clicks by Browser</h4>
            <Monitor className="text-slate-400" size={16} />
          </div>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {browserData.map((browser, index) => (
              <div key={browser.name} className="space-y-1">
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-300">
                  <span>{browser.name}</span>
                  <span className="font-bold text-navy dark:text-white">{browser.count} ({browser.value}%)</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary dark:bg-teal-500 rounded-full" style={{ width: `${browser.value}%`, opacity: 1 - (index * 0.2) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">Operating Systems</h4>
            <Terminal className="text-slate-400" size={16} />
          </div>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {osData.map((os, index) => (
              <div key={os.name} className="space-y-1">
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-300">
                  <span>{os.name}</span>
                  <span className="font-bold text-navy dark:text-white">{os.value}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary dark:bg-teal-500 rounded-full" style={{ width: `${os.value}%`, opacity: 1 - (index * 0.2) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl p-6 shadow-sm border border-surface-container-high dark:border-slate-700 flex flex-col lg:col-span-2">
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
