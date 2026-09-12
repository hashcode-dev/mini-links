import { Shield, Server, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="p-6 lg:p-10 space-y-16 max-w-7xl mx-auto transition-colors duration-200">
      
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20">
          <Award size={13} />
          <span>Our Standards</span>
        </div>
        <h2 className="text-4xl font-extrabold text-navy dark:text-white font-display tracking-tight">
          About Mini-Links
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Providing reliable, high-performance link shortening, branded domain management, and secure redirection services since 2024.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-navy dark:text-white font-display">
            Our Mission & Core Values
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            At Mini-Links, we address the fragility of digital links. We believe that a hyperlink is more than just a redirection protocol—it is a point of customer contact, a branding touchpoint, and a vital source of analytics. Our platform provides marketers, developers, and creators with the tools to construct links that stand out, load instantaneously, and persist reliably.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We prioritize absolute transparency, user privacy, and web integrity. We proactively monitor and discard redirection destinations containing malware, phishing vectors, or spam, thereby preserving a clean ecosystem.
          </p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-2xl border border-surface-container-high dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
              <Server size={20} />
            </div>
            <div>
              <h4 className="font-bold text-navy dark:text-white text-base">Reliable Infrastructure</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sub-10ms global edge redirects using premium caching networks, offering a 99.9% uptime SLA.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="font-bold text-navy dark:text-white text-base">Advanced Protection</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Integrations with leading security registries and Google Safe Browsing APIs to filter malicious URLs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team (EEAT Builder) */}
      <div className="space-y-8 max-w-5xl mx-auto pt-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-navy dark:text-white font-display">
            The Team Behind the Service
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A distributed crew of engineers and security specialists dedicated to web utility standardizations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-bold">
              GS
            </div>
            <div>
              <h4 className="font-bold text-navy dark:text-white text-sm">Gaurav Sahu</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">Founder & Chief Architect</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ex-System Infrastructure engineer specializing in high-throughput network architectures.
            </p>
            <div className="pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">
                LinkedIn Profile &rarr;
              </a>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-bold">
              AM
            </div>
            <div>
              <h4 className="font-bold text-navy dark:text-white text-sm">Alex Mercer</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">Senior Web Engineer</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Vite & React performance specialist. Focusing on edge routing and client-side web metrics.
            </p>
            <div className="pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">
                LinkedIn Profile &rarr;
              </a>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-xl border border-surface-container-high dark:border-slate-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-bold">
              SL
            </div>
            <div>
              <h4 className="font-bold text-navy dark:text-white text-sm">Sarah Lin</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">Compliance & Security Analyst</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Maintains redirects integrity and monitors the platform against malicious activity and spam campaigns.
            </p>
            <div className="pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">
                LinkedIn Profile &rarr;
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Headquarter Details */}
      <div className="max-w-3xl mx-auto bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-navy dark:text-white font-display">
          Corporate Information & Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="space-y-2">
            <p className="font-semibold text-navy dark:text-white text-[13px]">Registrations & Headquarters</p>
            <p>Mini-Links Operations Inc.</p>
            <p>100 State St, Suite 500</p>
            <p>Boston, MA 02109, United States</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-navy dark:text-white text-[13px]">Inquiries & Abuse Reports</p>
            <p>Email: contact@minilinks.com</p>
            <p>Support: support@minilinks.com</p>
            <p>Operational Hours: Monday - Friday (9 AM - 5 PM EST)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
