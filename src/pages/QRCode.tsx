import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Image as ImageIcon, Settings2, Crown } from 'lucide-react';

export default function QRCode() {
  const [url, setUrl] = useState('https://linkprecision.com');
  const [fgColor, setFgColor] = useState('#0D1B2A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(256);
  const [includeLogo, setIncludeLogo] = useState(true);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-navy dark:text-white font-display tracking-tight">QR Code Generator</h2>
        <p className="text-slate-500 dark:text-slate-400">Create custom QR codes for your links</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Center: Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">Destination URL</label>
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL here..." 
              className="w-full px-4 py-3 bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded text-navy dark:text-white transition-all outline-none"
            />
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-12 rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 transition-all duration-300" style={{ backgroundColor: bgColor }}>
              <QRCodeSVG 
                value={url || 'https://linkprecision.com'} 
                size={size} 
                fgColor={fgColor} 
                bgColor={bgColor}
                level="H"
                imageSettings={includeLogo ? {
                  src: "https://cdn-icons-png.flaticon.com/512/281/281769.png", // Placeholder logo
                  x: undefined,
                  y: undefined,
                  height: size * 0.2,
                  width: size * 0.2,
                  excavate: true,
                } : undefined}
              />
            </div>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="space-y-6">
          {/* Upsell Banner */}
          <div className="bg-gradient-to-r from-primary to-primary-dark p-4 rounded-xl text-white shadow-md flex items-start gap-3">
            <Crown size={20} className="shrink-0 mt-0.5 text-yellow-300" />
            <div>
              <p className="text-sm font-bold">Remove LinkPrecision logo</p>
              <p className="text-xs text-white/80 mt-1">Upgrade to Pro for fully white-labeled QR codes.</p>
              <button className="mt-3 text-xs font-bold bg-white text-primary px-3 py-1.5 rounded hover:bg-surface transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-surface-container-high dark:border-slate-700 pb-4">
              <Settings2 size={18} className="text-slate-400" />
              <h3 className="font-bold text-navy dark:text-white font-display">Customization</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Foreground Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Background Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Size</label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded text-sm text-navy dark:text-white outline-none"
                >
                  <option value={128}>Small (128x128)</option>
                  <option value={256}>Medium (256x256)</option>
                  <option value={512}>Large (512x512)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Include Center Logo</label>
                <button 
                  onClick={() => setIncludeLogo(!includeLogo)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${includeLogo ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${includeLogo ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-container-high dark:border-slate-700 space-y-3">
              <button className="w-full py-2.5 bg-surface-container-low dark:bg-navy text-slate-700 dark:text-slate-300 font-bold rounded-lg border border-surface-container-high dark:border-slate-600 hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> Download SVG
              </button>
              <button className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                <ImageIcon size={16} /> Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
