import React, { useState } from 'react';
import { Mail, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'abuse',
    subject: '',
    message: ''
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
        message: ''
      });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6 lg:p-10 space-y-16 max-w-7xl mx-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Contact Support & Abuse</h1>
        <p className="text-sm md:text-base text-slate-500">Have a question, need billing support, or want to report link abuse? We are here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Info Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-semibold text-slate-900">Get in Touch</h3>
            
            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-slate-900">Email Communications</h4>
                <p className="text-xs text-slate-500 mt-0.5">support@minilinks.com</p>
                <p className="text-[10px] text-slate-400">For abuse reports: abuse@minilinks.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-slate-900">Operational Hours</h4>
                <p className="text-xs text-slate-500 mt-0.5">Mon - Fri: 9:00 AM - 5:00 PM EST</p>
                <p className="text-[10px] text-slate-400">Replies within 24-48 business hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-slate-900">Headquarters</h4>
                <p className="text-xs text-slate-500 mt-0.5">100 State St, Suite 500</p>
                <p className="text-xs text-slate-500">Boston, MA 02109, USA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-semibold text-blue-600 mb-1.5 text-sm">Abuse Takedowns</h4>
            We inspect all submitted spam and phishing complaints within 12 hours. If a shortened Mini Links URL is found to redirect to malicious content, the link will be terminated immediately.
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="category" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Inquiry Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  >
                    <option value="abuse">Report Link Abuse / Phishing</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message Detail</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Provide all context, including relevant short links or URLs..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              {isSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  Your message has been sent successfully. We will get back to you shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
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
