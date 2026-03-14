'use client';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map(item => <CartItem key={item._id} item={item} />)}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shippingPrice === 0 ? '🎉 Free' : `$${shippingPrice}`}</span>
            </div>
            {subtotal < 100 && <p className="text-xs text-indigo-600">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>}
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total</span><span>${(subtotal + shippingPrice).toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout"><Button fullWidth size="lg">Proceed to Checkout</Button></Link>
        </div>
      </div>
    </div>
  );
}