import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject required';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      detail: '+91 98765 43210',
      sub: 'Mon–Sat: 9 AM – 7 PM IST',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'hello@aqualux.com',
      sub: 'We reply within 24 hours',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: MapPin,
      title: 'Showroom',
      detail: '123, Luxury Business Park',
      sub: 'Bandra, Mumbai — 400050',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      detail: 'Mon–Sat: 9 AM – 8 PM',
      sub: 'Sunday: 10 AM – 5 PM',
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy pt-32 pb-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="inline-block px-4 py-2 rounded-full bg-aqua/20 border border-aqua/30 text-aqua text-sm font-medium mb-5">
            Get in Touch
          </span>
          <h1 className="text-4xl font-black text-white mb-3">We're Here to Help</h1>
          <p className="text-white/60 text-lg">Have a question about a product or your order? Our experts are ready to assist you.</p>
        </div>
      </section>

      <section className="py-16 bg-warm-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactInfo.map((info, i) => (
              <div key={i} className="card p-5 hover:-translate-y-0.5 transition-transform">
                <div className={`w-11 h-11 rounded-xl ${info.color} flex items-center justify-center mb-4`}>
                  <info.icon size={20} />
                </div>
                <h3 className="font-bold text-navy text-sm mb-1">{info.title}</h3>
                <p className="font-semibold text-navy text-sm">{info.detail}</p>
                <p className="text-xs text-slate mt-0.5">{info.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MessageCircle size={20} className="text-aqua" />
                  <h2 className="text-xl font-bold text-navy">Send us a Message</h2>
                </div>

                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">Message Sent!</h3>
                    <p className="text-slate">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-outline mt-5 text-sm py-2.5">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)}
                          className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Your name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                          className={`input-field ${errors.email ? 'border-red-400' : ''}`} placeholder="you@email.com" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Phone (optional)</label>
                        <input value={form.phone} onChange={e => set('phone', e.target.value)}
                          className="input-field" placeholder="Mobile number" />
                      </div>
                      <div>
                        <label className="label">Subject *</label>
                        <select value={form.subject} onChange={e => set('subject', e.target.value)}
                          className={`input-field ${errors.subject ? 'border-red-400' : ''}`}>
                          <option value="">Select a topic</option>
                          <option>Product Enquiry</option>
                          <option>Order Support</option>
                          <option>Returns & Refunds</option>
                          <option>Installation Help</option>
                          <option>Warranty Claim</option>
                          <option>Other</option>
                        </select>
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label">Message *</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`}
                        placeholder="Tell us how we can help..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center py-4">
                      <Send size={16} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Map / Info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-navy to-navy-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin size={40} className="mx-auto mb-2 text-aqua" />
                    <p className="font-semibold">123, Luxury Business Park</p>
                    <p className="text-sm text-white/60">Bandra, Mumbai — 400050</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy mb-3">Visit Our Showroom</h3>
                  <p className="text-sm text-slate leading-relaxed">
                    Experience our products firsthand at our flagship showroom. Our experts will guide you through our collection and help you choose the perfect pieces for your bathroom.
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-slate">
                    <div className="flex items-center gap-2"><Clock size={14} className="text-aqua" /> Mon–Sat: 9:00 AM – 8:00 PM</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-aqua" /> Sunday: 10:00 AM – 5:00 PM</div>
                  </div>
                </div>
              </div>

              {/* FAQ snippet */}
              <div className="card p-5">
                <h3 className="font-bold text-navy mb-4">Common Questions</h3>
                <div className="space-y-3">
                  {[
                    { q: 'What is your return policy?', a: '15-day hassle-free returns for all unused products.' },
                    { q: 'Do you offer installation?', a: 'Yes, we partner with certified plumbers in major cities.' },
                    { q: 'How long does delivery take?', a: '5–7 business days for most products.' },
                  ].map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <p className="font-medium text-navy text-sm">{faq.q}</p>
                      <p className="text-xs text-slate mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
