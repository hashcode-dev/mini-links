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
  const [domain, setDomain] = useState('lp.at');
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
        <h2 className="text-3xl font-extrabold text-navy dark:text-white font-display tracking-tight">Architect a New Destination</h2>
        <p className="text-slate-500 dark:text-slate-400">Precision URL shortening with editorial analytics.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl shadow-sm border border-surface-container-high dark:border-slate-700">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 block">Paste your long URL</label>
          <div className="relative">
            <input
              type="url"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/path/to/something/important"
              className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-xl px-4 py-4 pr-12 text-base text-navy dark:text-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
            />
            <LinkIcon size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Custom Alias</label>
              <span className="text-[10px] text-slate-400">{alias.length} / 20</span>
            </div>
            <div className="flex items-center bg-surface-container-low dark:bg-navy rounded-lg px-4 py-3 border border-surface-container-high dark:border-slate-700">
              <span className="text-slate-500 text-sm mr-1">{domain}/</span>
              <input
                type="text"
                maxLength={20}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-custom-link"
                className="w-full bg-transparent outline-none text-sm text-navy dark:text-white"
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 block">Domain Selector</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-navy dark:text-white outline-none"
            >
              <option value="lp.at">lp.at</option>
              <option value="minilinks.com">minilinks.com</option>
              <option value="m-lnk.io">m-lnk.io</option>
            </select>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 block">Link Expiry (Optional)</label>
            <div className="relative">
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-navy dark:text-white outline-none"
              />
              <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password Protection</label>
              <p className="text-[10px] text-slate-400 mt-1">Restrict access with a secure key.</p>
            </div>
            <button
              type="button"
              onClick={() => setPasswordProtected((prev) => !prev)}
              className={`w-10 h-6 rounded-full relative transition-colors ${passwordProtected ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${passwordProtected ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
        </section>

        <section className="bg-surface-container-low dark:bg-navy p-6 rounded-xl border border-surface-container-high dark:border-slate-700">
          <h3 className="text-sm font-bold text-navy dark:text-white mb-4">UTM Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="Source (twitter)" className="bg-surface-container-lowest dark:bg-navy-light border border-surface-container-high dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-navy dark:text-white outline-none" />
            <input value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="Medium (social)" className="bg-surface-container-lowest dark:bg-navy-light border border-surface-container-high dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-navy dark:text-white outline-none" />
            <input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="Campaign (launch)" className="bg-surface-container-lowest dark:bg-navy-light border border-surface-container-high dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-navy dark:text-white outline-none" />
          </div>
        </section>

        {errorMessage && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        <footer className="flex flex-col md:flex-row items-center gap-4 pt-2">
          <button type="submit" className="w-full md:flex-1 bg-cta hover:bg-cta-dark text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md">
            Shorten Link
          </button>
          <button type="button" onClick={() => navigate('/links')} className="w-full md:w-auto px-8 py-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy transition-colors">
            Cancel
          </button>
        </footer>
      </form>
    </div>
  );
}
