import { useState } from 'react';
import { useProducts } from './context/ProductContext';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, X, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Bathtubs', 'Showers', 'Toilets', 'Washbasins', 'Faucets', 'Accessories'];
const EMPTY = { name: '', category: '', brand: '', price: '', discountPrice: '', stock: '', description: '', image: '', status: 'active' };

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || EMPTY);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.brand.trim()) e.brand = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || Number(form.price),
      stock: Number(form.stock),
      images: form.image ? [form.image] : [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-xl font-bold text-navy">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Product Name *', key: 'name', span: 2, placeholder: 'e.g. Premium Freestanding Bathtub' },
            { label: 'Brand *', key: 'brand', placeholder: 'Brand name' },
            { label: 'Price (₹) *', key: 'price', type: 'number', placeholder: '0' },
            { label: 'Discounted Price (₹)', key: 'discountPrice', type: 'number', placeholder: '0' },
            { label: 'Stock *', key: 'stock', type: 'number', placeholder: '0' },
          ].map(f => (
            <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
              <label className="label">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className={`input-field ${errors[f.key] ? 'border-red-400' : ''}`}
              />
              {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
            </div>
          ))}

          <div>
            <label className="label">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className={`input-field ${errors.category ? 'border-red-400' : ''}`}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="label">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="label">Image URL</label>
            <input type="url" value={form.image} onChange={e => set('image', e.target.value)}
              placeholder="https://..." className="input-field" />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 h-24 w-24 rounded-xl object-cover border border-gray-200" />
            )}
          </div>

          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Product description..." className="input-field resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
          <button onClick={onClose} className="btn-ghost border border-gray-200 rounded-xl px-5 py-2.5">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center py-2.5">
            {product?.id ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductStatus } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | product object

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (data) => {
    if (modal?.id) updateProduct(modal.id, data);
    else addProduct(data);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) deleteProduct(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy">Products</h1>
          <p className="text-slate text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="input-field pl-9 py-2.5" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field w-44 py-2.5">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">Category</th>
                <th className="table-header">Price</th>
                <th className="table-header">Stock</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-warm-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-navy text-sm">{p.name}</p>
                        <p className="text-xs text-slate">{p.brand} · {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge-aqua">{p.category}</span>
                  </td>
                  <td className="table-cell">
                    <p className="font-bold text-navy text-sm">₹{p.discountPrice?.toLocaleString('en-IN')}</p>
                    {p.discountPrice < p.price && (
                      <p className="text-xs text-slate line-through">₹{p.price?.toLocaleString('en-IN')}</p>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={`font-semibold text-sm ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-green-600'}`}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => toggleProductStatus(p.id)} className="flex items-center gap-1.5 text-sm font-medium">
                      {p.status === 'active'
                        ? <><ToggleRight size={22} className="text-aqua" /> <span className="text-aqua">Active</span></>
                        : <><ToggleLeft size={22} className="text-slate" /> <span className="text-slate">Inactive</span></>
                      }
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(p)}
                        className="p-1.5 rounded-lg text-slate hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg text-slate hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
