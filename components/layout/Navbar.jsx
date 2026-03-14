'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const { user, logout } = useAuthStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600 flex-shrink-0">
          BahariClick
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3">

          <Link href="/products" className="hidden md:block text-sm text-gray-600 hover:text-indigo-600">
            Products
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hidden md:block"
                >
                  Dashboard
                </Link>
              )}
              <Link href="/orders" className="text-sm text-gray-600 hover:text-indigo-600 hidden md:block">
                Orders
              </Link>
              <button
                onClick={logout}
                className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}