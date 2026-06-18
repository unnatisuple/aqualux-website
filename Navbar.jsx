import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-nav' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center shadow-aqua-glow group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">AL</span>
            </div>
            <span className={`text-xl font-black tracking-tight transition-colors ${
              scrolled ? 'text-navy' : 'text-white'
            }`}>
              Aqua<span className="text-aqua">Lux</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-aqua bg-aqua/10'
                    : scrolled
                    ? 'text-navy hover:text-aqua hover:bg-aqua/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              id="nav-cart-btn"
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                scrolled ? 'hover:bg-navy/5 text-navy' : 'hover:bg-white/10 text-white'
              }`}
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-aqua text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    scrolled ? 'text-navy hover:bg-navy/5' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 animate-slide-down">
                    <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-warm-100 transition-colors">
                      <User size={16} className="text-aqua" /> My Account
                    </Link>
                    <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-warm-100 transition-colors">
                      <Package size={16} className="text-aqua" /> My Orders
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="nav-login-btn"
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  scrolled
                    ? 'bg-navy text-white hover:bg-navy-600'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <User size={15} /> Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                scrolled ? 'text-navy hover:bg-navy/5' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-nav animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive(link.to) ? 'bg-aqua/10 text-aqua' : 'text-navy hover:bg-warm-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" className="block px-4 py-3 rounded-xl font-semibold text-sm text-aqua hover:bg-aqua/5 transition-colors">
                Login / Register
              </Link>
            )}
            {user && (
              <>
                <Link to="/account" className="block px-4 py-3 rounded-xl font-medium text-sm text-navy hover:bg-warm-100 transition-colors">
                  My Account
                </Link>
                <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
