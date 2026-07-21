import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home, BookOpen, Mail, Map } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-8">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900 shadow-sm">
        <HelpCircle size={32} />
      </div>

      <div className="space-y-3">
        <span className="px-3.5 py-1 text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-900 inline-block">
          HTTP 404 Status
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          The requested page or shortened link path does not exist on Mini-Links. It may have been deleted, mistyped, or removed due to policy non-compliance.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="min-h-[44px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Home size={16} />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/sitemap"
          className="min-h-[44px] px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
        >
          <Map size={16} />
          <span>Browse Sitemap</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <Link
          to="/about"
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all space-y-1 block group"
        >
          <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs font-bold">
            <BookOpen size={14} /> About Us
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Learn about Mini-Links infrastructure standards.</p>
        </Link>

        <Link
          to="/contact"
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all space-y-1 block group"
        >
          <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs font-bold">
            <Mail size={14} /> Contact Support
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Report broken links or submit inquiries.</p>
        </Link>

        <Link
          to="/privacy-policy"
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all space-y-1 block group"
        >
          <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs font-bold">
            <ArrowLeft size={14} /> Privacy Policy
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Read cookie & data protection disclosures.</p>
        </Link>
      </div>
    </div>
  );
}
