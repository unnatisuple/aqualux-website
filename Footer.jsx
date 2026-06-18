import { Link } from 'react-router-dom';
import { Share2, Globe, Rss, Play, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-aqua-700 to-aqua py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Stay in the Loop</h3>
          <p className="text-white/80 mb-6">Get exclusive offers, new arrivals, and bathroom inspiration straight to your inbox.</p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-aqua font-bold rounded-xl hover:bg-warm-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">AL</span>
              </div>
              <span className="text-xl font-black">Aqua<span className="text-aqua">Lux</span></span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Premium bath & sanitary products crafted for those who believe their bathroom deserves the best. Luxury, reimagined.
            </p>
            <div className="flex items-center gap-3">
              {[Share2, Globe, Rss, Play].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-aqua transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Track Order', to: '/track-order' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/60 hover:text-aqua text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-aqua/50"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-3">
              {['Bathtubs', 'Showers', 'Toilets', 'Washbasins', 'Faucets', 'Accessories'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-white/60 hover:text-aqua text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-aqua/50"></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="text-aqua mt-0.5 flex-shrink-0" />
                <span>123, Luxury Business Park,<br />Bandra, Mumbai — 400050</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="text-aqua flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-aqua transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="text-aqua flex-shrink-0" />
                <a href="mailto:hello@aqualux.com" className="hover:text-aqua transition-colors">hello@aqualux.com</a>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 mb-2 font-medium">SECURE PAYMENTS</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Razorpay', 'Visa', 'MC', 'UPI', 'RuPay'].map(b => (
                  <span key={b} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 font-medium">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">© 2024 AquaLux. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(link => (
              <a key={link} href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
