import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit2, QrCode, Share2, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLinks, type LinkStatus, type ShortLink } from '../context/LinksContext';
import StatusBadge from '../components/StatusBadge';

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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Link Management
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            View, search, and analyze your high-performing branded URLs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 min-h-[44px] pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
              aria-label="Search links"
            />
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full sm:w-auto min-h-[44px] pl-9 pr-8 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 outline-none appearance-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
              aria-label="Filter status"
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
            className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>Create Link</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden card-shadow border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Short URL</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Destination</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Created</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center border border-blue-200/60 dark:border-blue-900 text-blue-600 dark:text-blue-400 shrink-0">
                        <LinkIcon size={16} />
                      </div>
                      <div>
                        <Link to={`/links/${link.id}`} className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline flex items-center gap-1">
                          {link.shortUrl} <ExternalLink size={12} />
                        </Link>
                        <p className="text-[11px] text-slate-400 sm:hidden truncate max-w-[140px]">{link.originalUrl}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[260px]">{link.originalUrl}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="font-display text-sm font-extrabold text-slate-900 dark:text-slate-100 w-12">{link.clicks.toLocaleString('en-US')}</div>
                      <div className="w-20 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineFromClicks(link.clicks)}>
                            <Line type="monotone" dataKey="value" stroke={link.status === 'Active' ? '#004bca' : '#94a3b8'} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatDate(link.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={link.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => navigate(`/links/${link.id}`)}
                        className="p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        aria-label="Edit link"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/qr?linkId=${link.id}`)}
                        className="p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        aria-label="Generate QR Code"
                      >
                        <QrCode size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(link.shortUrl)}
                        className="p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        aria-label="Copy short URL"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(link.id)}
                        className="p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500/30"
                        aria-label="Delete link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No links match your current search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredLinks.length}</span> of {links.length} links
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-500 disabled:opacity-50" disabled>Previous</button>
            <button className="w-8 h-8 flex items-center justify-center text-xs font-bold bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-500 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
