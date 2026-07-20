import { FileText, Shield, Cookie, Eye } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'July 4, 2026';

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-4xl mx-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
          <Shield size={13} />
          <span>Compliance Document</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last Updated: {lastUpdated}</p>
      </div>

      {/* Main Copy */}
      <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> 1. Introduction
          </h2>
          <p>
            Welcome to Mini Links ("we," "our," or "us"). We operate the web application located at <a href="/" className="text-blue-600 hover:underline font-medium">https://minilinks.com</a>. This Privacy Policy details our policies regarding the collection, usage, and disclosure of personal data when you utilize our URL shortening, QR code generation, and link tracking services.
          </p>
          <p>
            By using Mini Links, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms, please do not access our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye size={18} className="text-blue-600" /> 2. Information Collection and Usage
          </h2>
          <p>
            To provide our link analytics and redirection services, we collect several types of data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Data:</strong> When registering, we collect your name, email address, and authentication sessions to secure your account.
            </li>
            <li>
              <strong>Shortened URL Details:</strong> We store the destination URLs you submit, along with custom aliases, descriptions, and dynamic routing settings.
            </li>
            <li>
              <strong>Redirect Analytics Logs:</strong> When an end-user clicks a Mini Links short URL, we collect log metrics to display in your dashboard. This includes browser agent strings, operating system, approximate geographic location, referrer paths, and transaction timestamps.
            </li>
          </ul>
        </section>

        <section className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cookie size={18} className="text-blue-600" /> 3. Cookies & Advertising (Google AdSense Disclosure)
          </h2>
          <p>
            Mini Links utilizes cookies to improve your user experience and deliver relevant advertisements. Cookies are files with small amounts of data stored on your device.
          </p>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website. Google's use of advertising cookies enables it and its partners to serve ads based on their visit to our sites and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Ad Settings</a> or visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">www.aboutads.info</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Data Security & Retention</h2>
          <p>
            The security of your data is paramount. We deploy SSL/TLS encryption for all data in transit and rest. Link logs are retained for reporting analytics and purged according to account settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Contact Privacy Officer</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data erasure under GDPR/CCPA, please contact our privacy officer at <a href="mailto:privacy@minilinks.com" className="text-blue-600 hover:underline">privacy@minilinks.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
