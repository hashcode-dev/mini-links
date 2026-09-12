import { Link } from 'react-router-dom';
import { Network, Home, DollarSign, Info, Shield, HelpCircle, FileSpreadsheet } from 'lucide-react';

export default function SitemapPage() {
  const publicLinks = [
    {
      title: 'Core Platform Features',
      description: 'Access the main landing, shortening mechanics, and plan directories.',
      icon: Home,
      links: [
        { name: 'Home Landing Page', path: '/', description: 'URL Shortener, Dynamic QR codes, and realtime redirect metrics.' },
        { name: 'Platform Pricing', path: '/pricing', description: 'Monthly and annual pricing options for creators, developers, and enterprises.' }
      ]
    },
    {
      title: 'Company & Support',
      description: 'Get in touch with support, inspect E-E-A-T credentials, and founder biographies.',
      icon: Info,
      links: [
        { name: 'About Us', path: '/about', description: 'Our engineering methodologies, server architecture details, and corporate profile.' },
        { name: 'Contact Support', path: '/contact', description: 'Submit questions, request technical assistance, or report redirect spam.' }
      ]
    },
    {
      title: 'Legal & Policies',
      description: 'Mandatory policies governing user safety, cookie storage, GDPR rights, and redirect liability.',
      icon: Shield,
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy', description: 'Disclosures on collected logs, Google cookie usage, GDPR, and CCPA settings.' },
        { name: 'Terms of Service', path: '/terms-of-service', description: 'User responsibilities, system usage limitations, spam bans, and link removals.' }
      ]
    }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-16 max-w-5xl mx-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20">
          <Network size={13} />
          <span>Navigation Map</span>
        </div>
        <h2 className="text-4xl font-extrabold text-navy dark:text-white font-display tracking-tight">HTML Sitemap</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">Direct links to navigate all publicly accessible sections of the Mini-Links portal.</p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {publicLinks.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-2xl border border-surface-container-high dark:border-slate-700 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                  <Icon size={16} />
                </div>
                <h3 className="text-base font-bold text-navy dark:text-white font-display">{section.title}</h3>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 flex-1">{section.description}</p>
              
              <ul className="space-y-4 pt-4 border-t border-surface-container-low dark:border-slate-800">
                {section.links.map((link, lidx) => (
                  <li key={lidx} className="group">
                    <Link to={link.path} className="block space-y-1">
                      <span className="text-xs font-bold text-navy dark:text-white group-hover:text-primary transition-colors flex items-center gap-1">
                        {link.name} &rarr;
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-normal">
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
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 max-w-4xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-navy dark:text-white font-display flex items-center gap-2">
          <HelpCircle size={15} className="text-primary" /> Looking for User Workspace Links?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Dynamic dashboard links, shortened URLs tables, user-specific QR codes, and target analytics are security-restricted. Search engine crawlers and guest users cannot access these paths without logging in first. Registered users can enter these spaces via the <Link to="/auth" className="text-primary hover:underline font-semibold">Sign In Portal</Link>.
        </p>
      </div>

    </div>
  );
}
