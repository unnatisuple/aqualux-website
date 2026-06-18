import { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_ORDERS } from '../data/products';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_orders');
      return saved ? JSON.parse(saved) : DUMMY_ORDERS;
    } catch { return DUMMY_ORDERS; }
  });

  useEffect(() => {
    localStorage.setItem('aqualux_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderStatus: 'Processing',
      ...orderData,
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
  };

  const getOrdersByCustomer = (email) => {
    return orders.filter(o => o.customerEmail === email);
  };

  const getOrderById = (id) => orders.find(o => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByCustomer, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
