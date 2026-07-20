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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Link Management</h1>
          <p className="text-sm text-slate-500">View, search, and analyze your high-performing URLs</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-8 pr-8 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-300 outline-none appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Create Link
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Short URL</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Destination</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Created</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                        <LinkIcon size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <Link to={`/links/${link.id}`} className="font-mono text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                          {link.shortUrl} <ExternalLink size={12} />
                        </Link>
                        <p className="text-[11px] text-slate-400 sm:hidden truncate max-w-[140px]">{link.originalUrl}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-slate-500 truncate max-w-[260px]">{link.originalUrl}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-slate-900 w-12">{link.clicks.toLocaleString('en-US')}</div>
                      <div className="w-20 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineFromClicks(link.clicks)}>
                            <Line type="monotone" dataKey="value" stroke={link.status === 'Active' ? '#4f46e5' : '#94a3b8'} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <p className="text-xs text-slate-500">{formatDate(link.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      link.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      link.status === 'Expired' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {link.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5 text-slate-400 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => navigate(`/links/${link.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => navigate(`/qr?linkId=${link.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors" title="QR Code">
                        <QrCode size={16} />
                      </button>
                      <button type="button" onClick={() => handleCopy(link.shortUrl)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors" title="Copy URL">
                        <Share2 size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(link.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    No links match your current search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredLinks.length}</span> of {links.length} links
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-medium text-slate-500 disabled:opacity-50" disabled>Previous</button>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-semibold bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-500 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
