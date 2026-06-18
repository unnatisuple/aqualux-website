import { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, COUPONS } from '../data/products';
import toast from 'react-hot-toast';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch { return PRODUCTS; }
  });
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_categories');
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch { return CATEGORIES; }
  });
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('aqualux_coupons');
      return saved ? JSON.parse(saved) : COUPONS;
    } catch { return COUPONS; }
  });

  useEffect(() => { localStorage.setItem('aqualux_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('aqualux_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('aqualux_coupons', JSON.stringify(coupons)); }, [coupons]);

  // Products CRUD
  const addProduct = (data) => {
    const newProduct = { ...data, id: Date.now(), rating: 0, reviewCount: 0, reviews: [], isBestSeller: false, isFeatured: false };
    setProducts(prev => [...prev, newProduct]);
    toast.success('Product added!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const updateProduct = (id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast.success('Product updated!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const toggleProductStatus = (id) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
  };

  // Categories CRUD
  const addCategory = (data) => {
    setCoupons(prev => [...prev, { ...data, id: Date.now() }]);
    toast.success('Category added!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const updateCategory = (id, data) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success('Category updated!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const addCategoryItem = (data) => {
    setCategories(prev => [...prev, { ...data, id: Date.now(), count: 0 }]);
    toast.success('Category added!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  // Coupons CRUD
  const addCoupon = (data) => {
    setCoupons(prev => [...prev, { ...data, id: Date.now() }]);
    toast.success('Coupon created!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const updateCoupon = (id, data) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success('Coupon updated!', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast.success('Coupon deleted', { style: { background: '#0F2340', color: '#F8F6F2', borderRadius: '12px' } });
  };

  const toggleCoupon = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <ProductContext.Provider value={{
      products, categories, coupons,
      addProduct, updateProduct, deleteProduct, toggleProductStatus,
      addCategory, updateCategory, deleteCategory, addCategoryItem,
      addCoupon, updateCoupon, deleteCoupon, toggleCoupon,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};
