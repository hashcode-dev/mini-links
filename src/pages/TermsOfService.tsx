import { ShieldAlert, Scale, CheckSquare, Lock } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = 'July 4, 2026';

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-4xl mx-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="space-y-4 border-b border-surface-container-high dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20">
          <Scale size={13} />
          <span>Legal Agreement</span>
        </div>
        <h2 className="text-4xl font-extrabold text-navy dark:text-white font-display tracking-tight">Terms of Service</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Last Updated: {lastUpdated}</p>
      </div>

      {/* Main Copy */}
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <Scale size={18} className="text-primary" /> 1. Acceptance of Terms
          </h3>
          <p>
            By accessing or utilizing the URL shortener, QR code generator, API, and analytics dashboards provided by Mini-Links ("the Service"), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any local laws. If you do not agree with any of these terms, you are prohibited from using the Service.
          </p>
        </section>

        <section className="space-y-4 p-6 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-xl">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-400 font-display flex items-center gap-2">
            <ShieldAlert size={18} /> 2. Prohibited Uses & Link Takedowns
          </h3>
          <p className="text-xs text-red-900 dark:text-red-300">
            We maintain a zero-tolerance policy against service abuse. You may NOT utilize Mini-Links to shorten, customize, share, or embed links pointing to destination materials containing:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-red-900 dark:text-red-300">
            <li><strong>Malware or Phishing:</strong> Destructive scripts, spyware, virus payloads, credentials harvesting scams, or misleading copy simulating banking portals/financial systems.</li>
            <li><strong>Spam campaigns:</strong> Bulk messaging scripts, cold mail payloads, forum spam, or robotic tracking lists violating email regulations.</li>
            <li><strong>Illegal Activities:</strong> Materials promoting copyright infringement, unlicensed pharmaceuticals, weapon sales, or content violating regional laws.</li>
            <li><strong>AdSense Program Violation:</strong> Websites featuring low-value copy networks, adult content, violent materials, or click fraud scripts.</li>
          </ul>
          <p className="text-xs text-red-900 dark:text-red-300 font-semibold">
            Violating links will be permanently terminated without notice. Users initiating abusive redirects will face immediate account locks, API bans, and IP blocks. We cooperate with law enforcement and cyber threat databases to report illegal activities.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <CheckSquare size={18} className="text-primary" /> 3. User Accounts & Responsibilities
          </h3>
          <p>
            When creating an account, you represent that you are of legal age and provide accurate credentials. You are solely responsible for maintaining the confidentiality of your credentials and account actions. Mini-Links shall not be responsible for any loss or disruption caused by unauthorized entry.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display flex items-center gap-2">
            <Lock size={18} className="text-primary" /> 4. Service Availability & Limitations
          </h3>
          <p>
            We deploy our systems on distributed edge computing nodes and guarantee a 99.9% uptime for redirect operations. However, the Service is provided "as is" and "as available". We make no warranties, expressed or implied, regarding redirect operational longevity, uninterrupted speeds, or the accuracy of click tracker datasets.
          </p>
          <p>
            We reserve the right to limit API request counts, link counts, or account quotas to protect the stability of our cloud clusters.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">5. Intellectual Property</h3>
          <p>
            Mini-Links does not claim ownership over the destination URLs or content you shorten. However, the software code, graphics, layout elements, brand trademarks, and domain APIs are the exclusive intellectual property of Mini-Links. You may not copy, reverse engineer, or reproduce our design layouts without prior written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">6. Disclaimer of Warranties & Limitation of Liability</h3>
          <p>
            In no event shall Mini-Links, its founders, officers, or partners be held liable for any damages (including, without limitation, damages for loss of data, billing profits, or business interruptions) arising out of the use or inability to use the redirection tools, even if Mini-Links has been notified of the possibility of such damages.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">7. Governing Law</h3>
          <p>
            These terms are governed by and construed in accordance with the laws of the Commonwealth of Massachusetts, USA, without regard to its conflict of law provisions. Any dispute arising out of these terms shall be settled exclusively in the state or federal courts located in Boston, Massachusetts.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy dark:text-white font-display">8. Reaching Our Legal Counsel</h3>
          <p>
            For questions, legal notices, or copyright take-down notifications, reach our legal officer at:
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs space-y-1">
            <p><strong>Entity:</strong> Mini-Links Legal Operations</p>
            <p><strong>Email:</strong> legal@minilinks.com</p>
            <p><strong>Address:</strong> 100 State St, Suite 500, Boston, MA 02109, USA</p>
          </div>
        </section>

      </div>

    </div>
  );
}
