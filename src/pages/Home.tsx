import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Zap, ArrowRight, ExternalLink, QrCode, Share2, Copy, Check, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLinks } from '../context/LinksContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'shorten' | 'qr'>('shorten');
  const [isShortening, setIsShortening] = useState(false);
  const [isQrCreating, setIsQrCreating] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [domain, setDomain] = useState('minilinks.com');
  const [qrLongUrl, setQrLongUrl] = useState('');
  const [qrAlias, setQrAlias] = useState('');
  const [qrDomain, setQrDomain] = useState('minilinks.com');
  const [qrShortUrl, setQrShortUrl] = useState('');
  const [copiedQrUrl, setCopiedQrUrl] = useState(false);
  const qrTabSvgRef = useRef<SVGSVGElement | null>(null);
  const { createLink } = useLinks();

  const normalizeUrl = (rawUrl: string): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      throw new Error('URL is required.');
    }

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    new URL(candidate);
    return candidate;
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    setIsShortening(true);
    setTimeout(() => {
      try {
        const validUrl = normalizeUrl(longUrl);
        const link = createLink({
          originalUrl: validUrl,
          alias,
          domain,
        });
        setShortenedUrl(link.shortUrl);
      } finally {
        setIsShortening(false);
      }
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shortenedUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisitShortUrl = () => {
    window.open(`https://${shortenedUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareShortUrl = async () => {
    const shareUrl = `https://${shortenedUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl, title: 'Mini Link' });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore share cancel/errors.
    }
  };

  const handleOpenQrTabFromShorten = () => {
    setQrShortUrl(shortenedUrl);
    setActiveTab('qr');
  };

  const handleGenerateQr = (e: React.FormEvent) => {
    e.preventDefault();
    setIsQrCreating(true);
    setTimeout(() => {
      try {
        const validUrl = normalizeUrl(qrLongUrl);
        const link = createLink({
          originalUrl: validUrl,
          alias: qrAlias,
          domain: qrDomain,
        });
        setQrShortUrl(link.shortUrl);
      } finally {
        setIsQrCreating(false);
      }
    }, 500);
  };

  const handleGenerateAnotherQr = () => {
    setQrLongUrl('');
    setQrAlias('');
    setQrShortUrl('');
  };

  const handleCopyQrUrl = () => {
    navigator.clipboard.writeText(qrShortUrl);
    setCopiedQrUrl(true);
    setTimeout(() => setCopiedQrUrl(false), 2000);
  };

  const downloadSvgAsPng = (svgElement: SVGSVGElement | null, fileName: string) => {
    if (!svgElement) {
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    const image = new Image();
    const size = 220;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      context.drawImage(image, 0, 0, size, size);
      URL.revokeObjectURL(objectUrl);

      const png = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = png;
      link.download = fileName;
      link.click();
    };

    image.src = objectUrl;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[720px] flex items-center px-6 lg:px-12 py-16 overflow-hidden bg-surface-container-low dark:bg-navy">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cta rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Headline Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold text-primary dark:text-teal-400 tracking-widest uppercase">Precision URL Management</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold font-display leading-[1.1] tracking-tight text-navy dark:text-white">
              Shorten. <br/><span className="text-primary dark:text-teal-400">Brand.</span> <br/>Track.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Transform lengthy, cluttered links into powerful marketing<br/>
              assets. Mini Links Atelier provides the architectural<br/>
              precision your digital presence demands.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-navy dark:text-white">45M+</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Links Managed</span>
              </div>
              <div className="w-px h-8 bg-surface-container-high dark:bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-navy dark:text-white">99.9%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Uptime</span>
              </div>
            </div>
          </div>

          {/* Right: Widget Card */}
          <div className="bg-white dark:bg-navy-light p-1 rounded-xl shadow-xl ring-1 ring-slate-100 dark:ring-slate-700">
            <div className="bg-white dark:bg-navy-light rounded-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-navy/50">
                <button 
                  onClick={() => setActiveTab('shorten')}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${
                    activeTab === 'shorten'
                      ? 'text-teal-700 dark:text-teal-400 bg-white dark:bg-navy-light border-b-2 border-teal-600'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Shorten a Link
                </button>
                <button 
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'qr'
                      ? 'text-teal-700 dark:text-teal-400 bg-white dark:bg-navy-light border-b-2 border-teal-600'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Generate QR Code
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 flex flex-col">
                {activeTab === 'shorten' ? shortenedUrl ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300 flex flex-col">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">TinyURL Link</label>
                      <div className="p-4 bg-teal-50/70 border border-teal-200 dark:bg-teal-900/20 dark:border-teal-800 rounded-lg flex items-center justify-between">
                        <span className="font-mono text-teal-700 dark:text-teal-400 font-bold text-lg">{`https://${shortenedUrl}`}</span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                          title="Copy URL"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      TinyURL may earn commissions from this link. <a href="#" className="underline">Learn more.</a>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button type="button" onClick={handleVisitShortUrl} className="py-3 bg-[#0f7d98] hover:bg-[#0d6d85] text-white rounded-lg font-bold transition-colors text-sm">
                        Visit URL
                      </button>
                      <button type="button" onClick={handleOpenQrTabFromShorten} className="py-3 bg-[#0f7d98] hover:bg-[#0d6d85] text-white rounded-lg font-bold transition-colors text-sm">
                        QR
                      </button>
                      <button type="button" onClick={handleShareShortUrl} className="py-3 bg-[#0f7d98] hover:bg-[#0d6d85] text-white rounded-lg font-bold transition-colors text-sm">
                        Share
                      </button>
                      <button type="button" onClick={handleCopy} className="py-3 bg-[#062f57] hover:bg-[#052748] text-white rounded-lg font-bold transition-colors text-sm">
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <button 
                      onClick={() => setShortenedUrl('')}
                      className="w-full py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-bold transition-colors mt-auto"
                    >
                      Shorten another link
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleShorten} className="space-y-5 flex flex-col">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Long URL</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="url" 
                          required
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          placeholder="https://very-long-architectural-url.com/destination-page" 
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded text-slate-900 dark:text-white transition-all placeholder:text-slate-300 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Domain</label>
                        <input
                          type="text"
                          value={domain}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 rounded text-slate-900 dark:text-white font-medium transition-all outline-none text-sm cursor-default"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Alias (Optional)</label>
                        <input 
                          type="text" 
                          value={alias}
                          onChange={(e) => setAlias(e.target.value)}
                          placeholder="custom-alias" 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded text-slate-900 dark:text-white transition-all placeholder:text-slate-300 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <button 
                        type="submit"
                        disabled={isShortening}
                        className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isShortening ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Shorten Link</span>
                            <Zap size={18} />
                          </>
                        )}
                      </button>
                      
                      <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
                      By clicking Shorten Link, you agree to LinkPrecision's <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
                      </p>
                    </div>
                  </form>
                ) : qrShortUrl ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300 flex flex-col">
                    <div className="p-4 bg-teal-50/70 border border-teal-200 dark:bg-teal-900/20 dark:border-teal-800 rounded-lg flex items-center justify-between">
                      <span className="font-mono text-teal-700 dark:text-teal-400 font-bold text-lg">{qrShortUrl}</span>
                      <button
                        type="button"
                        onClick={handleCopyQrUrl}
                        className="p-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors flex items-center gap-2"
                      >
                        {copiedQrUrl ? <Check size={18} /> : <Copy size={18} />}
                        <span className="text-sm font-bold">{copiedQrUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-navy flex flex-col items-center gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <QRCodeSVG ref={qrTabSvgRef} value={`https://${qrShortUrl}`} size={220} level="M" />
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadSvgAsPng(qrTabSvgRef.current, 'mini-links-generated-qr.png')}
                        className="px-4 py-2 bg-white dark:bg-navy-light text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download QR PNG
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAnotherQr}
                      className="w-full py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-bold transition-colors mt-auto"
                    >
                      Generate another QR for another link
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGenerateQr} className="space-y-5 flex flex-col">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Long URL</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="url"
                          required
                          value={qrLongUrl}
                          onChange={(e) => setQrLongUrl(e.target.value)}
                          placeholder="https://very-long-architectural-url.com/destination-page"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded text-slate-900 dark:text-white transition-all placeholder:text-slate-300 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Domain</label>
                        <input
                          type="text"
                          value={qrDomain}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 rounded text-slate-900 dark:text-white font-medium transition-all outline-none text-sm cursor-default"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Alias (Optional)</label>
                        <input
                          type="text"
                          value={qrAlias}
                          onChange={(e) => setQrAlias(e.target.value)}
                          placeholder="custom-alias"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded text-slate-900 dark:text-white transition-all placeholder:text-slate-300 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <button
                        type="submit"
                        disabled={isQrCreating}
                        className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isQrCreating ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Generate QR Code</span>
                            <Zap size={18} />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
                        By clicking Generate QR Code, you agree to LinkPrecision's <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Links Section */}
      <section className="bg-surface-container-lowest dark:bg-navy-light py-20 px-6 border-t border-surface-container-high dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-display text-navy dark:text-white mb-2">Your Recent Links</h2>
              <p className="text-slate-500 dark:text-slate-400">Instant access to your latest architectural digital bridges.</p>
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 text-primary dark:text-teal-400 font-bold hover:gap-3 transition-all">
              View Analytics <ArrowRight size={18} />
            </Link>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy rounded-xl overflow-hidden border border-surface-container-high dark:border-slate-700 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-navy-light border-b border-surface-container-high dark:border-slate-700">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Icon</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Short Link</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Original URL</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high dark:divide-slate-700">
                  {[
                    { short: 'MiniLinks.com/ux-case', original: 'https://dribbble.com/shots/2349583-Case-St...', icon: 'https://cdn.brandfetch.io/dribbble.com/w/400/h/400' },
                    { short: 'MiniLinks.com/fig-proto', original: 'https://www.figma.com/file/ASh2849AsJ/Desi...', icon: 'https://cdn.brandfetch.io/figma.com/w/400/h/400' },
                    { short: 'MiniLinks.com/pay-portal', original: 'https://stripe.com/docs/api/checkout/session...', icon: 'https://cdn.brandfetch.io/stripe.com/w/400/h/400' },
                  ].map((link, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/50 dark:hover:bg-navy-light/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="w-8 h-8 rounded bg-surface-container-lowest dark:bg-navy border border-surface-container-high dark:border-slate-700 p-1 flex items-center justify-center">
                          <img src={link.icon} alt="Favicon" className="w-full h-full object-contain rounded-sm" />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-primary dark:text-teal-400 font-bold font-mono text-sm">{link.short}</span>
                          <Copy size={14} className="text-slate-400 cursor-pointer hover:text-navy dark:hover:text-white" />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-xs block">{link.original}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded bg-surface-container-low dark:bg-navy text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 hover:bg-primary/10 transition-all">
                            <ExternalLink size={18} />
                          </button>
                          <button className="p-2 rounded bg-surface-container-low dark:bg-navy text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 hover:bg-primary/10 transition-all">
                            <QrCode size={18} />
                          </button>
                          <button className="p-2 rounded bg-surface-container-low dark:bg-navy text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 hover:bg-primary/10 transition-all">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-navy-light w-full py-8 mt-auto border-t border-surface-container-high dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-semibold text-navy dark:text-white font-display">Mini Links</span>
            <p className="text-slate-500 dark:text-slate-400 text-xs">© 2024 Mini Links Inc. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-navy dark:hover:text-white underline-offset-4 hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-navy dark:hover:text-white underline-offset-4 hover:underline transition-all">Terms of Service</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-navy dark:hover:text-white underline-offset-4 hover:underline transition-all">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
