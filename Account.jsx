import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from './context/AuthContext';
import { useOrders } from './context/OrderContext';
import { User, Package, MapPin, Lock, Edit3, Save, X, AlertCircle, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Lock },
];

function OrderStatusBadge({ status }) {
  const map = {
    'Paid': 'badge-green',
    'COD - Pending': 'badge-yellow',
    'Processing': 'badge-aqua',
    'Shipped': 'badge-navy',
    'Delivered': 'badge-green',
    'Cancelled': 'badge-red',
  };
  return <span className={`badge ${map[status] || 'badge-navy'}`}>{status}</span>;
}

export default function Account() {
  const { user, updateProfile, logout } = useAuth();
  const { getOrdersByCustomer } = useOrders();
  const [tab, setTab] = useState('profile');

  if (!user) return <Navigate to="/login" replace />;

  const orders = getOrdersByCustomer(user.email);

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="card p-6 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aqua to-navy flex items-center justify-center text-white font-black text-2xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-navy">{user.name}</h1>
              <p className="text-slate text-sm">{user.email} · {user.phone}</p>
              <p className="text-xs text-aqua font-medium mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-56 flex-shrink-0">
              <div className="card p-2 space-y-1">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      tab === t.id ? 'bg-aqua text-white shadow-aqua-glow' : 'text-navy hover:bg-warm-100'
                    }`}
                  >
                    <t.icon size={16} /> {t.label}
                  </button>
                ))}
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <X size={16} /> Logout
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {tab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} />}
              {tab === 'orders' && <OrdersTab orders={orders} />}
              {tab === 'addresses' && <AddressesTab user={user} />}
              {tab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProfileTab({ user, updateProfile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone || '' });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-navy">Profile Information</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-outline py-2 px-4 text-sm">
            <Edit3 size={14} /> Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name', key: 'name', placeholder: 'Your name' },
          { label: 'Email Address', key: 'email', placeholder: 'your@email.com', type: 'email' },
          { label: 'Phone Number', key: 'phone', placeholder: '10-digit mobile' },
        ].map(f => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            {editing ? (
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="input-field"
                placeholder={f.placeholder}
              />
            ) : (
              <p className="px-4 py-3 bg-warm-100 rounded-xl text-navy font-medium text-sm">
                {user[f.key] || <span className="text-slate">Not set</span>}
              </p>
            )}
          </div>
        ))}
      </div>
      {editing && (
        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} className="btn-primary">
            <Save size={14} /> Save Changes
          </button>
          <button onClick={() => setEditing(false)} className="btn-ghost border border-gray-200 rounded-xl px-4 py-2.5">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Package size={40} className="text-aqua mx-auto mb-3 opacity-50" />
        <p className="font-semibold text-navy mb-1">No orders yet</p>
        <p className="text-slate text-sm">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-navy">Order History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Order ID</th>
              <th className="table-header">Date</th>
              <th className="table-header">Items</th>
              <th className="table-header">Total</th>
              <th className="table-header">Payment</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-warm-50 transition-colors">
                <td className="table-cell font-mono text-xs font-semibold text-aqua">{order.id}</td>
                <td className="table-cell text-slate text-xs">
                  {new Date(order.date).toLocaleDateString('en-IN')}
                </td>
                <td className="table-cell">
                  <span className="text-xs text-slate">{order.items?.length} item(s)</span>
                </td>
                <td className="table-cell font-bold">₹{order.total?.toLocaleString('en-IN')}</td>
                <td className="table-cell text-xs">{order.paymentMethod}</td>
                <td className="table-cell">
                  <OrderStatusBadge status={order.orderStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddressesTab({ user }) {
  const addresses = user.addresses || [];
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-navy mb-5">Saved Addresses</h2>
      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin size={36} className="text-aqua mx-auto mb-3 opacity-50" />
          <p className="text-slate text-sm">No addresses saved yet. Addresses are saved during checkout.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className="border border-gray-100 rounded-xl p-4">
              <p className="font-semibold text-navy text-sm mb-1">{addr.line1}</p>
              {addr.line2 && <p className="text-sm text-slate">{addr.line2}</p>}
              <p className="text-sm text-slate">{addr.city}, {addr.state} — {addr.pincode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = () => {
    setError('');
    if (!form.current || !form.newPwd || !form.confirm) { setError('All fields required.'); return; }
    if (form.newPwd.length < 6) { setError('New password must be 6+ characters.'); return; }
    if (form.newPwd !== form.confirm) { setError('Passwords do not match.'); return; }
    setSuccess(true);
    setForm({ current: '', newPwd: '', confirm: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-navy mb-6">Change Password</h2>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          ✓ Password changed successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      <div className="space-y-4 max-w-sm">
        {[
          { label: 'Current Password', key: 'current' },
          { label: 'New Password', key: 'newPwd' },
          { label: 'Confirm New Password', key: 'confirm' },
        ].map(f => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
        <button onClick={handleChange} className="btn-primary">
          <Save size={14} /> Update Password
        </button>
      </div>
    </div>
  );
}
