import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

// Fetch product data on the server for SEO
async function getProduct(slug) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
        next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// Dynamic SEO metadata for each product
export async function generateMetadata({ params }) {
    const product = await getProduct(params.slug);
    if (!product) return { title: 'Product Not Found' };
    return {
        title: `${product.name} | ShopNow`,
        description: product.description.substring(0, 160),
        openGraph: {
        images: [product.images[0]?.url],
        },
    };
}

export default async function ProductPage({ params }) {
    const product = await getProduct(params.slug);
    if (!product) notFound();
    return <ProductPageClient product={product} />;
}