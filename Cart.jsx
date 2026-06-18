import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Trash2, Minus, Plus, Tag, ArrowRight, ShoppingBag, ChevronRight, X } from 'lucide-react';

export default function Cart() {
  const { items, subtotal, discountAmount, shipping, total, coupon, updateQty, removeFromCart, applyCoupon, removeCoupon } = useCart();
  const { coupons } = useProducts();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (couponInput.trim()) applyCoupon(couponInput.trim(), coupons);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center px-4">
            <div className="w-24 h-24 bg-aqua/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-aqua" />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Your cart is empty</h2>
            <p className="text-slate mb-6">Looks like you haven't added anything yet. Let's change that!</p>
            <Link to="/products" className="btn-primary">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate mb-6">
            <Link to="/" className="hover:text-aqua">Home</Link>
            <ChevronRight size={14} />
            <span className="text-navy font-medium">Shopping Cart</span>
          </div>

          <h1 className="text-3xl font-black text-navy mb-8">
            Shopping Cart <span className="text-slate text-lg font-normal">({items.length} item{items.length !== 1 ? 's' : ''})</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="card p-4 flex gap-4 animate-fade-in">
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="font-bold text-navy hover:text-aqua transition-colors line-clamp-2 text-sm">
                      {item.name}
                    </Link>
                    <p className="text-lg font-black text-navy mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 bg-warm-100 rounded-xl p-1">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-navy">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {/* Line Total */}
                    <div className="text-right">
                      <p className="text-sm text-slate">Total</p>
                      <p className="font-black text-navy">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link to="/products" className="btn-ghost text-sm text-slate inline-flex mt-2">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="card p-5">
                <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-aqua" /> Coupon Code
                </h3>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <div>
                      <p className="font-semibold text-green-700 text-sm">{coupon.code}</p>
                      <p className="text-xs text-green-600">{coupon.description}</p>
                    </div>
                    <button onClick={removeCoupon} className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      className="input-field flex-1"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="btn-primary px-4 py-2.5 text-sm"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate mt-2">Try: WELCOME10, FLAT500, LUXBATH20</p>
              </div>

              {/* Summary */}
              <div className="card p-5">
                <h3 className="font-bold text-navy mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium text-navy">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({coupon?.code})</span>
                      <span className="font-medium">−₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-navy'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-slate bg-warm-100 rounded-lg p-2">
                      Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-black text-navy text-base">Total</span>
                    <span className="font-black text-navy text-xl">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full justify-center mt-5 py-4 text-base"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                {/* Trust */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate">
                  <span>🔒</span> 100% Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
