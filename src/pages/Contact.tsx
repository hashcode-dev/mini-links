import React, { useState } from 'react';
import { Mail, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import InputField from '../components/InputField';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'abuse',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'abuse',
        subject: '',
        message: '',
      });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Contact Support & Abuse
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Have a question, need billing support, or want to report link abuse? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Info Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow space-y-6">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">Get in Touch</h3>

            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Email Communications</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">hashcode.dev@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Operational Hours</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mon - Fri: 9:00 AM - 5:00 PM EST</p>
                <p className="text-[10px] text-slate-400">Replies within 24-48 business hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Headquarters</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Prayagraj Uttar Pradesh India</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h4 className="font-display font-semibold text-blue-600 dark:text-blue-400 mb-1.5 text-sm">Abuse Takedowns</h4>
            We inspect all submitted spam and phishing complaints within 12 hours. If a shortened Mini Links URL is found to redirect to malicious content, the link will be terminated immediately.
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                  id="name"
                  name="name"
                  label="Your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Inquiry Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                  >
                    <option value="abuse">Report Link Abuse / Phishing</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                <InputField
                  id="subject"
                  name="subject"
                  label="Subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Message Detail
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Provide all context, including relevant short links or URLs..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {isSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm flex items-center gap-2 font-medium">
                  <CheckCircle2 size={18} />
                  Your message has been sent successfully. We will get back to you shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
