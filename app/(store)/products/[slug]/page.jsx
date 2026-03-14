'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';

export default function ProductPage() {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`)
      .then((res) => res.json())
      .then((data) => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      slug: product.slug,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (product.upsellProducts?.length > 0) {
      setTimeout(() => setShowUpsell(true), 500);
    }
  };

  const handleAddUpsell = (upsellProduct) => {
    addItem({
      _id: upsellProduct._id,
      name: upsellProduct.name,
      price: upsellProduct.price,
      image: upsellProduct.images?.[0]?.url,
      slug: upsellProduct.slug,
    });
  };

  if (loading) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Loading product...</p>
    </div>
  );

  if (!product || product.message) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg mb-4">Product not found</p>
      <Link href="/products" className="text-indigo-600 hover:underline">
        Back to products
      </Link>
    </div>
  );

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-indigo-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                📦
              </div>
            )}
            {discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                -{discount}%
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === idx ? 'border-indigo-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-indigo-600 font-medium mb-2">
            {product.category?.name}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                ${product.comparePrice}
              </span>
            )}
            {discount && (
              <span className="bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-500 font-medium">✗ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-lg"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {added ? '✓ Added to Cart!' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts?.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((related) => (
              <Link
                key={related._id}
                href={`/products/${related.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="aspect-square bg-gray-100">
                  {related.images?.[0] ? (
                    <img
                      src={related.images[0].url}
                      alt={related.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{related.name}</h3>
                  <p className="text-indigo-600 font-bold">${related.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upsell Modal */}
      {showUpsell && product.upsellProducts?.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUpsell(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Complete Your Order!
                </h2>
                <p className="text-gray-500 text-sm">
                  Customers also bought these
                </p>
              </div>
              <button
                onClick={() => setShowUpsell(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {product.upsellProducts.map((upsell) => (
                <div
                  key={upsell._id}
                  className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {upsell.images?.[0] ? (
                      <img
                        src={upsell.images[0].url}
                        alt={upsell.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{upsell.name}</p>
                    <p className="text-indigo-600 font-semibold">${upsell.price}</p>
                  </div>
                  <button
                    onClick={() => handleAddUpsell(upsell)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg font-medium flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpsell(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50"
              >
                No thanks
              </button>
              <Link
                href="/cart"
                onClick={() => setShowUpsell(false)}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium text-center hover:bg-indigo-700"
              >
                View Cart →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}