import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Ticket,
  CreditCard, Settings, LogOut, Menu, X, Store, BookOpen, ChevronRight
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/setup-guide', label: 'Setup Guide', icon: BookOpen },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { logoutAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aqua to-aqua-700 flex items-center justify-center shadow-aqua-glow flex-shrink-0">
            <span className="text-white font-black text-sm">AL</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-black text-sm">AquaLux</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
        {SIDEBAR_LINKS.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
              isActive(link)
                ? 'bg-aqua text-white shadow-md'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            title={!sidebarOpen ? link.label : undefined}
          >
            <link.icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>{link.label}</span>}
            {sidebarOpen && isActive(link) && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          title={!sidebarOpen ? 'View Store' : undefined}
        >
          <Store size={18} className="flex-shrink-0" />
          {sidebarOpen && <span>View Store</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-warm-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col admin-sidebar transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-56' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 admin-sidebar flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSidebarOpen(!sidebarOpen); setMobileSidebarOpen(!mobileSidebarOpen); }}
              className="p-2 rounded-lg hover:bg-warm-100 text-slate transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-slate uppercase tracking-widest font-medium">
                {SIDEBAR_LINKS.find(l => isActive(l))?.label || 'Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate hover:text-aqua transition-colors hidden sm:block">
              View Store →
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aqua to-navy flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-sm font-semibold text-navy hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
