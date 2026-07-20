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
      <div className="p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Link Not Found</h2>
          <p className="text-slate-500 mb-6">This link may have been deleted or moved.</p>
          <Link to="/links" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm">
            Back to Links
          </Link>
        </div>
      </div>
    );
  }

  const deviceData = [
    { name: 'Mobile', value: 64, color: '#4f46e5' },
    { name: 'Desktop', value: 28, color: '#712ae2' },
    { name: 'Tablet', value: 8, color: '#059669' },
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
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Overview Card */}
      <section className="bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-mono text-blue-600 tracking-tight">{link.shortUrl}</h2>
            <button type="button" onClick={handleCopy} className="text-slate-400 hover:text-blue-600 transition-colors" title="Copy URL">
              <Copy size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <LinkIcon size={14} />
            <span className="truncate max-w-[200px] md:max-w-md">{link.originalUrl}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Created {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-indigo-600 font-bold">
              <MousePointerClick size={14} />
              {link.clicks.toLocaleString('en-US')} Total Clicks
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/links/new')} className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all flex items-center gap-2">
            <Edit2 size={14} /> Edit Link
          </button>
          <button type="button" onClick={handleDelete} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg transition-all flex items-center gap-2">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </section>

      {/* Activity Chart */}
      <section className="bg-white rounded-2xl p-6 md:p-8 space-y-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Click Activity Over Time</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button className="px-3 py-1 text-xs font-semibold bg-white text-blue-600 rounded-md shadow-sm">30D</button>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicksDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#712ae2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorClicksDetail)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClicksByCountryCard data={countryData} />

        <ClicksByDeviceCard data={deviceData} />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-semibold text-base text-slate-900">Clicks by Browser</h4>
            <Monitor className="text-slate-400" size={18} />
          </div>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {browserData.map((browser, index) => (
              <div key={browser.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>{browser.name}</span>
                  <span className="font-bold text-slate-900">{browser.count} ({browser.value}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${browser.value}%`, opacity: 1 - (index * 0.2) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ClicksByOperatingSystemCard data={osData} />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-semibold text-base text-slate-900">Activity by Hour</h4>
            <Clock className="text-slate-400" size={18} />
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="clicks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
