import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const MONTHLY_REVENUE = [
  { month: 'Jul', revenue: 185000 },
  { month: 'Aug', revenue: 220000 },
  { month: 'Sep', revenue: 195000 },
  { month: 'Oct', revenue: 310000 },
  { month: 'Nov', revenue: 395000 },
  { month: 'Dec', revenue: 480000 },
  { month: 'Jan', revenue: 290000 },
];

function StatCard({ title, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="admin-card flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate font-medium truncate">{title}</p>
        <p className="text-2xl font-black text-navy mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

const STATUS_COLOR = {
  'Paid': 'badge-green',
  'COD - Pending': 'badge-yellow',
  'Processing': 'badge-aqua',
  'Shipped': 'badge-navy',
  'Delivered': 'badge-green',
  'Cancelled': 'badge-red',
};

export default function Dashboard() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { customers } = useAuth();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);

  const today = new Date().toDateString();
  const ordersToday = orders.filter(o => new Date(o.date).toDateString() === today).length;

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter(p => p.stock === 0);

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-navy">Dashboard</h1>
        <p className="text-slate text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          sub={`₹${totalRevenue.toLocaleString('en-IN')} total`}
          icon={TrendingUp}
          color="bg-gradient-to-br from-aqua to-aqua-700"
          trend={12}
        />
        <StatCard
          title="Orders Today"
          value={ordersToday}
          sub={`${orders.length} total orders`}
          icon={ShoppingBag}
          color="bg-gradient-to-br from-navy to-navy-600"
          trend={5}
        />
        <StatCard
          title="Total Products"
          value={products.length}
          sub={`${products.filter(p => p.status === 'active').length} active`}
          icon={Package}
          color="bg-gradient-to-br from-purple-500 to-purple-700"
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          sub="registered accounts"
          icon={Users}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
          trend={8}
        />
      </div>

      {/* Revenue Chart */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-navy">Revenue Overview</h2>
            <p className="text-xs text-slate mt-0.5">Last 7 months performance</p>
          </div>
          <span className="badge-green text-xs px-3 py-1.5">+12% this month</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ABFBF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4ABFBF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
            <Tooltip
              formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', fontFamily: 'Inter' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#4ABFBF" strokeWidth={2.5}
              fill="url(#revenueGradient)" dot={{ fill: '#4ABFBF', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-aqua hover:underline font-medium">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header rounded-tl-lg">Order ID</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-warm-50 transition-colors">
                    <td className="table-cell font-mono text-xs font-bold text-aqua">{order.id}</td>
                    <td className="table-cell">{order.customerName}</td>
                    <td className="table-cell font-bold">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="table-cell">
                      <span className={`badge ${STATUS_COLOR[order.orderStatus] || 'badge-navy'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="font-bold text-navy">Stock Alerts</h2>
          </div>
          {[...outOfStock, ...lowStock].length === 0 ? (
            <p className="text-sm text-slate text-center py-4">All products well stocked ✓</p>
          ) : (
            <div className="space-y-3">
              {outOfStock.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{p.name}</p>
                    <span className="badge-red text-xs">Out of Stock</span>
                  </div>
                </div>
              ))}
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{p.name}</p>
                    <span className="badge-yellow text-xs">Only {p.stock} left</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/products" className="btn-outline w-full justify-center mt-4 py-2 text-xs">
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
}
