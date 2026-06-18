import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = loginAdmin(email, password);
    setLoading(false);
    if (!ok) { setError('Invalid admin credentials.'); return; }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-aqua/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-aqua/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center shadow-aqua-glow">
              <span className="text-white font-black text-lg">AL</span>
            </div>
            <span className="text-2xl font-black text-white">Aqua<span className="text-aqua">Lux</span></span>
          </Link>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <div className="glassmorphism rounded-3xl p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-aqua/20 rounded-2xl mb-6 mx-auto">
            <Lock size={22} className="text-aqua" />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Admin Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@aqualux.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-aqua focus:bg-white/15 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-aqua focus:bg-white/15 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-aqua text-white font-bold py-3.5 rounded-xl hover:bg-aqua-600 transition-all shadow-aqua-glow active:scale-95 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Sign In to Admin'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-white/5 rounded-xl text-center">
            <p className="text-white/40 text-xs">
              Demo: <span className="text-aqua/80">admin@aqualux.com</span> / <span className="text-aqua/80">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-white/40 text-sm">
          <Link to="/" className="text-aqua/70 hover:text-aqua transition-colors">← Back to Store</Link>
        </p>
      </div>
    </div>
  );
}
