import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Package, ArrowRight, MapPin } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-6xl mb-4">🤔</p>
          <h2 className="text-2xl font-bold text-navy mb-4">No order found</h2>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Success Animation */}
          <div className="text-center mb-10">
            <div className="checkmark-circle w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 52 52" className="w-14 h-14">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#22c55e" strokeWidth="2" />
                <path
                  className="checkmark-path"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27l8 8 16-16"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-navy mb-2">Order Placed Successfully!</h1>
            <p className="text-slate">Thank you for shopping with AquaLux. Your bathroom upgrade is on its way!</p>
          </div>

          {/* Order Info */}
          <div className="card p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-warm-100 rounded-xl p-4">
                <p className="text-xs text-slate font-medium uppercase tracking-wide mb-1">Order ID</p>
                <p className="font-bold text-navy text-sm">{order.id}</p>
              </div>
              <div className="bg-warm-100 rounded-xl p-4">
                <p className="text-xs text-slate font-medium uppercase tracking-wide mb-1">Payment</p>
                <p className="font-bold text-navy text-sm">{order.paymentStatus}</p>
              </div>
              {order.razorpayPaymentId && (
                <div className="bg-warm-100 rounded-xl p-4 col-span-2">
                  <p className="text-xs text-slate font-medium uppercase tracking-wide mb-1">Payment ID</p>
                  <p className="font-bold text-aqua text-sm font-mono">{order.razorpayPaymentId}</p>
                </div>
              )}
              <div className="bg-green-50 rounded-xl p-4 col-span-2 flex items-center gap-3">
                <Package size={20} className="text-green-600" />
                <div>
                  <p className="text-xs text-slate font-medium uppercase tracking-wide mb-0.5">Estimated Delivery</p>
                  <p className="font-bold text-green-700">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">Items Ordered</h3>
            <div className="space-y-3 mb-5">
              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-navy text-sm">{item.name}</p>
                    <p className="text-xs text-slate">Qty: {item.qty}</p>
                  </div>
                  <p className="font-bold text-navy text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              {order.codFee && (
                <div className="flex justify-between text-slate">
                  <span>COD Fee</span>
                  <span>₹99</span>
                </div>
              )}
              <div className="flex justify-between font-black text-navy text-base border-t pt-2">
                <span>Total Paid</span>
                <span>₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 flex gap-2 p-3 bg-warm-100 rounded-xl text-sm text-slate">
              <MapPin size={15} className="text-aqua mt-0.5 flex-shrink-0" />
              <span>{order.address?.line1}, {order.address?.city}, {order.address?.state} — {order.address?.pincode}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link to="/track-order" className="btn-outline flex-1 justify-center py-4">
              Track My Order
            </Link>
            <Link to="/products" className="btn-primary flex-1 justify-center py-4">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
