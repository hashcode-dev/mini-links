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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[620px] flex items-center px-6 lg:px-12 py-10 overflow-hidden bg-surface-container-low dark:bg-navy">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cta rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left: Headline Content */}
          <div className="space-y-5">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold text-primary dark:text-teal-400 tracking-widest uppercase">Precision URL Management</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-navy dark:text-white">
              Shorten. <br/><span className="text-primary dark:text-teal-400">Brand.</span> <br/>Track.
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Transform lengthy, cluttered links into powerful marketing<br/>
              assets. Mini Links provides the architectural<br/>
              precision your digital presence demands.
            </p>
            <div className="flex items-center gap-5">
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
            <div className="bg-white dark:bg-navy-light rounded-lg overflow-visible">
              {/* Tabs */}
              <div className="flex gap-2 p-2.5 bg-slate-100/80 dark:bg-navy/60 rounded-t-lg">
                <button
                  onClick={() => setActiveTab('shorten')}
                  className={`flex-1 py-2.5 px-3.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === 'shorten'
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-900/20'
                      : 'bg-white dark:bg-navy-light text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700'
                  }`}
                >
                  Shorten a Link
                </button>
                <button 
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-2.5 px-3.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === 'qr'
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-900/20'
                      : 'bg-white dark:bg-navy-light text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700'
                  }`}
                >
                  Generate QR Code
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 flex flex-col h-[430px]">
                {activeTab === 'shorten' ? shortenedUrl ? (
                  <div className="space-y-3 animate-in fade-in zoom-in duration-300 flex flex-col h-full overflow-visible">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Long URL</label>
                      <div className="h-[50px] px-4 bg-slate-50 dark:bg-navy border border-slate-100 dark:border-slate-700 rounded-lg flex items-center">
                        <span className="text-slate-700 dark:text-slate-300 text-sm truncate block w-full" title={longUrl}>{longUrl}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short URL</label>
                      <div className="h-[50px] px-4 bg-teal-50/70 border border-teal-200 dark:bg-teal-900/20 dark:border-teal-800 rounded-lg flex items-center justify-between gap-2">
                        <span className="font-mono text-teal-700 dark:text-teal-400 font-bold text-sm truncate" title={`https://${shortenedUrl}`}>{`https://${shortenedUrl}`}</span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors shrink-0"
                          title="Copy URL"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mini Links may earn commissions from this link. <a href="#" className="underline">Learn more.</a>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      <button type="button" onClick={handleVisitShortUrl} className="py-2.5 bg-[#0f7d98] hover:bg-[#0d6d85] text-white rounded-lg font-bold transition-colors text-sm">
                        Visit URL
                      </button>
                      <div ref={qrPopoverRef} className="relative">
                        <button type="button" onClick={handleOpenQrTabFromShorten} className="w-full py-2.5 bg-[#0f7d98] hover:bg-[#0d6d85] text-white rounded-lg font-bold transition-colors text-sm">
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
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                  <Download size={13} />
                                  Download SVG (Best for print)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadSvgAsPng(qrModalSvgRef.current, 'mini-links-qr-hd.png')}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors"
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
                      <button type="button" onClick={handleShareShortUrl} className="py-2.5 bg-[#0f7d98] hover:bg-[#0d6d85] text-white rounded-lg font-bold transition-colors text-sm">
                        Share
                      </button>
                      <button type="button" onClick={handleCopy} className="py-2.5 bg-[#062f57] hover:bg-[#052748] text-white rounded-lg font-bold transition-colors text-sm">
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <button 
                      onClick={() => { setShortenedUrl(''); setShowQrModal(false); }}
                      className="w-full py-2.5 bg-cta hover:bg-cta-dark text-white rounded-lg font-bold transition-colors mt-auto"
                    >
                      Shorten Another Link
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleShorten} className="space-y-4 flex flex-col h-full overflow-hidden">
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

                    <div className="space-y-3 pt-1.5">
                      <button
                        type="submit"
                        disabled={isShortening}
                        className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-bold transition-colors"
                          >
                            <Download size={13} />
                            Download SVG (Best for print)
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadSvgAsPng(qrTabSvgRef.current, 'mini-links-generated-qr-hd.png')}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-bold transition-colors"
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
                      className="w-full py-2.5 bg-cta hover:bg-cta-dark text-white rounded-lg font-bold transition-colors shrink-0"
                    >
                      Generate Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGenerateQr} className="space-y-4 flex flex-col h-full overflow-hidden">
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

                    <div className="space-y-3 pt-1.5">
                      <button
                        type="submit"
                        disabled={isQrCreating}
                        className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
      <section id="features" className="bg-surface-container-lowest dark:bg-navy-light py-12 px-6 border-t border-surface-container-high dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
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
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Icon</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Short Link</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Original URL</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high dark:divide-slate-700">
                  {recentGeneratedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-surface-container-low/50 dark:hover:bg-navy-light/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded bg-surface-container-lowest dark:bg-navy border border-surface-container-high dark:border-slate-700 p-1 flex items-center justify-center">
                          <LinkIcon size={14} className="text-slate-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-primary dark:text-teal-400 font-bold font-mono text-sm">{link.shortUrl}</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(`https://${link.shortUrl}`)}
                            className="text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
                            title="Copy short link"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-xs block">{link.originalUrl}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(link.originalUrl, '_blank', 'noopener,noreferrer')}
                            className="p-2 rounded bg-surface-container-low dark:bg-navy text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 hover:bg-primary/10 transition-all"
                            title="Open destination"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(`https://${link.shortUrl}`)}
                            className="p-2 rounded bg-surface-container-low dark:bg-navy text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 hover:bg-primary/10 transition-all"
                            title="Copy short link"
                          >
                            <QrCode size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareRecentLink(link.shortUrl)}
                            className="p-2 rounded bg-surface-container-low dark:bg-navy text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 hover:bg-primary/10 transition-all"
                            title="Share short link"
                          >
                            <Share2 size={18} />
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

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-navy-light w-full py-6 mt-auto border-t border-surface-container-high dark:border-slate-800">
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
