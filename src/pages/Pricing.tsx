import { useState } from 'react';
import { Check } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="p-6 lg:p-10 space-y-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Simple and Transparent Pricing</h1>
        <p className="text-sm md:text-base text-slate-500">Choose the perfect plan for your link management needs. Cancel anytime.</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-blue-600 rounded-full relative transition-colors"
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isAnnual ? 'left-8' : 'left-1'}`}></div>
          </button>
          <span className={`text-sm font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Annual <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full ml-1 font-bold uppercase tracking-wider">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm card-shadow-hover flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
          <p className="text-slate-500 text-sm mb-6">For personal use and small projects.</p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-slate-900">$0</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg transition-all mb-8 text-sm">
            Get Started Free
          </button>
          <ul className="space-y-4 flex-1">
            {['50 links / mo', 'Basic statistics', 'Standard QR codes', 'Email support (5 days)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-md relative flex flex-col transform md:-translate-y-2 card-shadow-hover">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm">
            Most Popular
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
          <p className="text-slate-500 text-sm mb-6">For creators and marketing professionals.</p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-slate-900">${isAnnual ? '13' : '16'}</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all mb-8 text-sm">
            Upgrade to Pro
          </button>
          <ul className="space-y-4 flex-1">
            {['250 links / mo', 'Unlimited tracked clicks', '3 custom domains', 'Unbranded QR codes', 'Priority support (1 day)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm card-shadow-hover flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
          <p className="text-slate-500 text-sm mb-6">For agencies and large-scale operations.</p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-slate-900">${isAnnual ? '69' : '85'}</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg transition-all mb-8 text-sm">
            Contact Sales
          </button>
          <ul className="space-y-4 flex-1">
            {['50,000 links / mo', 'Unlimited custom domains', 'REST API access', 'Team management', 'Dedicated support (4 hours)'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
