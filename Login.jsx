import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = loginUser(email, password);
    setLoading(false);
    if (!ok) { setError('Invalid email or password. Try priya@example.com / test123'); return; }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-warm-white flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80"
          alt="Luxury Bathroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-navy/60 flex flex-col justify-center px-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-black">AL</span>
            </div>
            <span className="text-2xl font-black text-white">Aqua<span className="text-aqua">Lux</span></span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Welcome back to<br />your sanctuary.</h2>
          <p className="text-white/60 text-lg leading-relaxed">Sign in to manage your orders, wishlists, and account settings.</p>
          <div className="mt-12 space-y-4">
            {['Free delivery over ₹5,000', 'Exclusive member discounts', 'Priority customer support'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-aqua/30 flex items-center justify-center text-aqua text-xs">✓</div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center">
              <span className="text-white font-black text-sm">AL</span>
            </div>
            <span className="text-xl font-black text-navy">Aqua<span className="text-aqua">Lux</span></span>
          </Link>

          <h1 className="text-3xl font-black text-navy mb-2">Sign In</h1>
          <p className="text-slate mb-8">Don't have an account? <Link to="/register" className="text-aqua font-semibold hover:underline">Create one</Link></p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <a href="#" className="text-xs text-aqua hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-navy transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 accent-[#4ABFBF] rounded"
              />
              <span className="text-sm text-slate">Remember me</span>
            </label>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-warm-100 rounded-xl text-xs text-slate">
            <p className="font-semibold text-navy mb-1">Demo Credentials:</p>
            <p>Customer: priya@example.com / test123</p>
            <p className="mt-1">Admin: <Link to="/admin/login" className="text-aqua">admin panel →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
