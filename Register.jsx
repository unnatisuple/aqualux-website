import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!acceptTerms) e.terms = 'Please accept the Terms & Conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = register(form);
    setLoading(false);
    if (!result.success) { setErrors({ email: result.error }); return; }
    navigate('/');
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type={name === 'password' || name === 'confirm' ? (showPwd ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={form[name]}
          onChange={e => set(name, e.target.value)}
          className={`input-field ${errors[name] ? 'border-red-400' : ''} ${(name === 'password' || name === 'confirm') ? 'pr-11' : ''}`}
        />
        {(name === 'password' || name === 'confirm') && name === 'password' && (
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-navy">
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />{errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-white flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1620626011761-996317702782?w=1200&q=80" alt="Bathroom" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-navy/60 flex flex-col justify-center px-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-black">AL</span>
            </div>
            <span className="text-2xl font-black text-white">Aqua<span className="text-aqua">Lux</span></span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Join the AquaLux<br />family today.</h2>
          <p className="text-white/60 text-lg leading-relaxed">Create your account and start experiencing premium bathroom products delivered to your door.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { val: '12+', label: 'Product Categories' },
              { val: '50K+', label: 'Happy Customers' },
              { val: '5★', label: 'Average Rating' },
              { val: 'Free', label: 'Shipping over ₹5K' },
            ].map((s, i) => (
              <div key={i} className="glassmorphism rounded-xl p-4">
                <p className="text-2xl font-black text-aqua">{s.val}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center">
              <span className="text-white font-black text-sm">AL</span>
            </div>
            <span className="text-xl font-black text-navy">Aqua<span className="text-aqua">Lux</span></span>
          </Link>

          <h1 className="text-3xl font-black text-navy mb-2">Create Account</h1>
          <p className="text-slate mb-8">Already have an account? <Link to="/login" className="text-aqua font-semibold hover:underline">Sign in</Link></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name *" name="name" placeholder="Your full name" />
            <Field label="Email Address *" name="email" type="email" placeholder="you@example.com" />
            <Field label="Mobile Number *" name="phone" type="tel" placeholder="10-digit mobile number" />
            <Field label="Password *" name="password" placeholder="At least 6 characters" />
            <Field label="Confirm Password *" name="confirm" placeholder="Repeat your password" />

            <label className={`flex items-start gap-2.5 cursor-pointer ${errors.terms ? 'text-red-500' : ''}`}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 accent-[#4ABFBF] rounded mt-0.5"
              />
              <span className="text-sm text-slate">
                I agree to the <a href="#" className="text-aqua hover:underline">Terms & Conditions</a> and <a href="#" className="text-aqua hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Creating Account...
                </span>
              ) : (
                <>Create Account <CheckCircle size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
