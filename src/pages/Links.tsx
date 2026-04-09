import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, MoreVertical, Edit2, QrCode, Share2, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mock data for sparklines
const generateSparklineData = () => Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 100) }));

const linksData = [
  { id: 1, short: 'lp.at/git-repo', dest: 'github.com/precision-atelier/core', clicks: '1,284', created: '12 Oct 2024', status: 'Active', sparkline: generateSparklineData() },
  { id: 2, short: 'lp.at/portfolio', dest: 'dribbble.com/precision_links', clicks: '4,120', created: '28 Sep 2024', status: 'Active', sparkline: generateSparklineData() },
  { id: 3, short: 'lp.at/article-4', dest: 'medium.com/tech-insights/link...', clicks: '952', created: '15 Aug 2024', status: 'Expired', sparkline: generateSparklineData() },
  { id: 4, short: 'lp.at/wiki-internal', dest: 'notion.so/atelier/internal-wiki', clicks: '542', created: '02 Nov 2024', status: 'Private', sparkline: generateSparklineData() },
];

export default function Links() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-navy dark:text-white font-display tracking-tight">Link Management</h2>
          <p className="text-slate-500 dark:text-slate-400">View and analyze your high-performing URLs</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search links..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-container-lowest dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm w-full md:w-64 focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white"
            />
          </div>
          <button className="px-4 py-2 bg-surface-container-lowest dark:bg-navy text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg border border-surface-container-high dark:border-slate-700 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
          <button className="px-4 py-2 bg-cta hover:bg-cta-dark text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Create Link
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl overflow-hidden shadow-sm border border-surface-container-high dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low dark:bg-navy border-b border-surface-container-high dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Short URL</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell">Destination</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:table-cell">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high dark:divide-slate-700">
              {linksData.map((link) => (
                <tr key={link.id} className="hover:bg-surface-container-low/50 dark:hover:bg-navy/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-low dark:bg-navy flex items-center justify-center p-1.5 border border-surface-container-high dark:border-slate-700">
                        <LinkIcon size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <Link to={`/links/${link.id}`} className="font-mono text-primary dark:text-teal-400 font-semibold text-sm hover:underline flex items-center gap-1">
                          {link.short} <ExternalLink size={12} />
                        </Link>
                        <p className="text-[10px] text-slate-400 sm:hidden truncate max-w-[120px]">{link.dest}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden lg:table-cell">
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{link.dest}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-navy dark:text-white w-12">{link.clicks}</div>
                      <div className="w-20 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={link.sparkline}>
                            <Line type="monotone" dataKey="value" stroke={link.status === 'Active' ? '#008080' : '#94a3b8'} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{link.created}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                      link.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      link.status === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {link.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:text-primary dark:hover:text-teal-400 transition-colors" title="Edit"><Edit2 size={16} /></button>
                      <button className="p-1.5 hover:text-primary dark:hover:text-teal-400 transition-colors" title="QR Code"><QrCode size={16} /></button>
                      <button className="p-1.5 hover:text-primary dark:hover:text-teal-400 transition-colors" title="Share"><Share2 size={16} /></button>
                      <button className="p-1.5 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low dark:bg-navy border-t border-surface-container-high dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-navy dark:text-white">1-4</span> of 142 links</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-navy dark:hover:text-white disabled:opacity-50" disabled>Previous</button>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center text-xs font-bold bg-primary text-white rounded">1</button>
              <button className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-primary transition-colors">2</button>
              <button className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-primary transition-colors">3</button>
            </div>
            <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-navy dark:hover:text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
