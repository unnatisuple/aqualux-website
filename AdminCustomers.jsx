import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Search, Eye, Ban, CheckCircle, X, Users } from 'lucide-react';

function CustomerModal({ customer, orders, onClose }) {
  const customerOrders = orders.filter(o => o.customerEmail === customer.email);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-xl font-bold text-navy">Customer Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Profile */}
          <div className="flex items-center gap-4 p-4 bg-warm-100 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-aqua to-navy flex items-center justify-center text-white font-black text-xl">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-black text-navy text-lg">{customer.name}</h3>
              <p className="text-slate text-sm">{customer.email}</p>
              <p className="text-slate text-sm">{customer.phone}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-black text-aqua">₹{(customer.spend || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate">Total spend</p>
            </div>
          </div>

          {/* Addresses */}
          {customer.addresses?.length > 0 && (
            <div>
              <p className="text-xs text-slate uppercase tracking-wide mb-2">Saved Addresses</p>
              {customer.addresses.map(addr => (
                <div key={addr.id} className="p-3 border border-gray-100 rounded-xl text-sm text-slate mb-2">
                  {addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city}, {addr.state} — {addr.pincode}
                </div>
              ))}
            </div>
          )}

          {/* Orders */}
          <div>
            <p className="text-xs text-slate uppercase tracking-wide mb-2">Order History ({customerOrders.length})</p>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-slate text-center py-4">No orders found</p>
            ) : (
              <div className="space-y-2">
                {customerOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-mono text-xs text-aqua font-bold">{order.id}</p>
                      <p className="text-xs text-slate">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <p className="font-bold text-navy text-sm">₹{order.total?.toLocaleString('en-IN')}</p>
                    <span className={`badge text-xs ${
                      order.orderStatus === 'Delivered' ? 'badge-green' :
                      order.orderStatus === 'Cancelled' ? 'badge-red' : 'badge-aqua'
                    }`}>{order.orderStatus}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomers() {
  const { customers, blockCustomer } = useAuth();
  const { orders } = useOrders();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const enriched = customers.map(c => ({
    ...c,
    orderCount: orders.filter(o => o.customerEmail === c.email).length,
    totalSpend: orders.filter(o => o.customerEmail === c.email && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.total, 0),
  }));

  const filtered = enriched.filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-navy">Customers</h1>
        <p className="text-slate text-sm mt-0.5">{customers.length} registered customers</p>
      </div>

      <div className="admin-card">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..." className="input-field pl-9 py-2.5 max-w-xs" />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Customer</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Orders</th>
                <th className="table-header">Total Spend</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-warm-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-aqua/30 to-navy/30 flex items-center justify-center font-bold text-navy text-sm flex-shrink-0">
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{c.name}</p>
                        <p className="text-xs text-slate">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-sm text-slate">{c.phone || '—'}</td>
                  <td className="table-cell font-semibold text-navy">{c.orderCount}</td>
                  <td className="table-cell font-bold text-navy">₹{c.totalSpend.toLocaleString('en-IN')}</td>
                  <td className="table-cell text-xs text-slate">
                    {c.joined ? new Date(c.joined).toLocaleDateString('en-IN') : 'N/A'}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                      {c.status === 'active' ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(c)}
                        className="p-1.5 rounded-lg text-slate hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => blockCustomer(c.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          c.status === 'active'
                            ? 'text-slate hover:bg-red-50 hover:text-red-600'
                            : 'text-slate hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        {c.status === 'active' ? <Ban size={15} /> : <CheckCircle size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <CustomerModal customer={selected} orders={orders} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
