'use client';

import Link from 'next/link';
import useCartStore from '@/store/cartStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const total = subtotal + shippingPrice;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">
          Add some products to get started!
        </p>
        <Link
          href="/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Shopping Cart ({items.length} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4"
            >
              {/* Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-indigo-600 font-semibold">${item.price}</p>

                {/* Quantity */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total + Remove */}
              <div className="flex flex-col items-end justify-between">
                <span className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shippingPrice === 0 ? '🎉 Free' : `$${shippingPrice}`}</span>
            </div>
            {subtotal < 100 && (
              <p className="text-xs text-indigo-600">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-3 rounded-xl transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}