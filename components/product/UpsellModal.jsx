// The upsell modal appears after adding a product to cart.
// It shows "Complete your order with these items" to increase order value.

'use client';
import Image from 'next/image';
import { X, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function UpsellModal({ upsellProducts, onClose }) {
  const [addedIds, setAddedIds] = useState(new Set());
  const addItem = useCartStore((state) => state.addItem);

  const handleAddUpsell = (product) => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      slug: product.slug,
    });
    setAddedIds((prev) => new Set([...prev, product._id]));
    toast.success(`${product.name} added!`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Your Order!</h2>
            <p className="text-gray-500 text-sm">Customers also bought these items</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Upsell Products */}
        <div className="space-y-4 mb-6">
          {upsellProducts.map((product) => (
            <div key={product._id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                {product.images[0] && (
                  <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 font-semibold">${product.price}</span>
                  {product.comparePrice && (
                    <span className="text-gray-400 text-sm line-through">${product.comparePrice}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleAddUpsell(product)}
                disabled={addedIds.has(product._id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  addedIds.has(product._id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {addedIds.has(product._id) ? (
                  <><Check size={14} /> Added</>
                ) : (
                  <><ShoppingCart size={14} /> Add</>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            No thanks
          </Button>
          <Button fullWidth onClick={onClose}>
            View Cart →
          </Button>
        </div>
      </div>
    </div>
  );
}