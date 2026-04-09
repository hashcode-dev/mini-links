import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="p-6 lg:p-10 space-y-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-navy dark:text-white font-display tracking-tight">Simple and Transparent Pricing</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">Choose the perfect plan for your link management needs. Cancel anytime.</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-navy dark:text-white' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-primary rounded-full relative transition-colors"
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isAnnual ? 'left-8' : 'left-1'}`}></div>
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-navy dark:text-white' : 'text-slate-400'}`}>
            Annual <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-2xl border border-surface-container-high dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-navy dark:text-white font-display mb-2">Free</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For personal use and small projects.</p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-navy dark:text-white">$0</span>
            <span className="text-slate-500 dark:text-slate-400">/mo</span>
          </div>
          <button className="w-full py-3 bg-surface-container-low dark:bg-navy text-navy dark:text-white font-bold rounded-lg border border-surface-container-high dark:border-slate-600 hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all mb-8">
            Get Started for Free
          </button>
          <ul className="space-y-4 flex-1">
            {['50 links / mo', 'Basic statistics', 'Standard QR codes', 'Email support (5 days)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-2xl border-2 border-primary shadow-xl relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
            Most Popular
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white font-display mb-2">Pro</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For creators and marketing professionals.</p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-navy dark:text-white">${isAnnual ? '13' : '16'}</span>
            <span className="text-slate-500 dark:text-slate-400">/mo</span>
          </div>
          <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md transition-all mb-8">
            Upgrade to Pro
          </button>
          <ul className="space-y-4 flex-1">
            {['250 links / mo', 'Unlimited tracked clicks', '3 custom domains', 'Unbranded QR codes', 'Priority support (1 day)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-2xl border border-surface-container-high dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-navy dark:text-white font-display mb-2">Bulk / Enterprise</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For agencies and large-scale operations.</p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-navy dark:text-white">${isAnnual ? '69' : '85'}</span>
            <span className="text-slate-500 dark:text-slate-400">/mo</span>
          </div>
          <button className="w-full py-3 bg-surface-container-low dark:bg-navy text-navy dark:text-white font-bold rounded-lg border border-surface-container-high dark:border-slate-600 hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all mb-8">
            Contact Sales
          </button>
          <ul className="space-y-4 flex-1">
            {['50,000 links / mo', 'Unlimited custom domains', 'REST API access', 'Team management', 'Dedicated support (4 hours)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto pt-12">
        <h3 className="text-2xl font-bold text-navy dark:text-white font-display mb-8 text-center">Feature Comparison</h3>
        <div className="bg-surface-container-lowest dark:bg-navy-light rounded-xl border border-surface-container-high dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-navy border-b border-surface-container-high dark:border-slate-700">
                  <th className="px-6 py-4 text-sm font-bold text-navy dark:text-white">Feature</th>
                  <th className="px-6 py-4 text-sm font-bold text-navy dark:text-white text-center">Free</th>
                  <th className="px-6 py-4 text-sm font-bold text-primary dark:text-teal-400 text-center">Pro</th>
                  <th className="px-6 py-4 text-sm font-bold text-navy dark:text-white text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high dark:divide-slate-700">
                {[
                  { name: 'Links / mo', free: '50', pro: '250', ent: '50,000' },
                  { name: 'Tracked Clicks', free: '1,000 / mo', pro: 'Unlimited', ent: 'Unlimited' },
                  { name: 'Custom Domains', free: '0', pro: '3', ent: 'Unlimited' },
                  { name: 'Analytics History', free: '30 days', pro: '2 years', ent: 'Unlimited' },
                  { name: 'API Access', free: false, pro: false, ent: true },
                  { name: 'Support', free: 'Email (5 days)', pro: 'Email + Chat (1 day)', ent: 'Dedicated (4 hours)' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 dark:hover:bg-navy/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                      {typeof row.free === 'boolean' ? (row.free ? <Check size={18} className="mx-auto text-primary" /> : <X size={18} className="mx-auto text-slate-300" />) : row.free}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-navy dark:text-white text-center bg-primary/5 dark:bg-teal-900/10">
                      {typeof row.pro === 'boolean' ? (row.pro ? <Check size={18} className="mx-auto text-primary" /> : <X size={18} className="mx-auto text-slate-300" />) : row.pro}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                      {typeof row.ent === 'boolean' ? (row.ent ? <Check size={18} className="mx-auto text-primary" /> : <X size={18} className="mx-auto text-slate-300" />) : row.ent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
