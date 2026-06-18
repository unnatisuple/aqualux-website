import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  storeName: 'AquaLux',
  logoUrl: '',
  contactEmail: 'hello@aqualux.com',
  phone: '+91 98765 43210',
  address: '123, Luxury Business Park, Bandra, Mumbai — 400050',
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 5000,
  shippingFee: 299,
  codAvailable: true,
  codFee: 99,
  razorpayKeyId: 'rzp_test_XXXXXXXXXX',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  useEffect(() => {
    localStorage.setItem('aqualux_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (data) => {
    setSettings(prev => ({ ...prev, ...data }));
    toast.success('Settings saved!', {
      icon: '✅',
      style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' }
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
