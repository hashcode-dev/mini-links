import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Image as ImageIcon, Settings2 } from 'lucide-react';
import { useLinks } from '../context/LinksContext';

export default function QRCode() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [searchParams] = useSearchParams();
  const { getLinkById } = useLinks();
  const selectedLinkId = searchParams.get('linkId') || '';
  const selectedLink = selectedLinkId ? getLinkById(selectedLinkId) : undefined;

  const [url, setUrl] = useState(selectedLink ? `https://${selectedLink.shortUrl}` : 'https://minilinks.com');
  const [fgColor, setFgColor] = useState('#0b1c30');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);

  const value = useMemo(() => url || 'https://minilinks.com', [url]);

  const downloadSvg = () => {
    if (!svgRef.current) {
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'mini-links-qr.svg';
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const downloadPng = () => {
    if (!svgRef.current) {
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(blobUrl);
        return;
      }
      context.drawImage(image, 0, 0, size, size);
      URL.revokeObjectURL(blobUrl);

      const png = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = png;
      link.download = 'mini-links-qr.png';
      link.click();
    };

    image.src = blobUrl;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          QR Code Workshop
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Design dynamic, high-definition vector QR codes for print, packaging, and digital media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-2">
            <label htmlFor="qr-target-url" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Target URL
            </label>
            <input
              id="qr-target-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter destination URL here..."
              className="w-full min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
            {selectedLink && (
              <p className="text-xs text-slate-500 mt-1">
                Preloaded from short URL: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{selectedLink.shortUrl}</span>
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow flex flex-col items-center justify-center min-h-[400px]">
            <div className="p-6 rounded-2xl card-shadow card-hover border border-slate-200/80 dark:border-slate-800 transition-all duration-300" style={{ backgroundColor: bgColor }}>
              <QRCodeSVG
                ref={svgRef}
                value={value}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
              />
            </div>
          </div>
        </div>

        {/* Customization Settings Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <Settings2 size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">Customization</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="fg-color" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                  Foreground Color
                </label>
                <div className="flex items-center gap-3">
                  <input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" />
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-semibold">{fgColor}</span>
                </div>
              </div>

              <div>
                <label htmlFor="bg-color" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" />
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-semibold">{bgColor}</span>
                </div>
              </div>

              <div>
                <label htmlFor="qr-resolution" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                  Resolution Size
                </label>
                <select
                  id="qr-resolution"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                >
                  <option value={128}>Small (128x128 px)</option>
                  <option value={256}>Medium (256x256 px)</option>
                  <option value={512}>Large (512x512 px)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <button
                type="button"
                onClick={downloadSvg}
                className="w-full min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download Vector SVG
              </button>
              <button
                type="button"
                onClick={downloadPng}
                className="w-full min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <ImageIcon size={16} /> Download PNG (HD)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
