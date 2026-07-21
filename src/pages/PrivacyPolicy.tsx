import React from 'react';
import { FileText, Shield, Cookie, Eye, Lock, RefreshCw } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'July 21, 2026';

  const handleOpenCookiePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
          <Shield size={13} />
          <span>Compliance Document</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-medium">Last Updated: {lastUpdated}</p>
      </div>

      {/* Main Content */}
      <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" /> 1. Introduction
          </h2>
          <p>
            Welcome to Mini Links ("we," "our," or "us"). We operate the web application located at <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">https://mini-links.com</a>. This Privacy Policy details our policies regarding the collection, usage, and disclosure of personal data when you utilize our URL shortening, dynamic QR code generation, and click tracking analytics services.
          </p>
          <p>
            By accessing or using Mini Links, you acknowledge that you have read and agree to the data practices outlined in this policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Eye size={18} className="text-blue-600 dark:text-blue-400" /> 2. Information Collection and Usage
          </h2>
          <p>
            To deliver high-speed URL shortening and redirect analytics, we process several categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Information:</strong> For registered users, we collect account credentials (name, email address, password hashes) to authenticate access to your link dashboard.
            </li>
            <li>
              <strong>Shortened URL Data:</strong> We store destination URLs, custom branded aliases, link creation timestamps, and configuration preferences.
            </li>
            <li>
              <strong>Click & Redirection Logs:</strong> When an end-user clicks a shortened link, our edge servers record aggregate telemetry including browser user-agent strings, operating systems, coarse geographic location (country/city level derived from IP), referrer headers, and timestamp metrics.
            </li>
          </ul>
        </section>

        <section className="space-y-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cookie size={18} className="text-blue-600 dark:text-blue-400" /> 3. Cookies & Advertising (Google AdSense & Consent Mode v2 Disclosure)
          </h2>
          <p>
            Mini Links uses cookies, web beacons, and local storage technologies to ensure seamless navigation, analyze site performance, and serve non-intrusive advertisements.
          </p>
          <p>
            <strong>Third-Party Advertising & DART Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to Mini Links or other websites. Google's use of advertising cookies enables it and its partners to serve targeted ads based on your visits across the Internet.
          </p>
          <p>
            <strong>Google Consent Mode v2 Compliance:</strong> We enforce Google Consent Mode v2 for all visitors. By default, advertising and analytics storage signals (<code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code>, <code>analytics_storage</code>) are set to denied until explicit user consent is granted via our Cookie Banner.
          </p>
          <p>
            <strong>Opt-Out Options:</strong> You can opt out of personalized Google advertising anytime by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">Google Ad Settings</a> or visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">www.aboutads.info</a>.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenCookiePreferences}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span>Change / Update Cookie Preferences</span>
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock size={18} className="text-blue-600 dark:text-blue-400" /> 4. GDPR / CCPA User Data Rights
          </h2>
          <p>
            Under global privacy frameworks including GDPR (EU/UK) and CCPA (California), you have the right to request access to your personal data, request data portability, object to processing, or request complete deletion of your account and short link telemetry.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">5. Contact Our Privacy Officer</h2>
          <p>
            If you have any questions regarding this Privacy Policy or wish to submit a data erasure request, please contact our privacy compliance officer at <a href="mailto:hashcode.dev@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">hashcode.dev@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
