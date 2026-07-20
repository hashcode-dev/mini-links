import { Link } from 'react-router-dom';
import { Link as LinkIcon, Shield, Globe, BookOpen } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-white border-t border-slate-800 py-12 px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Column 1: Brand & E-E-A-T Signal */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <LinkIcon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Mini Links
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise-grade URL redirection infrastructure and dynamic QR code metrics. Built for secure, fast, and transparent link management.
          </p>
          <div className="text-[11px] text-slate-500">
            Headquarters: Prayagraj Uttar Pradesh India
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Globe size={13} className="text-blue-500" /> Products
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">
                Pricing Plans
              </Link>
            </li>
            <li>
              <Link to="/#features" className="text-slate-400 hover:text-white transition-colors">
                Link Redirection
              </Link>
            </li>
            <li>
              <Link to="/#features" className="text-slate-400 hover:text-white transition-colors">
                Dynamic QR Engine
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <BookOpen size={13} className="text-blue-500" /> Company
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                Contact Support
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="text-slate-400 hover:text-white transition-colors">
                Directory Sitemap
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Policy */}
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Shield size={13} className="text-blue-500" /> Legal & Terms
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li className="pt-2 text-[10px] text-slate-500">
              Personalized Ad Opt-Out available via Google Ad Settings.
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[11px] text-slate-400">
          &copy; {currentYear} Mini-Links. All rights reserved.
        </p>
        <p className="text-[10px] text-slate-500 text-center sm:text-right">
          Disclaimer: Mini-Links has no affiliation with Google Inc. Google AdSense is a registered trademark of Google LLC.
        </p>
      </div>
    </footer>
  );
}
