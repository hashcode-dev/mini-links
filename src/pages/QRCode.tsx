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
  const [fgColor, setFgColor] = useState('#131b2e');
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
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">QR Code Workshop</h1>
        <p className="text-sm text-slate-500">Design dynamic, high-definition vector QR codes for print and web.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Target URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter destination URL here..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
            {selectedLink && (
              <p className="text-xs text-slate-500 mt-1">
                Preloaded from link: <span className="font-mono text-blue-600 font-medium">{selectedLink.shortUrl}</span>
              </p>
            )}
          </div>

          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="p-6 rounded-2xl shadow-md border border-slate-200 transition-all duration-300" style={{ backgroundColor: bgColor }}>
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

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Settings2 size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Customization</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">Foreground Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" />
                  <span className="text-sm font-mono text-slate-700 font-medium">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">Background Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" />
                  <span className="text-sm font-mono text-slate-700 font-medium">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">Resolution Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value={128}>Small (128x128 px)</option>
                  <option value={256}>Medium (256x256 px)</option>
                  <option value={512}>Large (512x512 px)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-3">
              <button type="button" onClick={downloadSvg} className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-2 text-sm">
                <Download size={16} /> Download SVG
              </button>
              <button type="button" onClick={downloadPng} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm text-sm">
                <ImageIcon size={16} /> Download PNG (HD)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
