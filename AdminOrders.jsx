import { useState } from 'react';
import { useOrders } from './context/OrderContext';
import { Search, Filter, X, Package, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['All', 'Paid', 'COD - Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const ORDER_STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_COLOR = {
  'Paid': 'badge-green', 'COD - Pending': 'badge-yellow', 'Processing': 'badge-aqua',
  'Shipped': 'badge-navy', 'Out for Delivery': 'badge-aqua', 'Delivered': 'badge-green', 'Cancelled': 'badge-red',
};

function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  const [newStatus, setNewStatus] = useState(order.orderStatus);

  const handleSave = () => {
    onUpdateStatus(order.id, newStatus);
    toast.success(`Order status updated to "${newStatus}"`, {
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-navy">Order Details</h2>
            <p className="text-xs font-mono text-aqua mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-warm-100 rounded-xl p-4">
              <p className="text-xs text-slate uppercase tracking-wide mb-1">Customer</p>
              <p className="font-semibold text-navy">{order.customerName}</p>
              <p className="text-sm text-slate">{order.customerEmail}</p>
              <p className="text-sm text-slate">{order.customerPhone}</p>
            </div>
            <div className="bg-warm-100 rounded-xl p-4">
              <p className="text-xs text-slate uppercase tracking-wide mb-1">Shipping Address</p>
              <p className="text-sm text-navy">{order.address?.line1}</p>
              {order.address?.line2 && <p className="text-sm text-slate">{order.address.line2}</p>}
              <p className="text-sm text-slate">{order.address?.city}, {order.address?.state} — {order.address?.pincode}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-warm-100 rounded-xl p-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate uppercase tracking-wide mb-1">Payment Method</p>
              <p className="font-semibold text-navy text-sm">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs text-slate uppercase tracking-wide mb-1">Payment Status</p>
              <span className={`badge ${STATUS_COLOR[order.paymentStatus] || 'badge-navy'}`}>{order.paymentStatus}</span>
            </div>
            {order.razorpayPaymentId && (
              <div className="col-span-2">
                <p className="text-xs text-slate uppercase tracking-wide mb-1">Razorpay Payment ID</p>
                <p className="font-mono text-xs text-aqua bg-aqua/5 px-3 py-1.5 rounded-lg">{order.razorpayPaymentId}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-slate uppercase tracking-wide mb-3">Items Ordered</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate">Qty: {item.qty} × ₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-bold text-navy text-sm">₹{(item.price * item.qty)?.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-navy rounded-xl">
            <span className="text-white/70">Order Total</span>
            <span className="text-white font-black text-xl">₹{order.total?.toLocaleString('en-IN')}</span>
          </div>

          {/* Status Update */}
          <div>
            <label className="label">Update Order Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
          <button onClick={onClose} className="btn-ghost border border-gray-200 rounded-xl px-5 py-2.5">Close</button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center py-2.5">Save Status</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' ||
      o.paymentStatus === statusFilter || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-navy">Orders</h1>
        <p className="text-slate text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="admin-card flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..." className="input-field pl-9 py-2.5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === s ? 'bg-navy text-white' : 'bg-warm-100 text-slate hover:bg-warm-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Items</th>
                <th className="table-header">Total</th>
                <th className="table-header">Payment</th>
                <th className="table-header">Order Status</th>
                <th className="table-header">Date</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-warm-50 transition-colors">
                  <td className="table-cell font-mono text-xs font-bold text-aqua">{order.id}</td>
                  <td className="table-cell">
                    <p className="font-medium text-navy text-sm">{order.customerName}</p>
                    <p className="text-xs text-slate">{order.customerEmail}</p>
                  </td>
                  <td className="table-cell text-sm">{order.items?.length} item(s)</td>
                  <td className="table-cell font-bold text-sm">₹{order.total?.toLocaleString('en-IN')}</td>
                  <td className="table-cell">
                    <span className={`badge ${STATUS_COLOR[order.paymentStatus] || 'badge-navy'} text-xs`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${STATUS_COLOR[order.orderStatus] || 'badge-navy'} text-xs`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="table-cell text-xs text-slate">
                    {new Date(order.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => setSelected(order)}
                      className="text-xs text-aqua font-semibold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}
