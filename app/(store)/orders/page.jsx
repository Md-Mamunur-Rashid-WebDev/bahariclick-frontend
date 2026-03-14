'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/orders/my')
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Loading orders...</p>
    </div>
  );

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view orders</h1>
      <Link href="/auth/login" className="bg-indigo-600 text-white px-8 py-3 rounded-lg inline-block font-semibold hover:bg-indigo-700">
        Sign In
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link href="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-lg inline-block font-semibold hover:bg-indigo-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-sm text-gray-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-gray-900">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}