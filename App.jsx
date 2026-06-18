import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import { SettingsProvider } from './context/SettingsContext';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCustomers from './admin/AdminCustomers';
import AdminCategories from './admin/AdminCategories';
import AdminPayments from './admin/AdminPayments';
import AdminSettings from './admin/AdminSettings';
import SetupGuide from './admin/SetupGuide';

import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="setup-guide" element={<SetupGuide />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    className: 'toast-custom',
                  }}
                />
                <AppRoutes />
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
