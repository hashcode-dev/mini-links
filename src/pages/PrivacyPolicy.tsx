import { FileText, Shield, Cookie, Eye } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'July 4, 2026';

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-4xl mx-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="space-y-4 border-b border-surface-container-high dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20">
          <Shield size={13} />
          <span>Compliance Document</span>
        </div>
        <h2 className="text-4xl font-extrabold text-navy dark:text-white font-display tracking-tight">Privacy Policy</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Last Updated: {lastUpdated}</p>
      </div>

      {/* Main Copy */}
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <FileText size={18} className="text-primary" /> 1. Introduction
          </h3>
          <p>
            Welcome to Mini-Links ("we," "our," or "us"). We operate the web application located at <a href="/" className="text-primary hover:underline font-medium">https://mini-links.com</a>. This Privacy Policy details our policies regarding the collection, usage, and disclosure of personal data when you utilize our URL shortening, QR code generation, and link tracking services.
          </p>
          <p>
            By using Mini-Links, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms, please do not access our services.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <Eye size={18} className="text-primary" /> 2. Information Collection and Usage
          </h3>
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
              <strong>Redirect Analytics Logs:</strong> When an end-user clicks a Mini-Links short URL, we collect log metrics to display in your dashboard. This includes browser agent strings, operating system, approximate geographic location (based on IP lookup, not precise GPS), referrer paths, and transaction timestamps.
            </li>
          </ul>
        </section>

        <section className="space-y-4 p-6 bg-surface-container-low dark:bg-navy-light rounded-xl border border-surface-container-high dark:border-slate-800">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <Cookie size={18} className="text-primary" /> 3. Cookies & Advertising (Google AdSense Disclosure)
          </h3>
          <p>
            Mini-Links utilizes cookies to improve your user experience and deliver relevant advertisements. Cookies are files with small amounts of data that are sent to your browser from a website and stored on your device.
          </p>
          <div className="space-y-3 text-xs bg-surface-container-lowest dark:bg-navy p-4 rounded-lg border border-surface-container-high dark:border-slate-700">
            <p className="font-semibold text-primary">Mandatory Google Cookie & DART Disclosures:</p>
            <p>
              * Google, as a third-party vendor, uses cookies to serve ads on our website.
            </p>
            <p>
              * Google's use of the DoubleClick DART cookie enables it and its partner networks to serve targeted advertisements to our users based on their visits to Mini-Links and other sites on the Internet.
            </p>
            <p>
              * Users can opt-out of the use of the DART cookie and configure personalized ad parameters by visiting the official Google Ad and Content Network Privacy Policy: 
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1 font-medium">
                https://policies.google.com/technologies/ads
              </a>.
            </p>
          </div>
          <p>
            We also employ third-party advertising companies and tracking tools (such as Google Analytics) to measure site traffic and engagement metrics. These networks use web beacons, tracking pixels, and storage cookies to index usage data without collecting identifying credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <Shield size={18} className="text-primary" /> 4. GDPR & CCPA Data Rights
          </h3>
          <p>
            We comply with international data protection protocols. Depending on your residency (such as within the EEA under GDPR, or California under CCPA), you possess specific legal rights:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Access:</strong> You can request copy outlines of all personal credentials we hold on your file.</li>
            <li><strong>Right to Rectification:</strong> You may request corrections to inaccurate profiles.</li>
            <li><strong>Right to Erasure (Forgetfulness):</strong> You may request permanent deletion of your profile and link listings by sending an inquiry to <span className="text-navy dark:text-white font-semibold">privacy@minilinks.com</span>.</li>
            <li><strong>Right to Opt-out of Data Sales:</strong> We do not sell user redirect profiles or direct credentials to data brokers. You may opt out of third-party tracking via your web browser settings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">5. Security of Data</h3>
          <p>
            The security of your credentials and destination links is paramount. We implement Secure Sockets Layer (SSL/TLS) encryption across all endpoints, access controls, and database backups. However, remember that no method of transmission over the Internet is 100% secure, and we cannot guarantee its absolute safety.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">6. Policy Updates</h3>
          <p>
            We may update our Privacy Policy periodically. We will notify you of any adjustments by posting the new version on this page and updating the "Last Updated" header at the top of this document. We advise you to review this policy periodically for any alterations.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">7. Contact Information</h3>
          <p>
            For questions or requests regarding data policies, cookies settings, or CCPA/GDPR compliance, reach us at:
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs space-y-1">
            <p><strong>Entity:</strong> Mini-Links Operations Inc.</p>
            <p><strong>Email:</strong> privacy@minilinks.com</p>
            <p><strong>Address:</strong> 100 State St, Suite 500, Boston, MA 02109, USA</p>
          </div>
        </section>

      </div>

    </div>
  );
}
