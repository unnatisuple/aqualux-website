import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'star-filled fill-amber-400 text-amber-400' : 'star-empty text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export { StarRating };

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.price > product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="card group overflow-hidden flex flex-col animate-fade-in">
      {/* Image */}
      <div className="relative product-img-container bg-warm-100 h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="bg-navy text-white text-xs font-semibold px-2.5 py-1 rounded-lg">Best Seller</span>
          )}
          {discount > 0 && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">{discount}% OFF</span>
          )}
        </div>
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1.5 bg-white text-navy text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-aqua hover:text-white transition-colors"
          >
            <Eye size={14} /> Quick View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-aqua font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="hover:text-aqua transition-colors">
          <h3 className="font-bold text-navy text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-slate">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-lg font-black text-navy">
            ₹{product.discountPrice.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-sm text-slate line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
            product.stock === 0
              ? 'bg-gray-100 text-slate cursor-not-allowed'
              : 'bg-navy text-white hover:bg-aqua hover:shadow-aqua-glow'
          }`}
        >
          <ShoppingCart size={15} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
