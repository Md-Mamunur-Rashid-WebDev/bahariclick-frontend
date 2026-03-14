'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import useCartStore from '@/store/cartStore';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete('page');
    router.push(`/products?${params}`);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      slug: product.slug,
    });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {search ? `Search: "${search}"` : 'All Products'}
          </h1>
          {pagination.total !== undefined && (
            <p className="text-gray-500 text-sm">{pagination.total} products</p>
          )}
        </div>
        {(search || category) && (
          <button
            onClick={() => router.push('/products')}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-1">
              <button
                onClick={() => updateFilter('category', '')}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !category
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', cat._id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat._id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                        📦
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-900 font-semibold px-3 py-1 rounded-full text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-indigo-600 font-medium mb-1">
                      {product.category?.name}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${product.comparePrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          addedId === product._id
                            ? 'bg-green-500 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {addedId === product._id ? '✓ Added' : '+ Cart'}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateFilter('page', p)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === p
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}