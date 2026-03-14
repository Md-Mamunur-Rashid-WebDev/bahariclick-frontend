'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/product/ProductGrid';
import UpsellModal from '@/components/product/UpsellModal';

export default function ProductPageClient({ product }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showUpsell, setShowUpsell] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        slug: product.slug,
        }, quantity);
        
        toast.success('Added to cart!');
        
        // Show upsell modal if upsell products exist
        if (product.upsellProducts?.length > 0) {
        setTimeout(() => setShowUpsell(true), 500);
        }
    };

    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-indigo-600">Products</a>
            <span className="mx-2">/</span>
            <a href={`/products?category=${product.category?._id}`} className="hover:text-indigo-600">
            {product.category?.name}
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                {product.images[selectedImage] ? (
                <Image
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                />
                ) : (
                <div className="w-full h-full bg-gray-200" />
                )}
                {discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                    -{discount}%
                </span>
                )}
            </div>
            
            {/* Thumbnail Row */}
            {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img, idx) => (
                    <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === idx ? 'border-indigo-600' : 'border-gray-200'
                    }`}
                    >
                    <Image src={img.url} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    </button>
                ))}
                </div>
            )}
            </div>

            {/* Product Details */}
            <div>
            <p className="text-indigo-600 font-medium mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">${product.comparePrice}</span>
                )}
                {discount && (
                <span className="bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                    Save {discount}%
                </span>
                )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
                {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                    ✓ In Stock ({product.stock} left)
                </span>
                ) : (
                <span className="text-red-500 font-medium">✗ Out of Stock</span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                    {tag}
                    </span>
                ))}
                </div>
            )}

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
                <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                        <Plus size={14} />
                    </button>
                    </div>
                </div>

                <Button onClick={handleAddToCart} size="xl" fullWidth>
                    <ShoppingCart size={20} />
                    Add to Cart — ${(product.price * quantity).toFixed(2)}
                </Button>
                </div>
            )}
            </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts?.length > 0 && (
            <section className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <ProductGrid products={product.relatedProducts} loading={false} />
            </section>
        )}

        {/* Upsell Modal */}
        {showUpsell && (
            <UpsellModal
            upsellProducts={product.upsellProducts}
            onClose={() => setShowUpsell(false)}
            />
        )}
        </div>
    );
}