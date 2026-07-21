import { useEffect, useState } from 'react';
import { Shield, Cookie, X, Check, Settings } from 'lucide-react';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    advertising: true,
    personalization: true,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      // Show banner if user hasn't made a choice yet
      setIsVisible(true);
    }

    // Listen for custom event triggered from Footer or Privacy Policy to re-open settings modal
    const handleReopen = () => {
      setShowSettingsModal(true);
    };

    window.addEventListener('open-cookie-settings', handleReopen);
    return () => window.removeEventListener('open-cookie-settings', handleReopen);
  }, []);

  const applyGtagConsent = (adStorage: 'granted' | 'denied', analyticsStorage: 'granted' | 'denied') => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        ad_storage: adStorage,
        ad_user_data: adStorage,
        ad_personalization: adStorage,
        analytics_storage: analyticsStorage,
      });
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'granted');
    applyGtagConsent('granted', 'granted');
    setIsVisible(false);
    setShowSettingsModal(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem('cookie-consent', 'denied');
    applyGtagConsent('denied', 'denied');
    setIsVisible(false);
    setShowSettingsModal(false);
  };

  const handleSaveCustom = () => {
    const adState = preferences.advertising ? 'granted' : 'denied';
    const analyticsState = preferences.analytics ? 'granted' : 'denied';
    localStorage.setItem('cookie-consent', preferences.advertising && preferences.analytics ? 'granted' : 'custom');
    applyGtagConsent(adState, analyticsState);
    setIsVisible(false);
    setShowSettingsModal(false);
  };

  if (!isVisible && !showSettingsModal) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner Bar */}
      {isVisible && !showSettingsModal && (
        <div
          role="region"
          aria-label="Cookie Consent Banner"
          className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl transition-all"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie size={20} />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-display font-bold text-white flex items-center gap-2">
                  We value your privacy & consent
                  <span className="px-2 py-0.5 text-[10px] bg-blue-900/60 text-blue-300 rounded-full border border-blue-700/50">
                    Consent Mode v2 Compliant
                  </span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Mini-Links uses cookies and processing signals to measure link performance, prevent fraudulent clicks, and serve non-intrusive personalized advertisements. You can accept all or customize your advertising and analytics choices anytime. Read our{' '}
                  <a href="/privacy-policy" className="text-blue-400 hover:underline font-medium">
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="flex-1 md:flex-none min-h-[40px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <Settings size={14} />
                <span>Customize</span>
              </button>
              <button
                type="button"
                onClick={handleRejectOptional}
                className="flex-1 md:flex-none min-h-[40px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Necessary Only
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none min-h-[40px] px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Check size={15} />
                <span>Accept All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Shield className="text-blue-400" size={20} />
                <h3 className="font-display text-lg font-bold text-white">Cookie Preferences</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close settings"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Essential Cookies */}
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-white">Strictly Necessary Cookies</h4>
                  <p className="text-slate-400 text-[11px]">Required for essential security, authentication, and core URL routing.</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-white">Performance & Analytics</h4>
                  <p className="text-slate-400 text-[11px]">Helps us analyze aggregate click volume and improve service latency.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600 bg-slate-900 border-slate-600 cursor-pointer"
                />
              </div>

              {/* Advertising */}
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-white">Personalized Advertising (Google AdSense)</h4>
                  <p className="text-slate-400 text-[11px]">Enables Google and third-party partners to serve relevant ads via Consent Mode v2.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.advertising}
                  onChange={(e) => setPreferences({ ...preferences, advertising: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600 bg-slate-900 border-slate-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
