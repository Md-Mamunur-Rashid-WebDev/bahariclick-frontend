import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';

// Next.js Server Component: data fetching happens on the server
// This is great for SEO — the HTML is pre-rendered with product data
async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?featured=true&limit=8`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 600 },
    });
    return await res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'ShopNow — Best Products at Great Prices',
  description: 'Shop the latest products with free shipping on orders over $100.',
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-indigo-200 mb-8">
              Free shipping on orders over $100. New arrivals every week.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors">
                Shop Now
              </Link>
              <Link href="/products?featured=true" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                Featured Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="px-5 py-2 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-full font-medium text-gray-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            View all →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={false} />
      </section>
    </div>
  );
}