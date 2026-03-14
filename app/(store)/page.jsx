import Link from 'next/link';

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?featured=true&limit=8`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { cache: 'no-store' }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Welcome to BahariClick
          </h1>
          <p className="text-xl text-indigo-200 mb-8">
            Free shipping on orders over $100
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/products"
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
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
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            View all →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products yet.</p>
            <p className="text-gray-400 text-sm mt-2">
              Add products from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-indigo-600 font-medium mb-1">
                    {product.category?.name}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}