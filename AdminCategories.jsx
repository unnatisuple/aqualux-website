import { useState } from 'react';
import { useProducts } from './context/ProductContext';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Tag, Ticket } from 'lucide-react';

// Categories Section
function CategoriesSection() {
  const { categories, updateCategory, deleteCategory, addCategoryItem } = useProducts();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'active' });
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: 'Name required' }); return; }
    if (modal === 'add') addCategoryItem(form);
    else updateCategory(modal.id, form);
    setModal(null);
    setForm({ name: '', description: '', status: 'active' });
    setErrors({});
  };

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-aqua" />
          <h2 className="font-bold text-navy">Categories</h2>
        </div>
        <button onClick={() => { setModal('add'); setForm({ name: '', description: '', status: 'active' }); }}
          className="btn-primary py-2 px-4 text-sm">
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Description</th>
              <th className="table-header">Items</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-warm-50">
                <td className="table-cell font-semibold text-navy">{cat.name}</td>
                <td className="table-cell text-slate text-sm">{cat.description}</td>
                <td className="table-cell">{cat.count || 0}</td>
                <td className="table-cell">
                  <span className={`badge ${cat.status === 'active' ? 'badge-green' : 'badge-red'}`}>{cat.status}</span>
                </td>
                <td className="table-cell">
                  <div className="flex gap-2">
                    <button onClick={() => { setModal(cat); setForm({ name: cat.name, description: cat.description, status: cat.status }); }}
                      className="p-1.5 rounded-lg text-slate hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 rounded-lg text-slate hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-navy">{modal === 'add' ? 'Add Category' : 'Edit Category'}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Category name" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field" placeholder="Short description" />
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="btn-ghost border border-gray-200 rounded-xl px-5 py-2.5 text-sm">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 justify-center py-2.5 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Coupons Section
function CouponsSection() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useProducts();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', expiry: '', description: '', active: true });
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Code required';
    if (!form.value || isNaN(form.value) || Number(form.value) <= 0) e.value = 'Valid value required';
    if (!form.minOrder || isNaN(form.minOrder)) e.minOrder = 'Min order required';
    if (!form.expiry) e.expiry = 'Expiry required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const data = { ...form, code: form.code.toUpperCase(), value: Number(form.value), minOrder: Number(form.minOrder) };
    if (modal === 'add') addCoupon(data);
    else updateCoupon(modal.id, data);
    setModal(null);
    setErrors({});
  };

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-aqua" />
          <h2 className="font-bold text-navy">Coupons</h2>
        </div>
        <button onClick={() => { setModal('add'); setForm({ code: '', type: 'percent', value: '', minOrder: '', expiry: '', description: '', active: true }); }}
          className="btn-primary py-2 px-4 text-sm">
          <Plus size={14} /> Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Code</th>
              <th className="table-header">Discount</th>
              <th className="table-header">Min Order</th>
              <th className="table-header">Expiry</th>
              <th className="table-header">Active</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-warm-50">
                <td className="table-cell font-mono font-bold text-aqua text-sm">{c.code}</td>
                <td className="table-cell font-semibold text-navy">
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </td>
                <td className="table-cell text-sm">₹{c.minOrder?.toLocaleString('en-IN')}</td>
                <td className="table-cell text-sm text-slate">{c.expiry}</td>
                <td className="table-cell">
                  <button onClick={() => toggleCoupon(c.id)}>
                    {c.active
                      ? <ToggleRight size={22} className="text-aqua" />
                      : <ToggleLeft size={22} className="text-slate" />
                    }
                  </button>
                </td>
                <td className="table-cell">
                  <div className="flex gap-2">
                    <button onClick={() => { setModal(c); setForm({ ...c }); }}
                      className="p-1.5 rounded-lg text-slate hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteCoupon(c.id)}
                      className="p-1.5 rounded-lg text-slate hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-navy">{modal === 'add' ? 'Add Coupon' : 'Edit Coupon'}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Coupon Code *', key: 'code', placeholder: 'e.g. SAVE20' },
                { label: 'Description', key: 'description', placeholder: 'Short description' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className={`input-field ${errors[f.key] ? 'border-red-400' : ''}`} placeholder={f.placeholder} />
                  {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Value *</label>
                  <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                    className={`input-field ${errors.value ? 'border-red-400' : ''}`} placeholder="0" />
                  {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
                </div>
                <div>
                  <label className="label">Min Order (₹) *</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))}
                    className={`input-field ${errors.minOrder ? 'border-red-400' : ''}`} placeholder="0" />
                  {errors.minOrder && <p className="text-red-500 text-xs mt-1">{errors.minOrder}</p>}
                </div>
                <div>
                  <label className="label">Expiry Date *</label>
                  <input type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))}
                    className={`input-field ${errors.expiry ? 'border-red-400' : ''}`} />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="btn-ghost border border-gray-200 rounded-xl px-5 py-2.5 text-sm">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 justify-center py-2.5 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCategories() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-navy">Categories & Coupons</h1>
        <p className="text-slate text-sm mt-0.5">Manage product categories and discount coupons</p>
      </div>
      <CategoriesSection />
      <CouponsSection />
    </div>
  );
}
