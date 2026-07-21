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
    // Simulate API call
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
      // Clear success notification after 5s
      setTimeout(() => setIsSuccess(false), 5000);
    }, 800);
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
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-navy dark:text-white font-display tracking-tight">Contact Us & Support</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">Have a question, need billing support, or want to report link abuse? We are here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Info Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-surface-container-lowest dark:bg-navy-light p-6 rounded-2xl border border-surface-container-high dark:border-slate-700 space-y-6">
            <h3 className="text-lg font-bold text-navy dark:text-white font-display">Get in Touch</h3>
            
            <div className="flex items-start gap-3">
              <Mail className="text-primary shrink-0 mt-1" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-navy dark:text-white">Email Communications</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">support@minilinks.com</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">For abuse reports: abuse@minilinks.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-primary shrink-0 mt-1" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-navy dark:text-white">Operational Hours</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mon - Fri: 9:00 AM - 5:00 PM EST</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Replies within 24-48 business hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-primary shrink-0 mt-1" size={18} />
              <div>
                <h4 className="font-semibold text-xs text-navy dark:text-white">Headquarters</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">100 State St, Suite 500</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Boston, MA 02109, USA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-primary mb-2">Abuse Takedowns</h4>
            We inspect all submitted spam and phishing complaints within 12 hours. If a shortened Mini-Links URL is found to redirect to content that violates our terms or Google's publisher policies, the link will be terminated immediately.
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest dark:bg-navy-light p-8 rounded-2xl border border-surface-container-high dark:border-slate-700 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all"
                  >
                    <option value="abuse">Report Link Abuse / Spam</option>
                    <option value="billing">Billing & Subscriptions</option>
                    <option value="technical">Technical Support</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all resize-none"
                />
              </div>

              {isSuccess && (
                <div className="flex items-center gap-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-lg text-sm">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>Your message has been sent successfully. Our support team will respond within 24-48 business hours.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message</span>
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
