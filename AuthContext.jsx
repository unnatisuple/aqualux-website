import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const ADMIN_CREDS = { email: 'admin@aqualux.com', password: 'admin123' };

// Seed customer
const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', password: 'test123', addresses: [{ id: 1, line1: '12, Rose Garden Apartments', line2: 'Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001' }] },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aqualux_user')); } catch { return null; }
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aqualux_admin')) || false; } catch { return false; }
  });
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_customers');
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
    } catch { return DEFAULT_CUSTOMERS; }
  });

  useEffect(() => {
    localStorage.setItem('aqualux_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (user) localStorage.setItem('aqualux_user', JSON.stringify(user));
    else localStorage.removeItem('aqualux_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aqualux_admin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const loginUser = (email, password) => {
    const found = customers.find(c => c.email === email && c.password === password);
    if (!found) return false;
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    toast.success(`Welcome back, ${safeUser.name}!`, {
      icon: '👋',
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
    return true;
  };

  const loginAdmin = (email, password) => {
    if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
      setIsAdmin(true);
      toast.success('Admin logged in!', {
        style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
      });
      return true;
    }
    return false;
  };

  const register = (data) => {
    const exists = customers.find(c => c.email === data.email);
    if (exists) return { success: false, error: 'Email already registered.' };
    const newCustomer = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      addresses: [],
      joined: new Date().toISOString(),
      status: 'active',
      orders: 0,
      spend: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
    const { password: _, ...safeUser } = newCustomer;
    setUser(safeUser);
    toast.success(`Welcome to AquaLux, ${data.name}!`, {
      icon: '🎉',
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully', {
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    toast.success('Admin logged out', {
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    setCustomers(prev => prev.map(c => c.id === user.id ? { ...c, ...data } : c));
    toast.success('Profile updated!', {
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  const addAddress = (address) => {
    const newAddr = { ...address, id: Date.now() };
    setUser(prev => ({ ...prev, addresses: [...(prev.addresses || []), newAddr] }));
    setCustomers(prev => prev.map(c =>
      c.id === user.id ? { ...c, addresses: [...(c.addresses || []), newAddr] } : c
    ));
  };

  const blockCustomer = (id) => {
    setCustomers(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
    ));
  };

  return (
    <AuthContext.Provider value={{
      user, isAdmin, customers,
      loginUser, loginAdmin, register, logout, logoutAdmin,
      updateProfile, addAddress, blockCustomer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
