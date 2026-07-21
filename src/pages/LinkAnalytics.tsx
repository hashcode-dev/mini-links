import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Copy, Calendar, MousePointerClick, Edit2, Trash2, Monitor, Link as LinkIcon, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, YAxis } from 'recharts';
import { useLinks } from '../context/LinksContext';
import ClicksByDeviceCard from '../components/ClicksByDeviceCard';
import ClicksByCountryCard from '../components/ClicksByCountryCard';
import ClicksByOperatingSystemCard from '../components/ClicksByOperatingSystemCard';

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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center card-shadow space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">Link Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400">This short link may have been deleted or moved.</p>
          <Link
            to="/links"
            className="inline-flex min-h-[44px] px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-md hover:bg-blue-700 transition-colors items-center justify-center"
          >
            Back to Links
          </Link>
        </div>
      </div>
    );
  }

  const deviceData = [
    { name: 'Mobile', value: 64, color: '#004bca' },
    { name: 'Desktop', value: 28, color: '#712ae2' },
    { name: 'Tablet', value: 8, color: '#007f57' },
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
  ].map((os) => ({
    ...os,
    count: Math.round((link.clicks * os.value) / 100),
  }));
  const timeData = [
    { time: '00:00', clicks: 10 },
    { time: '04:00', clicks: 5 },
    { time: '08:00', clicks: 40 },
    { time: '12:00', clicks: 80 },
    { time: '16:00', clicks: 60 },
    { time: '20:00', clicks: 30 },
  ];
  const countryData = [
    { name: 'United States', val: 51, count: '12,402' },
    { name: 'United Kingdom', val: 17, count: '4,120' },
    { name: 'Germany', val: 8, count: '2,011' },
    { name: 'Spain', val: 5, count: '1,200' },
  ];

  const handleDelete = () => {
    deleteLink(link.id);
    navigate('/links');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${link.shortUrl}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Overview Hero Card */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 card-shadow border border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tracking-tight">
              {link.shortUrl}
            </h1>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Copy URL"
            >
              <Copy size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
            <LinkIcon size={14} className="shrink-0" />
            <span className="truncate max-w-[200px] md:max-w-md font-mono">{link.originalUrl}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              Created {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold font-display">
              <MousePointerClick size={14} />
              {link.clicks.toLocaleString('en-US')} Total Clicks
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/links/new')}
            className="min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 size={16} /> Edit Link
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="min-h-[44px] px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </section>

      {/* Activity Chart Card */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 space-y-6 card-shadow border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Click Activity Over Time
          </h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm">
              30D
            </button>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicksDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004bca" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0061ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#5a6072', fontSize: 12 }} dy={10} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #c2c6d9', backgroundColor: '#ffffff' }} itemStyle={{ color: '#004bca', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="clicks" stroke="#004bca" strokeWidth={3} fillOpacity={1} fill="url(#colorClicksDetail)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClicksByCountryCard data={countryData} />
        <ClicksByDeviceCard data={deviceData} />

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 card-shadow border border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">Clicks by Browser</h3>
            <Monitor className="text-slate-400" size={18} />
          </div>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {browserData.map((browser, index) => (
              <div key={browser.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  <span>{browser.name}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{browser.count} ({browser.value}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${browser.value}%`, opacity: 1 - (index * 0.2) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ClicksByOperatingSystemCard data={osData} />

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 card-shadow border border-slate-200 dark:border-slate-800 flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">Activity by Hour</h3>
            <Clock className="text-slate-400" size={18} />
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#5a6072', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a6072', fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'rgba(0, 75, 202, 0.05)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #c2c6d9' }} />
                <Bar dataKey="clicks" fill="#004bca" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
