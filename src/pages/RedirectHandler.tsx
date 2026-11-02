import { useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import { DEFAULT_SHORTEN_REDIRECT_BASE } from '../lib/shortenApi';
import { isReservedRoute } from '../lib/reservedRoutes';

export default function RedirectHandler() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const isReserved = Boolean(shortCode && isReservedRoute(shortCode));
  const hasValidCode = Boolean(shortCode && !isReserved);

  const redirectBase =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_SHORTEN_REDIRECT_BASE) ||
    DEFAULT_SHORTEN_REDIRECT_BASE;

  const targetBackendUrl = shortCode
    ? `${redirectBase.replace(/\/+$/, '')}/${encodeURIComponent(shortCode)}`
    : '';

  useEffect(() => {
    if (hasValidCode && targetBackendUrl) {
      window.location.replace(targetBackendUrl);
    }
  }, [hasValidCode, targetBackendUrl]);

  // If the parameter matches a reserved web application route, navigate directly to it
  if (isReserved && shortCode) {
    return <Navigate to={`/${shortCode}`} replace />;
  }

  // If empty or no short code, go to home
  if (!shortCode) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Redirecting...
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Taking you to your destination via Mini-Links.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
          <a
            href={targetBackendUrl}
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 py-2 transition"
          >
            <span>If you are not redirected automatically, click here</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 py-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Mini-Links Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
