'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '', address: '', city: '',
    postalCode: '', country: 'Bangladesh',
    paymentMethod: 'Cash on Delivery',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const totalPrice = subtotal + shippingPrice;

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to checkout</h1>
      <Link href="/auth/login" className="bg-indigo-600 text-white px-8 py-3 rounded-lg inline-block font-semibold hover:bg-indigo-700">
        Sign In
      </Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
      <Link href="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-lg inline-block font-semibold hover:bg-indigo-700">
        Browse Products
      </Link>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', {
        items: items.map((item) => ({ product: item._id, quantity: item.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      setSuccess('Order placed successfully! Redirecting...');
      setTimeout(() => router.push('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'fullName', placeholder: 'Your full name' },
              { label: 'Address', key: 'address', placeholder: 'Street address' },
              { label: 'City', key: 'city', placeholder: 'Dhaka' },
              { label: 'Postal Code', key: 'postalCode', placeholder: '1207' },
              { label: 'Country', key: 'country', placeholder: 'Bangladesh' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  required type="text"
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Placing Order...' : `Place Order — $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingPrice === 0 ? '🎉 Free' : `$${shippingPrice}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}