import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Save, Eye, EyeOff, Store, CreditCard, Truck, Info } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [showKey, setShowKey] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => updateSettings(form);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-navy">Store Settings</h1>
        <p className="text-slate text-sm mt-0.5">Configure your store details and payment options</p>
      </div>

      {/* Store Info */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5">
          <Store size={18} className="text-aqua" />
          <h2 className="font-bold text-navy">Store Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Store Name', key: 'storeName', placeholder: 'AquaLux' },
            { label: 'Contact Email', key: 'contactEmail', type: 'email', placeholder: 'hello@yourstore.com' },
            { label: 'Phone Number', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
            { label: 'Currency Symbol', key: 'currencySymbol', placeholder: '₹' },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                className="input-field"
                placeholder={f.placeholder}
              />
            </div>
          ))}
          <div className="col-span-1 sm:col-span-2">
            <label className="label">Store Address</label>
            <textarea rows={2} value={form.address} onChange={e => set('address', e.target.value)}
              className="input-field resize-none" placeholder="Full store address" />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="label">Logo URL</label>
            <input type="url" value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)}
              className="input-field" placeholder="https://yourstore.com/logo.png" />
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5">
          <Truck size={18} className="text-aqua" />
          <h2 className="font-bold text-navy">Shipping & COD</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Free Shipping Threshold (₹)</label>
            <input type="number" value={form.freeShippingThreshold}
              onChange={e => set('freeShippingThreshold', Number(e.target.value))}
              className="input-field" />
            <p className="text-xs text-slate mt-1">Orders above this amount get free shipping</p>
          </div>
          <div>
            <label className="label">Default Shipping Fee (₹)</label>
            <input type="number" value={form.shippingFee}
              onChange={e => set('shippingFee', Number(e.target.value))}
              className="input-field" />
          </div>
          <div className="flex items-center gap-3 p-4 bg-warm-100 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={form.codAvailable}
                onChange={e => set('codAvailable', e.target.checked)}
                className="w-4 h-4 accent-[#4ABFBF]"
              />
              <span className="font-medium text-navy text-sm">Enable Cash on Delivery</span>
            </label>
          </div>
          <div>
            <label className="label">COD Handling Fee (₹)</label>
            <input type="number" value={form.codFee}
              onChange={e => set('codFee', Number(e.target.value))}
              className="input-field" disabled={!form.codAvailable} />
          </div>
        </div>
      </div>

      {/* Razorpay Settings */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={18} className="text-aqua" />
          <h2 className="font-bold text-navy">Razorpay Configuration</h2>
        </div>
        <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <Info size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            For production use, replace the test key with your live key from Razorpay Dashboard → Settings → API Keys.
            Never share your Key Secret on the frontend — use server-side order creation.
          </p>
        </div>
        <div>
          <label className="label">Razorpay Key ID</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={form.razorpayKeyId}
              onChange={e => set('razorpayKeyId', e.target.value)}
              className="input-field pr-11 font-mono text-sm"
              placeholder="rzp_test_XXXXXXXXXX or rzp_live_XXXXXXXXXX"
            />
            <button type="button" onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-navy">
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-slate mt-1">
            Test key starts with <code className="text-aqua">rzp_test_</code> · Live key starts with <code className="text-aqua">rzp_live_</code>
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-primary px-8 py-3.5 text-base">
          <Save size={16} /> Save Settings
        </button>
        <button onClick={() => setForm({ ...settings })}
          className="btn-ghost border border-gray-200 rounded-xl px-6 py-3 text-sm">
          Reset
        </button>
      </div>
    </div>
  );
}
