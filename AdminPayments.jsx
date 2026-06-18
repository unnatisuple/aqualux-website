import { useState } from 'react';
import { useOrders } from './context/OrderContext';
import { Search, TrendingUp, CreditCard, Truck, DollarSign } from 'lucide-react';

export default function AdminPayments() {
  const { orders } = useOrders();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const allTransactions = orders.map(o => ({
    orderId: o.id,
    customer: o.customerName,
    amount: o.total,
    method: o.paymentMethod,
    razorpayId: o.razorpayPaymentId,
    date: o.date,
    status: o.paymentStatus,
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = allTransactions.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.orderId.toLowerCase().includes(q) || t.customer?.toLowerCase().includes(q);
    const matchMethod = methodFilter === 'All' || t.method === methodFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchMethod && matchStatus;
  });

  const totalOnline = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const totalCOD = orders.filter(o => o.paymentStatus === 'COD - Pending').reduce((s, o) => s + o.total, 0);
  const totalRevenue = totalOnline + totalCOD;

  const summaryCards = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-gradient-to-br from-aqua to-aqua-700', sub: 'Online + COD' },
    { label: 'Online Collected', value: `₹${totalOnline.toLocaleString('en-IN')}`, icon: CreditCard, color: 'bg-gradient-to-br from-green-500 to-green-700', sub: 'Razorpay payments' },
    { label: 'COD Pending', value: `₹${totalCOD.toLocaleString('en-IN')}`, icon: Truck, color: 'bg-gradient-to-br from-amber-500 to-orange-600', sub: 'To collect on delivery' },
  ];

  const STATUS_COLOR = {
    'Paid': 'badge-green',
    'COD - Pending': 'badge-yellow',
    'Failed': 'badge-red',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-navy">Payment Reports</h1>
        <p className="text-slate text-sm mt-0.5">All transactions and payment analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className={`${card.color} rounded-2xl p-5 text-white`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/70 text-sm font-medium">{card.label}</p>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-black">{card.value}</p>
            <p className="text-white/60 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-card flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..." className="input-field pl-9 py-2.5" />
        </div>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="input-field w-40 py-2.5">
          <option value="All">All Methods</option>
          <option value="Razorpay">Razorpay</option>
          <option value="COD">COD</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-40 py-2.5">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="COD - Pending">COD Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Method</th>
                <th className="table-header">Razorpay ID</th>
                <th className="table-header">Date</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t, i) => (
                <tr key={i} className="hover:bg-warm-50 transition-colors">
                  <td className="table-cell font-mono text-xs font-bold text-aqua">{t.orderId}</td>
                  <td className="table-cell text-sm font-medium text-navy">{t.customer}</td>
                  <td className="table-cell font-bold text-navy">₹{t.amount?.toLocaleString('en-IN')}</td>
                  <td className="table-cell text-sm">{t.method}</td>
                  <td className="table-cell">
                    {t.razorpayId ? (
                      <span className="font-mono text-xs text-aqua bg-aqua/5 px-2 py-1 rounded-lg">{t.razorpayId}</span>
                    ) : (
                      <span className="text-slate text-xs">—</span>
                    )}
                  </td>
                  <td className="table-cell text-xs text-slate">
                    {new Date(t.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${STATUS_COLOR[t.status] || 'badge-navy'}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate">
              <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
