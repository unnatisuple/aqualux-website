import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { useProducts } from './context/ProductContext';
import { ShieldCheck, Truck, RefreshCw, Headphones, ChevronRight, Star, Droplets, Bath, Wind, Package, Wrench } from 'lucide-react';

const CATEGORY_ICONS = {
  Bathtubs: Bath,
  Showers: Droplets,
  Toilets: Wind,
  Washbasins: Droplets,
  Faucets: Wrench,
  Accessories: Package,
};

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80"
          alt="Luxury Bathroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/75 to-navy/50" />
      </div>

      {/* Animated circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-aqua/5 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aqua/20 border border-aqua/30 text-aqua text-sm font-medium mb-8 animate-fade-in">
          <Star size={14} className="fill-aqua" />
          Premium Bath & Sanitary Products
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 animate-slide-up">
          Elevate Your<br />
          <span className="shimmer-text">Bathroom Experience</span>
        </h1>

        <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
          Discover a curated collection of luxury bathtubs, showers, faucets and more. 
          Transform your bathroom into a personal spa sanctuary.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <button
            onClick={() => navigate('/products')}
            id="hero-shop-now"
            className="btn-primary text-base px-8 py-4 animate-pulse-aqua"
          >
            Shop Now <ChevronRight size={18} />
          </button>
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-2 text-white/80 hover:text-white font-semibold text-base transition-colors"
          >
            Our Story <ChevronRight size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '500+', label: 'Products' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '5★', label: 'Rated' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-aqua">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ categories }) {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-aqua font-semibold text-sm uppercase tracking-widest mb-3">Explore Range</p>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find the perfect products for every corner of your bathroom</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat.name] || Package;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                className="group card p-5 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aqua/10 to-navy/5 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-aqua group-hover:to-aqua-700 transition-all duration-300">
                  <Icon size={24} className="text-aqua group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-navy text-sm text-center group-hover:text-aqua transition-colors">{cat.name}</span>
                <span className="text-xs text-slate">{cat.count} items</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BestSellersSection({ products }) {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 6);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-aqua font-semibold text-sm uppercase tracking-widest mb-3">Top Picks</p>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Our most loved products, chosen by thousands of happy customers</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-aqua font-semibold hover:text-aqua-700 transition-colors">
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const features = [
    { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'Every product is rigorously tested and comes with manufacturer warranty. We stand by quality.' },
    { icon: Truck, title: 'Free Shipping', desc: 'Enjoy free delivery on all orders above ₹5,000. Fast, reliable shipping across India.' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '15-day hassle-free return policy. Not satisfied? We\'ll make it right, no questions asked.' },
    { icon: Headphones, title: 'Expert Support', desc: 'Our bathroom experts are available 7 days a week to help you choose the perfect products.' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-navy via-navy-600 to-navy-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-aqua rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-aqua rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-aqua font-semibold text-sm uppercase tracking-widest mb-3">Why AquaLux</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Us</h2>
          <p className="text-white/60 mt-3 text-lg">We're committed to making your bathroom renovation seamless</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glassmorphism rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-aqua/20 flex items-center justify-center mb-4 group-hover:bg-aqua transition-colors">
                <f.icon size={22} className="text-aqua group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedBanner() {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden h-72 group cursor-pointer" onClick={() => navigate('/products?category=Bathtubs')}>
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80" alt="Bathtubs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-aqua text-sm font-semibold mb-1">New Arrivals</p>
              <h3 className="text-white text-2xl font-bold mb-3">Luxury Bathtubs</h3>
              <span className="inline-flex items-center gap-1 text-white text-sm font-medium">Shop Now <ChevronRight size={14} /></span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-72 group cursor-pointer" onClick={() => navigate('/products?category=Showers')}>
            <img src="https://images.unsplash.com/photo-1620626011761-996317702782?w=800&q=80" alt="Showers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-aqua text-sm font-semibold mb-1">Trending</p>
              <h3 className="text-white text-2xl font-bold mb-3">Premium Showers</h3>
              <span className="inline-flex items-center gap-1 text-white text-sm font-medium">Shop Now <ChevronRight size={14} /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { products, categories } = useProducts();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoriesSection categories={categories} />
      <BestSellersSection products={products} />
      <FeaturedBanner />
      <WhyUsSection />
      <Footer />
    </div>
  );
}
