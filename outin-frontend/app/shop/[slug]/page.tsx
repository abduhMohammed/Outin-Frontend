import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/services/apiService';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60; // keep stock/price reasonably fresh

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
const { slug } = await params;
const product = await getProductBySlug(slug);
if (!product) return { title: 'Product not found | OUTIN' };

const description =
    (product.description ?? '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    `${product.name} by OUTIN`;
const image = product.imageUrls.find((u) => u.startsWith('http'));

return {
    title: `${product.name} | OUTIN`,
    description,
    openGraph: {
    title: `${product.name} | OUTIN`,
    description,
    ...(image ? { images: [image] } : {}),
    },
};
}

export default async function ProductPage({ params }: Props) {
const { slug } = await params;
const product = await getProductBySlug(slug);
if (!product) notFound();

// key: resets the selected color/size when you move from one product to another
return <ProductDetailClient key={product.id} product={product} />;
}