import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit2, QrCode, Share2, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLinks, type LinkStatus, type ShortLink } from '../context/LinksContext';

type StatusFilter = 'All' | LinkStatus;

function formatDate(dateValue: string): string {
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function sparklineFromClicks(clicks: number) {
  const baseline = Math.max(10, Math.round(clicks / 12));
  return Array.from({ length: 10 }, (_, index) => ({
    value: baseline + (((index * 17 + clicks) % 40) - 20),
  }));
}

function sortLinksForDisplay(links: ShortLink[]) {
  return [...links].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function Links() {
  const navigate = useNavigate();
  const { links, deleteLink } = useLinks();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filteredLinks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sortLinksForDisplay(links).filter((link) => {
      const matchesSearch =
        !term ||
        link.shortUrl.toLowerCase().includes(term) ||
        link.originalUrl.toLowerCase().includes(term) ||
        link.domain.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'All' || link.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [links, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    deleteLink(id);
  };

  const handleCopy = async (shortUrl: string) => {
    await navigator.clipboard.writeText(`https://${shortUrl}`);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
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
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-8 pr-8 py-2 bg-surface-container-lowest dark:bg-navy text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg border border-surface-container-high dark:border-slate-700 outline-none appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Private">Private</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => navigate('/links/new')}
            className="px-4 py-2 bg-cta hover:bg-cta-dark text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Create Link
          </button>
        </div>
      </div>

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
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-surface-container-low/50 dark:hover:bg-navy/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-low dark:bg-navy flex items-center justify-center p-1.5 border border-surface-container-high dark:border-slate-700">
                        <LinkIcon size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <Link to={`/links/${link.id}`} className="font-mono text-primary dark:text-teal-400 font-semibold text-sm hover:underline flex items-center gap-1">
                          {link.shortUrl} <ExternalLink size={12} />
                        </Link>
                        <p className="text-[10px] text-slate-400 sm:hidden truncate max-w-[140px]">{link.originalUrl}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden lg:table-cell">
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[260px]">{link.originalUrl}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-navy dark:text-white w-12">{link.clicks.toLocaleString('en-US')}</div>
                      <div className="w-20 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineFromClicks(link.clicks)}>
                            <Line type="monotone" dataKey="value" stroke={link.status === 'Active' ? '#008080' : '#94a3b8'} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(link.createdAt)}</p>
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
                      <button type="button" onClick={() => navigate(`/links/${link.id}`)} className="p-1.5 hover:text-primary dark:hover:text-teal-400 transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => navigate(`/qr?linkId=${link.id}`)} className="p-1.5 hover:text-primary dark:hover:text-teal-400 transition-colors" title="QR Code">
                        <QrCode size={16} />
                      </button>
                      <button type="button" onClick={() => handleCopy(link.shortUrl)} className="p-1.5 hover:text-primary dark:hover:text-teal-400 transition-colors" title="Share">
                        <Share2 size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(link.id)} className="p-1.5 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No links match your current search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low dark:bg-navy border-t border-surface-container-high dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-navy dark:text-white">{filteredLinks.length}</span> of {links.length} links
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-bold text-slate-500 disabled:opacity-50" disabled>Previous</button>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-bold bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-500 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
