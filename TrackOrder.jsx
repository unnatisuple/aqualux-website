import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useOrders } from '../context/OrderContext';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ChevronRight } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'Order Placed', icon: Package, color: 'text-blue-500' },
  { key: 'Payment Confirmed', icon: CheckCircle, color: 'text-green-500' },
  { key: 'Processing', icon: Clock, color: 'text-amber-500' },
  { key: 'Shipped', icon: Truck, color: 'text-purple-500' },
  { key: 'Out for Delivery', icon: MapPin, color: 'text-orange-500' },
  { key: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
];

function getStatusIndex(orderStatus) {
  const map = {
    'Processing': 2,
    'Shipped': 3,
    'Out for Delivery': 4,
    'Delivered': 5,
    'Cancelled': -1,
  };
  // If paid, show Payment Confirmed
  return map[orderStatus] ?? 2;
}

function getDummyTimestamps(order) {
  const base = new Date(order.date);
  return [
    new Date(base).toLocaleString('en-IN'),
    new Date(base.getTime() + 1 * 3600000).toLocaleString('en-IN'),
    new Date(base.getTime() + 4 * 3600000).toLocaleString('en-IN'),
    new Date(base.getTime() + 24 * 3600000).toLocaleString('en-IN'),
    new Date(base.getTime() + 5 * 24 * 3600000).toLocaleString('en-IN'),
    new Date(base.getTime() + 7 * 24 * 3600000).toLocaleString('en-IN'),
  ];
}

export default function TrackOrder() {
  const { getOrderById } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    setError('');
    if (!orderId.trim() || !email.trim()) {
      setError('Please enter both Order ID and Email.');
      return;
    }
    const found = getOrderById(orderId.trim());
    if (!found || found.customerEmail.toLowerCase() !== email.toLowerCase()) {
      setOrder(null);
      setError('No order found with the given details. Please check and try again.');
      return;
    }
    setOrder(found);
  };

  const currentStep = order ? getStatusIndex(order.orderStatus) : 0;
  const timestamps = order ? getDummyTimestamps(order) : [];

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />

      <div className="bg-navy pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Order</h1>
          <p className="text-white/60">Enter your order ID and email to see the live status</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Search Box */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Order ID *</label>
              <input
                type="text"
                placeholder="e.g. ORD-2024-001"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input
                type="email"
                placeholder="Email used during order"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="input-field"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
              ⚠ {error}
            </p>
          )}
          <button onClick={handleSearch} className="btn-primary w-full justify-center py-3.5">
            <Search size={16} /> Track Order
          </button>
          <p className="text-xs text-slate text-center mt-3">
            Try: Order ID <strong>ORD-2024-001</strong> · Email <strong>priya@example.com</strong>
          </p>
        </div>

        {/* Timeline */}
        {order && (
          <div className="card p-6 animate-fade-in">
            {/* Order Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-slate uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-black text-navy text-lg">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate uppercase tracking-widest mb-1">Placed On</p>
                <p className="font-semibold text-navy text-sm">
                  {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate uppercase tracking-widest mb-1">Est. Delivery</p>
                <p className="font-semibold text-green-600 text-sm">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate uppercase tracking-widest mb-1">Status</p>
                <span className={`badge font-semibold ${
                  order.orderStatus === 'Delivered' ? 'badge-green' :
                  order.orderStatus === 'Cancelled' ? 'badge-red' : 'badge-aqua'
                } text-sm px-3 py-1`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            {order.orderStatus !== 'Cancelled' && (
              <div className="mb-6">
                <div className="relative h-2 bg-gray-100 rounded-full mb-4">
                  <div
                    className="h-2 bg-gradient-to-r from-aqua to-aqua-300 rounded-full transition-all duration-700"
                    style={{ width: `${((currentStep) / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate">
                  <span>Placed</span>
                  <span>Confirmed</span>
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivery</span>
                  <span>Delivered</span>
                </div>
              </div>
            )}

            {/* Timeline Steps */}
            <div className="relative">
              <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-100" />
              <div className="space-y-6">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = currentStep >= i;
                  const isCurrent = currentStep === i;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="relative flex items-start gap-5 pl-0">
                      {/* Dot */}
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'border-aqua bg-aqua shadow-aqua-glow scale-110'
                          : isDone
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-200 bg-white'
                      }`}>
                        <StepIcon size={14} className={isDone ? 'text-white' : 'text-gray-300'} />
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-2 transition-opacity ${!isDone ? 'opacity-40' : ''}`}>
                        <p className={`font-semibold text-sm ${isDone ? 'text-navy' : 'text-slate'}`}>
                          {step.key}
                          {isCurrent && <span className="ml-2 text-xs bg-aqua/10 text-aqua px-2 py-0.5 rounded-full font-medium">Current</span>}
                        </p>
                        {isDone && (
                          <p className="text-xs text-slate mt-0.5">{timestamps[i]}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="mt-6 p-4 bg-warm-100 rounded-xl flex items-start gap-3">
                <MapPin size={16} className="text-aqua mt-0.5" />
                <div>
                  <p className="text-xs text-slate font-medium uppercase tracking-wide mb-1">Delivering To</p>
                  <p className="text-sm font-semibold text-navy">{order.customerName}</p>
                  <p className="text-sm text-slate">{order.address.line1}{order.address.line2 ? ', ' + order.address.line2 : ''}, {order.address.city} — {order.address.pincode}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
