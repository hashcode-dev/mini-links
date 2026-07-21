import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Link as LinkIcon } from 'lucide-react';
import { useLinks } from '../context/LinksContext';
import InputField from '../components/InputField';

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
      setErrorMessage('Please enter a valid destination URL (e.g. https://example.com).');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Create Branded Link
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Configure custom domains, alias paths, and UTM redirect campaign parameters.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination URL Card */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-2">
          <label htmlFor="destination-url" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Destination URL *
          </label>
          <div className="relative">
            <input
              id="destination-url"
              type="url"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/path/to/destination"
              className="w-full min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
            <LinkIcon size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400" />
          </div>
        </section>

        {/* Alias & Domain Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="custom-alias" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Custom Alias
              </label>
              <span className="text-[11px] text-slate-400">{alias.length} / 20</span>
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-700 min-h-[44px]">
              <span className="text-slate-500 text-xs font-medium mr-1 select-none">{domain}/</span>
              <input
                id="custom-alias"
                type="text"
                maxLength={20}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-custom-link"
                className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-2">
            <label htmlFor="domain-select" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Domain
            </label>
            <select
              id="domain-select"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
            >
              <option value="minilinks.com">minilinks.com</option>
              <option value="lp.at">lp.at</option>
              <option value="m-lnk.io">m-lnk.io</option>
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-2">
            <label htmlFor="expiry-date" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Link Expiry (Optional)
            </label>
            <div className="relative">
              <input
                id="expiry-date"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
              />
              <Calendar size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password Protection
              </label>
              <p className="text-xs text-slate-400 mt-0.5">Restrict redirect access with a key phrase.</p>
            </div>
            <button
              type="button"
              onClick={() => setPasswordProtected((prev) => !prev)}
              className={`w-12 h-6 rounded-full relative transition-colors ${passwordProtected ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              aria-label="Toggle password protection"
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${passwordProtected ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* UTM Parameters Section */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-4">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">UTM Campaign Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="utm-source"
              label="UTM Source"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              placeholder="e.g. twitter"
            />
            <InputField
              id="utm-medium"
              label="UTM Medium"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              placeholder="e.g. social"
            />
            <InputField
              id="utm-campaign"
              label="UTM Campaign"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="e.g. launch_2026"
            />
          </div>
        </section>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Submit Actions */}
        <footer className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span>Shorten & Save Link</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/links')}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center"
          >
            Cancel
          </button>
        </footer>
      </form>
    </div>
  );
}
