import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { StarRating } from './ProductCard';
import { useProducts } from './context/ProductContext';
import { useCart } from './context/CartContext';
import { ShoppingCart, Zap, Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Tag } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <Navbar />
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-navy mb-2">Product Not Found</h2>
          <Link to="/products" className="btn-primary mt-4">Back to Products</Link>
        </div>
      </div>
    );
  }

  const discount = product.price > product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 text-sm text-slate">
            <Link to="/" className="hover:text-aqua transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-aqua transition-colors">Products</Link>
            <ChevronRight size={14} />
            <Link to={`/products?category=${product.category}`} className="hover:text-aqua transition-colors">{product.category}</Link>
            <ChevronRight size={14} />
            <span className="text-navy font-medium truncate max-w-48">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              <div className="card overflow-hidden mb-4 aspect-square">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-aqua shadow-aqua-glow' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-aqua">{product.category}</span>
                {product.isBestSeller && <span className="badge bg-amber-100 text-amber-700">Best Seller</span>}
              </div>

              <p className="text-aqua font-semibold mb-1">{product.brand}</p>
              <h1 className="text-3xl font-black text-navy leading-tight mb-2">{product.name}</h1>
              <p className="text-xs text-slate mb-4">SKU: {product.sku}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <StarRating rating={product.rating} size={18} />
                <span className="font-bold text-navy">{product.rating}</span>
                <span className="text-sm text-slate">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-warm-100 rounded-2xl">
                <span className="text-4xl font-black text-navy">
                  ₹{product.discountPrice.toLocaleString('en-IN')}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-slate line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="badge bg-green-100 text-green-700 text-sm px-3 py-1">{discount}% OFF</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                </span>
              </div>

              {/* Qty + Buttons */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-1">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-warm-100 transition-colors text-navy"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-navy">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-warm-100 transition-colors text-navy"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-secondary justify-center py-4 text-base"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary justify-center py-4 text-base"
                >
                  <Zap size={18} /> Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: 'Free Shipping', sub: 'Over ₹5,000' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: '15-day policy' },
                  { icon: Shield, label: 'Warranty', sub: 'Manufacturer' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100">
                    <item.icon size={18} className="text-aqua mb-1" />
                    <span className="text-xs font-semibold text-navy">{item.label}</span>
                    <span className="text-xs text-slate">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card p-6 mb-12">
            <div className="flex gap-2 border-b border-gray-100 mb-6">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-4 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                    activeTab === tab ? 'border-aqua text-aqua' : 'border-transparent text-slate hover:text-navy'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="text-navy/70 leading-relaxed">
                <p className="mb-4">{product.description}</p>
                {product.features && (
                  <ul className="space-y-2 mt-4">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-aqua/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-aqua text-xs">✓</span>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications || {}).map(([key, val], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-warm-50' : 'bg-white'}>
                        <td className="py-3 px-4 font-semibold text-navy w-1/3 rounded-l-lg">{key}</td>
                        <td className="py-3 px-4 text-slate rounded-r-lg">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {product.reviews?.length === 0 && <p className="text-slate text-center py-8">No reviews yet. Be the first!</p>}
                {product.reviews?.map(review => (
                  <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-aqua to-navy flex items-center justify-center text-white font-bold text-sm">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-navy text-sm">{review.user}</p>
                          <p className="text-xs text-slate">{new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-navy/70 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 className="section-title mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
