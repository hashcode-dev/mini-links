import { useState } from 'react';
import { Check } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Simple and Transparent Pricing
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Choose the perfect plan for your link management and tracking needs. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>Monthly</span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-blue-600 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Toggle annual billing"
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isAnnual ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={`text-sm font-semibold ${isAnnual ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
            Annual <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full ml-1 font-bold uppercase tracking-wider">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Free</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For personal use and small side projects.</p>
          <div className="mb-8">
            <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-100">$0</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <button className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition-all mb-8 text-sm">
            Get Started Free
          </button>
          <ul className="space-y-4 flex-1">
            {['50 links / mo', 'Basic statistics', 'Standard QR codes', 'Email support (5 days)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-blue-600 shadow-xl relative flex flex-col transform md:-translate-y-2 card-hover">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
            Most Popular
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Pro</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For creators and marketing professionals.</p>
          <div className="mb-8">
            <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-100">${isAnnual ? '13' : '16'}</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <button className="w-full min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all mb-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
            Upgrade to Pro
          </button>
          <ul className="space-y-4 flex-1">
            {['250 links / mo', 'Unlimited tracked clicks', '3 custom domains', 'Unbranded QR codes', 'Priority support (1 day)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="font-semibold">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Enterprise</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For agencies and large-scale operations.</p>
          <div className="mb-8">
            <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-100">${isAnnual ? '69' : '85'}</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <button className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition-all mb-8 text-sm">
            Contact Sales
          </button>
          <ul className="space-y-4 flex-1">
            {['50,000 links / mo', 'Unlimited custom domains', 'REST API access', 'Team management', 'Dedicated support (4 hours)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
