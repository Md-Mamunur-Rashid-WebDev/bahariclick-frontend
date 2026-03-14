"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";
import { SlidersHorizontal, X } from "lucide-react";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Read filters from URL parameters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 1;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
        const params = new URLSearchParams({ page, limit: 12 });
        if (search) params.set("search", search);
        if (category) params.set("category", category);

        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products);
        setPagination(data.pagination);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }, [search, category, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        api.get("/categories").then(({ data }) => setCategories(data));
    }, []);

    // Update URL when filters change
    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
        params.set(key, value);
        } else {
        params.delete(key);
        }
        params.delete("page"); // Reset to page 1 on filter change
        router.push(`/products?${params}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">
                {search ? `Search: "${search}"` : "All Products"}
            </h1>
            {pagination.total !== undefined && (
                <p className="text-gray-500 text-sm">
                {pagination.total} products found
                </p>
            )}
            </div>
            <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 md:hidden"
            >
            <SlidersHorizontal size={16} />
            Filters
            </button>
        </div>

        <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside
            className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}
            >
            <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {(search || category) && (
                    <button
                    onClick={() => router.push("/products")}
                    className="text-sm text-red-500 flex items-center gap-1 hover:text-red-700"
                    >
                    <X size={14} /> Clear all
                    </button>
                )}
                </div>

                {/* Category Filter */}
                <div>
                <h3 className="font-medium text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                    <button
                    onClick={() => updateFilter("category", "")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !category
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                    >
                    All Categories
                    </button>
                    {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => updateFilter("category", cat._id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat._id
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                    >
                        {cat.name}
                    </button>
                    ))}
                </div>
                </div>
            </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (p) => (
                    <button
                        key={p}
                        onClick={() => updateFilter("page", p)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === p
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                    ),
                )}
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
