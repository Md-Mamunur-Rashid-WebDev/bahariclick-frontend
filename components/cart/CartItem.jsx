"use client";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import useCartStore from "@/store/cartStore";

export default function CartItem({ item }) {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className="flex gap-4 py-4 border-b border-gray-100">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
            {item.image ? (
            <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
            />
            ) : (
            <div className="w-full h-full bg-gray-200" />
            )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
            <p className="text-indigo-600 font-semibold">${item.price}</p>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 mt-2">
            <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
                <Minus size={12} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
                <Plus size={12} />
            </button>
            </div>
        </div>

        {/* Item Total & Remove */}
        <div className="flex flex-col items-end justify-between">
            <span className="font-semibold text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
            onClick={() => removeItem(item._id)}
            className="text-red-400 hover:text-red-600 transition-colors"
            >
            <Trash2 size={16} />
            </button>
        </div>
        </div>
    );
}
