import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('aqualux_cart', JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const discountAmount = coupon
    ? coupon.type === 'percent'
      ? Math.round(subtotal * coupon.value / 100)
      : coupon.value
    : 0;

  const shipping = subtotal >= 5000 ? 0 : 299;
  const total = subtotal - discountAmount + shipping;

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
        stock: product.stock,
        qty,
      }];
    });
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Item removed from cart', {
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code, allCoupons) => {
    const found = allCoupons.find(c => c.code === code.toUpperCase() && c.active);
    if (!found) {
      toast.error('Invalid or expired coupon code', {
        style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
      });
      return false;
    }
    if (subtotal < found.minOrder) {
      toast.error(`Minimum order ₹${found.minOrder.toLocaleString('en-IN')} required`, {
        style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
      });
      return false;
    }
    setCoupon(found);
    toast.success(`Coupon "${found.code}" applied! You save ₹${found.type === 'percent' ? Math.round(subtotal * found.value / 100).toLocaleString('en-IN') : found.value.toLocaleString('en-IN')}`, {
      icon: '🎉',
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Coupon removed', {
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  return (
    <CartContext.Provider value={{
      items, itemCount, subtotal, discountAmount, shipping, total,
      coupon, addToCart, removeFromCart, updateQty, clearCart, applyCoupon, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
