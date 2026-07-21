import { Shield, Server, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
          <Award size={14} />
          <span>Our Standards</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          About Mini Links
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Providing reliable, high-performance link shortening, branded domain management, and secure redirection services.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Our Mission & Core Values
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            At Mini Links, we address the fragility of digital links. We believe that a hyperlink is a vital branding touchpoint and access gateway. Our platform provides marketers, developers, and creators with the tools to construct links that load instantaneously and persist reliably.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            We prioritize absolute transparency, user privacy, and web integrity. We proactively monitor redirection destinations to preserve a safe digital ecosystem.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <Server size={20} />
            </div>
            <div>
              <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-base">Reliable Infrastructure</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sub-10ms global edge redirects using premium caching networks, offering a 99.9% uptime SLA.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-base">Advanced Protection</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Integrations with leading security registries and Google Safe Browsing APIs to filter malicious URLs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="space-y-8 max-w-5xl mx-auto pt-4">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            The Team Behind the Service
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A distributed team of engineers and security specialists dedicated to web utility standardizations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow card-hover text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-700 dark:text-slate-200 text-base font-extrabold border border-slate-200 dark:border-slate-700">
              GS
            </div>
            <div>
              <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">Gaurav Sahu</h4>
              <p className="text-xs text-slate-400">Founder & Chief Architect</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ex-System Infrastructure engineer specializing in high-throughput network architectures.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow card-hover text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-700 dark:text-slate-200 text-base font-extrabold border border-slate-200 dark:border-slate-700">
              AM
            </div>
            <div>
              <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">Alex Mercer</h4>
              <p className="text-xs text-slate-400">Senior Web Engineer</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Vite & React performance specialist. Focusing on edge routing and client-side web metrics.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow card-hover text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-700 dark:text-slate-200 text-base font-extrabold border border-slate-200 dark:border-slate-700">
              EL
            </div>
            <div>
              <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">Elena Lee</h4>
              <p className="text-xs text-slate-400">Security & Trust Officer</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Manages link takedown algorithms, automated abuse detection, and GDPR compliance policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
