import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, Users, Leaf, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Arjun Mehra', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80' },
  { name: 'Priyanka Desai', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80' },
  { name: 'Vikram Nair', role: 'Operations Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
];

const MILESTONES = [
  { year: '2018', event: 'AquaLux founded in Mumbai with a vision for accessible luxury' },
  { year: '2019', event: 'Launched first product line of 50 premium bath products' },
  { year: '2021', event: 'Expanded to all major Indian cities, serving 10,000+ customers' },
  { year: '2023', event: 'Crossed ₹10 Crore revenue milestone with 50,000+ happy customers' },
  { year: '2024', event: 'Launched e-commerce platform and exclusive designer collections' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-600 to-navy-800 pt-32 pb-20">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-aqua/20 border border-aqua/30 text-aqua text-sm font-medium mb-6">Our Story</span>
          <h1 className="text-5xl font-black text-white mb-5">Crafting Luxury<br /><span className="text-gradient">One Bathroom at a Time</span></h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            At AquaLux, we believe your bathroom is more than a utility space — it's your private sanctuary. Since 2018, we've been on a mission to bring world-class bath products to Indian homes at fair prices.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: '50,000+', label: 'Happy Customers' },
            { val: '500+', label: 'Products' },
            { val: '6+', label: 'Years of Excellence' },
            { val: '4.8★', label: 'Average Rating' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-aqua">{s.val}</p>
              <p className="text-slate text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-aqua font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold text-navy mb-5">Bringing Spa-Level Luxury into Every Indian Home</h2>
            <p className="text-slate leading-relaxed mb-5">
              We source our products from the world's finest manufacturers and rigorously test each item before it reaches your door. Our curators travel to trade shows in Italy, Germany, and Japan to handpick pieces that meet our exacting standards.
            </p>
            <p className="text-slate leading-relaxed mb-8">
              Every product in our catalogue is chosen for its build quality, aesthetic excellence, and durability — because we believe luxury should last a lifetime.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: 'Quality Certified', desc: 'BIS & ISO standards' },
                { icon: Users, label: 'Expert Team', desc: '50+ bathroom specialists' },
                { icon: Leaf, label: 'Eco-Friendly', desc: 'Water-saving designs' },
                { icon: Heart, label: 'Customer First', desc: '24×7 dedicated support' },
              ].map((v, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-aqua/10 flex items-center justify-center flex-shrink-0">
                    <v.icon size={18} className="text-aqua" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{v.label}</p>
                    <p className="text-xs text-slate">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-card-hover">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80" alt="Our Showroom" className="w-full h-96 lg:h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Our Journey</h2>
            <p className="text-white/60 mt-2">Six years of bringing bathroom dreams to life</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-aqua/20 -translate-x-1/2" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <p className="text-aqua font-bold text-2xl">{m.year}</p>
                    <p className="text-white/70 text-sm mt-1">{m.event}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-aqua shadow-aqua-glow flex-shrink-0 relative z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="section-title mb-3">Meet Our Team</h2>
          <p className="section-subtitle mb-12">The people passionate about your bathroom</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <div key={i} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-lg" />
                <h3 className="font-bold text-navy">{member.name}</h3>
                <p className="text-aqua text-sm font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-aqua-700 to-aqua text-center">
        <h2 className="text-3xl font-black text-white mb-3">Ready to transform your bathroom?</h2>
        <p className="text-white/80 mb-6">Browse our collection and find the perfect pieces for your sanctuary</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-white text-aqua font-bold px-8 py-4 rounded-xl hover:bg-warm-100 transition-colors">
          Shop Now <ChevronRight size={18} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
