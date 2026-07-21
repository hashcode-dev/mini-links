import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Zap, QrCode, Copy, Check, Download, X, BarChart3 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLinks } from '../context/LinksContext';
import { isAuthenticated } from '../lib/auth';
import ResultBox from '../components/ResultBox';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'shorten' | 'qr'>('shorten');
  const [isShortening, setIsShortening] = useState(false);
  const [isQrCreating, setIsQrCreating] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [domain] = useState('minilinks.com');
  const [qrLongUrl, setQrLongUrl] = useState('');
  const [qrAlias, setQrAlias] = useState('');
  const [qrDomain] = useState('minilinks.com');
  const [qrShortUrl, setQrShortUrl] = useState('');
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
    }, 400);
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
    }, 400);
  };

  const handleGenerateAnotherQr = () => {
    setQrLongUrl('');
    setQrAlias('');
    setQrShortUrl('');
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

  const applyPreset = (presetUrl: string) => {
    setLongUrl(presetUrl);
    setQrLongUrl(presetUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff]">
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 py-12 lg:py-20 px-4 md:px-8 bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Headline */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              URL Shortener, Branded Links & <span className="text-blue-600">Analytics</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
              Simplifying link management with enterprise edge redirection, custom branded domains, and dynamic QR codes.
            </p>

            {/* Metric Summary row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <ResultBox label="Active Links" value="1.2M+" colorClass="text-blue-600 font-display font-bold" />
              <ResultBox label="Click Velocity" value="99.9%" colorClass="text-purple-600 font-display font-bold" />
              <ResultBox label="QR Engine" value="HD SVG" colorClass="text-emerald-600 font-display font-bold" />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <Link
                to="/pricing"
                className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <span>View Plans</span>
                <Zap size={16} />
              </Link>
              <a
                href="#features"
                className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Right Interactive Tool Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => setActiveTab('shorten')}
                  className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                    activeTab === 'shorten'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon size={16} />
                  <span>Shorten Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                    activeTab === 'qr'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode size={16} />
                  <span>Generate QR Code</span>
                </button>
              </div>

              {/* Card Form Body */}
              <div className="p-6">
                {/* Quick Preset Pills */}
                <div className="mb-4 flex items-center space-x-2 overflow-x-auto pb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyPreset('https://github.com/facebook/react')}
                    className="px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shrink-0"
                  >
                    React Repo
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('https://developer.mozilla.org/en-US/docs/Web/JavaScript')}
                    className="px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shrink-0"
                  >
                    MDN Docs
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('https://tailwindcss.com/docs')}
                    className="px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shrink-0"
                  >
                    Tailwind CSS
                  </button>
                </div>

                {activeTab === 'shorten' ? (
                  shortenedUrl ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Original Long URL</label>
                        <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-slate-900 text-sm truncate block" title={longUrl}>{longUrl}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Shortened Link</label>
                        <div className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2">
                          <span className="font-mono text-blue-600 font-bold text-sm truncate">{`https://${shortenedUrl}`}</span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="text-slate-500 hover:text-blue-600 transition-colors shrink-0"
                            aria-label="Copy short link"
                          >
                            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                        <button type="button" onClick={handleVisitShortUrl} className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all">
                          Visit
                        </button>
                        <div ref={qrPopoverRef} className="relative">
                          <button type="button" onClick={handleOpenQrTabFromShorten} className="w-full min-h-[44px] px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all">
                            QR Code
                          </button>
                          {showQrModal && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-[280px] bg-white rounded-2xl card-shadow border border-slate-200 p-4">
                              <div className="flex gap-3 items-center mb-3">
                                <QRCodeSVG ref={qrModalSvgRef} value={`https://${shortenedUrl}`} size={80} level="M" />
                                <div className="space-y-1">
                                  <h4 className="font-display text-xs font-bold text-slate-900">QR Code Ready</h4>
                                  <button
                                    type="button"
                                    onClick={() => downloadSvgAsPng(qrModalSvgRef.current, 'mini-links-qr.png')}
                                    className="w-full px-2 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
                                  >
                                    <Download size={12} /> Save PNG
                                  </button>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowQrModal(false)}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <button type="button" onClick={handleShareShortUrl} className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all">
                          Share
                        </button>
                        <button type="button" onClick={handleCopy} className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all">
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setShortenedUrl(''); setShowQrModal(false); }}
                        className="w-full min-h-[44px] py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all mt-2"
                      >
                        Shorten Another URL
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleShorten} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Destination URL</label>
                        <input
                          type="url"
                          required
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          placeholder="Paste long URL (e.g., https://example.com/long-page)"
                          className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Domain</label>
                          <input
                            type="text"
                            value={domain}
                            readOnly
                            className="w-full min-h-[44px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm cursor-default"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Custom Alias (optional)</label>
                          <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="e.g. promo2026"
                            className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isShortening}
                        className="w-full min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      >
                        {isShortening ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span>Shorten Link</span>
                        )}
                      </button>
                    </form>
                  )
                ) : (
                  qrShortUrl ? (
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <QRCodeSVG ref={qrTabSvgRef} value={`https://${qrShortUrl}`} size={120} level="M" />
                        <div className="space-y-2">
                          <h4 className="font-display text-sm font-bold text-slate-900">QR Code Generated</h4>
                          <div className="flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => downloadSvgAsFile(qrTabSvgRef.current, 'mini-links-qr.svg')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 justify-center"
                            >
                              <Download size={13} /> Download SVG
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadSvgAsPng(qrTabSvgRef.current, 'mini-links-qr.png')}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 justify-center"
                            >
                              <Download size={13} /> Download HD PNG
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAnotherQr}
                        className="w-full min-h-[44px] py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all"
                      >
                        Generate Another Code
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleGenerateQr} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Destination URL</label>
                        <input
                          type="url"
                          required
                          value={qrLongUrl}
                          onChange={(e) => setQrLongUrl(e.target.value)}
                          placeholder="Paste URL for QR code generation"
                          className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Domain</label>
                          <input
                            type="text"
                            value={qrDomain}
                            readOnly
                            className="w-full min-h-[44px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm cursor-default"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Alias (optional)</label>
                          <input
                            type="text"
                            value={qrAlias}
                            onChange={(e) => setQrAlias(e.target.value)}
                            placeholder="Add custom alias"
                            className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isQrCreating}
                        className="w-full min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      >
                        {isQrCreating ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span>Generate QR Code</span>
                        )}
                      </button>
                    </form>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Links Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Recent Links</h2>
          {isUserAuthenticated && (
            <Link to="/links" className="text-sm font-semibold text-blue-600 hover:underline">
              View All Links &rarr;
            </Link>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Icon</th>
                  <th className="px-6 py-3.5">Short Link</th>
                  <th className="px-6 py-3.5">Original URL</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentGeneratedLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        {getFaviconUrl(link.originalUrl) && !failedFaviconIds[link.id] ? (
                          <img
                            src={getFaviconUrl(link.originalUrl) || undefined}
                            alt="Favicon"
                            className="w-5 h-5 rounded-sm object-contain"
                            onError={() => setFailedFaviconIds((prev) => ({ ...prev, [link.id]: true }))}
                          />
                        ) : (
                          <LinkIcon size={14} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-semibold text-blue-600">
                      {link.shortUrl}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 truncate max-w-xs">
                      {link.originalUrl}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => window.open(link.originalUrl, '_blank', 'noopener,noreferrer')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Visit
                        </button>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(`https://${link.shortUrl}`)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentGeneratedLinks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                      No recent links created yet. Use the form above to shorten a link.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Speed & Scannability
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete suite of link management tools built with precision elevation design tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow card-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <LinkIcon size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-1">Branded Short Links</h3>
            <p className="text-sm text-slate-500 mb-6">
              Increase click-through rates by up to 34% using custom domains and memo aliases.
            </p>
            <Link to="/links/new" className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
              <span>Create Link</span>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow card-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <QrCode size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-1">Dynamic QR Engine</h3>
            <p className="text-sm text-slate-500 mb-6">
              Vector SVG & HD PNG generation with instant target URL editing capabilities.
            </p>
            <Link to="/qr" className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
              <span>Generate QR</span>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-1">Real-time Analytics</h3>
            <p className="text-sm text-slate-500 mb-6">
              Track country metrics, device breakdowns, and daily click momentum instantly.
            </p>
            <Link to="/dashboard" className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
