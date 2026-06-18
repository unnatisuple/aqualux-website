import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useOrders } from './context/OrderContext';
import { useSettings } from './context/SettingsContext';
import { Lock, CreditCard, Smartphone, Building2, Truck, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Luhn algorithm for card validation
function luhn(num) {
  const digits = num.replace(/\s/g, '').split('').reverse().map(Number);
  const sum = digits.reduce((acc, d, i) => {
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    return acc + d;
  }, 0);
  return sum % 10 === 0;
}

function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

// Step indicator
function StepIndicator({ step }) {
  const steps = ['Delivery', 'Review', 'Payment'];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-aqua text-white shadow-aqua-glow' : 'bg-gray-200 text-slate'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${i === step ? 'text-aqua' : i < step ? 'text-green-600' : 'text-slate'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-4 transition-colors ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1: Delivery Address
function DeliveryStep({ address, setAddress, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Full name is required';
    if (!address.email.trim() || !/\S+@\S+\.\S+/.test(address.email)) e.email = 'Valid email required';
    if (!address.phone.trim() || !/^[6-9]\d{9}$/.test(address.phone)) e.phone = 'Valid 10-digit mobile required';
    if (!address.line1.trim()) e.line1 = 'Address required';
    if (!address.city.trim()) e.city = 'City required';
    if (!address.state.trim()) e.state = 'State required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) e.pincode = '6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const Field = ({ label, name, placeholder, type = 'text', half = false }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={address[name]}
        onChange={e => setAddress(prev => ({ ...prev, [name]: e.target.value }))}
        className={`input-field ${errors[name] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors[name]}</p>}
    </div>
  );

  const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir'];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-navy mb-6">Delivery Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name *" name="fullName" placeholder="As on ID" />
        <Field label="Email *" name="email" placeholder="you@example.com" type="email" half />
        <Field label="Phone *" name="phone" placeholder="10-digit mobile" half />
        <Field label="Address Line 1 *" name="line1" placeholder="House no., Street, Area" />
        <Field label="Address Line 2" name="line2" placeholder="Landmark, Colony (optional)" />
        <div>
          <label className="label">City *</label>
          <input type="text" value={address.city} onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
            className={`input-field ${errors.city ? 'border-red-400' : ''}`} placeholder="Your city" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="label">State *</label>
          <select value={address.state} onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
            className={`input-field ${errors.state ? 'border-red-400' : ''}`}>
            <option value="">Select State</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className="label">Pincode *</label>
          <input type="text" value={address.pincode} onChange={e => setAddress(p => ({ ...p, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))}
            className={`input-field ${errors.pincode ? 'border-red-400' : ''}`} placeholder="6-digit pincode" />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
        </div>
      </div>
      <button onClick={handleNext} className="btn-primary mt-6 w-full justify-center py-4">
        Continue to Review <ChevronRight size={16} />
      </button>
    </div>
  );
}

// Step 2: Order Review
function ReviewStep({ address, items, subtotal, discountAmount, shipping, total, onBack, onNext }) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-navy mb-6">Order Review</h2>

      {/* Address summary */}
      <div className="bg-warm-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">Delivering To</p>
        <p className="font-semibold text-navy">{address.fullName}</p>
        <p className="text-sm text-slate">{address.line1}{address.line2 ? ', ' + address.line2 : ''}, {address.city}, {address.state} — {address.pincode}</p>
        <p className="text-sm text-slate">{address.phone} · {address.email}</p>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy text-sm line-clamp-1">{item.name}</p>
              <p className="text-xs text-slate">Qty: {item.qty}</p>
            </div>
            <p className="font-bold text-navy text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-6">
        <div className="flex justify-between text-slate"><span>Subtotal</span><span className="text-navy font-medium">₹{subtotal.toLocaleString('en-IN')}</span></div>
        {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{discountAmount.toLocaleString('en-IN')}</span></div>}
        <div className="flex justify-between text-slate"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-navy font-medium'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
        <div className="flex justify-between font-black text-navy text-lg border-t border-gray-100 pt-2"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost px-6 py-3 border border-gray-200 rounded-xl">← Back</button>
        <button onClick={onNext} className="btn-primary flex-1 justify-center py-4">
          Proceed to Payment <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// Step 3: Payment
function PaymentStep({ address, total, items, subtotal, discountAmount, shipping, onBack, onSuccess }) {
  const [method, setMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  const BANKS = [
    { code: 'SBI', name: 'State Bank of India' },
    { code: 'HDFC', name: 'HDFC Bank' },
    { code: 'ICICI', name: 'ICICI Bank' },
    { code: 'AXIS', name: 'Axis Bank' },
    { code: 'KOTAK', name: 'Kotak Mahindra Bank' },
    { code: 'PNB', name: 'Punjab National Bank' },
    { code: 'BOB', name: 'Bank of Baroda' },
  ];

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const openRazorpay = async (extraOptions = {}) => {
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Could not load payment gateway. Please try again.', {
        style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
      });
      setLoading(false);
      return;
    }

    const options = {
      key: settings.razorpayKeyId,
      amount: total * 100,
      currency: 'INR',
      name: 'AquaLux',
      description: 'Order Payment',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&q=80',
      prefill: {
        name: address.fullName,
        email: address.email,
        contact: address.phone,
      },
      theme: { color: '#4ABFBF' },
      handler: (response) => {
        setLoading(false);
        onSuccess({
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
        });
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.error('Payment cancelled.', {
            style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
          });
        }
      },
      ...extraOptions,
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setLoading(false);
      toast.error('Payment failed. Please try again.', {
        style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
      });
    });
    rzp.open();
  };

  const validateAndPay = () => {
    const e = {};
    if (method === 'upi') {
      if (!upiId.trim() || !/^[\w\.\-]+@[\w]+$/.test(upiId)) e.upi = 'Enter a valid UPI ID (e.g. name@upi)';
    }
    if (method === 'card') {
      if (!card.number || card.number.replace(/\s/g,'').length !== 16) e.cardNumber = 'Enter a valid 16-digit card number';
      else if (!luhn(card.number)) e.cardNumber = 'Invalid card number';
      if (!card.name.trim()) e.cardName = 'Cardholder name required';
      if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Enter valid expiry (MM/YY)';
      if (!card.cvv.trim() || !/^\d{3,4}$/.test(card.cvv)) e.cvv = 'Enter valid CVV';
    }
    if (method === 'netbanking') {
      if (!bank) e.bank = 'Please select a bank';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (method === 'cod') {
      if (total > 25000) {
        toast.error('COD not available for orders above ₹25,000', {
          style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
        });
        return;
      }
      onSuccess({
        paymentMethod: 'COD',
        paymentStatus: 'COD - Pending',
        razorpayPaymentId: null,
        codFee: 99,
      });
      return;
    }

    if (method === 'upi') {
      openRazorpay({ method: 'upi', vpa: upiId });
    } else if (method === 'card') {
      openRazorpay({ method: 'card' });
    } else if (method === 'netbanking') {
      openRazorpay({ method: 'netbanking', bank });
    } else {
      openRazorpay();
    }
  };

  const payMethods = [
    { id: 'razorpay', label: 'Razorpay', icon: CreditCard, desc: 'Pay via Razorpay checkout' },
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'PhonePe, GPay, BHIM & more' },
    { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit / Debit card' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'Internet banking' },
    { id: 'cod', label: 'Cash on Delivery', icon: Truck, desc: total <= 25000 ? '+₹99 handling fee' : 'Not available above ₹25,000' },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-navy mb-6">Payment</h2>

      {/* Method Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {payMethods.map(m => (
          <button
            key={m.id}
            onClick={() => { setMethod(m.id); setErrors({}); }}
            disabled={m.id === 'cod' && total > 25000}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              method === m.id ? 'border-aqua bg-aqua/5' : 'border-gray-200 hover:border-gray-300'
            } ${m.id === 'cod' && total > 25000 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <m.icon size={18} className={method === m.id ? 'text-aqua' : 'text-slate'} />
            <p className={`text-xs font-semibold mt-1.5 ${method === m.id ? 'text-aqua' : 'text-navy'}`}>{m.label}</p>
          </button>
        ))}
      </div>

      {/* Payment Forms */}
      <div className="min-h-48 mb-6">
        {method === 'razorpay' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-aqua/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard size={28} className="text-aqua" />
            </div>
            <p className="font-semibold text-navy">Razorpay Secure Checkout</p>
            <p className="text-sm text-slate mt-1">You'll be redirected to Razorpay's secure payment page</p>
          </div>
        )}

        {method === 'upi' && (
          <div>
            <label className="label">UPI ID *</label>
            <input
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className={`input-field ${errors.upi ? 'border-red-400' : ''}`}
            />
            {errors.upi && <p className="text-red-500 text-xs mt-1">{errors.upi}</p>}
            <p className="text-xs text-slate mt-2">Supported: PhonePe, Google Pay, Paytm, BHIM, Amazon Pay</p>
          </div>
        )}

        {method === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="label">Card Number *</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
                className={`input-field font-mono tracking-widest ${errors.cardNumber ? 'border-red-400' : ''}`}
                maxLength={19}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            <div>
              <label className="label">Cardholder Name *</label>
              <input
                type="text"
                placeholder="Name on card"
                value={card.name}
                onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                className={`input-field ${errors.cardName ? 'border-red-400' : ''}`}
              />
              {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Expiry (MM/YY) *</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2);
                    setCard(p => ({ ...p, expiry: v }));
                  }}
                  className={`input-field ${errors.expiry ? 'border-red-400' : ''}`}
                  maxLength={5}
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label className="label">CVV *</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={card.cvv}
                  onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
                  className={`input-field ${errors.cvv ? 'border-red-400' : ''}`}
                  maxLength={4}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}

        {method === 'netbanking' && (
          <div>
            <label className="label">Select Bank *</label>
            <select
              value={bank}
              onChange={e => setBank(e.target.value)}
              className={`input-field ${errors.bank ? 'border-red-400' : ''}`}
            >
              <option value="">-- Choose your bank --</option>
              {BANKS.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
            {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
          </div>
        )}

        {method === 'cod' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
              <Truck size={16} /> Cash on Delivery
            </p>
            <p className="text-sm text-amber-700">An extra ₹99 COD handling fee will be added to your order.</p>
            <p className="text-sm text-amber-700 mt-1">Total payable on delivery: <strong>₹{(total + 99).toLocaleString('en-IN')}</strong></p>
            {total > 25000 && <p className="text-sm text-red-600 mt-2 font-medium">⚠ COD not available for orders above ₹25,000</p>}
          </div>
        )}
      </div>

      {/* Security badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 p-3 bg-warm-100 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs text-slate font-medium">
          <Lock size={13} className="text-green-600" /> SSL Encrypted
        </div>
        <div className="text-slate text-xs">|</div>
        <div className="flex items-center gap-1.5 text-xs text-slate font-medium">
          <CheckCircle size={13} className="text-green-600" /> 100% Secure Payments
        </div>
        <div className="flex items-center gap-2 ml-2">
          {['Razorpay', 'Visa', 'MC', 'UPI', 'RuPay'].map(b => (
            <span key={b} className="px-2 py-0.5 bg-white rounded border border-gray-200 text-xs text-slate font-medium">{b}</span>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-slate mb-5">🔒 Your payment information is encrypted and secure</p>

      {/* Total + Pay button */}
      <div className="flex items-center justify-between mb-4 p-4 bg-navy rounded-xl">
        <span className="text-white/70 font-medium">Amount to pay</span>
        <span className="text-white font-black text-xl">₹{(method === 'cod' ? total + 99 : total).toLocaleString('en-IN')}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost px-6 py-3 border border-gray-200 rounded-xl">← Back</button>
        <button
          onClick={validateAndPay}
          disabled={loading}
          className="btn-primary flex-1 justify-center py-4 animate-pulse-aqua"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg>
              Processing...
            </span>
          ) : (
            <>
              <Lock size={16} />
              {method === 'cod' ? 'Place Order (COD)' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items, subtotal, discountAmount, shipping, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePaymentSuccess = (paymentData) => {
    const order = addOrder({
      customerId: user?.id,
      customerName: address.fullName,
      customerEmail: address.email,
      customerPhone: address.phone,
      address,
      items,
      subtotal,
      discountAmount,
      shipping,
      total: paymentData.paymentMethod === 'COD' ? total + 99 : total,
      coupon: coupon?.code,
      ...paymentData,
    });
    clearCart();
    navigate('/order-success', { state: { order } });
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-navy mb-6 text-center">Checkout</h1>
          <StepIndicator step={step} />

          {step === 0 && (
            <DeliveryStep address={address} setAddress={setAddress} onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <ReviewStep
              address={address} items={items} subtotal={subtotal}
              discountAmount={discountAmount} shipping={shipping} total={total}
              onBack={() => setStep(0)} onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              address={address} total={total} items={items} subtotal={subtotal}
              discountAmount={discountAmount} shipping={shipping}
              onBack={() => setStep(1)} onSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
