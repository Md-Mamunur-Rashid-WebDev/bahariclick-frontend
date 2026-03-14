'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0, orders: 0, categories: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1'),
      api.get('/orders'),
      api.get('/categories'),
    ]).then(([products, orders, categories]) => {
      setStats({
        products: products.data.pagination?.total || 0,
        orders: orders.data.length || 0,
        categories: categories.data.length || 0,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, href: '/admin/products', color: 'bg-indigo-500', emoji: '📦' },
    { label: 'Total Orders', value: stats.orders, href: '/admin/orders', color: 'bg-green-500', emoji: '🛍️' },
    { label: 'Categories', value: stats.categories, href: '/admin/categories', color: 'bg-purple-500', emoji: '🏷️' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {card.emoji}
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-6 flex items-center gap-4"
        >
          <span className="text-3xl">📦</span>
          <div>
            <p className="font-bold text-lg">Manage Products</p>
            <p className="text-indigo-200 text-sm">Add, edit, delete products</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 flex items-center gap-4"
        >
          <span className="text-3xl">🛍️</span>
          <div>
            <p className="font-bold text-lg">Manage Orders</p>
            <p className="text-green-200 text-sm">View and update order status</p>
          </div>
        </Link>
      </div>
    </div>
  );
}