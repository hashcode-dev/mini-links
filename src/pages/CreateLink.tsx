import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Link as LinkIcon } from 'lucide-react';
import { useLinks } from '../context/LinksContext';

export default function CreateLink() {
  const navigate = useNavigate();
  const { createLink } = useLinks();

  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [domain, setDomain] = useState('minilinks.com');
  const [expiresAt, setExpiresAt] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const parsed = new URL(originalUrl);
      if (!parsed.protocol.startsWith('http')) {
        throw new Error('Please enter a valid http/https URL.');
      }

      const created = createLink({
        originalUrl,
        alias,
        domain,
        expiresAt,
        passwordProtected,
        utmSource,
        utmMedium,
        utmCampaign,
      });

      navigate(`/links/${created.id}`);
    } catch {
      setErrorMessage('Please enter a valid destination URL.');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Create Branded Link</h1>
        <p className="text-sm text-slate-500">Configure custom domains, aliases, and redirect settings.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Destination URL</label>
          <div className="relative">
            <input
              type="url"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/path/to/destination"
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
            <LinkIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Custom Alias</label>
              <span className="text-[11px] text-slate-400">{alias.length} / 20</span>
            </div>
            <div className="flex items-center bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <span className="text-slate-500 text-xs font-medium mr-1">{domain}/</span>
              <input
                type="text"
                maxLength={20}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-custom-link"
                className="w-full bg-transparent outline-none text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            >
              <option value="minilinks.com">minilinks.com</option>
              <option value="lp.at">lp.at</option>
              <option value="m-lnk.io">m-lnk.io</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Link Expiry (Optional)</label>
            <div className="relative">
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Password Protection</label>
              <p className="text-xs text-slate-400 mt-0.5">Restrict access with a passphrase key.</p>
            </div>
            <button
              type="button"
              onClick={() => setPasswordProtected((prev) => !prev)}
              className={`w-11 h-6 rounded-full relative transition-colors ${passwordProtected ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${passwordProtected ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">UTM Campaign Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="utm_source (e.g. twitter)" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
            <input value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="utm_medium (e.g. social)" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
            <input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="utm_campaign (e.g. launch)" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
          </div>
        </section>

        {errorMessage && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700 font-medium">
            {errorMessage}
          </p>
        )}

        <footer className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all">
            Shorten Link
          </button>
          <button type="button" onClick={() => navigate('/links')} className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg transition-all text-sm">
            Cancel
          </button>
        </footer>
      </form>
    </div>
  );
}
