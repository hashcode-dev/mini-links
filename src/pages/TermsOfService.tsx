import { ShieldAlert, Scale, CheckSquare, Lock } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = 'July 4, 2026';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
          <Scale size={13} />
          <span>Legal Agreement</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 font-medium">Last Updated: {lastUpdated}</p>
      </div>

      {/* Main Content */}
      <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale size={18} className="text-blue-600 dark:text-blue-400" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or utilizing the URL shortener, QR code generator, API, and analytics dashboards provided by Mini Links ("the Service"), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any local laws.
          </p>
        </section>

        <section className="space-y-4 p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl card-shadow">
          <h2 className="font-display text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
            <ShieldAlert size={18} /> 2. Prohibited Uses & Link Takedowns
          </h2>
          <p className="text-xs text-red-900 dark:text-red-300">
            We maintain a zero-tolerance policy against service abuse. You may NOT utilize Mini Links to shorten, customize, share, or embed links pointing to destination materials containing:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-red-900 dark:text-red-300">
            <li><strong>Malware or Phishing:</strong> Destructive scripts, spyware, virus payloads, credentials harvesting scams, or misleading copy.</li>
            <li><strong>Spam campaigns:</strong> Bulk messaging scripts, cold mail payloads, forum spam, or robotic tracking lists.</li>
            <li><strong>Illegal Activities:</strong> Materials promoting copyright infringement, unlicensed pharmaceuticals, or content violating regional laws.</li>
            <li><strong>AdSense Program Violation:</strong> Websites featuring low-value copy networks, adult content, or click fraud scripts.</li>
          </ul>
          <p className="text-xs text-red-900 dark:text-red-300 font-semibold">
            Violating links will be permanently terminated without notice. Users initiating abusive redirects will face immediate account locks, API bans, and IP blocks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare size={18} className="text-blue-600 dark:text-blue-400" /> 3. User Accounts & Responsibilities
          </h2>
          <p>
            When creating an account, you represent that you are of legal age and provide accurate credentials. You are solely responsible for maintaining the confidentiality of your credentials and account actions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock size={18} className="text-blue-600 dark:text-blue-400" /> 4. Service Availability & Limitations
          </h2>
          <p>
            We deploy our systems on distributed edge computing nodes and guarantee a 99.9% uptime for redirect operations. However, the Service is provided "as is" and "as available". We make no warranties regarding redirect operational longevity or uninterrupted speeds.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">5. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the Commonwealth of Massachusetts, USA.
          </p>
        </section>
      </div>
    </div>
  );
}
