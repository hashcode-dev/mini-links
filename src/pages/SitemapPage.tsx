import { Link } from 'react-router-dom';
import { Network, Home, Info, Shield, HelpCircle } from 'lucide-react';

export default function SitemapPage() {
  const publicLinks = [
    {
      title: 'Core Platform',
      description: 'Access landing, link shortening mechanics, and plan directories.',
      icon: Home,
      links: [
        { name: 'Home Landing Page', path: '/', description: 'URL Shortener, Dynamic QR codes, and real-time metrics.' },
        { name: 'Platform Pricing', path: '/pricing', description: 'Monthly and annual pricing options for creators and enterprises.' },
      ],
    },
    {
      title: 'Company & Support',
      description: 'Get in touch with support, team information, and abuse inquiries.',
      icon: Info,
      links: [
        { name: 'About Us', path: '/about', description: 'Our engineering methodologies and corporate profile.' },
        { name: 'Contact Support', path: '/contact', description: 'Submit questions, request technical assistance, or report spam.' },
      ],
    },
    {
      title: 'Legal & Policies',
      description: 'Mandatory policies governing user safety, cookies, GDPR rights, and terms.',
      icon: Shield,
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy', description: 'Disclosures on collected logs, cookies, and GDPR rights.' },
        { name: 'Terms of Service', path: '/terms-of-service', description: 'User responsibilities, system usage rules, and link takedowns.' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
          <Network size={13} />
          <span>Navigation Map</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Sitemap
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Direct links to navigate all public sections of the Mini Links portal.
        </p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {publicLinks.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">{section.title}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1">{section.description}</p>

              <ul className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {section.links.map((link, lidx) => (
                  <li key={lidx} className="group">
                    <Link to={link.path} className="block space-y-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                        {link.name} &rarr;
                      </span>
                      <span className="text-[11px] text-slate-400 block leading-normal">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Structured Guidelines */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto space-y-3 card-shadow">
        <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle size={16} className="text-blue-600 dark:text-blue-400" /> User Workspace Navigation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Dynamic dashboard tools, link lists, custom QR code workshops, and target analytics require authentication. Registered users can enter these spaces via the <Link to="/auth" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Sign In Portal</Link>.
        </p>
      </div>
    </div>
  );
}
