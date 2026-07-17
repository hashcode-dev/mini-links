import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Zap, ArrowRight, ExternalLink, QrCode, Share2, Copy, Check, Download, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLinks } from '../context/LinksContext';
import { isAuthenticated } from '../lib/auth';

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
  const [showQrModal, setShowQrModal] = useState(false);
  const [failedFaviconIds, setFailedFaviconIds] = useState<Record<string, boolean>>({});
  const qrTabSvgRef = useRef<SVGSVGElement | null>(null);
  const qrModalSvgRef = useRef<SVGSVGElement | null>(null);
  const qrPopoverRef = useRef<HTMLDivElement | null>(null);
  const { createLink, links, recentLinks } = useLinks();
  const isUserAuthenticated = isAuthenticated();
  const recentGeneratedLinks = (isUserAuthenticated ? links : recentLinks)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const normalizeUrl = (rawUrl: string): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      throw new Error('URL is required.');
    }

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    new URL(candidate);
    return candidate;
  };

  const getFaviconUrl = (url: string): string | null => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return null;
    }
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
    setShowQrModal((prev) => !prev);
  };

  useEffect(() => {
    if (!showQrModal) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (qrPopoverRef.current?.contains(event.target as Node)) {
        return;
      }
      setShowQrModal(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showQrModal]);

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
    navigator.clipboard.writeText(`https://${qrShortUrl}`);
    setCopiedQrUrl(true);
    setTimeout(() => setCopiedQrUrl(false), 2000);
  };

  const handleShareRecentLink = async (shortUrl: string) => {
    const shareUrl = `https://${shortUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl, title: 'Mini Link' });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Ignore share cancel/errors.
    }
  };

  const HIGH_DEFINITION_QR_PNG_SIZE = 2048;

  const downloadSvgAsPng = (svgElement: SVGSVGElement | null, fileName: string, exportSize = HIGH_DEFINITION_QR_PNG_SIZE) => {
    if (!svgElement) {
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = exportSize;
      canvas.height = exportSize;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      context.imageSmoothingEnabled = false;
      context.drawImage(image, 0, 0, exportSize, exportSize);
      URL.revokeObjectURL(objectUrl);

      const png = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = png;
      link.download = fileName;
      link.click();
    };

    image.src = objectUrl;
  };

  const downloadSvgAsFile = (svgElement: SVGSVGElement | null, fileName: string) => {
    if (!svgElement) {
      return;
    }
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="relative min-h-[620px] flex items-center px-6 lg:px-12 py-10 overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary-light rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left: Headline Content */}
          <div className="space-y-5">
            <h1 className="text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-white">
              URL Shortener, Branded Short Links & Analytics
            </h1>
            <p className="text-lg text-text-muted max-w-xl leading-relaxed">
              Welcome to the original link shortener — simplifying the Internet through the power of the URL since 2002.
            </p>
            <p className="text-lg text-text-muted max-w-xl leading-relaxed">
              You can use branded domains for fully custom links, track link analytics, and enjoy other powerful features with our paid plans.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-white text-navy font-bold rounded-lg hover:bg-gray-100 transition-colors">
              View Plans
            </button>
          </div>

          {/* Right: Widget Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-visible">
              {/* Tabs */}
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab('shorten')}
                  className={`flex-1 py-3 px-6 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'shorten'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-navy hover:bg-gray-200'
                  }`}
                >
                  <LinkIcon size={18} />
                  Shorten a Link
                </button>
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-3 px-6 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'qr'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-navy hover:bg-gray-200'
                  }`}
                >
                  <QrCode size={18} />
                  Generate QR Code
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 flex flex-col h-auto">
                {activeTab === 'shorten' ? shortenedUrl ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300 flex flex-col">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy">Long URL</label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg flex items-center">
                        <span className="text-navy text-sm truncate block w-full" title={longUrl}>{longUrl}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy">Short URL</label>
                      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-2">
                        <span className="font-mono text-blue-600 font-bold text-sm truncate" title={`https://${shortenedUrl}`}>{`https://${shortenedUrl}`}</span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="text-gray-600 hover:text-navy transition-colors shrink-0"
                          title="Copy URL"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
                      <button type="button" onClick={handleVisitShortUrl} className="py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-bold transition-all text-sm">
                        Visit URL
                      </button>
                      <div ref={qrPopoverRef} className="relative">
                        <button type="button" onClick={handleOpenQrTabFromShorten} className="w-full py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-bold transition-all text-sm">
                          QR
                        </button>
                        {showQrModal && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-[280px] bg-white dark:bg-navy-light rounded-xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                            {/* Subscribe banner */}
                            <div className="bg-teal-50 dark:bg-teal-900/30 border-b border-teal-100 dark:border-teal-800 px-4 py-3">
                              <p className="text-xs text-center text-slate-700 dark:text-slate-300 leading-relaxed">
                                Want to generate a QR code without the logo? <Link to="/pricing" className="text-primary dark:text-teal-400 font-bold hover:underline">Subscribe now.</Link>
                              </p>
                            </div>
                            {/* QR content */}
                            <div className="p-5 flex gap-4 items-start">
                              <div className="bg-white p-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shrink-0">
                                <QRCodeSVG ref={qrModalSvgRef} value={`https://${shortenedUrl}`} size={90} level="M" imageSettings={{ src: '/favicon.ico', height: 20, width: 20, excavate: true }} />
                              </div>
                              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-navy dark:text-white leading-tight">Download Your QR Code</h4>
                                <button
                                  type="button"
                                  onClick={() => downloadSvgAsFile(qrModalSvgRef.current, 'mini-links-qr.svg')}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-xs font-bold transition-all"
                                >
                                  <Download size={13} />
                                  Download SVG
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadSvgAsPng(qrModalSvgRef.current, 'mini-links-qr-hd.png')}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-xs font-bold transition-all"
                                >
                                  <Download size={13} />
                                  Download PNG (HD)
                                </button>
                              </div>
                            </div>
                            {/* Close button */}
                            <button
                              type="button"
                              onClick={() => setShowQrModal(false)}
                              className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={handleShareShortUrl} className="py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-bold transition-all text-sm">
                        Share
                      </button>
                      <button type="button" onClick={handleCopy} className="py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold transition-all text-sm">
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <button
                      onClick={() => { setShortenedUrl(''); setShowQrModal(false); }}
                      className="w-full py-3 bg-success hover:bg-success-dark text-white rounded-lg font-bold transition-all mt-4"
                    >
                      Shorten Another Link
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleShorten} className="space-y-4 flex flex-col h-auto">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy flex items-center gap-1">
                        <LinkIcon size={16} />
                        Long URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="Paste long URL here"
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-navy transition-all placeholder:text-gray-500 outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy flex items-center gap-1">
                          <span>🌐</span>
                          Domain
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={domain}
                            readOnly
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy font-medium outline-none text-sm cursor-default"
                          />
                          <span className="text-gray-400">/</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy flex items-center gap-1">
                          ✎ Alias (optional)
                        </label>
                        <input
                          type="text"
                          value={alias}
                          onChange={(e) => setAlias(e.target.value)}
                          placeholder="Add alias here"
                          className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-navy transition-all placeholder:text-gray-500 outline-none text-sm"
                        />
                        <p className="text-xs text-gray-500">Must be at least 5 characters</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        type="submit"
                        disabled={isShortening}
                        className="w-full py-3 bg-success hover:bg-success-dark text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isShortening ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <span>Shorten Link</span>
                        )}
                      </button>
                      
                      <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
                      By clicking Shorten Link, you agree to Mini Links' <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
                      </p>
                    </div>
                  </form>
                ) : qrShortUrl ? (
                  <div className="animate-in fade-in zoom-in duration-300 h-full min-h-0 flex flex-col gap-3">
                    <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                      <div className="flex gap-4 items-start">
                        <div className="bg-white p-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shrink-0">
                          <QRCodeSVG ref={qrTabSvgRef} value={`https://${qrShortUrl}`} size={132} level="M" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="text-[15px] font-bold text-navy dark:text-white leading-tight text-center">Download Your QR Code</h4>
                          <button
                            type="button"
                            onClick={() => downloadSvgAsFile(qrTabSvgRef.current, 'mini-links-generated-qr.svg')}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-sm font-bold transition-all"
                          >
                            <Download size={13} />
                            Download SVG
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadSvgAsPng(qrTabSvgRef.current, 'mini-links-generated-qr-hd.png')}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-sm font-bold transition-all"
                          >
                            <Download size={13} />
                            Download PNG (HD)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <span className="min-w-[120px] font-semibold text-slate-700 dark:text-slate-200">Destination URL</span>
                          <span className="text-slate-700 dark:text-slate-300 truncate" title={qrLongUrl}>{qrLongUrl}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="min-w-[120px] font-semibold text-slate-700 dark:text-slate-200">Mini Links Link</span>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-slate-700 dark:text-slate-300 truncate" title={`https://${qrShortUrl}`}>{`https://${qrShortUrl}`}</span>
                            <button
                              type="button"
                              onClick={handleCopyQrUrl}
                              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-teal-400 transition-colors shrink-0"
                              title="Copy Mini Links"
                            >
                              {copiedQrUrl ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Mini Links may earn commissions from this link. <a href="#" className="underline">Learn more.</a>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAnotherQr}
                      className="w-full py-3 bg-success hover:bg-success-dark text-white rounded-lg font-bold transition-all"
                    >
                      Generate Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGenerateQr} className="space-y-4 flex flex-col h-auto">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy flex items-center gap-1">
                        <LinkIcon size={16} />
                        Destination URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={qrLongUrl}
                        onChange={(e) => setQrLongUrl(e.target.value)}
                        placeholder="Paste long URL here"
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-navy transition-all placeholder:text-gray-500 outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy flex items-center gap-1">
                          🌐 Domain
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={qrDomain}
                            readOnly
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy font-medium outline-none text-sm cursor-default"
                          />
                          <span className="text-gray-400">/</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy flex items-center gap-1">
                          ✎ Alias (optional)
                        </label>
                        <input
                          type="text"
                          value={qrAlias}
                          onChange={(e) => setQrAlias(e.target.value)}
                          placeholder="Add alias here"
                          className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-navy transition-all placeholder:text-gray-500 outline-none text-sm"
                        />
                        <p className="text-xs text-gray-500">Must be at least 5 characters</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        type="submit"
                        disabled={isQrCreating}
                        className="w-full py-3 bg-success hover:bg-success-dark text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isQrCreating ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <span>Generate QR Code</span>
                        )}
                      </button>

                      <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
                        By clicking Generate QR Code, you agree to Mini Links' <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
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
      <section id="features" className="bg-navy py-12 px-6 border-t border-navy-light/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-white mb-2">Your Recent Links:</h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-bold text-navy">Icon</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy">Short Link</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy">Original URL</th>
                    <th className="px-6 py-4 text-sm font-bold text-navy text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentGeneratedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 p-1 flex items-center justify-center">
                          {getFaviconUrl(link.originalUrl) && !failedFaviconIds[link.id] ? (
                            <img
                              src={getFaviconUrl(link.originalUrl) || undefined}
                              alt="Website favicon"
                              className="w-full h-full object-contain rounded-sm"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={() => setFailedFaviconIds((prev) => ({ ...prev, [link.id]: true }))}
                            />
                          ) : (
                            <LinkIcon size={14} className="text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary font-bold font-mono text-sm">{link.shortUrl}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm truncate max-w-xs block">{link.originalUrl}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(link.originalUrl, '_blank', 'noopener,noreferrer')}
                            className="p-2 rounded bg-primary hover:bg-primary-light text-white transition-all text-xs font-bold flex items-center gap-1"
                            title="Visit URL"
                          >
                            <ExternalLink size={16} />
                            Visit URL
                          </button>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(`https://${link.shortUrl}`)}
                            className="p-2 rounded bg-primary hover:bg-primary-light text-white transition-all text-xs font-bold flex items-center gap-1"
                            title="QR"
                          >
                            <QrCode size={16} />
                            QR
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareRecentLink(link.shortUrl)}
                            className="p-2 rounded bg-primary hover:bg-primary-light text-white transition-all text-xs font-bold flex items-center gap-1"
                            title="Share"
                          >
                            <Share2 size={16} />
                            Share
                          </button>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(`https://${link.shortUrl}`)}
                            className="p-2 rounded bg-gray-800 hover:bg-gray-900 text-white transition-all text-xs font-bold flex items-center gap-1"
                            title="Copy"
                          >
                            <Copy size={16} />
                            Copy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recentGeneratedLinks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        No recent links yet. Shorten a URL to see it here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
